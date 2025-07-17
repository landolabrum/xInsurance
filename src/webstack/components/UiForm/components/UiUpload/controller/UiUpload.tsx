import React, { useState, useRef } from 'react';
import styles from './UiUpload.scss';
import UiButton from '../../../views/UiButton/UiButton';
import UiInput from '../../UiInput/UiInput';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import AdaptGrid from '@webstack/components/Containers/AdaptGrid/AdaptGrid';
import UiMedia from '@webstack/components/UiMedia/controller/UiMedia';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import ProductImage from '~/src/modules/ecommerce/Products/views/ProductDescription/views/ProductImage/ProductImage';
interface UiUploadProps {
  title: string;
  onFileUpload: (file: File, previewUrl: string) => void;
  onFileRemove?: (index: number) => void;
  multiple?: boolean;
  maxFiles?: number;
}


const UiUpload: React.FC<UiUploadProps> = ({ title, onFileUpload, multiple = false, maxFiles = 5, onFileRemove }) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [fileInfos, setFileInfos] = useState<{ name: string; size: string; extension: string; dimensions?: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Check if the number of selected files exceeds maxFiles
    if (files.length + previews.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files.`);
      return;
    }

    const newFiles = Array.from(files);
    const updatedPreviews: string[] = [];

    newFiles.forEach((file,i) => {
      const objectUrl = URL.createObjectURL(file);
      const extension = file.name.split('.').pop()?.toLowerCase() || 'unknown';
      const size = `${(file.size / 1024).toFixed(1)} KB`;
      const name:string = file.name;

      // Check if image, create a new Image object to get dimensions
      const img = new Image();
      img.onload = () => {
        const newInfo = {
          src: <ProductImage image={objectUrl} options={{ alt: name, variant: "upload" }} />,
          name,
          size,
          extension,
          dimensions: `${img.width}×${img.height}px`,
          delete: <UiIcon color="red" onClick={() => handleRemove(i)} icon="fa-trash-can" />,
        };
        setFileInfos(prev => [...prev, newInfo]);
      };
      img.src = objectUrl;

      updatedPreviews.push(objectUrl);
      onFileUpload(file, objectUrl);
    });

    setPreviews(prev => [...prev, ...updatedPreviews]);

    // Clear the file input field after processing the files
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

const handleRemove = (index: number) => {
  setPreviews(prev => prev.filter((_, i) => i !== index));
  setFileInfos(prev => prev.filter((_, i) => i !== index));
  if (onFileRemove) onFileRemove(index);
};


  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files) return;
    const fileList = new DataTransfer();
    Array.from(files).forEach(file => fileList.items.add(file));
    if (fileInputRef.current) {
      fileInputRef.current.files = fileList.files;
      handleFileChange({ target: { files: fileList.files } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const renderFileTable = () => {
    if (!fileInfos.length) return null;
    return (
      <AdapTable
        data={fileInfos}
        variant="mini"
        options={{ hide: ['footer','header'], hideColumns: [], title: 'Files' }}
        filters={[]}
      />
    );
  };

  const filePlaceholder = previews.length > 0
    ? `Add another image (${previews.length}/${maxFiles})`
    : 'Upload image';

  return (
    <>
      <style jsx>{styles}</style>
      <div className="ui-upload d-flex" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        {renderFileTable()}
        <div className="ui-upload--actions">
          <UiInput
            innerRef={fileInputRef}
            type="file"
            accept="image/*"
            variant="inherit"
            
            placeholder={filePlaceholder}
            multiple={multiple}
            onChange={handleFileChange}
          />
                 

             <div className='fake'>
             <div >
              {filePlaceholder}
              </div>
                <UiIcon icon="fas-plus"/>
              </div>
        </div>
      </div>
    </>
  );
};

export default UiUpload;
