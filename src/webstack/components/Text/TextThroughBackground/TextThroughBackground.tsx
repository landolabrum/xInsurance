import React, { useEffect, useState } from 'react';
import styles from './TextThroughBackground.scss';
import useWindow from '@webstack/hooks/window/useWindow';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';

interface MediaConfig {
  url: string;
  type?: 'image' | 'video' | 'youtube';
}

interface TextConfig {
  content: React.ReactNode;
  size?: string;
  position?: {
    top?: string;
    left?: string;
    bottom?: string;
    right?: string;
  };
  color?: string;
  fontWeight?: string;
  textTransform?: string;
  textAlign?: string;
  [key: string]: any;
}

interface Props {
  media: MediaConfig;
  text: TextConfig;
  btn?: any;
}

const TextThroughBackground: React.FC<Props> = ({ media, text, btn }) => {
  const { width } = useWindow();

  const [textStyles, setTextStyles] = useState<any>({});

  const updateFontSize = () => {
    const fontSize = text.size || `${(width / 100) * 2.5}px`;

    setTextStyles({
      fontSize,
      fontWeight: text.fontWeight || 'bold',
      textTransform: text.textTransform || 'none',
      textAlign: text.textAlign || 'center',
      width: '100%',
      color: 'transparent',
      ...text,
    });
  };

  useEffect(() => {
    updateFontSize();
  }, [width, text]);

  const isYouTubeEmbed = (url: string) =>
    url.includes('youtube.com') || url.includes('youtu.be');

const renderMedia = () => {
  if (media.type === 'youtube' && isYouTubeEmbed(media.url)) {
    const embedUrl = media.url.includes('embed')
      ? media.url
      : `https://www.youtube.com/embed/${media.url
          .split('/')
          .pop()}?controls=0&autoplay=1&mute=1&loop=1&modestbranding=1&playlist=${media.url.split('/').pop()}`;

    return (
      <>
        <style jsx>{styles}</style>
        <iframe
          className="clip-text-video__youtube"
          src={embedUrl}
          title="YouTube Video"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </>
    );
  }

  if (media.type === 'video') {
    return (
      <>
        <style jsx>{styles}</style>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="clip-text-video__video"
        >
          <source src={media.url} />
        </video>
      </>
    );
  }

  return (
    <>
      <style jsx>{styles}</style>
      <img
        src={media.url}
        alt="background"
        className="clip-text-video__image"
      />
    </>
  );
};


  return (
    <>
      <style jsx>{styles}</style>
      <section className="clip-text-video">
        {renderMedia()}
        <div className="clip-text-video__text">
          <span className="clip-text-video__mask" style={textStyles}>
            {text.content}
          </span>
           {btn && (
            <div className="clip-text-video__text--action">
              <UiButton {...btn} disabled={false} variant="inherit">
                {btn?.text || 'Click here'}
              </UiButton>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default TextThroughBackground;
