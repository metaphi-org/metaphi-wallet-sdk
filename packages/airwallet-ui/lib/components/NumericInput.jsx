import { useEffect, useState } from 'react';

const NumericInput = ({ label, maxLength = 6, onInputChange, disabled }) => {
  const [code, setCode] = useState('');
  // const placeholder = Array.from(Array(maxLength));
  // const code = useRef([]);

  // const handlKeyDown = useCallback(
  //   (e) => {
  //     const index = parseInt(e.target.id);
  //     const newCode = [...code.current];
  //     // Handle backspace
  //     const key = e.keyCode;
  //     if (key === 8) {
  //       newCode[index] = '';
  //       code.current = newCode;
  //       console.log(e.target?.previousElementSibling);
  //       e.target?.previousElementSibling?.focus();
  //       console.log(code);
  //       return;
  //     }
  //   },
  //   [code],
  // );

  // const onChange = (e) => {
  //   if (!e.target.value.length) return;

  //   const newCode = [...code.current];
  //   const index = parseInt(e.target.id);
  //   const value = e.target.value[0];

  //   newCode[index] = value;
  //   code.current = newCode;
  //   console.log('old code', code.current, 'new code', newCode, index);
  //   // Focus on the next element
  //   if (index < maxLength) e.target?.nextElementSibling?.focus();

  //   // Reached max.
  //   const textCode = code.current.join('');
  //   if (textCode.length === maxLength) onInputChange(textCode);
  //   console.log('Auth Code:', code, textCode.length === maxLength);
  // };

  return (
    <div>
      <label>{label}</label>
      <div className="numeric-input-container">
        <input
          disabled={disabled}
          type="text"
          onChange={(e) => onInputChange(e.target.value)}
        />
        {/* {placeholder.map((value, index) => (
          <input
            key={index}
            id={index}
            type="text"
            maxLength="1"
            className="rounded"
            onKeyDown={handlKeyDown}
            onChange={onChange}
          />
        ))} */}
      </div>
    </div>
  );
};

export default NumericInput;
