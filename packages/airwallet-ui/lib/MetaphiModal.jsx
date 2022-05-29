import React from "react";
import CloseIcon from "./assets/close.svg";
import MetaphiLogo from "./assets/metaphi-logo.png";

/**
 * Wrapper component for modal.
 *
 */
const MetaphiModal = (props) => {
  return (
    <div className="metaphi">
      <div className="modal">
        {/** Modal Background */}
        <div className="modal-background"></div>
        {/** Modal */}
        <div className="modal-body-wrapper">
          {/** Modal Close Button */}
          <div className="modal-btn-close" onClick={props.onClose}>
            <img src={CloseIcon} width="48px" height="48px" />
          </div>
          {/** Modal Wrapper */}
          <div className="modal-content-wrapper">
            <div className="modal-header">
              <div className="logo">
                <img src={MetaphiLogo} width="40px" height="40px" />
              </div>
              <div className="branding">Metaphi</div>
            </div>
            {/** Modal Content */}
            <div>{props.children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaphiModal;
