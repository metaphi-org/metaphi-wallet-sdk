import { useEffect } from 'react';
import Lottie from 'react-lottie';

const LottieGraphic = ({ animationData }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return <Lottie options={defaultOptions} height={144} width={144} />;
};

export default LottieGraphic;
