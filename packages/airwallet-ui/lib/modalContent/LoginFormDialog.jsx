import { useState } from 'react';
import TextButton from '../components/TextButton.jsx';
import PrimaryButton from '../components/PrimaryButton.jsx';
import Input from '../components/Input.jsx';
import NumericInput from '../components/NumericInput.jsx';

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
  const [value, setValue] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const text = codeSent
    ? 'Please check your email.'
    : 'Send Authorization Code';

  const handleContinue = () => {
    setIsLoading(true);
    resolve(value);
  };

  return (
    <div>
      {/** Description */}
      <div className="modal-description">
        Enter the following details to connect to Metaphi
      </div>

      {/** Email */}
      <div className="modal-section">
        <Input label="Email Address" onChange={setValue} />
        <TextButton
          text={text}
          disabled={codeSent}
          onClick={() => {
            if (codeSent) return;

            setCodeSent(true);
            resolve(value);
          }}
        />
      </div>

      {/** Authentication */}
      <div
        className={`modal-section modal-section--${
          mode === 1 ? 'active' : 'disabled'
        }`}
      >
        <NumericInput
          disabled={mode === 0 || isLoading}
          label="Authentication Code"
          onInputChange={setValue}
        />
      </div>

      {/** CTA */}
      <div className="modal-cta-wrapper">
        {/** Continue */}
        <PrimaryButton
          loading={isLoading}
          disabled={mode === 0 || value?.length < 6 || isLoading}
          onClick={handleContinue}
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
