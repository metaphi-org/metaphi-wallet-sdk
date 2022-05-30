import React from "react";

const PrimaryButton = ({ children, disabled, onClick }) => {
  return (
    <div
      className={`btn btn--primary ${disabled ? "disabled" : "active"}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default PrimaryButton;
