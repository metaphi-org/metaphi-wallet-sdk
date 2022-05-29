import React from "react";
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
        <div className="modal-btn-close">x</div>
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
