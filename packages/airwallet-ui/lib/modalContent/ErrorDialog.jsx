import { useEffect } from "react";
import lottie from 'lottie-web';
import animationData from '../assets/lottie/error.json';

const ErrorDialog = () => {  
  useEffect(() => {
    const heroAnimation = lottie.loadAnimation({
      container: document.getElementById('error-animation'),
      renderer: 'svg',
      animationData
    });
    
    heroAnimation.goToAndPlay(0, true);
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      {/** Lottie */}
      <div id='error-animation' style={{ width: "144px", height: "144px" }}></div>
      <div className="modal-cta-wrapper loading">Connecting ...</div>
    </div>
  );
};

export default ErrorDialog;
