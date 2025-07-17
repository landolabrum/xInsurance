import React, { useEffect } from 'react';
import styles from './Stream.scss';
import { useHeader } from '@webstack/components/Containers/Header/controller/MainHeader';
import { useRouter } from 'next/router';
import StreamAssets from '../views/StreamAssets/controller/StreamAssets';
import StreamAssetForm from '../views/StreamAssets/views/StreamAssetsForm/StreamAssetsForm';

const Stream: React.FC = () => {
  const [header, setHeader] = useHeader();
  const { query } = useRouter();
  const view = query?.view;

  useEffect(() => {
    console.log(header)
   setHeader({ hide: true });
  }, []);

  return (
    <>
      <style jsx>{styles}</style>
      <div className="stream">
        {view === 'fields' && <StreamAssetForm />}
        <StreamAssets />
      </div>
    </>
  );
};

export default Stream;
