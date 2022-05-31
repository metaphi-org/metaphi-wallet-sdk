import React from 'react';

const PrimaryButton = ({ children, disabled, loading, onClick }) => {
  return (
    <div
      className={`btn btn--primary ${
        disabled ? 'btn--disabled disabled' : 'active'
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default PrimaryButton;
