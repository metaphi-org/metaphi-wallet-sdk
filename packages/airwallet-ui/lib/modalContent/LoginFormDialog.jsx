import React from "react";
import TextButton from "../components/TextButton.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import Input from "../components/Input.jsx";
import NumericInput from "../components/NumericInput.jsx";

const MetaphiInfoLink = () => {
  return (
    <a
      className="text-link"
      href="https://metaphi.xyz"
      target="_blank"
      rel="noreferrer"
    >
      Learn more about Metaphi
    </a>
  );
};

const LoginFormDialog = (props) => {
  // const [mode, setMode] = React.useState("email"); // verification
  // const [email, setEmail] = useState("");
  // const [verificationCode, setVerificationCode] = useState([]);

  const handleEmailChange = (e) => {
    // setEmail(e.target.value);
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
      <div className="modal-section">
        <Input label="Email Address" onChange={handleEmailChange} />
        <TextButton text="Send Authorization Code" onClick={resolve} />
      </div>

      {/** Authentication */}
      {/* <div className="modal-section">
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
