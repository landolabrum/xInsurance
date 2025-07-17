import React, { useEffect, useState } from 'react';
import styles from './VerifyEmail.scss';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import Login from '~/src/modules/authentication/views/Login/controller/Login';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import useDevice from '~/src/core/authentication/hooks/useDevice';
import { useGuest } from '~/src/core/authentication/hooks/useGuest';

interface IVerifyEmail {
  token?: string;
  onSuccess: (e: any) => void;
}

interface IVerifyEmailState {
  status?: string;
  detail?: {
    detail: string
  };
  fields?: IFormField[];
  message?: string;
  customer?: any;
}

const VerifyEmail: React.FC<any> = ({ token, onSuccess }: IVerifyEmail) => {
  const [state, setState] = useState<IVerifyEmailState>({ status: 'verifying_email' });
  const MemberService = getService<IMemberService>("IMemberService");
  const { openModal } = useModal();
  const guest = useGuest();
  const handleVerify = async () => {
    if (!token) {
      setState({ status: 'no_token_present' });
      return;
    } else if (!state?.status || (state.status && ["418", 418, 400, 'incomplete'].includes(state.status))) {
      return;
    }
    try {
      const verifiedResponse = await MemberService.verifyEmail(String(token));
      console.error('[ HANDLE VERIFY ]', verifiedResponse);
      let responseFields = verifiedResponse?.detail?.fields && Object.values(verifiedResponse?.detail?.fields).map((field: any): IFormField => {
        field.label = field.name;
        field.value = field.message;
        field.error = true;
        delete field.message;
        field.readonly = true;
        return field;
      });
      console.log({ verifiedResponse });
      if (verifiedResponse) setState({
        ...verifiedResponse,
        fields: verifiedResponse?.fields || responseFields
      });
    } catch (e: any) {
      console.error('[ HANDLE VERIFY ERROR ]', e);
    }
  };

  const loadingText = (): string => {
    let context = '';
    const isString = (e: any) => typeof e == 'string';
    if (isString(state.status)) context = String(state.status);
    else if (isString(state.detail)) context = String(state.detail);
    else if (state.detail?.detail && isString(state.detail?.detail)) context = state.detail.detail;
    return keyStringConverter(context);
  };

  const onChange = (e: any) => {
    const { name, value } = e.target;
    const stateFields = state?.fields;
    const iter = (fieldName: string) => { return stateFields?.find((f: IFormField) => f.name === fieldName); }
    const pw_value = iter('password')?.value;
    const confirm_pw_value = iter('confirm_password')?.value;
    // Create a new fields array with updated values and errors
    const updatedFields = stateFields?.map((field: IFormField) => {
      if (field.name === name) {
        const updatedField = { ...field, value };
        const is_p = name === 'password';
        const is_c = name === 'confirm_password';
        if ((is_c && pw_value !== value && pw_value !== '') || (is_p && confirm_pw_value !== value && confirm_pw_value !== '')) {
          updatedField.error = 'Not Same as Password';
        } else if (updatedField.error) {
          delete updatedField.error;
        }
        return updatedField;
      }
      return field;
    });
    setState({ ...state, fields: updatedFields });
  };

  const device = useDevice();

  const onSubmit = async () => {
    const newPassword = state?.fields?.find((f: IFormField) => f.name == 'password')?.value;
    let request = state.customer;
    request.metadata.user.password = newPassword;
    request.metadata.user.devices = [device];
      console.log("[ verify_email (CUSTOMER) ]", request);
      const updateMember = await MemberService.modifyCustomer(request);
      console.log({updateMember});
      if (updateMember) {
        handleLoginModal();
        onSuccess(updateMember.email);
      }

  };

  const handleLoginModal = () => {
    console.log("[ handleLoginModal ]");
    openModal({ children: <Login email={state.customer.email} onSuccess={(e) => JSON.stringify(e)} /> });
  };

  const isForm = state.status && ["418", 418, 'incomplete'].includes(state.status) && state?.fields;
  useEffect(() => {
    handleVerify();
  }, [state?.status, onSuccess]);

  return (
    <>
      <style jsx>{styles}</style>
      {/* {JSON.stringify(guest)} */}
      <div className='verify-email'>
        <div className={`verify-email__content${state.status === 'verification_success' ? ' verify-email__content--success' : ''}`}>
          <div className='verify-email__content--loader'>
            <UiLoader
              position='relative'
              text={loadingText()}
              dots={state?.status != undefined && ['verifying_email'].includes(state?.status)}
            />
          </div>
          {isForm &&
            <UiForm
              title={typeof state?.detail == 'string' && state.detail || undefined}
              onChange={onChange}
              fields={state.fields}
              onSubmit={typeof state?.detail == 'string' && onSubmit || undefined}
            />
          }
          {state.status === 'verification_success' && state.customer.email && <div className='verify-email__content__sign-in'>
            <UiButton onClick={handleLoginModal}>Login</UiButton>
          </div>}
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
