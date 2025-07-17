import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useClearance, useUser } from './useUser';
import { IRoute, useClearanceRoutes } from '@webstack/components/PageComponents/Navbar/data/routes';
import IAuthenticatedUser from "~/src/models/ICustomer";

interface ORoute{
  selectedUser:IAuthenticatedUser | undefined;
  pathname:string;
  explicitRouter:(e:any)=>void;
  routeTitle?:string | false;
};


const useRoute = (): ORoute => {
  const user = useUser();
  const [selectedUser, setUser] = useState<IAuthenticatedUser | undefined>();
  const router = useRouter();
  const clearanceRoutes = useClearanceRoutes();
  const level = useClearance();
  const handleRouteTitle = () => String(router.pathname)?.length && router.pathname.split('/')[1] || false;
  const routeTitle = handleRouteTitle();


  const renderTriggers = [user, selectedUser, setUser, clearanceRoutes, level];

  const explicitRouter = (route: IRoute) => {
    if (route?.href) router.push(route.href, undefined, { shallow: false });
  };
  const implicitRouter = useCallback(() => {

    if (user && !selectedUser) setUser(user);
    if (clearanceRoutes) {
      const matchingRoute = clearanceRoutes.find(clearRoute => {
        const routePathWithoutQuery = clearRoute?.href;
        if (routePathWithoutQuery === router.pathname) {
          return true;
        }
        else if (
          (
            Boolean(clearRoute.clearance && clearRoute.clearance >= level) ||
            Boolean(!clearRoute.clearance)
          )) {
          return false;
        }
        else if (clearRoute?.items) {
          return clearRoute.items.some(item => {
            const itemPathWithoutQuery = item?.href.split('?')[0];
            return itemPathWithoutQuery === router.pathname;
          });
        }
        return false;
      });
      if (matchingRoute) {
        const hrefIsString:boolean = typeof matchingRoute?.href === 'string';
        const notCurrent = matchingRoute?.href && !router.asPath.includes(matchingRoute?.href) || 'current-route';
        const canNavigate = Boolean( typeof hrefIsString === 'boolean' && typeof notCurrent === 'boolean');
        const emailVerified = Boolean(router.pathname == '/verify' && router?.query?.vid == 'email' && user);
        if(emailVerified)router.push('/user-account');
        if(canNavigate){
          router.push(String(matchingRoute.href), undefined, { shallow: true });
        }
      } else if (router.asPath !== '/authentication/signout') {
        let currentPath: string = router.asPath;
        if (currentPath.includes('/404?')) {
          // STOPS LOOPED 404 Results
          router.push('/');
        } else {
          router.push(`/404?loc=${currentPath}`);
        }
      }
    }
  }, [...renderTriggers]); 
  const pathname: string = router.pathname;
  useEffect(() => {
    implicitRouter();
  }, [ implicitRouter  ]); // Added routeTitle to dependencies array
  

  return { selectedUser, pathname, explicitRouter, routeTitle};
};

export default useRoute;
