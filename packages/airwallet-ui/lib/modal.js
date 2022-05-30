import React from "react";
// Components.
import MetaphiModal from "./MetaphiModal.jsx";
import LoginFormDialog from "./modalContent/LoginFormDialog.jsx";
import ConnectionInitializationDialog from "./modalContent/ConnectionInitializationDialog.jsx";
import TransactionSigningDialog from "./modalContent/TransactionSigningDialog.jsx";
import ProcessingDialog from "./modalContent/ProcessingDialog.jsx";
import SuccessDialog from "./modalContent/SuccessDialog.jsx";
import ErrorDialog from "./modalContent/ErrorDialog.jsx";
import ConnectDialog from "./modalContent/ConnectDialog.jsx";
// Styles.
import "./styles/index.scss";

class MetaphiInputHandler extends React.Component {
  static INPUT_TYPES = {
    EMAIL: 0,
    VERIFICATION_CODE: 1,
    USER_PIN: 2,
    TRANSACTION_SIGN: 3,
    SUCCESS: 4,
    PROCESSING: 5,
    ERROR: 6,
    CONNECT: 7,
  };

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      modalState: MetaphiInputHandler.INPUT_TYPES.SUCCESS,
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

    const self = this;
    // Setup promise.
    const myPromise = new Promise((resolve, reject) => {
      self._resolve = resolve;
    });
    return myPromise;
  };

  updateState = (state) => {
    if (state === "processing")
      this.setState({ modalState: MetaphiInputHandler.INPUT_TYPES.PROCESSING });
    if (state === "success") {
      this.setState({ modalState: MetaphiInputHandler.INPUT_TYPES.SUCCESS });

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
        return <LoginFormDialog mode={0} resolve={this._resolve} />;
      case MetaphiInputHandler.INPUT_TYPES.VERIFICATION_CODE:
        return <LoginFormDialog mode={1} resolve={this._resolve} />;
      case MetaphiInputHandler.INPUT_TYPES.USER_PIN:
        return <ConnectionInitializationDialog resolve={this._resolve} />;
      case MetaphiInputHandler.INPUT_TYPES.TRANSACTION_SIGNING:
        return <TransactionSigningDialog resolve={this._resolve} />;
      case MetaphiInputHandler.INPUT_TYPES.SUCCESS:
        return <SuccessDialog dapp={"Pegaxy"} onClose={this.handleClose} />;
      case MetaphiInputHandler.INPUT_TYPES.PROCESSING:
        return <ProcessingDialog />;
      case MetaphiInputHandler.INPUT_TYPES.ERROR:
        return <ErrorDialog />;
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
