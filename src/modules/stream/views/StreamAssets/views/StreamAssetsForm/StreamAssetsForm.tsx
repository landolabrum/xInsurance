import React, { useState, useEffect } from 'react';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import useSessionStorage from '@webstack/hooks/storage/useSessionStorage';

const toStringSafe = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return value.toString();
  return '';
};

const DEFAULT_CORNER = 'top-left';

const StreamAssetForm: React.FC = () => {
  const [fields, setFields] = useState<IFormField[]>([]);
  const { sessionData, setSessionItem } = useSessionStorage();

  const currentCorner = toStringSafe(
    fields.find((f) => f.name === 'corner')?.value ?? DEFAULT_CORNER
  );

  const overlayData = sessionData?.[currentCorner] ?? {
    title: '',
    description: '',
    imageSrc: '',
    icons: [],
    list: [],
  };

  useEffect(() => {
    setFields([
      {
        name: 'corner',
        label: 'Corner',
        type: 'select',
        value: currentCorner,
        options: [
          { value: 'top-left', label: 'Top Left' },
          { value: 'top-right', label: 'Top Right' },
          { value: 'bottom-left', label: 'Bottom Left' },
          { value: 'bottom-right', label: 'Bottom Right' },
          { value: 'bottom-full', label: 'Bottom Full' },
        ],
      },
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        value: toStringSafe(overlayData?.title),
        required: true,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'text',
        value: toStringSafe(overlayData?.description),
      },
      {
        name: 'icon',
        label: 'Icon (FontAwesome ID)',
        type: 'text',
        value: toStringSafe(overlayData?.icons?.[0]),
      },
      {
        name: 'imageSrc',
        label: 'Image URL',
        type: 'text',
        value: toStringSafe(overlayData?.imageSrc),
      },
    ]);
  }, [sessionData, currentCorner]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const val = value?.value || value;
    const updatedFields = fields.map((f) =>
      f.name === name ? { ...f, value:val } : f
    );

    setFields(updatedFields);

    const updatedCorner = name === 'corner' ? value : currentCorner;

    // Build new overlay object
    const newOverlay = updatedFields.reduce((acc, field) => {
      if (field.name === 'corner') return acc;
      if (field.name === 'icon') {
        acc.icons = [toStringSafe(field.value)].filter(Boolean);
      } else {
        acc[field.name] = toStringSafe(field.value);
      }
      return acc;
    }, {} as Record<string, any>);

    // Save overlay under corner
    setSessionItem(updatedCorner, newOverlay);
  };

  const handleSubmit = () => {
    // no-op: all updates handled via handleChange
  };

  return (
    <div className="stream__form">
      <UiForm
        fields={fields}
        title="Overlay Builder"
        submitText="Update Overlay"
        onChange={handleChange}
        onSubmit={handleSubmit}
        variant="dark"
      />
    </div>
  );
};

export default StreamAssetForm;
