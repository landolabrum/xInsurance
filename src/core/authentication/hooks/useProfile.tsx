import { useState, useEffect } from "react";
import { getService } from "@webstack/common";
import IAuthenticatedUser from "~/src/models/ICustomer";
import IMemberService from "../../services/MemberService/IMemberService";
import useLocation from "@webstack/hooks/user/useLocation";
import { useRouter } from "next/router";
import { useModal } from "@webstack/components/Containers/modal/contexts/modalContext";
import Authentication from "~/src/pages/authentication";

// UserAgent context
export interface UserAgentContext {
  user_agent?: string;
  user_agent_data: {
    brands?: Array<{
      brand: string;
      version: string;
    }>;
    mobile: boolean;
    platform: string;
  } | null;
  wan?: string;
}

// Profile context
export interface ProfileUserContext extends IAuthenticatedUser {
  userAgent: UserAgentContext;
  lngLat?: [number, number];
}

export interface ProfileContext extends IAuthenticatedUser {
  userAgent: UserAgentContext;
  lngLat?: [number, number];
}

interface UseProfileOptions {
  require?: 'user' | 'location' | 'both';
}

export const useProfile = ({ require }: UseProfileOptions = {}): ProfileContext | undefined => {
  const MemberService = getService<IMemberService>('IMemberService');
  const { isModalOpen, openModal, closeModal } = useModal();
  const [view, setView] = useState<string>("sign-in");
  const [newCustomerEmail, setNewCustomerEmail] = useState<string | undefined>();
  const router = useRouter();
  const query = router.query;
  const { lngLat, requestLocation, permissionDenied } = useLocation();
  const [requirement, setRequirement] = useState<string | undefined>();
  const [profile, setProfile] = useState<ProfileContext | undefined>(() => {
    const initialUser = MemberService.getCurrentUser();
    const userAgent = {
      user_agent: '',
      user_agent_data: null,
      wan: '',
    };
    return initialUser ? { ...initialUser, userAgent, lngLat } : undefined;
  });

  // UseEffect for user agent detection
  useEffect(() => {
    const handleLoad = async () => {
      const user_agent = window.navigator.userAgent;
      const nav: any = navigator;
      const user_agent_data = 'userAgentData' in nav ? nav.userAgentData : null;

      setProfile(prev => ({
        ...prev!,
        userAgent: { user_agent, user_agent_data }
      }));

      const tryFetchIp = async (retry = false): Promise<string | null> => {
        try {
          const cached = sessionStorage.getItem("wan_ip");
          if (cached) return cached;

          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 3000);

          const response = await fetch('https://ipapi.co/json/', { signal: controller.signal });
          clearTimeout(timeout);

          if (!response.ok) throw new Error("IPAPI fetch failed");

          const data = await response.json();
          sessionStorage.setItem("wan_ip", data.ip);
          return data.ip;
        } catch (err: any) {
          if (!retry) return tryFetchIp(true);
          console.warn('[useProfile] WAN IP fetch failed after retry:', err?.message || err);
          return null;
        }
      };

      const wan = await tryFetchIp();
      if (wan) {
        setProfile(prev => ({
          ...prev!,
          userAgent: { ...prev!.userAgent, wan }
        }));
      }
    };

    handleLoad();
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  const openAuthenticationModal = (initialView: string) => {
    if (isModalOpen) return;
    setView(initialView);
    openModal({
      title: "sign in ",
      children: (<Authentication view={initialView} />),
    });
  };

  const handleSignup = (response: any) => {
    const status = response?.status;
    if (!status) {
      alert("dev, handle this! 212");
      return;
    }

    let label = "404, an error occurred signing up.";
    switch (status) {
      case 'created':
        label = `email: ${response?.email}, successfully created.`;
        break;
      case 'existing':
        label = `email: ${response?.email}, exists.`;
        break;
      default: break;
    }
    setView('sign-in');
    setNewCustomerEmail(response.email);
  };

  useEffect(() => {
    if (query && query.verify && view !== 'verify') setView('verify');
    if (newCustomerEmail !== undefined && !isModalOpen && view !== 'sign-in') setView("sign-in");
  }, [query, isModalOpen, newCustomerEmail, view]);

  useEffect(() => {
    if (lngLat) {
      setProfile(prev => ({ ...prev!, lngLat }));
    }
  }, [lngLat]);

  useEffect(() => {
    if (profile && !profile.userAgent.user_agent) {
      setProfile(prev => ({
        ...prev!,
        userAgent: {
          user_agent: window.navigator.userAgent,
          user_agent_data: (navigator as any).userAgentData || null
        }
      }));
    }
  }, [profile]);

  const addUser = () => {
    if (!require || (require === 'location' && profile?.id && requirement === 'user') && isModalOpen) return;
    else if (!requirement || Boolean(require !== 'location' || requirement !== 'done')) setRequirement('user');
    openAuthenticationModal("sign-in");
  };

  const addLocation = () => {
    if (requirement === 'user' && view === 'sign-in' && !isModalOpen) setRequirement('location');
    else if (profile || require === 'location') setRequirement('location');
  };

  useEffect(() => {
    if (!require) return;
    if (!profile?.id && requirement === undefined) addUser();
    if (requirement !== 'location') addLocation();
    if (requirement === 'location' && !profile?.lngLat && !isModalOpen && !permissionDenied) requestLocation();
    if (permissionDenied) {
      setRequirement('done');
      setProfile(prev => ({ ...prev!, lngLat: [0, 0] }));
    }
  }, [isModalOpen, permissionDenied, requirement]);

  return profile;
};

export default useProfile;
