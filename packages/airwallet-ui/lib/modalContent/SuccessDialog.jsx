import { useEffect } from "react";
import lottie from 'lottie-web';
import PrimaryButton from "../components/PrimaryButton.jsx";
import SecondaryButton from "../components/SecondaryButton.jsx";
import animationData from '../assets/lottie/success.json';

const SuccessDialog = ({ address, dapp, onClose }) => {
  const navigateToMetaphi = () => {
    window.open("https:/metaphi.xyz");
  };

  useEffect(() => {
    const heroAnimation = lottie.loadAnimation({
      container: document.getElementById('wallet-connected-animation'),
      renderer: 'svg',
      animationData
    });
    
    heroAnimation.goToAndPlay(0, true);
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      {/** Lottie */}
      <div id='wallet-connected-animation' style={{ width: "144px", height: "144px" }}></div>
      <div style={{ textAlign: "center", lineHeight: "1.5" }}>
        You have successfully connected your Metaphi Wallet ({address}) to
        <br />
        {dapp}
      </div>
      <div className="modal-cta-wrapper">
        <PrimaryButton onClick={onClose}>Go to {dapp}</PrimaryButton>
        <SecondaryButton onClick={navigateToMetaphi}>
          View Metaphi Dashboard
        </SecondaryButton>
      </div>
    </div>
  );
};

export default SuccessDialog;
