import { useState, useEffect } from "react";
import PrimaryButton from "../components/PrimaryButton.jsx";

const MAX_PIN_LENGTH = 4

const ConnectionInitializationDialog = ({ walletAddress, resolve }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [userPin, setUserPin] = useState();
  const [timer, setTimer]  = useState(0)

  const isActive = activeStep < 5
  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (timer % 2 === 0 && activeStep != 3) setActiveStep(activeStep + 1)
        setTimer(timer => timer + 1);
      }, 1000);
    } 

    return () => clearInterval(interval);
  }, [isActive, timer, activeStep]);

  const handleUserPin = (e) => {
    setUserPin(e.target.value);
    if (e.target.value.length === MAX_PIN_LENGTH) {
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
            <div className={`bullet-description ${getBulletState(0) === 'active' ? 'bullet-description--loading' : ''}`}>
              {activeStep === 0 ? "Getting your wallet address..." : null}
              {activeStep > 0 ? "Fetched address." : null}
            </div>
          </div>
        </div>
        <div className={`modal-bullet modal-bullet--${getBulletState(1)}`}>
          <div className="bullet">2</div>
          <div className="bullet-body">
            <div className="bullet-title">Local Share</div>
            <div className={`bullet-description ${getBulletState(1) === 'active' ? 'bullet-description--loading' : ''}`}>
              {activeStep === 1 ? "Retrieving local share..." : null}
              {activeStep > 1 ? "Retrieved local share." : null}
            </div>
          </div>
        </div>
        <div className={`modal-bullet modal-bullet--${getBulletState(2)}`}>
          <div className="bullet">3</div>
          <div className="bullet-body">
            <div className="bullet-title">Metaphi Share</div>
            <div className={`bullet-description ${getBulletState(2) === 'active' ? 'bullet-description--loading' : ''}`}>
              {activeStep === 2 ? "Fetching Metaphi share..." : null}
              {activeStep > 2 ? "Fetched Metaphi share." : null}
            </div>
          </div>
        </div>
        <div className={`modal-bullet modal-bullet--${getBulletState(3)}`}>
          <div className="bullet">4</div>
          <div className="bullet-body">
            <div className="bullet-title">Pin:</div>
            <div className={`bullet-description ${getBulletState(3) === 'active' ? 'bullet-description--loading' : ''}`}>
              <input
                onChange={handleUserPin}
                type="text"
                disabled={activeStep !== 3}
                placeholder="e.g 1234"
              />
            </div>
          </div>
        </div>
        <div className={`modal-bullet modal-bullet--${getBulletState(4)}`}>
          <div className="bullet">5</div>
          <div className="bullet-body">
            <div className="bullet-title">Private Key Reconstruction</div>
            <div className={`bullet-description ${getBulletState(4) === 'active' ? 'bullet-description--loading' : ''}`}>
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
