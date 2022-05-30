import { useState } from "react";
import PrimaryButton from "../components/PrimaryButton.jsx";

const ConnectionInitializationDialog = ({ walletAddress, resolve }) => {
  const [activeStep, setActiveStep] = useState();
  const [userPin, setUserPin] = useState();

  const handleUserPin = (e) => {
    setUserPin(e.target.value);
    if (e.target.value.length === 4) {
      setActiveStep(4);
    }
  };

  const getBulletState = (step) => {
    if (step < activeStep) return "complete";
    if (step === activeStep) return "active";
    if (step > activeStep) return "incomplete";
  };

  return (
    <div>
      <div className="modal-description">Connection Initialization</div>

      {/** Bullets */}
      <div className="bullet-container">
        <div className={`modal-bullet modal-bullet--${getBulletState(0)}`}>
          <div className="bullet">1</div>
          <div className="bullet-body">
            <div className="bullet-title">Wallet Address</div>
            <div className="bullet-description">
              {activeStep === 0 ? "Getting your wallet address..." : null}
              {activeStep > 0 ? walletAddress : null}
            </div>
          </div>
        </div>
        <div className={`modal-bullet modal-bullet--${getBulletState(1)}`}>
          <div className="bullet">2</div>
          <div className="bullet-body">
            <div className="bullet-title">Local Share</div>
            <div className="bullet-description">
              {activeStep === 1 ? "Retriving local share..." : null}
              {activeStep > 1 ? "Retrived local share" : null}
            </div>
          </div>
        </div>
        <div className={`modal-bullet modal-bullet--${getBulletState(2)}`}>
          <div className="bullet">3</div>
          <div className="bullet-body">
            <div className="bullet-title">Metaphi Share</div>
            <div className="bullet-description">
              {activeStep === 2 ? "Fetching Metaphi share..." : null}
              {activeStep > 2 ? "Fetched Metaphi share." : null}
            </div>
          </div>
        </div>
        <div className={`modal-bullet modal-bullet--${getBulletState(3)}`}>
          <div className="bullet">4</div>
          <div className="bullet-body">
            <div className="bullet-title">Pin:</div>
            <div className="bullet-description">
              <input
                onChange={handleUserPin}
                type="text"
                disabled={activeStep !== 3}
                placeholder="Please enter your user pin"
              />
            </div>
          </div>
        </div>
        <div className={`modal-bullet modal-bullet--${getBulletState(4)}`}>
          <div className="bullet">5</div>
          <div className="bullet-body">
            <div className="bullet-title">Private Key Reconstruction</div>
            <div className="bullet-description">
              {activeStep === 4 ? "Recontructing your private key..." : null}
              {activeStep > 4 ? "Private key reconstructed." : null}
            </div>
          </div>
        </div>
      </div>

      <div className="modal-cta-wrapper">
        <PrimaryButton
          disabled={activeStep < 5}
          onClick={() => resolve(userPin)}
        >
          Connect Wallet
        </PrimaryButton>
      </div>
    </div>
  );
};

export default ConnectionInitializationDialog;
