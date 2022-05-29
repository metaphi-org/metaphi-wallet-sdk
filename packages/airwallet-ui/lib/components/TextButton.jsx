import React from "react";

const TextButton = ({ text, onClick }) => {
  return (
    <div className="btn btn--text" onClick={onClick}>
      {text}
    </div>
  );
};

export default TextButton;
