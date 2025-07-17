import { useCallback, useEffect, useState } from "react";
import { getService } from "@webstack/common";
import useSessionStorage from "@webstack/hooks/storage/useSessionStorage";
import { useLoader } from "@webstack/components/Loader/Loader";
import IProductService from "~/src/core/services/ProductService/IProductService";
import { IProduct } from "~/src/models/Shopping/IProduct";
import environment from "~/src/core/environment";

export const useProducts = ({ showAll = false }: { showAll?: boolean } = {}) => {
  const { mid } = environment.merchant;
  const EXPIRY = 60000; // 1 minute
  const productService = getService<IProductService>("IProductService");
  const { sessionData, setSessionItem } = useSessionStorage();
  const [products, setProducts] = useState<IProduct[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [liveMode, setLiveMode] = useState<boolean | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [loader, setLoader] = useLoader();

  const activeFilter = (products: any) => {
    return products.filter((product: any) => product?.active);
  };

  const merchantProductHandler = (products: IProduct[]) => {
    return products.filter((product) => product.metadata.mid == mid);
  };

  const loadFromCache = useCallback(() => {
    const cachedData = sessionData?.products;
    const isExpired = cachedData && Date.now() - cachedData.created > EXPIRY;

    if (cachedData && !isExpired) {
      let clearanceProducts = cachedData.data;
      if (!showAll) clearanceProducts = merchantProductHandler(activeFilter(clearanceProducts));
      if (clearanceProducts) {
        setProducts(clearanceProducts);
        setTotal(clearanceProducts.length);
        setHasMore(cachedData.has_more);
        setLiveMode(cachedData.live_mode);
        return true;
      }
    }
    return false;
  }, [sessionData, showAll]);

  const fetchProducts = useCallback(async () => {
    if (loading || products) return;
    if (loadFromCache()) return;

    setLoader({ active: true });
    setLoading(true);
    try {
      const response = await productService.getProducts({ limit: 3 }); // Adjust your API request here
      if (response?.data) {
        const newData = { ...response, created: Date.now() };
        let filteredProducts = response.data;

        if (!showAll) {
          filteredProducts = merchantProductHandler(activeFilter(filteredProducts));
        }

        setProducts(filteredProducts);
        setSessionItem("products", newData, { expiry: EXPIRY });
        setHasMore(response.has_more);
        setLiveMode(response.live_mode);
        setTotal(filteredProducts.length);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch products.");
    } finally {
      setLoader({ active: false });
      setLoading(false);
    }
  }, [loading, products, loadFromCache]);

  useEffect(() => {
    fetchProducts();
    console.log({sessionData})
  }, [fetchProducts]);

  return { products, loading, liveMode, hasMore, error, fetchProducts, total };
};
