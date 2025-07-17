// src/functions/initializeMap.ts
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import { IVessel, IVesselActions } from "../models/IMapVessel";
import addVessels from "./mapVessels";
import { flyToView } from "./mapControls";
import mapRotate from "./mapRotate";

interface InitializeMapParams {
    map: MapboxMap;
    profile: any;
    vessels?: IVessel[];
    userVesselConfig: IVessel;
    vesselActions: IVesselActions;
    mapOptions: any;
    stopLoader: () => void;
    setLngLat: (lngLat: [number, number]) => void;
    setZoom: (zoom: number) => void;
    hideHover?: boolean;
}

const initializeMap = ({
    map,
    profile,
    vessels,
    userVesselConfig,
    vesselActions,
    mapOptions,
    stopLoader,
    setLngLat,
    setZoom,
    hideHover,
}: InitializeMapParams) => {
    const hasUserLocation = profile?.lngLat && profile.lngLat.every((lngOrLat: number) => lngOrLat !== 0);
    map.on('style.load', () => {
        const getInitialVessels = () => {
            if (profile?.lngLat) userVesselConfig.lngLat = profile?.lngLat;
            if (!vessels) return [userVesselConfig];
            if (hasUserLocation) {
                return [...vessels, userVesselConfig].map((vessel, index) => ({
                    ...vessel,
                    id: index + 1,
                }));
            } else {
                // flyToView(map, { lngLat: [-95, 37] });
                return [...vessels].map((vessel, index) => ({
                    ...vessel,
                    id: index + 1,
                }));
            }
        };
        mapOptions?.pitch && map.setPitch(mapOptions?.pitch);
        const initialVessels = getInitialVessels();
        addVessels(map, vesselActions, initialVessels, hideHover);
        mapOptions?.rpm && mapRotate(map, { zoom: mapOptions?.zoom || map.getZoom(), rpm: mapOptions?.rpm, maxZoom: mapOptions?.zoom + 5});
        stopLoader();
    });
    map.on('move', () => {
        setLngLat(mapOptions?.center || map.getCenter().toArray() as [number, number]);
        setZoom(mapOptions?.zoom || map.getZoom());
    });
};

export default initializeMap;
