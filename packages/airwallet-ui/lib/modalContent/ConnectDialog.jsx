import React from "react";
import PrimaryButton from "../components/PrimaryButton.jsx";

const MAX_PIN_LENGTH = 4

const ConnectDialog = ({ resolve, email }) => {
  const [userPin, setUserPin] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleUserPin = (e) => {
    setUserPin(e.target.value);
    if (e.target.value.length === MAX_PIN_LENGTH) {
      resolve(userPin)
      setIsLoading(true);
    }
  };

  return (
    <div>
      {/** Email */}
      <div className="modal-section">
        {email}
      </div>

      {/** User Pin */}
      <input
        onChange={handleUserPin}
        type="text"
        placeholder="e.g 1234"
        disabled={isLoading}
      />
    </div>
  );
};

export default ConnectDialog;
