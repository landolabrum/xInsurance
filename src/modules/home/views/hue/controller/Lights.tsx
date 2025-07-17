import React, { useEffect, useState } from 'react';
import styles from './Lights.scss';
import { getService } from '@webstack/common';
import IHomeService, { ILight } from '~/src/core/services/HomeService/IHomeService';
import AdaptGrid from '@webstack/components/Containers/AdaptGrid/AdaptGrid';
import { useLoader } from '@webstack/components/Loader/Loader';
import UiBar from '@webstack/components/Graphs/UiBar/UiBar';
import ToggleSwitch from '@webstack/components/UiForm/components/UiToggle/UiToggle';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import UiInput from '@webstack/components/UiForm/components/UiInput/UiInput';
import ColorPicker from '@webstack/components/ColorPicker/ColorPicker';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import { calculateHexFromHueSatBri } from '../functions/LightHelpers';
import { reverseString } from '@webstack/helpers/Strings/reverseString';

interface ILightDisplay extends ILight {
  view?: string;
}

const LightsList = () => {
  const [loader, setLoader] = useLoader();
  const [group, setGroup] = useState<string[]>([]); // Changed from useState<string[] | undefined>();

  const [go, setGo] = useState<any | undefined>(false);
  const [currentLight, setCurrentLight] = useState<ILightDisplay | undefined>();
  const [hueData, setHueData] = useState<any>();
  const [isAll, setIsAll] = useState<boolean>(false);
  const homeService = getService<IHomeService>('IHomeService');
  const [view, setView] = useState('light');

  const updateLight = (changedLight: ILightDisplay, isColor?: boolean) => {
    setHueData(() => hueData.map((light: ILightDisplay) => {
      if (light.id_ == changedLight.id_) {
        if (isColor) changedLight.view = 'color';
        light = changedLight;
      }
      return light;
    }))
  };

  const toggleBarView = (id: string) => {
    const updateLightsWithView = hueData.map((light: ILightDisplay) => {
      if (light?.id_ == id) {
        if (light?.view == undefined) {
          light.view = 'color';
        } else if (light?.view != undefined) {
          delete light.view;
        }
      }
      return light;
    });
    setHueData(updateLightsWithView);
  }

  const onLights = hueData && hueData?.filter((light: ILightDisplay) => light.is_on) || [];
  const handleLightAnimation = (color: string) => {
    if (onLights.length === 0) return;
    const currentLightIndex = currentLight ? onLights.findIndex((light: ILightDisplay) => light.id_ === currentLight.id_) : -1;
    const nextLightIndex = (currentLightIndex + 1) % onLights.length;
    const nextLight = onLights[nextLightIndex];
    setCurrentLight(nextLight);
    multiHomeService('color', { id: nextLight.id_, hex: color });
  };

  const atPoints = onLights && onLights.map((light: ILightDisplay, index: number) => {
    const newHex = light?.hex ? `#${reverseString(light.hex.substring(1, light.hex.length))}` : '#ff3300';
    return {
      time: (index + 1) * 1000,
      value: newHex,
      backgroundColor: newHex,
      onPoint: handleLightAnimation
    };
  });

  const hueList = async (hue_object?: string) => {
    setLoader({ active: true, body: `loading ${hue_object}` });
    try {
      const response = await homeService.hue_list(hue_object);
      setHueData(response);
    } catch (e: any) {
      console.log('[ FETCH LIGHTS (ERR) ]', JSON.stringify(e));
    }
  }

  const multiHomeService = async (action: string, data?: any) => {
    const handleLoader = (active: boolean, action?: string, name?: string) => {
      setLoader({ active: active, body: `${action}, ${name} ` });
    };

    handleLoader(true, action, data?.name);

    const applyAction = async (id_: string) => {
      let response;
      const numericId = Number(id_);
      switch (action) {
        case 'toggle':
          response = await homeService.hue_toggle(numericId, view === 'group' && 'group' || undefined);
          break;
        case 'brightness':
          if (data?.bri !== undefined) {
            response = await homeService.hue_brightness(numericId, data.bri, view);
          }
          break;
        case 'color':
          if (data?.hex) {
            response = await homeService.lightColor(id_, data.hex, view);
            const calculatedHex = calculateHexFromHueSatBri(response.hue, response.sat, response.bri);
            response = { ...response, hex: calculatedHex, view: 'color' };
          }
          break;
      }
      if (response) {
        updateLight(response, action === 'color');
      }
    };

    if (isAll) {
      for (const light of hueData) {
        await applyAction(light.id_);
      }
    } else if (group.length > 0 && ['toggle', 'brightness', 'color'].includes(action)) {
      for (const id_ of group) {
        await applyAction(id_);
      }
    } else if (data?.id) {
      await applyAction(data.id);
    }

    handleLoader(false, action, data?.name);
  };

  const getHueList = (hue_object?: string) => {
    hueList(hue_object).then(() => {
      setLoader({ active: false });
      hue_object && setView(hue_object);
    });
  }

  const oppoView = view === 'light' ? 'group' : 'light';

  const addToGroup = (id_: string) => {
    setGroup(group !== undefined ? [...group, id_] : [id_]);
  }
  const removeFromGroup = (id_: string) => {
    if (group) {
      setGroup(group.filter((existingId) => existingId !== id_));
    }
  }
  useEffect(() => {
    hueData == undefined && getHueList();
  }, []);

  return (
    <>
      <style jsx>{styles}</style>
      <div className='lights'>
        <AdaptGrid xs={2} lg={3} gap={15}>
          <UiButton variant={go && 'primary'} onClick={() => getHueList(oppoView)}>{oppoView}</UiButton>
          <UiButton variant={go && 'primary'} onClick={() => setGo(!go)}>start animation</UiButton>
          <UiButton variant={go && 'primary'} onClick={() => setIsAll(!isAll)}>
            {isAll ? 'Unset All' : 'Set All'}
          </UiButton>
        </AdaptGrid>
        {hueData && !isAll && <AdaptGrid xs={1} sm={3} gap={15}>
          {Object.entries(hueData).map(([key, light]: any, index: number) =>
            <div
              className={`lights__light ${group?.includes(light.id_) ? 'in-group' : ''}`}
              key={index}
              onDoubleClick={() => {
                if (group?.includes(light.id_)) {
                  removeFromGroup(light.id_);
                } else {
                  addToGroup(light.id_);
                }
              }}>
              <div className='lights__light-header'>
                <div className='lights__light-header--action'>
                  <UiInput size='sm' value={light.name} disabled={true} />
                  <UiButton size='sm' >update</UiButton>
                </div>

                <div className='lights__light-header--action' >
                  <ToggleSwitch name={light?.id_} value={light?.is_on} onChange={() => multiHomeService('toggle', { id: light.id_ })}/>
                  <div
                    className='lights__light-header--action'
                    onClick={() => toggleBarView(light.id_)}
                  >
                    <UiIcon icon='fa-palette' />
                  </div>
                </div>
              </div>

              {light?.view !== 'color' ? (
                <UiBar
                  onChange={(value) => {
                    if (String(value).length == 0 || !value) return;
                    else multiHomeService('brightness', { id: light.id_, bri: value, name: light.name });
                  }}
                  barCount={5}
                  percentage={light?.bri * 100 / 254}
                />
              ) : (
                <ColorPicker
                  hex={light.hex}
                  onChange={(hex: string) => multiHomeService('color', { id: light.id_, hex: hex, name: light.name })}
                />
              )}
            </div>
          )}
        </AdaptGrid>}

        {isAll && (
          <UiBar
            onChange={(value) => {
              if (String(value).length == 0 || !value) return;
              else if (String(value).startsWith('#')) multiHomeService('color', { id: 'all-lights', hex: value });
              else multiHomeService('brightness', { id: 'all-lights', bri: value });
            }}
            barCount={5}
            percentage={100} // This is an example percentage; adjust based on your logic
          />
        )}
      </div>
    </>
  );
};

export default LightsList;
