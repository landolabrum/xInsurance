import React from 'react';
import styles from './UiTextBalance.scss';

interface UiTextBalanceProps {
  text: string;
}

const UiTextBalance: React.FC<UiTextBalanceProps> = ({ text }) => {
  const words = text.split(' ');

  return (
    <>
      <style jsx>{styles}</style>
      <div className="ui-text-balance">
        <div className="ui-text-balance__content">
          {words.map((word, index) => (
            <div
              key={index}
              className="ui-text-balance__line"
              style={{
                ['--char-count' as any]: word.length,
                ['--line-index' as any]: index + 1,
              }}
            >
              {word}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UiTextBalance;
