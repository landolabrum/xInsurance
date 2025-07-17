// Relative Path: ./Products.tsx
import React from 'react';
import styles from './Products.scss';
import ProductsListing from '../views/ProductListing/controller/ProductsListing';
import { useRouter } from 'next/router';
import ProductDescription from '../views/ProductDescription/controller/ProductDescription';
import { useProducts } from '../hooks/useProducts';

// Remember to create a sibling SCSS file with the same name as this component

const Products: React.FC = () => {
      const { products, loading, hasMore } = useProducts();
    const router = useRouter();
    if (router.query?.id) return <ProductDescription />;
    console.log({ products });
    return<>
    <style jsx>{styles}</style>
    <div className='products'>
    <ProductsListing  products={products} loading={loading} hasMore={hasMore} />;
    </div>
    </> 

};

export default Products;