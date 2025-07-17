// UiMedia.tsx
import { useEffect, useRef, useState } from 'react';
import styles from './UiMedia.scss';
import ImageControl, { IImageMediaType, IImageVariant } from '../ImageControl/ImageControl';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import useWindow from '@webstack/hooks/window/useWindow';

export interface IMedia {
  src: string;
  alt?: string;
  variant?: IImageVariant;
  onLoad?: (e: any) => void;
  type?: IImageMediaType;
  loadingText?: string;
  rotate?: number;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  poster?: string | React.ReactNode;
  preload?: 'auto' | 'metadata' | 'none';
  width?: number;
  height?: number;
  playbackSpeed?: number;
  children?: any;
  style?:any;
}

const UiMedia: React.FC<IMedia> = ({
  src,
  variant,
  type = 'image',
  alt,
  style,
  loadingText,
  rotate,
  onLoad,
  autoplay,
  controls,
  loop,
  muted,
  poster,
  preload = 'auto',
  width,
  height,
  playbackSpeed = 1,
  children
}) => {
  const [imageControlProps, setImageControlProps] = useState<any>({ variant, type });
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(!!autoplay);

  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement | HTMLIFrameElement | null>(null);
  const window = useWindow();

  const handleReload = () => {
    setImageControlProps({ ...imageControlProps, error: null });
    setReloadTrigger((prev) => prev + 1);
  };

  const RefreshLoadingText = () => (
    <>
      <div style={{ color: '#f90' }}>{loadingText}, Failed</div>
      <div>
        <UiIcon icon="fa-arrows-rotate" onClick={handleReload} />
      </div>
    </>
  );

  const handleLoad = (props: any) => {
    setIsLoading(false);
    onLoad?.(imageControlProps);
  };

  const handleError = (event: any) => {
    event.preventDefault();
    setIsLoading(false);
    if (!imageControlProps.error) {
      setImageControlProps({ ...imageControlProps, error: <RefreshLoadingText /> });
    }
  };

  const togglePlay = () => {
    if (type === 'video' && mediaRef.current) {
      const videoEl = mediaRef.current as HTMLVideoElement;
      if (videoEl.paused) {
        setImageControlProps({ ...imageControlProps, isPlaying: true });
        videoEl.play();
        setIsPlaying(true);
      } else {
        setImageControlProps({ ...imageControlProps, isPlaying: false });
        videoEl.pause();
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    if (type === 'video' && mediaRef.current && playbackSpeed) {
      (mediaRef.current as HTMLVideoElement).playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, type]);

  useEffect(() => {
    if (rotate && mediaRef.current) {
      mediaRef.current.style.transform = `rotate(${rotate}deg)`;
    } else if (mediaRef.current?.style.transform) {
      mediaRef.current.style.transform = '';
    }

    if (height && mediaRef.current) {
      mediaRef.current.style.height = `${height}px`;
    }

    if (variant && mediaRef.current) {
      mediaRef.current.classList.add(`ui-media--${variant}`);
      if (variant === 'background') {
        const shadowHeight = window.height - mediaRef.current.offsetHeight;
        if (shadowHeight < 0) return;
        mediaRef.current.style.boxShadow = `0 0 ${shadowHeight}px ${shadowHeight * 0.5}px var(--gray-80-o)`;
      }
    }
  }, [rotate, mediaRef, window, variant, src]);
  useEffect(() => {
    if (type === 'iframe' && mediaRef.current) {
      setImageControlProps({ ...imageControlProps, isPlaying: true });
      const iframe = mediaRef.current as HTMLIFrameElement;
      iframe.style.visibility = isLoading ? 'hidden' : 'visible';
    }
  }, [isLoading, type]);

  const stringPoster: string = typeof poster === 'string' && poster || '';

  return (
    <>
      <style jsx>{styles}</style>
      <ImageControl
        {...imageControlProps}
        mediaType={type}
        onComplete={handleLoad}
        onPlayPauseClick={togglePlay}
        showPlayPause={type === 'video'}
      >
        {isLoading && <div className="loading">{loadingText || 'Loading...'}</div>}
        {!autoplay && !isPlaying && poster && <div className="ui-media--poster" onClick={togglePlay}>
          <div className="ui-media--poster__content">
            {poster}
          </div>
        </div>}

        {!imageControlProps.error && (
          type === 'video' ? (
            <video
              ref={mediaRef as React.Ref<HTMLVideoElement>}
              src={src}
              autoPlay={autoplay}
              controls={false}
              loop={loop}
              muted={muted}
              poster={stringPoster}
              preload={preload}
              width={width}
              height={height}
              onLoadStart={() => setIsLoading(true)}
              onCanPlayThrough={handleLoad}
              onError={handleError}
              key={reloadTrigger}
              className="ui-media"
            />
          ) : type === 'iframe' ? (
            <div className="ui-media__iframe-wrapper">
              <iframe
                ref={mediaRef as React.Ref<HTMLIFrameElement>}
                src={src}
                width={width || '100%'}
                height={height || 360}
                title={alt || 'iframe'}
                onLoad={() => {
                  handleLoad({});
                  setIsLoading(false);
                }}
                onError={handleError}
                key={reloadTrigger}
                className="ui-media__iframe"
                style={style||{
                  border: 'none',
                  visibility: isLoading ? 'hidden' : 'visible'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              {isLoading && (
                <div className="loading">{loadingText || 'Loading iframe...'}</div>
              )}
              {imageControlProps.error && (
                <div className="ui-media__error">{imageControlProps.error}</div>
              )}
            </div>


          ) : (
            <img
              ref={mediaRef as React.Ref<HTMLImageElement>}
              src={src}
              alt={alt}
              onLoad={handleLoad}
              onError={handleError}
              key={reloadTrigger}
              className="ui-media"
              width={width}
              height={height}
            />
          )
        )}
        {children && <div className='ui-media__children'>
          {children}</div>}
      </ImageControl>
    </>
  );
};

export default UiMedia;
