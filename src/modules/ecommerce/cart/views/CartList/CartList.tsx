import styles from './CartList.scss';
import AdaptGrid from '@webstack/components/Containers/AdaptGrid/AdaptGrid';
import React, { useEffect, useState } from 'react';
import { IProduct } from '~/src/models/Shopping/IProduct';
import CartListItem from '../CartListItem/CartListItem';
import useCart from '../../hooks/useCart';
// import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
// import Image from 'next/image';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import environment from '~/src/core/environment';
// import { numberToUsd } from '@webstack/helpers/userExperienceFormats';

interface ICartTableItem {
    name?: string;
    description?: string;
    price?: string;
    image?: React.ReactElement;
}
const CartList = ({ variant, adjustable }: { variant?: 'mini', adjustable?: boolean }) => {
    const [_cart, setCart] = useState<IProduct[] | ICartTableItem[]>();
    const { cart } = useCart();
    const BrandIcon = () => {
        return <>
            <style jsx>{styles}</style>
            <div className='cart-list__brand-icon'>
                <UiIcon width="100px" height="120px" icon={`${environment.merchant.name}-logo`} />
            </div>
        </>
    };
    useEffect(() => {
        if (!_cart && cart) {
            // console.log("Cart contents:", cart); // Debugging line
            setCart(cart);
        }
    }, [cart]);
    
    if (_cart) return <>
        <style jsx>{styles}</style>
        {/* {JSON.stringify(_cart)} */}
        <div
            className={`cart-list ${variant && ` cart-list__${variant}` || ''}
                `}>
            <AdaptGrid xs={1} gap={20}>
                {_cart.map((item: any, key: number) => (
                    <div key={`${item.id}-${item.price.id}`}>
                        <CartListItem variant={variant} item={item} adjustable={adjustable} />
                    </div>
                ))
                }
            </AdaptGrid>
        </div>
    </>;
    return <></>
}

export default CartList;