import React from "react";
import SecondaryButton from "../components/SecondaryButton.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";

const TransactionSigningDialog = (props) => {
  console.log(props)
 const {
    resolve,
    address,
    balance,
    origin,
    message,
    onClose
  } = props

  const handleClick = (value) => {
    if (typeof resolve === 'function') resolve(value)
    onClose()
  } 

  return (
    <div>
      <div className="modal-description">Signature Request</div>
      <div className="modal-section flex flex-row">
        <div className="" style={{ wordWrap: 'break-word'}}>
          <div className='modal-label'>Address:</div>
          <div className='modal-text'>{address}</div>
        </div>
        {/* <div className="half-container">
          <div className='modal-label'>Balance:</div>
          <div className='modal-text'>{balance} WEI</div>
        </div> */}
      </div>
      <div className="modal-section">
        <div  className='modal-label'>Origin:</div>
        <div className='modal-text'>{window.location.hostname}</div>
      </div>
      <div className="modal-section">
        <div className="message-box">
          <div className='modal-label'>Message:</div>
          <div style={{textAlign: 'center'}} className='modal-text'>{message}</div>
        </div>
      </div>
      <div className="modal-cta-wrapper wrapper-row">
        <SecondaryButton onClick={() => handleClick(false)}>Cancel</SecondaryButton>
        <PrimaryButton onClick={() => handleClick(true)}>Sign</PrimaryButton>
      </div>
    </div>
  );
};

export default TransactionSigningDialog;
