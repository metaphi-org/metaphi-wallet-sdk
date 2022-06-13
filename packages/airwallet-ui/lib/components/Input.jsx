import React from 'react';

const Input = ({
  defaultValue,
  placeholder = '',
  disabled = false,
  label,
  onChange,
}) => {
  const handleChange = (e) => {
    if (typeof onChange === 'function') onChange(e.target.value);
  };

  return (
    <>
      <label>{label}</label>
      <input
        type="text"
        defaultValue={defaultValue}
        disabled={disabled}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </>
  );
};

export default Input;
