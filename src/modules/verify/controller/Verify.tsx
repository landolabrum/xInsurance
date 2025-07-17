import React, { useEffect, useState } from 'react';
import styles from './Verify.scss';
import { useRouter } from 'next/router';
// import VerifyEmail from '../views/VerifyEmail/VerifyEmail';
// import LoginView from '../../authentication/views/Login/views/LoginView/LoginView';
// import VerifyAccount from '../views/VerifyAccount/VerifyAccount';
// import VerifyPayment from '../views/VerifyPayment/VerifyPayment';
// import VerifyPassword from '../views/VerifyPassword/VerifyPassword';
// import VerifyShare from '../views/VerifyShare/VerifyShare';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import { getService } from '@webstack/common';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import VerifyEmail from '../views/VerifyEmail/VerifyEmail';
import UiDev from '@webstack/components/UiDev/UiDev';
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION?.trim();

interface IVerifyErrorView {
  view?: string;
  name?: string;
  message?: string;
}
const DefaultVerifyView = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='verify__default'>
        <h1>Verify</h1>
        <p>Here is where you will verify a token in which you should have received via a specified contact method.</p>
      </div>
    </>
  );
};
const VerifyErrorView = (props: IVerifyErrorView) => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='verify__error' id={props.view}>
        <h3>¡Error!</h3>
        <div className='verify__error-header'>Verify: <span className="c-error">{props?.name && keyStringConverter(props?.name)}</span>
        </div>
        <p className=''>{props?.message}</p>
        <span className='error--more-info'>If you think you are seeing this message as an error, please contact your admin.</span>
      </div>
    </>
  );
};
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQmVubnkgSGFuc2VuIiwic2VjdXJpdHkiOnsidHlwZSI6ImdwcyIsIm1vZGVsIjoiYWlydGFnIn0sImNvbnRhY3RzIjpbeyJuYW1lIjoiVmFzaHRpIiwidGVsIjoiKzEyMDg5MzY4MTk5IiwiYWRkcmVzcyI6eyJjaXR5IjoiY2l0eSIsImNvdW50cnkiOiJVUyIsImxpbmUxIjoibGluZSAxIiwibGluZTIiOiJsaW5lIDIiLCJwb3N0YWxfY29kZSI6IjkwMjEwIiwic3RhdGUiOiJDQSJ9fV19.sTZD6PkNzJa606xCkkhvnt2lwHNfGVfMjt8-n4d3duM
const Verify = () => {
  const { pathname, query } = useRouter();
  const [view, setView] = useState('');
  const [context, setContext] = useState<any>('');
  // const [newCustomerEmail, setNewCustomerEmail] = useState<string | undefined>();
  // const [token, setToken] = useState<string | undefined>();
  const MemberService = getService<IMemberService>("IMemberService");

  const vid = query?.vid;
  const token = query?.token && String(query.token);

  const handleVerify = async () => {
    if (!token) {
      setContext({ status: 'no_token_present' });
      return;
    }

    try {
      const verifiedResponse = await MemberService.verifyEmail(String(token));
      // console.error('[ HANDLE VERIFY ]', verifiedResponse)
      if (verifiedResponse) setContext(verifiedResponse);
    } catch (e: any) {
      console.error('[ HANDLE VERIFY ]', e)
      if(e?.fields)console.log({e:e.fields})
    }
  }
  const views: any = {
    'no-view-id': VerifyErrorView({ ...context, name: context?.view }),
    'no-token': VerifyErrorView({ ...context, name: context?.view }),
    email: <VerifyEmail token={token} 
      onSuccess={console.log}
    // onSuccess={(v: string) => setNewCustomerEmail(v)}
     />,
  }
  //   'sign-in': <LoginView email={newCustomerEmail} />,
  //   email: <VerifyEmail token={token} onSuccess={(v: string) => setNewCustomerEmail(v)} />,
  //   password: <VerifyPassword token={token} onSuccess={(v: string) => setNewCustomerEmail(v)} />,
  //   account: <VerifyAccount />,
  //   payment: <VerifyPayment token={token} />,
  //   share: <VerifyShare />,
  // };
  const intLayout =async  () => {
    const queryTypes = [typeof vid, typeof token];
    const meetsQuerys = queryTypes.filter(a=>'string').length == 2;
    if(meetsQuerys)return vid;
    // if (typeof query.token == 'string') setToken(query.token);
  };
  const initView = async (view?:string|string[])=>{
    if(context)return;
    else if(!vid && !token)return;
    if(!view && !vid)setContext({
      view: 'no-view-id',
      code: 404,
      error: true,
      message: 'No View'
    });
    else if( !token)setContext({
      view: 'no-token',
      code: 404,
      error: true,
      message: 'No Token Type Specified'
    });
    const handleVerify = async () => {
      if(!ENCRYPTION_KEY)return;
      if (!token) {
          setContext({ ...context,status: 'no_token_present' });
          return;
      }
      const verifiedResponse = await MemberService.decryptJWT({
          token: token,
          secret: ENCRYPTION_KEY,
          algorithm: 'HS256',
          verify:false
      });
      console.log({verifiedResponse})
      if (verifiedResponse) setContext(verifiedResponse);
  }
  await handleVerify()
    // setContext({view:view});
  }
  useEffect(() => {
    
    intLayout().then((a)=>initView(a));
    // console.log('initview:',view)

    // if (newCustomerEmail) {
    //   setView('sign-in');
    // } 
  }, [intLayout]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className='verify'>
        <UiDev data={{token,view,context}}/>
        {views[context?.view]}
      </div>
    </>
  );
};

export default Verify;
