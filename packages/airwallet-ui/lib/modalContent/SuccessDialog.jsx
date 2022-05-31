import { useEffect } from 'react';
import PrimaryButton from '../components/PrimaryButton.jsx';
import SecondaryButton from '../components/SecondaryButton.jsx';
import LottieGraphic from '../components/LottieGraphic.jsx';
import animationData from '../assets/lottie/success.json';

const SuccessDialog = ({ address, dApp, onClose }) => {
  const navigateToMetaphi = () => {
    window.open('https:/metaphi.xyz');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LottieGraphic animationData={animationData} />
      <div style={{ textAlign: 'center', lineHeight: '1.5' }}>
        You have successfully connected your Metaphi Wallet ({address}) to
        <br />
        {dApp}
      </div>
      <div className="modal-cta-wrapper">
        <PrimaryButton onClick={onClose}>Go to {dApp}</PrimaryButton>
        <SecondaryButton onClick={navigateToMetaphi}>
          View Metaphi Dashboard
        </SecondaryButton>
      </div>
    </div>
  );
};

export default SuccessDialog;
