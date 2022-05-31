import React from 'react';

const TextButton = ({ text, onClick, disabled }) => {
  return (
    <div
      className={`btn btn--text ${disabled ? 'btn--disabled' : ''}`}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default TextButton;
