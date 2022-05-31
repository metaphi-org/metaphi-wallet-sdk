import { useEffect } from 'react';
import LottieGraphic from '../components/LottieGraphic.jsx';
import animationData from '../assets/lottie/loading.json';

const ProcessingDialog = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/** Lottie */}
      <LottieGraphic animationData={animationData} />
      <div className="modal-cta-wrapper loading">Connecting ...</div>
    </div>
  );
};

export default ProcessingDialog;
