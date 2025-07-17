import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./ProductsListing.scss";
import AdaptGrid from "@webstack/components/Containers/AdaptGrid/AdaptGrid";
import ProductListingItem from "../views/ProductListingItem/ProductListingItem";
import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import UiButton from "@webstack/components/UiForm/views/UiButton/UiButton";
import useWindow from "@webstack/hooks/window/useWindow";
import ProductSlider from "../views/ProductSlider/ProductSlider";
import { IProduct } from "~/src/models/Shopping/IProduct";



interface IProductListing {
  hide?: string[] | 'header';
  variant?: 'full-width' | 'full',
  scrollX?: boolean;
  products?:IProduct[]|null;
  hasMore: boolean; 
  loading:boolean;
  onSelect?: (e: any) => void;
}
const ProductsListing = ({ hide, variant, onSelect, scrollX, products, hasMore, loading }: IProductListing) => {
  const router = useRouter();
  // useLayout({ background: 'var(--gray-20)' });
  console.log({productListing:products})
  const { query, pathname } = router;
  const [layout, setLayout] = useState<string>(query.layout && String(query.layout) || "grid");
  const layoutList = ["grid", "list", "gridX"];
  const { width } = useWindow();
  const layouts: any = {
    grid: { gap: 10, sm: 1, md: 2, lg: 3, xl:5, variant: variant, margin:width>900&&'25px'  },
    gridX: { gap: 10, sm: 3, md:2, lg: 4, xl: 5, scroll: "scroll-x" },
    list: { gap: 10, xs: 1 },
  };

  const handleLayoutChange = (newLayout: string) => {
    if (onSelect) return onSelect(newLayout)
    setLayout(newLayout);
    router.push({ pathname, query: { ...query, layout: newLayout } }, undefined, { shallow: true });
  };
  const isHideHeader = hide?.includes('header') && hide == undefined;

  // console.log(products)
  useEffect(() => { if (scrollX) handleLayoutChange("gridX") }, [variant]);
  // useEffect(() => { if(pageLayout)setPageLayout({background:"var(--gray-40)"}) }, [variant]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className="products-listing">
        {/* {JSON.stringify(hasMore)} */}
        {(!isHideHeader && (
          <div className="products-listing__header">
            <h1>Products <small className='pac-container'>
              showing: {products?.length || 0}
              </small>
            </h1>
            <div className="products-listing__layout-actions">
              {layoutList.map((view: string) => (
                <div key={view} className="products-listing__layout-actions--item">
                  <UiIcon
                    color={(view == layout && "var(--primary-10)") || undefined}
                    icon={`fa-${view}`}
                    onClick={() => handleLayoutChange(view)}
                  />
                </div>
              ))}
            </div>
          </div>
        )) ||
          undefined}
        <div className="products-listing__body">
          <ProductSlider products={products} />
        </div>
        <div className="products-listing__body">
          <AdaptGrid {...layouts[layout]}>
            {products
              ?.filter((product) => product?.active === true)
              ?.map((product, key) => (
                <div key={key} className="products-listing__item-container">
                  <ProductListingItem onSelect={onSelect} product={product} layout={layouts[layout]} />
                  {/* {JSON.stringify({product:product.metadata,price:product?.price?.nickname,pageLayout})} */}
                </div>
              ))}
          </AdaptGrid>
        </div>
        {hasMore && (
          <div className="products-listing__footer">
            <UiButton>Load More</UiButton>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductsListing;
