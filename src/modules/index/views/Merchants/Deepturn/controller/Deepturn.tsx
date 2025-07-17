import React, { useEffect, useState } from 'react';
import styles from './Deepturn.scss';
import UiMap from '@webstack/components/ThreeComponents/UiMap/controller/UiMap';
import { IVessel } from '@webstack/components/ThreeComponents/UiMap/models/IMapVessel';
import { useRouter } from 'next/router';

import UiMedia from '@webstack/components/UiMedia/controller/UiMedia';
import useWindow from '@webstack/hooks/window/useWindow';
import MBWaterMark from '../../../MindBurner/views/WaterMark/MBWaterMark';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import useLayout from '@webstack/layouts/default/hooks/useLayout';

const Deepturn = () => {
  const { pathname } = useRouter();
  const [currentVessel, setCurrentVessel] = useState<IVessel | false | undefined>();
  const {layout,setLayout}=useLayout();

  const vessels: IVessel[] = [

    // ✅ New Antelope Point Marina marker
    {
      id: 2,
      name: 'Antelope Point Marina',
      lngLat: [-111.429722, 36.966389],
      className: 'partner',
      hover: 'Antelope Point Marina',
      description: (
        <UiMedia
          autoplay
          style={{ height: "100%" }}
          variant='cover'
          type='iframe'
          src='https://www.youtube.com/embed/N9tH-8UOFas?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1'
        />
      ),
      // description:  <UiMedia type='iframe' src='https://www.youtube.com/embed/N9tH-8UOFas?si=OCakKGOAEY4yrkU5'/>,
      // description:  <></>
    },    {
      id: 1,
      name: 'Two Story Smart Home',

      lngLat: [-75.1867254, 39.9307048],
      className: "partner",
      // images: [
      //   "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEyNDAxNzM1NTk1NjgzMjg4Mw%3D%3D/original/e1573119-8f57-4e97-9d4f-9ed4be4de8b4.jpeg?im_w=1200",
      //   "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEyNDAxNzM1NTk1NjgzMjg4Mw%3D%3D/original/a6f2bd88-0ef0-455b-8f00-433eee5b13c2.jpeg?im_w=720"
      // ],
      description: <>
        <style jsx>{styles}</style>
        <div className='description'>
          <div className='description__request'>
              <UiButton variant='inherit' href={`/location?pid=1`}>Request</UiButton>
          </div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>
      </>
    },
  ];
useEffect(() => {if(!layout?.background && pathname === "/"){
  setLayout({background:"var(--black)"})
}else{
  setLayout({background:  undefined})

}}, []);
  return (
    <>
      <style jsx>{styles}</style>
      <div className="deepturn">
         {pathname === "/" && (
                <UiMap
                
                  onVesselClick={setCurrentVessel}
                  options={{
                    rpm: 1000,
                    hideTools: true,
                    // loadingDelay: 3000,
                    // zoom: 3,
                    // pitch: 50,
                    center: [-111.429722, 36.966389],
                  }}
                  vessels={vessels}
                />
              )}
      </div>
      <MBWaterMark />
    </>
  );
};

export default Deepturn;
