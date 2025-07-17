import styles from './Cart.scss';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import EmptyCart from '../views/EmptyCart/EmptyCart';
import CartList from '../views/CartList/CartList';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import CheckoutButton from '../../Checkout/views/CheckoutButton/CheckoutButton';
import useCart from '../hooks/useCart';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';


const Cart = ({ variant, traits }: any) => {
  const { cart } = useCart();
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  let query = String(router.query.ref);


  useEffect(() => {
    setLoaded(true);
  }, [query]);
  if (!loaded) {
    return <UiLoader />; // Or return a loading spinner, or some other "loading" state component
  }
  return (
    <>
      <style jsx>{styles}</style>
      {/* {cart && Object.values(cart)?.map((item:any,idx:number)=><>
        {console.log({item:item?.price})}
      </>)} */}
      <div className='cart'>
        <div className='cart__header'>
          <UiButton variant="link" href='/product'>Keep Shopping</UiButton>
          <div className='cart__header-title'></div>
          {cart && cart.length != 0 && <CheckoutButton cart_items={cart} />}
        </div>
        {cart && cart.length != 0 ? <CartList /> : (<>
          <EmptyCart />
        </>)}
      </div>
    </>
  );
};

export default Cart;

