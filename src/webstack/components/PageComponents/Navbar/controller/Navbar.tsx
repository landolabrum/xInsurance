import React, { useEffect, useState, useMemo, useRef } from "react";
import styles from "./Navbar.scss";
import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import { IRoute, useClearanceRoutes } from "../data/routes";
import useRoute from "~/src/core/authentication/hooks/useRoute";
import UiButton from "@webstack/components/UiForm/views/UiButton/UiButton";
import Authentication from "~/src/pages/authentication";
import { IModalContent, useModal } from "@webstack/components/Containers/modal/contexts/modalContext";
import UiSelect from "@webstack/components/UiForm/components/UiSelect/UiSelect";
import MobileNav from "../views/MobileNav/MobileNav";
import environment from "~/src/core/environment";
import useNavMobile from "../hooks/useNavBreak";
import useScroll from "@webstack/hooks/useScroll";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import useCart from "~/src/modules/ecommerce/cart/hooks/useCart";

const Navbar = () => {
  const { selectedUser, pathname, explicitRouter } = useRoute();
  const routes = useClearanceRoutes();
  const [scroll, _] = useScroll();
  const { openModal, closeModal, isModalOpen, replaceModal } = useModal();
  const [currentRoutes, setCurrentRoutes] = useState<IRoute[]>([]);
  const [toggled, setToggled] = useState<string | null>(null);
  const navRef = useRef(null);
  const navItemsRef = useRef(null);
  const breakpointWidth = 1100;
  const isMobile = useNavMobile(navRef, navItemsRef, breakpointWidth);

  const handleMobileClick = (selectedRoute: IRoute) => {
    if (isModalOpen) {
      handleModalNavigation(selectedRoute);
    } else {
      handleRouteNavigation(selectedRoute);
    }
  };
  const handleModal = ({children,variant,title}:{title?:any,children:any, variant?:'popup'|'fullscreen'}) =>{
    const brandTitle= 
        <>
          <h1 onClick={() => handleMobileClick({ href: '/' })}>
            <UiIcon icon={`${environment.merchant.name}-logo`} />
            {environment.merchant.name && keyStringConverter(environment.merchant.name)}
          </h1>
        </>;

    let context = { variant:variant&&variant||'popup',children: children, title:title||brandTitle };
     isModalOpen ? replaceModal(context) : openModal(context);
  }
  const handleModalNavigation = (selectedRoute: IRoute) => {
    if (selectedRoute.href && !selectedRoute.items) {
      explicitRouter(selectedRoute);
    } else if (selectedRoute.modal && modals[selectedRoute.modal]) {
      handleModal( modals[selectedRoute.modal])
    } else {
      replaceModal({
        children: <MobileNav routes={selectedRoute.items || []} handleClick={handleMobileClick} onBack={handleBackButtonClick} />,
      });
    }
  };

  const handleRouteNavigation = (selectedRoute: IRoute) => {
    if (selectedRoute.href && !selectedRoute.items) {
      explicitRouter(selectedRoute);
      closeModal();
    } else if (selectedRoute.modal && modals[selectedRoute.modal]) {
      handleModal({children:modals[selectedRoute.modal]});
    } else if (selectedRoute.items) {
      handleModal({ children: <MobileNav routes={selectedRoute.items || []} handleClick={handleMobileClick} onBack={handleBackButtonClick} /> });
    }
  };

  const merchantName = String(environment.merchant.name);
  const isBrandRoute = (route: IRoute) => route.label === keyStringConverter(merchantName);

  const handleBackButtonClick = () => {
    setCurrentRoutes(routes);
    handleTrigger();
  };

  const handleToggle = (label: string) => {
    setToggled(label);
  };

  const handleSelect = (route: IRoute | string) => {
    const _route: IRoute = typeof route === 'string' ? { href: route } : route;

    if (_route?.href) {
      explicitRouter(_route);
      setToggled(_route.label || null);
    } else if (_route?.modal)handleModal({children:modals[_route.modal]});
  };

  const defaultModalProps: IModalContent = {};

  const handleTrigger = () => {
    const content = {

      children: <MobileNav routes={currentRoutes} handleClick={handleMobileClick} />,
    };

    handleModal(content);
  };

  const displayName = useMemo(() => {
    return selectedUser?.name ? `${selectedUser.name.split(" ")[0]} ${selectedUser.name.split(" ")[1][0]}.` : "";
  }, [selectedUser]);

  const { total } = useCart();

  const modals: any = {
    login: <Authentication view="sign-up" />,
  };

  const navClass = `navbar__container ${isMobile ? 'navbar__container--hide' : ''} ${merchantName}`;

  useEffect(() => {
    if (!isModalOpen && toggled) {
      setToggled('');
    }
  }, [setToggled, isModalOpen]);

  useEffect(() => {
    if (routes) {
      const newRoutes = routes
        .filter(r => !(r.href === '/cart' && total === 0) && r.hide !== true)
        .map(r => r);

      setCurrentRoutes(newRoutes.reverse());
    }
    toggled != null && setToggled(null);
  }, [routes, setCurrentRoutes, total]);

  return (
    <>
      <style jsx>{styles}</style>
      <nav id="nav-bar" className={navClass}>
        <div className="navbar" ref={navRef}>
          <div className={`navbar__trigger${scroll > 90 ? ' navbar__trigger--o' : ''}`}>
            <UiIcon
              icon={isModalOpen ? 'fa-xmark' : 'fa-bars'}
              onClick={handleTrigger}
            />
          </div>
          <div ref={navItemsRef} className={`nav-bar__nav-items`}>
            {currentRoutes && currentRoutes.map((route, key) => {
              return <div
                key={key}
                className={`nav__nav-item nav__nav-item--${route.label ? (
                  isBrandRoute(route) ? 'brand' : route.label.toLowerCase()) : (
                  String(route.href).split('/')[1]
                )}${toggled === route.label ? ' nav__nav-item__active' : ''}${route.label === 'user-account' && total === 0 && ' no-cart' || ''
                  }`}
                onDoubleClick={() => route?.href && handleSelect({ href: route.href })}
              >
                {route.href !== '/cart' ? !route?.items ? (
                  <UiButton
                    traits={route?.icon ? (
                      isBrandRoute(route) ? {
                        beforeIcon: { icon: route.icon }
                      } : {
                        afterIcon: { icon: route.icon }
                      }
                    ) : undefined}
                    variant="nav-item"
                    onClick={() => handleSelect(route)}
                  >
                    {route.label}
                  </UiButton>
                ) : (
                  <UiSelect
                    openDirection={route?.label === 'user-account' && 'left' || undefined}
                    overlay={{ zIndex: 997 }}
                    traits={route?.icon ? { afterIcon: { icon: route.icon } } : undefined}
                    openState={Boolean(toggled && toggled === route.label) ? 'open' : 'closed'}
                    variant={`nav-item${toggled === route?.label ? '--active' : ''}`}
                    value={route.label === 'user-account' ? displayName : route.label}
                    options={route?.items}
                    onSelect={handleSelect}
                    onToggle={() => route.label && handleToggle(route.label)}
                  />
                ) : (
                  <UiIcon
                    badge={total}
                    onClick={() => handleSelect(route)}
                    icon={route?.icon}
                  />
                )}
              </div>
            })
            }
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
