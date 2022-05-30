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

const LoginFormDialog = ({ mode, resolve }) => {
  const [value, setValue] = useState("");

  return (
    <div>
      {/** Description */}
      <div className="modal-description">
        Enter the following details to connect to Metaphi
      </div>

      {/** Email */}
      <div className="modal-section">
        <Input label="Email Address" onChange={setValue} />
        <TextButton text="Send Authorization Code" onClick={resolve} />
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
          onClick={resolve}
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
