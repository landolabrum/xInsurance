// Relative Path: ./MbOne.tsx
import React, { useEffect, useState } from 'react';
import styles from "./NirvanaEnergy.scss";
import AdaptGrid from '@webstack/components/Containers/AdaptGrid/AdaptGrid';
import HomeGridItem from '../../../HomeGridItem/HomeGridItem';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
// import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import { upperCase } from 'lodash';
import UiMedia from '@webstack/components/UiMedia/controller/UiMedia';
import useScroll from '@webstack/hooks/useScroll';
import useWindow from '@webstack/hooks/window/useWindow';
import { useRouter } from 'next/router';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
// import AdminService from '../../../../../core/services/AdminService/AdminService';
import { getService } from '@webstack/common';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import Services from '~/src/pages/services';
import TextThroughBackground from '@webstack/components/Text/TextThroughBackground/TextThroughBackground';
// const NirvanaEnergyIcon = () => {
//   const nStyle = `.nirv{
//       display: flex;
//       color: var(--blue-10);
//       --ui-icon-color: var(--blue-10);
//       gap: var(--s-9);
//       font-size: var(--s-5);
//   }`;
//   return <>
//     <style jsx>{nStyle}</style><style jsx>{styles}</style>
//     <div className='nirv'>
//       <div className='nirv--icon'>
//         <UiIcon icon={`nirvana-energy-logo`} />
//       </div>
//       Nirvana Energy
//     </div>
//   </>
// }

// Remember to create a sibling SCSS file with the same name as this component
const NirvanaEnergy = () => {

  const { openModal, closeModal, replaceModal } = useModal();
  const { width, height } = useWindow();
  const { push } = useRouter();
  const [currentScrollYPosition] = useScroll();
  const [view, setView] = useState('start');
  const [bgLoaded, setBgLoaded] = useState(false);

  const outputValue = (powerInKW: number) => {
    const volts = 240;
    const powerFactor = 1;
    const ampStr = String((powerInKW * 1000) / (volts * powerFactor)).split('.');
    const addAmp = Number(String(ampStr[1])[0]) > 5;
    const amps = addAmp ? Number(ampStr[0]) + 2 : ampStr[0];
    return `${powerInKW} kW = ${amps} Amps`;
  };
  const handleModal = (cmd: 'terms' | 'privacy') => {
    if (cmd == 'terms') {
      push('/terms-and-conditions')
      // onClick={() => push('/build')}
      //       openModal({
      // variant: 'fullscreen',
      // // title: 'Terms of Service',
      // children: <>
      //         <TermsOfService onClose={console.log}/>
      //         </>,
      //         footer: <div className='s-w-100 d-flex'>
      //           <UiButton variant='link' onClick={() => closeModal()}>Close</UiButton>
      //         </div>
      //       })
    } else if (cmd == 'privacy') {
      push('/privacy-policy')
      //   openModal({
      //     title: 'Privacy Policy',
      //     variant: 'fullscreen',
      //     children:<>
      //     <PrivacyPolicy onClose={console.log}/>
      //     </>

      // })   
    }
    else {
      push("/")
    }
  };
  const CompetitorBrand
    = ({ competitor }: { competitor: string }) => {
      return <>
        <style jsx>{styles}</style>
        <div className='nirvana-energy__competitor'>
          {upperCase(competitor)}
        </div>
      </>
    }
  const tableData = [
    {
      "Solar Panels": "High-efficiency panels designed for durability and maximum sunlight capture",
    },
    {
      "Battery-Backup": "Maintain uninterrupted power with intelligent, 24/7 battery storage",
    },
    {
      "Generators": "Rugged and dependable backup power for emergencies and off-grid use",
    },
    {
      "Solar Farm": "Scale your energy production with a custom-designed commercial solar array",
    },
    {
      "DIY Consulting": "Expert guidance to help you design and install your own solar system",
    },
  ];

  const scrollFadeMatrix = -currentScrollYPosition * .002 + 1;
  const isScrolled = scrollFadeMatrix < 0;
  const bgOpacity = (): any => {
    if (isScrolled) return { opacity: 0, visibility: 'hidden' };
    return currentScrollYPosition > 10 ? {
      opacity: scrollFadeMatrix,
      visibility: 'visible'
    } : {}
  }
  const service: any = getService("IAdminService");
  const listThreas = async () => {
    try {
      const response = await service.listThreats();
      console.log({ response })
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    listThreas()
  }, []);
  const isDesktop = width > 1100;
  const handleBackgroundLoad = () => {
    setBgLoaded(true);
  }


  return (
    <>
      <style jsx>{styles}</style>
      <div id="nirvana-index" className="nirvana-energy">
        <div className="nirvana-energy__bg-overlay" onClick={() => push("/build")} style={bgOpacity()}>
          <TextThroughBackground
            btn={{
              text:"start here",
              variant:'glow'
            }}
            media={{
              url: "https://github.com/landolabrum/assets/raw/refs/heads/main/nirv1/b-roll/home.webm",
              type: "video", // optional; defaults to image if omitted
            }}
            text={{
              // backgroundColor: "var(--gray-10)",
              content: "Build your Nirvana",
              // fontSize: "10rem",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          />
        </div>

        <div className="nirvana-energy__content--first">
          <div className="nirvana-energy__content--title">Protect your future, create your Nirvana.</div>
          <div className="nirvana-energy__content--label">
            On and Off-grid battery back up If you&apos;re thinking about going off grid or want to learn more about
            backup battery systems, it&apos;s time to create your Nirvana.
          </div>
          <UiMedia
            type="video"
            poster={
              <>
                <img alt="nirv1-home" className="d-flex s-w-100" src="/merchant/nirv1/videos/nirv1_index1-poster.png" />
              </>
            }
            src="/merchant/nirv1/videos/nirv1_index1.mp4"
          />
        </div>
        <div className="nirvana-energy__content">
          {view == "start" && (
            <>
              <div className="nirvana-energy__content--title">The Importance of Backup Batteries</div>
              <AdaptGrid sm={1} md={3} margin="0 0 45px" gap={15}>
                <HomeGridItem icon="fal-cloud-bolt-sun" title="power outages">
                  With backup batteries, you can be sure your home will have power even during outages. Most batteries
                  will only back up what is stored when the grid goes down. Be sure to get our system that refills the
                  battery if the grid stays down.
                </HomeGridItem>
                <HomeGridItem icon="fa-globe" title="environmental concerns">
                  Using solar battery backup systems helps reduce your carbon footprint. The less you rely on the grid,
                  the more you do for our planet.
                </HomeGridItem>
                <HomeGridItem icon="fal-circle-dollar" title="cost savings">
                  Solar battery backup systems can help you save money on electricity bills in the long run. The 30%
                  Federal Tax credit applies to battery storage that is connected to a PV
                </HomeGridItem>
              </AdaptGrid>
              {/* </div> */}
              <h3>On-grid vs Off-grid Solar Battery Backup Systems</h3>
              <AdaptGrid sm={1} md={2} margin="0 0" gapX={10}>
                <HomeGridItem title="on-grid">
                  On-grid systems are connected to the utility grid and can sell excess energy back to the power
                  competitor or store excess energy depending on how the system is
                </HomeGridItem>
                <HomeGridItem title="environmental concerns">
                  Off-grid systems are not connected to the utility grid. These systems can be tailored to fit your
                  needs no matter how big or small and using several different power sources.
                </HomeGridItem>
              </AdaptGrid>
              <HomeGridItem>
                <div className="nirvana-energy__content--services">
                  <Services />
                </div>
              </HomeGridItem>

              <div className="s-w-100 d-flex-col">
                ROC: 357597
                <div className="s-w-100 d-flex">
                  <UiButton variant="link" onClick={() => handleModal("terms")}>
                    Terms & Conditions
                  </UiButton>
                  <UiButton variant="link" onClick={() => handleModal("privacy")}>
                    Privacy Policy
                  </UiButton>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NirvanaEnergy;