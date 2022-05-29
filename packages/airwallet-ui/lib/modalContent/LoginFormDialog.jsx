import React, { useState } from "react";
import PrimaryButton from "../components/PrimaryButton.jsx";

const Input = ({ label, onChange }) => {
  return (
    <div>
      <label>{label}</label>
      <input onChange={onChange} />
    </div>
  );
};

const NumericInput = ({ label }) => {
  return (
    <div>
      <label>{label}</label>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <input
          id="0"
          type="text"
          maxLength="1"
          style={roundedInputStyle}
          onChange={this.handleVerificationCodeChange}
        />
        <input
          id="1"
          type="text"
          maxLength="1"
          style={roundedInputStyle}
          onChange={this.handleVerificationCodeChange}
        />
        <input
          id="2"
          type="text"
          maxLength="1"
          style={roundedInputStyle}
          onChange={this.handleVerificationCodeChange}
        />
        <input
          id="3"
          type="text"
          maxLength="1"
          style={roundedInputStyle}
          onChange={this.handleVerificationCodeChange}
        />
        <input
          id="4"
          type="text"
          maxLength="1"
          style={roundedInputStyle}
          onChange={this.handleVerificationCodeChange}
        />
        <input
          id="5"
          type="text"
          maxLength="1"
          style={roundedInputStyle}
          onChange={this.handleVerificationCodeChange}
        />
      </div>
    </div>
  );
};

const TextButton = ({ text, onClick }) => {
  return (
    <div className="btn btn--text" onClick={onClick}>
      {text}
    </div>
  );
};

const MetaphiInfoLink = () => {
  return (
    <a
      className="link"
      href="https://metaphi.xyz"
      target="_blank"
      rel="noreferrer"
    >
      Learn more about Metaphi
    </a>
  );
};

const LoginFormDialog = (props) => {
  const [mode, setMode] = useState("email"); // verification
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState([]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleVerificationCodeChange = (e) => {
    const index = e.target.id;
    let code = this.state.verificationCode;
    code[index] = e.target.value;
    setVerificationCode(code);
    // Focus on the next element
    if (index < 6) e.target?.nextElementSibling?.focus();
  };

  const resolve = () => {
    if (mode === "email") return props.resolve(email);
    if (mode === "verification")
      return props.resolve(verificationCode.join(""));
  };

  return (
    <div>
      {/** Description */}
      <div className="modal-description">
        Enter the following details to connect to Metaphi
      </div>

      {/** Email */}
      {/* <div class="modal-section">
        <TextButton text="Get Authorization Code" onClick={resolve} />
      </div> */}

      {/** Authentication */}
      {/* <div class="modal-section">
        <NumericInput
          label="Authentication Code"
          onChange={handleVerificationCodeChange}
        />
      </div> */}

      {/** CTA */}
      <div className="modal-cta-wrapper">
        {/** Continue */}
        <PrimaryButton text="Continue" onClick={resolve} />
        {/** Information Link */}
        <MetaphiInfoLink />
      </div>
    </div>
  );
};

export default LoginFormDialog;
