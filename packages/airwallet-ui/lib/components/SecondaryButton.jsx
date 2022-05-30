import React from "react";

const SecondaryButton = ({ disabled, children, onClick }) => {
  return (
    <div
      className={`btn btn--secondary ${disabled ? "disabled" : "active"}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default SecondaryButton;
