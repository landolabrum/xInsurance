import React, { useCallback, useEffect, useState } from 'react';
import styles from './UiSettingsLayout.scss';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import UiHeader from '@webstack/components/Containers/Header/views/UiHeader/UiHeader';
import UiButtonGroup from '@webstack/components/UiForm/components/UiButtonGroup/controller/UiButtonGroup';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import useWindow from '@webstack/hooks/window/useWindow';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { useRouter } from 'next/router';

interface ISettingsLayout {
  views: Record<string, React.ReactNode>;
  setViewCallback?: (view: string) => void;
  variant?: 'full-width' | 'full';
  theme?: 'light';
  title?: React.ReactNode;
  subTitle?: string;
  viewName?: string;
  customMenu?: React.ReactNode;
  footer?: React.ReactNode;
}

const UiSettingsLayout: React.FC<ISettingsLayout> = ({
  views,
  setViewCallback,
  variant,
  theme,
  title,
  subTitle,
  viewName,
  customMenu,
  footer,
}) => {
  const router = useRouter();
  const { width } = useWindow();
  const [view, setView] = useState<string>();
  const [collapseOpen, setCollapseOpen] = useState(false);

  const viewKeys = Object.keys(views);
  const defaultView = viewName || viewKeys[0];
  const isValidView = view && viewKeys.includes(view);
  
  const generateClass = (block?: string) => {
    let cls = `settings`;
    let blk = block || '';
    if (block) cls += ` settings__${blk}`;
    if (variant) cls += ` settings${block ? `__${blk}` : ""}--${variant}`;
    if (theme) cls += ` settings__${blk}_${theme}`;
    if (view === 'no-view') cls += ` settings${block ? `__${blk}` : ""}--no-view`;
    return cls;
  };

  const handleViewChange = useCallback((newView: string) => {
    setCollapseOpen(false);
    router.push(
      { pathname: router.pathname, query: { vid: keyStringConverter(newView) } },
      undefined,
      { shallow: false }
    );
    setViewCallback?.(newView);
  }, [router, setViewCallback]);

  const renderButtons = () => (
    <UiButtonGroup
      btns={viewKeys.map((key) => ({
        label: keyStringConverter(key),
        name: key,
        value: key,
        checked: view === key,
        disabled: false,
      }))}
      onSelect={(e) => handleViewChange(e.target.value)}
      // btnSize="md"
    />
  );
const setFixed = () => {
  const el = document.getElementById('main');
  if (el && !el.classList.contains('main-fixed')) {
    el.classList.add('main-fixed');
  }
};

useEffect(() => {
  const routeView = router.query?.vid as string;
  if (routeView && routeView !== view) {
    setView(routeView);
  }
}, [router.query]);

useEffect(() => {
  variant =='full' && setFixed();

  return () => {
    const el = document.getElementById('main');
    if (el) el.classList.remove('main-fixed');
  };
}, []);

  useEffect(() => {
    if (!view && defaultView && !isValidView) {
      setView('no-view');
    };
  }, [view, defaultView]);

  const titleContent = typeof title === 'string' ? keyStringConverter(title) : title;

  if (!isValidView && view !== 'no-view') {
    return (
      <div className={generateClass('primary')}>
        <div className="settings__loader"><UiLoader /></div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{styles}</style>
      <div id="settings" className={generateClass()}>
     <div className={generateClass('header')}>
  {(!title && title !== undefined && isValidView) ? (
    <UiHeader title={titleContent} subTitle={subTitle} />
  ) : (titleContent && view !== 'no-view') ? (
    <div>
      <h2 className='settings__title'>{titleContent}</h2>
    </div>
  ) : "null"}
</div>


        <div className={generateClass('container')}>
          <div className={generateClass('nav')}>

            {width < 1260 && view !== 'no-view' ? (
              <UiCollapse
                open={collapseOpen}
                onToggle={() => setCollapseOpen(!collapseOpen)}
                label={keyStringConverter(view || router.pathname.split('/')[1])}
              >
                {renderButtons()}
              </UiCollapse>
            ) : renderButtons()}

            {customMenu}
          </div>

          {view !== 'no-view' && (
            <div className={generateClass('view')}>
              <div className={generateClass('view--content')}>{views[view]}</div>
              {footer && <div className={generateClass('footer')}>{footer}</div>}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UiSettingsLayout;
