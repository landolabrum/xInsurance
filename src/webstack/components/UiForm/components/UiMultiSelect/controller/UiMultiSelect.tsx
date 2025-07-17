import React, { useEffect, useState } from 'react';
import styles from './UiMultiSelect.scss';
import UiInput from '../../UiInput/UiInput';
import { IInput } from '@webstack/models/input';
import UiButton from '../../UiButton/UiButton';

interface IUiMultiSelect extends IInput {
  value: string[];
  onChange: (e: { target: { name: string; value: string[] } }) => void;
}

const UiMultiSelect: React.FC<IUiMultiSelect> = (props) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' && input.trim()) {
      e.preventDefault();
      const updated = [...props.value, input.trim()];
      props.onChange({ target: { name: props.name || '', value: updated } });
      setInput('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleRemove = (item: string) => {
    const updated = props.value.filter((v) => v !== item);
    const removal = { target: { name: props.name || '', value: updated } }
    console.log("[ HANDLE REMOVE ]",removal)
    props.onChange(removal);
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className="ui-multi-select">
        <UiInput
          {...props}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <div className="ui-multi-select__tags">
          {props.value.map((tag, idx) => (
            <div key={`${tag}-${idx}`} className="ui-multi-select__tag">
              <UiButton
                size="sm"
                traits={{ afterIcon: {icon:'fa-xmark', onClick:()=>handleRemove(tag)} }}
                onClick={() => handleRemove(tag)}
              >
                {tag}
              </UiButton>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UiMultiSelect;
