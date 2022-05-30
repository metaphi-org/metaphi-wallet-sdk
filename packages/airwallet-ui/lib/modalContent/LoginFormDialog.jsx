// import  { useState } from "react";
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

/**
 * Modal to get user input for email or verification code.
 * 
 * @param {mode} emailOrVerificationMode: 0 or 1 
 * @param {resolve} promise 
 * @returns 
 */
const LoginFormDialog = ({ mode, resolve }) => {
  const [value, setValue] = useState("");
  const [codeSent, setCodeSent] = useState(false)

  const text = codeSent ? "Didn\'t get a code? Resend Code" : "Send Authorization Code"

  return (
    <div>
      {/** Description */}
      <div className="modal-description">
        Enter the following details to connect to Metaphi
      </div>

      {/** Email */}
      <div className="modal-section">
        <Input label="Email Address" onChange={setValue} />
        <TextButton text={text} onClick={() => {
          setCodeSent(true)
          resolve(value)
        }} />
      </div>

      {/** Authentication */}
      <div
        className={`modal-section modal-section--${
          mode === 1 ? "active" : "disabled"
        }`}
      >
        <NumericInput label="Authentication Code" onInputChange={setValue} />
      </div>

      {/** CTA */}
      <div className="modal-cta-wrapper">
        {/** Continue */}
        <PrimaryButton
          disabled={mode === 0 || value?.length < 6}
          onClick={() => resolve(value)}
        >
          Continue
        </PrimaryButton>
        {/** Information Link */}
        <MetaphiInfoLink />
      </div>
    </div>
  );
};

export default LoginFormDialog;
