import React, { useRef } from 'react';
import styles from './StreamAssets.scss';
import AdaptGrid from '@webstack/components/Containers/AdaptGrid/AdaptGrid';
import StreamAssetItem from '../views/StreamAssetItem/StreamAssetItem';
import useSessionStorage from '@webstack/hooks/storage/useSessionStorage';

interface StreamOverlayData {
  title: string;
  description: string;
  list: { id: number; name: string }[];
  corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-full' | 'bottom-full';
  imageSrc?: string;
  icons?: string[];
}

interface IStreamAssets {
  size?: { x: number; y: number };
  aspectRatio?: number;
}

const StreamAssets: React.FC<IStreamAssets> = ({ size, aspectRatio }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { sessionData } = useSessionStorage();

  const overlays: StreamOverlayData[] = Object.entries(sessionData ?? {})
    .map(([corner, data]) => ({
      ...(data as Partial<StreamOverlayData>),
      corner: corner as StreamOverlayData['corner'],
      title: data?.title ?? '',
      description: data?.description ?? '',
      list: data?.list ?? [],
      imageSrc: data?.imageSrc,
      icons: data?.icons ?? [],
    }));

  const containerStyle: React.CSSProperties = {
    width: size?.x ? `${size.x}px` : undefined,
    height: size?.y ? `${size.y}px` : undefined,
    aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
    position: 'relative',
  };

  return (
    <>
      <style jsx>{styles}</style>

      <div ref={containerRef} className="stream-assets" style={containerStyle}>
        <div className="stream-assets__video-layer">
          <AdaptGrid xs={2}>
            <div className="stream-assets__placeholder" />
            <div className="stream-assets__placeholder" />
            <div className="stream-assets__placeholder" />
            <div className="stream-assets__placeholder" />
          </AdaptGrid>
        </div>

        {/* Overlay Layer */}
        {overlays.map((overlay, index) => (
          <div
            key={index}
            className={`stream-assets__overlay stream-assets__overlay--${overlay.corner}`}
          >
            <StreamAssetItem {...overlay} />
          </div>
        ))}
      </div>
    </>
  );
};

export default StreamAssets;
