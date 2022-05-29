import React from "react";
import CloseIcon from "./assets/close.svg";
import "./styles/modal.scss";

/**
 * Wrapper component for modal.
 *
 */
const MetaphiModal = (props) => {
  return (
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
          {/** Modal Content */}
          <div>{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default MetaphiModal;
