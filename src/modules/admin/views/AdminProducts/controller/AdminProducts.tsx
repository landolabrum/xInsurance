import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import styles from './AdminProducts.scss';
import { dateFormat, numberToUsd } from '@webstack/helpers/userExperienceFormats';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import AdminProduct from '../views/AdminProduct/AdminProduct';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import { useAdminLevel } from '~/src/core/authentication/hooks/useUser';
import useDeleteProduct from '../hooks/useDeleteProduct';
import { useLoader } from '@webstack/components/Loader/Loader';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { useProducts } from '~/src/modules/ecommerce/Products/hooks/useProducts';
import environment from '~/src/core/environment';

const AdminProducts: React.FC = () => {
  const { openModal, closeModal } = useModal();
  const { user } = useAdminLevel();
  const [product, setProduct] = useState<any>();
  const [searchTerm, setSearchTerm] = useState('');
  const [select, setSelect] = useState(false);
  const [view, setView] = useState<'list' | 'add' | 'product'>('list');
  const [responseExtras, setExtras] = useState<Record<string, any>>();
  const [loader, setLoader] = useLoader();
  const [modified, setModified] = useState<any[]>();
  const [filterState, setFilterState] = useState({ visibility: 'active', merchant: 'all' });
  const searchTimeout = useRef<NodeJS.Timeout>();

  const { products, loading, liveMode, hasMore, error, fetchProducts, total } = useProducts({ showAll: true });
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const selected = useMemo(() => {
    if (!select || !filteredProducts) return [];
    return filteredProducts.filter((p) => p.selected);
  }, [select, filteredProducts]);

  const { deletedProduct, initiateDelete } = useDeleteProduct();

  const handleSearch = useCallback((term: string) => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => setSearchTerm(term), 300);
  }, []);

  const handleFilterChange = (field: IFormField) => {
    const [group, value] = field.name.split('-');
    setFilterState(prev => ({ ...prev, [group]: value }));
  };

  const getUniqueMids = (list: any[]) => [...new Set(list.map(p => p.mid).filter(Boolean))];

  const applyFilters = useCallback(() => {
    if (!products) return;

    let filtered = [...products];

    if (filterState.visibility === 'active') {
      filtered = filtered.filter(p => p.active);
    } else if (filterState.visibility === 'inactive') {
      filtered = filtered.filter(p => !p.active);
    }

    if (filterState.merchant !== 'all') {
      filtered = filtered.filter(p => p.mid === filterState.merchant);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        Object.values(p).some(v => typeof v === 'string' && v.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProducts(filtered);
  }, [products, filterState, searchTerm]);

  useEffect(() => {
    applyFilters();
  }, [filterState, searchTerm, applyFilters]);

  useEffect(() => {
    if (!products || products.length === 0 || view !== 'list') return;
    const formatted = products.map((field: any) => {
      const notActive = field.active === false;
      const notAllowed = field.metadata.mid !== environment.merchant.mid && user.type !== 'admin-3';
      if (notAllowed && notActive) return null;

      const context: any = {
        id: field.id,
        image: field.images,
        name: field.name,
        type: field.type,
        price_id: field.price.id,
        price: numberToUsd(field.price.unit_amount),
        livemode: JSON.stringify(field.livemode),
        timeline: (
          <div className='heiarchy'>
            <div className='heiarchy-item'><div>created</div><div>{dateFormat(field.created, { isTimestamp: true })}</div></div>
            <div className='heiarchy-item'><div>updated</div><div>{dateFormat(field.updated, { isTimestamp: true })}</div></div>
          </div>
        )
      };

      if (user.type === 'admin-3') {
        context.mid = field.metadata.mid;
        context.active = field.active;
      }

      return context;
    }).filter(Boolean);

    setFilteredProducts(formatted);
    setExtras({ total, livemode: liveMode, has_more: hasMore });
  }, [products, view]);

  const onRowClick = (product: any) => {
    if (!product.id) return;
    console.log({product});
    setProduct(products?.find((p) => p.id === product.id));
    setView('product');
  };

  const onSelect = (product: any) => {
    if (!product.id) return;
    setFilteredProducts(prev =>
      prev?.map(item =>
        item.name === product.name && item.price_id === product.price_id
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const handleDeselect = () => {
    setFilteredProducts(prev => prev?.map(p => ({ ...p, selected: undefined })));
    setSelect(false);
  };

  const confirmDelete = () => {
    const toDelete = filteredProducts?.filter(p => p.selected).map(p => ({ ...p, label: p.name, status: 'incomplete' })) ?? [];
    setModified(toDelete);

    openModal({
      confirm: {
        title: `Delete ${toDelete.length} Products?`,
        statements: [
          {
            label: 'Delete',
            onClick: async () => {
              setLoader({ active: true, children: 'Deleting products...' });
              for (const p of toDelete) {
                try {
                  const result = await initiateDelete(p);
                  p.status = 'complete';
                } catch {
                  p.status = 'error';
                }
              }
              setLoader({ active: false });
              openModal({
                title: "Delete Completed",
                children: (
                  <ol>{toDelete.map((p) => (<li key={p.id}>{p.name} - {p.status}</li>))}</ol>
                ),
                confirm: {
                  statements: [{ label: "back to products", onClick: handleDeselect }],
                },
              });
            }
          },
          { label: 'Cancel', onClick: handleDeselect }
        ],
        body: <ol>{toDelete.map(p => <li key={p.id}>{p.name} - {p.id}</li>)}</ol>
      }
    });
  };

  const handleAction = (action: string) => {
    if (action === 'edit') setSelect(s => !s);
    else setView(action as any);
  };

  const midOptions = getUniqueMids(products || []).map(mid => ({ label: mid, name: `merchant-${mid}` }))
    .concat([{ label: 'all', name: 'merchant-all' }]).reverse();

  const pageContext = {
    list: {
      actions: ['add', 'edit'],
      view: (
        <AdapTable
          onSelect={select ? onSelect : undefined}
          options={{ tableTitle: 'admin products', hideColumns: ['id', 'selected', 'price_id'] }}
          data={filteredProducts}
          filters={{
            visibility: [
              { label: 'everything', name: 'visibility-everything' },
              { label: 'active', name: 'visibility-active' },
              { label: 'inactive', name: 'visibility-inactive' }
            ],
            merchant: midOptions
          }}
          setFilter={handleFilterChange}
          search={searchTerm}
          setSearch={handleSearch}
          onRowClick={onRowClick}
        />
      )
    },
    add: { actions: ['list'], view: <AdminProduct products={products} /> },
    product: { actions: ['list'], view: <AdminProduct product={product} /> }
  };

  if (loading) return <UiLoader />;

  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-products'>
        <div className='admin-products__header'>
          <div className='admin-products__header--left'>
            <div className='heiarchy'>
              {responseExtras && Object.entries(responseExtras).map(([k, v]) => (
                <div key={k} className='heiarchy__item'>
                  <div className='heiarchy-key'>{k}</div>
                  <div className='heiarchy-value'>{v?.toString()}</div>
                </div>
              ))}
            </div>
          </div>
          <div className='admin-products__header--right'>
            {pageContext[view].actions.map(action => (
              <div key={action}><UiButton onClick={() => handleAction(action)}>{action}</UiButton></div>
            ))}
            {selected.length > 0 && (
              <div>
                <UiButton onClick={confirmDelete} variant="error">
                  {selected.length} {selected.length === 1 ? 'Item' : 'Items'}
                </UiButton>
              </div>
            )}
          </div>
        </div>
        {pageContext[view].view}
      </div>
    </>
  );
};

export default AdminProducts;
