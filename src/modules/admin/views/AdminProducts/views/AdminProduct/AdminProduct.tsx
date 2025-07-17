import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getService } from '@webstack/common';
import IAdminService from '~/src/core/services/AdminService/IAdminService';
import useDeleteProduct from '../../hooks/useDeleteProduct';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import styles from './AdminProduct.scss';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import environment from '~/src/core/environment';
import { useNotification } from '@webstack/components/Notification/Notification';
import useSessionStorage from '@webstack/hooks/storage/useSessionStorage';
import { IProduct } from '~/src/models/Shopping/IProduct';

const AdminProduct: React.FC<{ product?: any, products?: IProduct[]|null }> = ({ product, products }) => {
  const router = useRouter();
  const mid = environment.merchant.mid;
  const adminService = getService<IAdminService>('IAdminService');
  const { initiateDelete } = useDeleteProduct();
  const [notification, setNotification] = useNotification();
  const billingOptions = [
    { label: 'One-time Purchase', value: 'one_time' },
    { label: 'Daily', value: 'day' },
    { label: 'Weekly', value: 'week' },
    { label: 'Monthly', value: 'month' },
    { label: 'Every 3 months', value: 'quarter' },
    { label: 'Every 6 months', value: 'biannual' },
    { label: 'Yearly', value: 'year' },
    { label: 'Custom', value: 'custom' },
  ];

  const marketingFeatureOptions = [
    { label: 'AI Generated', value: 'ai_generated' },
    { label: 'Verified Creator', value: 'verified_creator' },
    { label: 'Premium Support', value: 'premium_support' },
    { label: 'Early Access', value: 'early_access' },
  ];

  const taxRateOptions = [
    { label: 'No Tax (0%)', value: '0.00' },
    { label: 'Standard (7.45%)', value: '0.0745' },
    { label: 'Custom (10%)', value: '0.10' },
  ];

  const [fields, setFields] = useState<IFormField[]>([]);
  const [productMetadata, setProductMetadata] = useState<IFormField[]>([]);
  const [prices, setPrices] = useState<IFormField[][]>([]);
  const [priceMetadata, setPriceMetadata] = useState<IFormField[][]>([]);

  useEffect(() => {
    const categories = products?.filter((p:any)=>{
      if(p?.metadata?.category)return p?.metadata?.category}
    );
    console.log({categories})
    const commonFields: IFormField[] = [
      { name: 'name', label: 'Product Name', type: 'text', required: true, value: product?.name || 'Cuppy Pro' },
      { name: 'description', label: 'Description', type: 'textarea', value: product?.description || 'For those who need Stability in life.', },
      { name: 'active', label: 'Active', type: 'checkbox', value: product?.active ?? true },
      {
        name: 'marketing_features',
        label: 'Marketing Features',
        type: 'multi-select',
        value: product?.marketing_features || [],
        options: marketingFeatureOptions,
      },
    ];
    setFields(commonFields);

    if (product?.metadata) {
      setProductMetadata(
        Object.entries(product.metadata)
          .filter(([key]) => key !== 'mid')
          .map(([key, value]) => ({
            name: key,
            label: key,
            type: 'text',
            value: String(value),
          }))
      );
    } else {
      setProductMetadata([]);
    }

    if (product?.price && typeof product.price === 'object') {
      const priceFields = getInitialPriceFields(
        product.price.tax_behavior === 'inclusive' ? 'yes' : 'no',
        product.price.tax_rate || '0.00',
        {
          ...product.price,
          recurring: product.price.recurring ? { interval: product.price.recurring.interval } : null,
        }
      );
      setPrices([priceFields]);

      setPriceMetadata([
        product.price.metadata
          ? Object.entries(product.price.metadata).map(([key, value]) => ({
            name: key,
            label: key,
            type: 'text',
            value: String(value),
          }))
          : [],
      ]);
    } else {
      setPrices([getInitialPriceFields()]);
      setPriceMetadata([[]]);
    }
  }, [product]);

  function getInitialPriceFields(includeTax: string = 'no', taxRate: string = '0.00', existing?: any): IFormField[] {
    const fields: IFormField[] = [
      { name: 'nickname', label: 'Price Name', type: 'text', value: existing?.nickname || '' },
      { name: 'unit_amount', label: 'Amount (USD)', type: 'text', value: existing?.unit_amount ? String(existing.unit_amount / 100) : '', traits: { mask: 'currency' } },
      { name: 'recurring', type: 'checkbox', label: 'recurring' },
      // { name: 'billing_period', label: 'Billing Period', type: 'select', value: existing?.recurring?.interval || 'one_time', options: billingOptions },
      { name: 'include_tax', label: 'Include Tax', type: 'select', value: includeTax, options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
      { name: 'file', label: 'Image File', type: 'file', multiple: false, value: '' },
    ];
    if (includeTax === 'yes') {
      fields.push({ name: 'tax_rate', label: 'Sales Tax Rate', type: 'select', value: taxRate, options: taxRateOptions });
    }
    return fields;
  }

  const onChange = (e: any, index?: number, isPriceMeta?: boolean) => {
    let { name, value, files } = e.target;
    name = name.replace(/^metadata\./, '');
    const val = value?.value !== undefined ? value?.value : value;
    // console.log({name,value})

    if ((files && files.length > 0) || val instanceof File) {
      const newFiles = files ? Array.from(files) : [val];
      if (typeof index === 'number') {
        const updated = [...prices];
        updated[index] = updated[index].map(f => f.name === name ? { ...f, value: newFiles[0] } : f);
        return setPrices(updated);
      }
    }

    if (typeof index === 'number') {
      const updated = [...(isPriceMeta ? priceMetadata : prices)];
      updated[index] = updated[index].map(f => f.name === name ? { ...f, value: val } : f);
      isPriceMeta ? setPriceMetadata(updated) : setPrices(updated);
    } else {
      const isMetaField = productMetadata.some(f => f.name === name);
      const isField = fields.some(f => f.name === name);
      if (isMetaField) {
        setProductMetadata(prev => prev.map(f => f.name === name ? { ...f, value: val } : f));
      } else if (isField) {
        setFields(prev => prev.map(f => f.name === name ? { ...f, value: val } : f));
      } else {
        console.warn(`Field "${name}" not found in form state`);
      }
    }
  };


  const onSubmit = async () => {
    const imageFiles = prices
      .map((priceFields, index) => {
        const fileField = priceFields.find(f => f.name === 'file')?.value;
        if (fileField instanceof File) {
          const nickname = String(priceFields.find(f => f.name === 'nickname')?.value || `price_${index}`);
          const ext = fileField.name.split('.').pop();
          return new File([fileField], `${nickname}_${index}.${ext}`, { type: fileField.type });
        }
        return null;
      })
      .filter(Boolean);

    const pricesData = prices.map((fields, index) => {
      const price = Object.fromEntries(fields.map(f => [f.name, f.value]));
      const billingPeriod = price.billing_period;
      const nickname = String(price.nickname || `price_${index}`).trim().replace(/\s+/g, '_');

      return {
        nickname,
        unit_amount: price.unit_amount
          ? Math.round(parseFloat(String(price.unit_amount).replace(/[^\d.]/g, '')) * 100)
          : 0,
        currency: 'usd',
        tax_behavior: price.include_tax === 'yes' ? 'inclusive' : 'exclusive',
        billing_scheme: 'per_unit',
        ...(price.include_tax === 'yes' && typeof price.tax_rate === 'string' && { tax_rate: price.tax_rate }),
        ...(billingPeriod !== 'one_time' && billingPeriod !== 'custom' && {
          recurring: {
            interval: ['day', 'week', 'month', 'year'].includes(String(billingPeriod))
              ? String(billingPeriod)
              : 'month',
            interval_count:
              billingPeriod === 'quarter' ? 3 :
                billingPeriod === 'biannual' ? 6 :
                  1,
          },
        }),
        metadata: Object.fromEntries((priceMetadata[index] || []).map(f => [f.name, f.value]))
      };
    });

    let payload: any = {
      metadata: { mid, ...Object.fromEntries(productMetadata.map(f => [f.name, f.value])) },
      name: fields.find(f => f.name === 'name')?.value || '',
      description: fields.find(f => f.name === 'description')?.value || '',
      active: fields.find(f => f.name === 'active')?.value || false,
      marketing_features: fields.find(f => f.name === 'marketing_features')?.value || [],
      price: pricesData,
      merchant_id: mid,
      imageFiles,
    };
    if (product?.id) payload.id = product.id;

    try {
      const response = await adminService.createProduct(payload);
      if (response?.id) {
        setNotification({
          active: true,
          list: [
            {
              label: 'Product Created Successfully!',
              message: `"${response.name}" was created successfully.`,
              onClick: () => router.push(`/admin?vid=products&id=${response.id}`),
            },
          ],
        });
      }
    } catch (error: any) {
      setNotification({
        active: true,
        apiError: {
          error: true,
          status: error?.status || 400,
          message: error?.message || 'Failed to create product',
          detail: error?.response?.data?.detail || error?.detail || 'Unexpected error',
        },
        persistence: 5000,
      });
    }
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className="admin-product">
        <div className="admin-product__section">
          <UiForm title={product?.id ? 'Edit Product' : 'Add Product'} fields={fields} onChange={(e) => onChange(e)} />
          <UiForm
            key={`product-meta-${productMetadata.length}`}
            title="Product Metadata"
            fields={productMetadata}
            onChange={(e) => onChange(e)}
            onAddField={(e) => {
              let { name, value } = e.target;
              name = name.replace(/^metadata\./, '');
              if (!productMetadata.find(f => f.name === name)) {
                setProductMetadata(prev => [
                  ...prev,
                  { name, label: value || name, type: 'text', value: '' },
                ]);
              }
            }}
          />
        </div>

        {prices.map((price, index) => (
          <div className="admin-product__section" key={index}>
            <UiForm title={product?.price?.nickname || `Price ${index + 1}`} onChange={(e) => onChange(e, index)} fields={price} />
            <UiForm
              key={`price-meta-${index}`}
              title={`Price ${index + 1} Metadata`}
              fields={priceMetadata[index] || []}
              onChange={(e) => onChange(e, index, true)}
              onAddField={(e) => {
                let { name, value } = e.target;
                name = name.replace(/^metadata\./, '');
                setPriceMetadata(prev => {
                  const updated = [...prev];
                  if (!updated[index]) updated[index] = [];
                  if (!updated[index].find(f => f.name === name)) {
                    updated[index].push({ name, label: value || name, type: 'text', value: '' });
                  }
                  return updated;
                });
              }}
            />
            <UiIcon icon="fa-trash-can" onClick={() => {
              setPrices(prev => prev.filter((_, i) => i !== index));
              setPriceMetadata(prev => prev.filter((_, i) => i !== index));
            }} />
          </div>
        ))}

        <UiButton
          variant="link"
          traits={{ afterIcon: 'fa-dollar-sign-circle' }}
          onClick={() => {
            setPrices(prev => [...prev, getInitialPriceFields()]);
            setPriceMetadata(prev => [...prev, []]);
          }}
        >
          Add Price
        </UiButton>
        <UiButton variant="glow" onClick={onSubmit}>
          {product?.id ? 'Save Changes' : 'Add Product'}
        </UiButton>
        {product?.id && (
          <UiButton
            variant="danger"
            traits={{ afterIcon: 'fa-trash-can' }}
            onClick={() => initiateDelete(product.id)}
          >
            Delete Product
          </UiButton>
        )}
      </div>
    </>
  );
};

export default AdminProduct;
