import React from "react";

const Input = ({ label, onChange }) => {
  return (
    <>
      <label>{label}</label>
      <input type="text" onChange={onChange} />
    </>
  );
};

export default Input;
