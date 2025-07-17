import React, { ReactElement, useEffect,useState, useRef, ReactNode, useMemo } from "react";
import styles from './DefaultLayout.scss';
import Title from "@webstack/components/Text/Title/Title";
import environment from "~/src/core/environment";
import JoinForms from "@webstack/components/PageComponents/Join/controller/JoinForms";


interface IProps {
  children: ReactElement;
}


const MainLayout = ({ children }: IProps) => {
  const mainRef = useRef<HTMLElement>(null);
  const mid = environment.merchant.mid;

  const styleMerchant = () => {
    if (!mid || !mainRef.current) return;

    const head = document.head;
    let merchantStyleLoaded = false;

    // Inject base theme if missing
    if (!document.querySelector('link[href="/styles/theme.css"]')) {
      const theme = document.createElement('link');
      theme.rel = 'stylesheet';
      theme.href = '/styles/theme.css';
      head.appendChild(theme);
    }

    // Inject merchant stylesheet
    const merchantHref = `/styles/merchants/${mid}.css`;
    if (!document.querySelector(`link[href="${merchantHref}"]`)) {
      const merchantStyle = document.createElement('link');
      merchantStyle.rel = 'stylesheet';
      merchantStyle.href = merchantHref;
      head.appendChild(merchantStyle);
      merchantStyleLoaded = true;
    }

    // setLayout(prev => ({
    //   ...prev,
    //   merchantStyleLoaded: merchantStyleLoaded || prev.merchantStyleLoaded,
    //   // NOTE: Optional default background if not set elsewhere
    //   background: prev.background ?? 'var(--gray-20)',
    // }));
  };

  const checkScrollbar = () => {
    if (!mainRef.current) return;
    const hasScrollbar = document.body.scrollHeight > window.innerHeight;
    mainRef.current.classList.toggle('has-scrollbar-y', hasScrollbar);
  };

  useEffect(() => {
    styleMerchant();
    checkScrollbar();
    window.addEventListener('resize', checkScrollbar);
    return () => window.removeEventListener('resize', checkScrollbar);
  }, []);

  return (
    <>
      <Title />
      <style jsx>{styles}</style>
      <main
        ref={mainRef}
        id="main"
      >
        {children}
        <JoinForms />
      </main>
    </>
  );
};

export default MainLayout;
