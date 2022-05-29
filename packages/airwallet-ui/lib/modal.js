import React from "react";
// Components.
import MetaphiModal from "./MetaphiModal.jsx";
import LoginFormDialog from "./modalContent/LoginFormDialog.jsx";
import ConnectionInititalizationDialog from "./modalContent/ConnectionInitializationDialog.jsx";
import ProcessingDialog from "./modalContent/ProcessingDialog.jsx";
import SuccessDialog from "./modalContent/SuccessDialog.jsx";
import ErrorDialog from "./modalContent/ErrorDialog.jsx";
import ConnectDialog from "./modalContent/ConnectDialog.jsx";
// Styles.
import "./styles/modal.scss";

const informationLinkStyle = {
  color: "pink",
  textDecoration: "underline",
  textAlign: "center",
  marginTop: "36px",
};

const mainButtonStyle = {
  borderRadius: "24px",
  height: "64px",
  padding: "14px 121px",
  fontSize: "24px",
  backgroundColor: "#9228E8",
  color: "white",
};

const brandingStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  fontSize: "24px",
  lineHeight: "36px",
};

const headingTextStyle = {
  fontSize: "20px",
  lineHeight: "30px",
  textAlign: "center",
  marginTop: "16px",
};

const labelStyle = {
  padding: "12px 0",
};

const inputStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "17px 24px",
  width: "416px",
  height: "64px",
  background: "#1F1F1F",
  borderRadius: "24px",
  margin: "8px 0",
  color: "white",
};

const roundedInputStyle = {
  height: "48px",
  width: "48px",
  borderRadius: "50%",
  color: "white",
  background: "#1F1F1F",
};

const sectionStyle = {
  margin: "32px 0",
};

const linkButtonStyle = {
  textDecoration: "underline",
  color: "#5C5C5C",
  fontSize: "20px",
  lineHeight: "36px",
  textAlign: "center",
  cursor: "pointer",
  marginTop: "24px",
};

class MetaphiInputHandler extends React.Component {
  static INPUT_TYPES = {
    EMAIL: 0,
    VERIFICATION_CODE: 1,
    USER_PIN: 2,
    TRANSACTION_SIGNING: 3,
  };

  constructor(props) {
    super(props);
    this.state = {
      show: true,
      modalState: MetaphiInputHandler.INPUT_TYPES.TRANSACTION_SIGNING,
    };
    this._resolve = null;

    // Append to window, to control state from outside.
    if (global.window) window.MetaphiModal = this;
  }

  show() {
    this.setState({ show: true });
  }

  handleClose = () => {
    this.setState({ show: false });
  };

  getEmail = async (msg) => {
    return this.getUserInput(MetaphiInputHandler.INPUT_TYPES.EMAIL);
  };

  getVerificationCode = async () => {
    return this.getUserInput(MetaphiInputHandler.INPUT_TYPES.VERIFICATION_CODE);
  };

  getUserPin = async () => {
    return this.getUserInput(MetaphiInputHandler.INPUT_TYPES.USER_PIN);
  };

  getUserInput = async (inputType) => {
    // Setup modal state.
    this.setState({ show: true, modalState: inputType });

    // Setup promise.
    const myPromise = new Promise((resolve, reject) => {
      self._resolve = resolve;
    });
    return myPromise;
  };

  updateState = (state) => {
    if (state === "processing") this.setState({ modalState: 3 });
    if (state === "success") {
      this.setState({ modalState: 4 });

      // hide modal.
      const self = this;
      setTimeout(() => {
        self.setState({ show: false });
      }, 1000);
    }
  };

  renderState = (modalState) => {
    switch (modalState) {
      case MetaphiInputHandler.INPUT_TYPES.EMAIL:
        return <LoginFormDialog />;
      case MetaphiInputHandler.INPUT_TYPES.VERIFICATION_CODE:
        return <LoginFormDialog />;
      case MetaphiInputHandler.INPUT_TYPES.USER_PIN:
        return <ConnectionInitializationDialog />;
      case MetaphiInputHandler.INPUT_TYPES.TRANSACTION_SIGNING:
        return <TransactionSigningDialog />;
      default:
        break;
    }
  };

  render() {
    if (!this.state.show) return null;

    return (
      <MetaphiModal onClose={this.handleClose}>
        <div>{this.renderState(this.state.modalState)}</div>
      </MetaphiModal>
    );
  }
}

export default MetaphiInputHandler;
