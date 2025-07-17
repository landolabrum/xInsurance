// ContactForm.tsx
import React, { useEffect, useState } from 'react';
import styles from './ContactForm.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { fieldType, findField } from '@webstack/components/UiForm/functions/formFieldFunctions';
import useWindow from '@webstack/hooks/window/useWindow';
import validateField from '@webstack/components/UiForm/functions/validateField';
import useSessionStorage from '@webstack/hooks/storage/useSessionStorage';

interface IContactFormProps {
  submit?: {
    text?: string;
  }; 
  onSubmit: (contactData: any) => void;
  user?: any;
  fieldErrors?: any;
  onChange?: (e: any) => void;
  payment?: any;
  title?: string | React.ReactElement | boolean;
  fields?: IFormField[];
  sessionKey?: string;
}

const ContactForm: React.FC<IContactFormProps> = (props) => {
  const { onSubmit, user, onChange, submit, title = 'contact', fieldErrors, fields: propFields = [], sessionKey = 'contactFormFields' } = props;
  const windowSize = useWindow();
  const { sessionData, setSessionItem } = useSessionStorage();

  const getWidth = (): string => windowSize.width >= 900 ? '50%' : '100%';
  const width = getWidth();

const defaultContactFields: IFormField[] = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'e.g. Herbie Hancock', required: true },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'e.g. your@email.com', required: true, width },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: 'e.g. 1 (000) 000-0000', required: false, width },
  { name: 'line1', label: 'Address Line 1', type: 'text', placeholder: 'e.g. 123 Main St', required: true, width },
  { name: 'line2', label: 'Address Line 2', type: 'text', placeholder: 'e.g. Apt, Suite, etc.', required: false, width },
  { name: 'city', label: 'City', type: 'text', placeholder: 'e.g. Los Angeles', required: true, width },
  { name: 'state', label: 'State', type: 'text', placeholder: 'e.g. CA', required: true, width },
  { name: 'postal_code', label: 'Postal Code', type: 'text', placeholder: 'e.g. 90001', required: true, width },
];


  const initialFields = sessionData?.[sessionKey] || propFields || defaultContactFields;
  const [fields, setFields] = useState<IFormField[]>(initialFields);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (propFields && propFields.length) {
      setFields(propFields); 
      setSessionItem(sessionKey, propFields);
      handleDisabled(propFields);
    }
  }, [propFields]);

  const handleDisabled = (updatedFields: IFormField[]) => {
    const isFormComplete = updatedFields.every(field => !field.required || (field.value && !field.error));
    setDisabled(!isFormComplete);
  };

  const errorColor = 'var(--orange-50)';

  const validater = (field: any): IFormField => {
    let text = findField(fields, field.name)?.name || '* ';
    if (field.required && typeof text === 'string' && !text.trim().startsWith('*')) {
      text = `* ${text}`;
    }

    let error: string | null = null;
    let color: string | undefined;

    if (field.required && !field.value) {
      error = validateField('required', field.value);
    } else {
      error = validateField(field.name, field.value);
    }

    if (error) {
      text += ` *${error}*`;
      color = errorColor;
    }

    return {
      ...field,
      label: { text, color },
      error,
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFields = fields.map((field: IFormField) => {
      if (field.name === name) {
        const updated = validater({ ...field, value });
        return updated;
      }
      return field;
    });
    onChange?.(e);
    setFields(updatedFields);
    handleDisabled(updatedFields);
    setSessionItem(sessionKey, updatedFields);
  };

  const handleFormSubmit = () => {
    const formData = fields.reduce((acc: any, field: any) => {
      if (['line1', 'line2', 'city', 'state', 'postal_code'].includes(field.name)) {
        acc.address = {
          ...acc.address,
          [field.name]: field.value,
        };
      } else {
        acc[field.name] = field.value;
      }
      return acc;
    }, {});
    onSubmit(formData);
  };

  useEffect(() => {
    let updated = user && Object.entries(user).map(([name,value]:any) => {
      let context:any = {name, value,label:name}
      const type = fieldType(context);
      context.type = type;
      return context;
    }
    ).filter(field=>['name', 'email', 'phone', 'address'].includes(field.name)&&field.value);
    if (user && Array.isArray(user)) {
      const addressField = user.find(u => u.name === 'address')?.v;
      const updatedFields = fields.map(field => {
        const userField = user.find(u => u.name === field.name);
        if (
          ['line1', 'line2', 'city', 'state', 'postal_code'].includes(field.name) &&
          typeof addressField === 'object'
        ) {
          field.value = addressField?.[field.name] || '';
        } else if (userField) {
          field.value = userField.v;
        }
        return field;
      });
      setFields(updatedFields);
      setSessionItem(sessionKey, updatedFields);
      handleDisabled(updatedFields);
    }
      const totalfields = defaultContactFields.map((f) => {
        const updatedExists = updated?.length && findField(updated, f.name);
        console.log({f,updated})
        if(updatedExists)return updatedExists;
        return f
      });
      console.log({totalfields})
      setFields(totalfields);
      setSessionItem(sessionKey, totalfields);
      handleDisabled(totalfields);
    console.log({updated})
  }, [user]);

  useEffect(() => {
    if (fieldErrors) {
      const updatedFields = fields.map((field: IFormField) => {
        const errorField = findField(fieldErrors, field.name);
        if (errorField) return { ...field, error: errorField.error };
        return field;
      });
      setFields(updatedFields);
    }
  }, [fieldErrors]);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = getWidth();
      setFields(prevFields => prevFields.map(field => ({
        ...field,
        width: field.name !== 'name' ? newWidth : field.width
      })));
    };
    handleResize();
  }, [windowSize.width]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className="contact-form">
        {title && <div className="contact-form__title">{title}</div>}
        {fieldErrors && (
          <ul>
            {Object.entries(fieldErrors).map(([index, field]: any) => (
              <li key={index}>
                <strong>{field?.name}: </strong>
                {field?.error}
              </li>
            ))}
          </ul>
        )}
        <UiForm
          fields={fields}
          disabled={disabled}
          onChange={handleChange}
          onSubmit={handleFormSubmit}
          submitText={submit?.text}
        />
      </div>
    </>
  );
};

export default ContactForm;
