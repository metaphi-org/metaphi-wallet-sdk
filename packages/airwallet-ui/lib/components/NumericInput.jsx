import {useState} from "react";

const NumericInput = ({ label, maxLength, onInputChange }) => {
  const [code, setCode] = useState([]);

  const onChange = (e) => {
    const index = e.target.id;
    code[index] = e.target.value;
    setCode(code);

    // Focus on the next element
    if (index < maxLength) e.target?.nextElementSibling?.focus();

    // Reached max.
    if (code.join("").length === maxLength) onInputChange(code.join(""));
  };

  return (
    <div>
      <label>{label}</label>
      <div className="numeric-input-container">
        <input
          id="0"
          type="text"
          maxLength="1"
          className="rounded"
          onChange={onChange}
        />
        <input
          id="1"
          type="text"
          maxLength="1"
          className="rounded"
          onChange={onChange}
        />
        <input
          id="2"
          type="text"
          maxLength="1"
          className="rounded"
          onChange={onChange}
        />
        <input
          id="3"
          type="text"
          maxLength="1"
          className="rounded"
          onChange={onChange}
        />
        <input
          id="4"
          type="text"
          maxLength="1"
          className="rounded"
          onChange={onChange}
        />
        <input
          id="5"
          type="text"
          maxLength="1"
          className="rounded"
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default NumericInput;
