import React from "react";

const Input = ({ label, onChange }) => {
  return (
    <>
      <label>{label}</label>
      <input type="text" onChange={(e) => onChange(e.target.value)} />
    </>
  );
};

export default Input;
