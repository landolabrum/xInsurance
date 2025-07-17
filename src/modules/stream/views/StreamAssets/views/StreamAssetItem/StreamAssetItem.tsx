import React from 'react';
import styles from './StreamAssetItem.scss';
import UiMedia from '@webstack/components/UiMedia/controller/UiMedia';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';

interface IStreamAssetItemListItem {
  name?: string;
  id?: number;
}

interface IStreamAssetItem {
  title: string;
  description: string;
  list: IStreamAssetItemListItem[];
  className?: string;
  animation?: string;
  imageSrc?: string;
  icons?: string[];
}

const StreamAssetItem: React.FC<IStreamAssetItem> = ({
  title,
  description,
  list,
  className = '',
  animation = '',
  imageSrc,
  icons = [],
}) => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className={`stream-asset-item ${className} ${animation}`}>
        <div className="stream-asset-item__header">
          {imageSrc && (
            <div className="stream-asset-item__media">
              <UiMedia src={imageSrc} type='img' alt={title} width={50} height={50} />
            </div>
          )}
          <div className="stream-asset-item__info">
            <div className="stream-asset-item__title">{title}</div>
            <div className="stream-asset-item__description">{description}</div>
          </div>
          {!!icons.length && (
            <div className="stream-asset-item__icons">
              {icons.map((icon, index) => (
                <UiIcon key={index} icon={icon} size={18} />
              ))}
            </div>
          )}
        </div>
        <div className="stream-asset-item__list">
          {list.map((item, index) => (
            <div className="stream-asset-item__list-item" key={index}>
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StreamAssetItem;
