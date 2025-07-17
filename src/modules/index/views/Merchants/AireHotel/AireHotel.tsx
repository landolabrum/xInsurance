import React, { useState } from 'react';
import styles from './AireHotel.scss';
import UiMap from '@webstack/components/ThreeComponents/UiMap/controller/UiMap';
import { IVessel } from '@webstack/components/ThreeComponents/UiMap/models/IMapVessel';
// import MapVesselDetails from '@webstack/components/ThreeComponents/UiMap/views/MapVessel/views/MapVesselDetails/MapVesselDetails';
import { useRouter } from 'next/router';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
const AireHotel = () => {
  const { pathname } = useRouter()
  const [currentVessel, setCurrentVessel] = useState<IVessel | false | undefined>();
  // const closeVessel = () => currentVessel && setCurrentVessel(false);

  const vessels: IVessel[] = [
    {
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

  return (
    <>
      <style jsx>{styles}</style>
      <div className='deepturn'>
          {pathname == '/' && <UiMap
            onVesselClick={setCurrentVessel}
            hideHover={true}
            options={{
              rpm: 200,
              loadingDelay: 3000
            }}
            vessels={vessels}
          />}

        </div>
    </>
  );
};

export default AireHotel;
