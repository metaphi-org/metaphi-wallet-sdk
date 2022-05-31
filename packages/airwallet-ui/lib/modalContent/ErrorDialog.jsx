import { useEffect } from 'react';
import LottieGraphic from '../components/LottieGraphic.jsx';
import animationData from '../assets/lottie/error.json';

const ErrorDialog = ({ message }) => {
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
      <div className="modal-cta-wrapper">{message}</div>
    </div>
  );
};

export default ErrorDialog;
