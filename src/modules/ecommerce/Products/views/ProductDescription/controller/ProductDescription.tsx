import React, { useCallback, useEffect, useState } from 'react';
import styles from './ProductDescription.scss';
import AdaptGrid from '@webstack/components/Containers/AdaptGrid/AdaptGrid';
import { useRouter } from 'next/router';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { getService } from '@webstack/common';
import ProductBuyNow from '../views/ProductBuyNow/ProductBuyNow';
import useCart from '~/src/modules/ecommerce/cart/hooks/useCart';
import IProductService from '~/src/core/services/ProductService/IProductService';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import Image from 'next/image';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import environment from '~/src/core/environment';
import GLBViewer from '@webstack/components/ThreeComponents/ThreeGLB/ThreeGLB';
import ProductImage from '../views/ProductImage/ProductImage';
import UiMedia from '@webstack/components/UiMedia/controller/UiMedia';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';

interface IProductDescription {
  product_id?: string,
  price_id?: string,
  btnText?: string
}
const ProductDescription = ({ product_id, price_id, btnText }: IProductDescription) => {
  const {mid}=environment.merchant;
  const router = useRouter();
  const productNonExist = 'product does not exist';
  const product_query_id: string | undefined = router?.query?.id != undefined ? router?.query?.id.toString() : undefined
  const price_query_id: string | undefined = router?.query?.pri != undefined ? router?.query?.pri.toString() : undefined
  const [product, setProduct] = useState<any>(null); // Changed from {} to null
  const [isLoading, setIsLoading] = useState<boolean | string>(true); // Add a loading state
  const { cart } = useCart();

  const fetchProduct = useCallback(
    async () => {
      if (product &&
        [product_query_id, price_query_id].includes(undefined) &&
        [product_id, price_id].includes(undefined)
      ) return;
      setIsLoading(true); // Start loading
      const ProductService = getService<IProductService>("IProductService");
      let productRequest = {
        id: product_id || product_query_id,
        pri: price_id || price_query_id
      };
      try {

        const productResponse = await ProductService.getProduct(productRequest);
        if (productResponse?.id) {
          productResponse.price.qty = 0;
          // console.log('[ PRODUCT ]', Object.keys(productResponse))
          setProduct(productResponse);
          setIsLoading(false); // End loading
          return productResponse?.name;
        }
      } catch (e: any) {
        const errors = e?.detail;
        if (typeof errors == 'object') {
          Array(errors).forEach((err: any) => {
            const errorData = err?.detail[0];
            if (errorData) {
              const isFieldRequired = errorData.msg === 'field required';
              if (isFieldRequired) setIsLoading(productNonExist);
              // const isProductId = errorData?.loc.includes('query');
              // const isPriId = errorData?.loc.includes('pri');
              // console.log('[ productDescription ( ERROR ) ]', )
            }
          })
        }
      }
      return ''; // Return an empty string if productResponse is not valid
    },
    [product_query_id, price_query_id, product_id, price_id], // Dependencies updated
  );

  useEffect(() => {
    fetchProduct(); // Moved fetching into a useEffect to be run on mount and on changes of product_query_id and price_query_id
  }, [fetchProduct]); // Dependencies updated
  // product_id, price_id, product_query_id, price_query_id, 
  // useEffect(() => {
  // }, [product]); // Dependencies updated
  if (product == null) return (
    <>
      <style jsx>{styles}</style>
      <div className="product-description">
        <div className="product-description--loader">
          <UiLoader text={isLoading} dots={!Boolean(isLoading === productNonExist)} />
        </div>
      </div>
    </>
  ); // Return loader when loading

console.log({product})
  return (
    <>
      <style jsx>{styles}</style>
      <div className="product-description">
        <UiButton traits={{ beforeIcon: "fa-chevron-left" }} variant="link" href="/product">
          back to shop
        </UiButton>
        <div className="product-description__header">
          <div className="product-description__header-left">
            <div className="product-description__header--title">{`buy ${product.name}`}</div>
          </div>
          <div className="product-description__header-right">{product?.offers}</div>
        </div>
        <div className="product-description__body">
          <AdaptGrid sm={1} md={2} gap={15}>
            <div className="product-description__images">
              {product.images[0] ? (
                <>
                  <div className="product-description__images--main">
                    <UiMedia src={product.images[0]} alt={product?.name} />
                  </div>
                  <div className="product-description__images--carousel">
                    {product?.images?.length > 1 &&
                      Object.entries(product.images).map(([index, image]: any) => (
                        <div
                          key={index}
                          className={`product-description__images--carousel__item ${
                            index === 0 ? "product-description__images--carousel__item--active" : ""
                          }`}
                          // onClick={() => {
                          //   setProductImage(image);
                          // }}
                        >
                          <UiMedia src={image} alt={product?.name} />
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                <div className="img-placeholder">
                  <UiIcon icon={`${environment.merchant.name}-logo`} />
                </div>
              )}
            </div>
            <div className="product-description__info-panel">
              <div className="product-description__info-panel_header">
                <h1 className="product-description__info-panel_title">{product.name}</h1>
              </div>
              <div className="product-description__info-panel_body">{product.description}</div>
            </div>
          </AdaptGrid>
        </div>
        <div className="product-description__footer">
          {cart && cart?.length >= 1 && (
            <div className="product-description__go-to-cart">
              <UiButton traits={{ afterIcon: "fal-bag-shopping" }} variant="link" href="/cart">
                go to cart
              </UiButton>
            </div>
          )}
          <div className="product-description__buy-button">
            <ProductBuyNow goToCart product={product} btnText={btnText} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDescription;
