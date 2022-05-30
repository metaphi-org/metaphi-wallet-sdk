import React from "react";
import PrimaryButton from "../components/PrimaryButton.jsx";
import SecondaryButton from "../components/SecondaryButton.jsx";

const SuccessDialog = ({ address, dapp, onClose }) => {
  const navigateToMetaphi = () => {
    window.open("https:/metaphi.xyz");
  };

  return (
    <div>
      {/** Lottie */}
      <div style={{ width: "144px", height: "144px" }}></div>
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
