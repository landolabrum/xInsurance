// src/functions/handleResize.ts
import { MutableRefObject } from "react";
import { IVessel } from "../models/IMapVessel";
import { flyToView } from "./mapControls";

const handleResize = (
    mapContainerRef: MutableRefObject<HTMLDivElement | null>,
    mapRef: MutableRefObject<mapboxgl.Map | null>,
    isVesselVisible: boolean,
    newSize: any,
    setVesselVisibility:any,
    selectedVessel: any,
) => {
    if (!mapContainerRef.current) return;
    const map = mapRef.current;
    const hasVessel = isVesselVisible !== false;
    if (isVesselVisible===false) {
        console.log("[ TODO  ]:hideVessel",mapRef?.current)
                setVesselVisibility(false);

    }
    else
    if (hasVessel) {
                const direction = newSize < 1 ? "up" : "down";
        flyToView(map,{ 
            lngLat: selectedVessel.lngLat,
            zoom: 15,
            offset: { y:Math.abs(newSize * .9), x: 0 },
            direction
        });

        if (mapRef.current) {
            mapRef.current.resize();
        }
    }
};

export default handleResize;
