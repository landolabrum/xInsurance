import React, { useEffect } from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';

import MainLayout from '../webstack/layouts/default/controller/DefaultLayout';
import ServiceContainer from '@webstack/components/ServiceContainer/ServiceContainer';
import styles from '@webstack/layouts/default/controller/DefaultLayout.scss';

import { OverlayProvider } from '@webstack/components/Overlay/Overlay';
import { HeaderProvider } from '@webstack/components/Containers/Header/controller/MainHeader';
import { NotificationProvider } from '@webstack/components/Notification/Notification';
import { ModalProvider } from '@webstack/components/Containers/modal/contexts/modalContext';
import { ModalOverlay } from '@webstack/components/Containers/modal/views/modalOverlay';
import { LoaderProvider } from '@webstack/components/Loader/Loader';
import GoogleTag from '@webstack/lib/thirdParty/Google/Analytics/controller/GoogleTag/GoogleTag';

import {
  LayoutProvider,
  useLayout,
} from '@webstack/layouts/default/hooks/useLayout';

const ApplyLayoutBackground = () => {
  const { layout } = useLayout();

  useEffect(() => {
    const original = document.body.style.background;
    if (layout.background) {
      document.body.style.background = layout.background;
    }

    return () => {
      document.body.style.background = original;
    };
  }, [layout.background]);

  return null;
};


const MyApp = ({ Component, pageProps }: AppProps) => {
  const gtag = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style jsx>{styles}</style>
      <ServiceContainer />
      <OverlayProvider>
        <LayoutProvider>
          <ApplyLayoutBackground />
          <LoaderProvider>
            <NotificationProvider>
              <ModalProvider>
                <HeaderProvider>
                  <ModalOverlay />
                  <MainLayout>
                    <Component {...pageProps} />
                  </MainLayout>
                </HeaderProvider>
              </ModalProvider>
            </NotificationProvider>
          </LoaderProvider>
        </LayoutProvider>
      </OverlayProvider>
      <GoogleTag gtag={gtag} />
    </>
  );
};

export default MyApp;
