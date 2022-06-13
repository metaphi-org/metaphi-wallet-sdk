import { useState } from 'react';
import PrimaryButton from '../components/PrimaryButton.jsx';
import Input from '../components/Input.jsx';

const MAX_PIN_LENGTH = 4;

const ConnectDialog = ({ resolve, email, dApp }) => {
  const [userPin, setUserPin] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = (e) => {
    resolve(userPin);
    setIsLoading(true);
  };

  return (
    <div>
      <div className="modal-description">Connect to {dApp}</div>
      {/** Email */}
      <Input label="Email Address" defaultValue={email} disabled={true} />
      <br />
      {/** User Pin */}
      <Input
        label="User Pin"
        placeholder="e.g 1234"
        disabled={isLoading}
        onChange={setUserPin}
      />
      <div
        style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}
      >
        <PrimaryButton
          loading={isLoading}
          disabled={isLoading}
          onClick={handleConnect}
        >
          Connect
        </PrimaryButton>
      </div>
    </div>
  );
};

export default ConnectDialog;
