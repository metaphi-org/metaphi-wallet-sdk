import React from "react";
import SecondaryButton from "../components/SecondaryButton.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";

const TransactionSigningDialog = ({
  resolve,
  address,
  balance,
  origin,
  message,
}) => {
  return (
    <div>
      <div className="modal-description">Signature Request</div>
      <div className="modal-section flex flex-row">
        <div className="half-container">
          <div>Address:</div>
          <div>{address}</div>
        </div>
        <div className="half-container">
          <div>Balance:</div>
          <div>{balance}</div>
        </div>
      </div>
      <div className="modal-section">
        <div>Origin:</div>
        <div>{origin}</div>
      </div>
      <div className="modal-section">
        <div className="message-box">
          <div>Message:</div>
          <div>{message}</div>
        </div>
      </div>
      <div className="modal-cta-wrapper wrapper-row">
        <SecondaryButton onClick={() => resolve(false)}>Cancel</SecondaryButton>
        <PrimaryButton onClick={() => resolve(true)}>Sign</PrimaryButton>
      </div>
    </div>
  );
};

export default TransactionSigningDialog;
