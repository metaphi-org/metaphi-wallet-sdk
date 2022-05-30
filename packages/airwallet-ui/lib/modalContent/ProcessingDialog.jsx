import { useEffect } from "react";
import lottie from 'lottie-web';
import animationData from '../assets/lottie/processing.json';

const ProcessingDialog = () => {
  useEffect(() => {
    const heroAnimation = lottie.loadAnimation({
      container: document.getElementById('processing-animation'),
      renderer: 'svg',
      animationData
    });
    
    heroAnimation.goToAndPlay(0, true);
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      {/** Lottie */}
      <div id='processing-animation' style={{ width: "144px", height: "144px" }}></div>
      <div className="modal-cta-wrapper loading">Connecting ...</div>
    </div>
  );
};

export default ProcessingDialog;
