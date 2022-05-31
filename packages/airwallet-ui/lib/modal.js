import React from 'react';
// Components.
import MetaphiModal from './MetaphiModal.jsx';
import LoginFormDialog from './modalContent/LoginFormDialog.jsx';
import ConnectionInitializationDialog from './modalContent/ConnectionInitializationDialog.jsx';
import TransactionSigningDialog from './modalContent/TransactionSigningDialog.jsx';
import ProcessingDialog from './modalContent/ProcessingDialog.jsx';
import SuccessDialog from './modalContent/SuccessDialog.jsx';
import ErrorDialog from './modalContent/ErrorDialog.jsx';
import ConnectDialog from './modalContent/ConnectDialog.jsx';
// Styles.
import "./styles/index.scss";

/**
 * Handles all inputs from the user.
 */
class MetaphiWalletInteractionHandler extends React.Component {
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
      modalState: null,
      modalProps: {},
    };
    this._resolve = null;

    // Append to window, enables controlling state from outside.
    if (global.window) window.MetaphiModal = this;
  }

  /** Visibility functions. */
  show() {
    this.setState({ show: true });
  }

  handleClose = () => {
    this.setState({ show: false });
  };

  /** Convenience functions. */
  getEmail = async () => {
    return this.getUserInput(MetaphiWalletInteractionHandler.INPUT_TYPES.EMAIL);
  };

  getVerificationCode = async () => {
    return this.getUserInput(
      MetaphiWalletInteractionHandler.INPUT_TYPES.VERIFICATION_CODE,
    );
  };

  getUserPin = async () => {
    return this.getUserInput(
      MetaphiWalletInteractionHandler.INPUT_TYPES.USER_PIN);
  };

  getUserSigningConfirmation = async (payload) => {
    return this.getUserInput(
      MetaphiWalletInteractionHandler.INPUT_TYPES.TRANSACTION_SIGN,
      payload,
    );
  };

  getUserTransactionConfirmation = async (payload) => {
    return this.getUserInput(
      MetaphiWalletInteractionHandler.INPUT_TYPES.TRANSACTION_SIGN,
      payload,
    );
  };

  /** Internal functions. */
  getUserInput = async (inputType, payload) => {
    if (inputType === undefined) {
      throw new Error('Invalid Input Requested.');
    }

    // Setup modal state.
    this.setState({ show: true, modalState: inputType, modalProps: payload });

    // Setup promise.
    const self = this;
    const myPromise = new Promise((resolve, reject) => {
      self._resolve = resolve;
    });
    return myPromise;
  };

  updateState = (state, modalProps) => {
    if (state === 'processing')
      this.setState({
        modalState: MetaphiWalletInteractionHandler.INPUT_TYPES.PROCESSING,
      });
    if (state === 'success') {
      this.setState({
        modalState: MetaphiWalletInteractionHandler.INPUT_TYPES.SUCCESS,
        modalProps,
      });
    }
  };

  showError = (error, inputType) => {
    this.setState({
      show: true,
      modalState: MetaphiWalletInteractionHandler.INPUT_TYPES.ERROR,
      modalProps: { message: error.message },
    });
  };

  renderState = (modalState) => {
    const dialogProps = this.state.modalProps;

    switch (modalState) {
      case MetaphiWalletInteractionHandler.INPUT_TYPES.EMAIL:
        return <LoginFormDialog mode={0} resolve={this._resolve} />;
      case MetaphiWalletInteractionHandler.INPUT_TYPES.VERIFICATION_CODE:
        return <LoginFormDialog mode={1} resolve={this._resolve} />;
      case MetaphiWalletInteractionHandler.INPUT_TYPES.USER_PIN:
        return (
          <ConnectionInitializationDialog
            resolve={this._resolve}
            {...dialogProps}
          />
        );
      case MetaphiWalletInteractionHandler.INPUT_TYPES.TRANSACTION_SIGN:
        return (
          <TransactionSigningDialog
            resolve={this._resolve}
            {...dialogProps}
            onClose={this.handleClose}
          />
        );
      case MetaphiWalletInteractionHandler.INPUT_TYPES.SUCCESS:
        return <SuccessDialog {...dialogProps} onClose={this.handleClose} />;
      case MetaphiWalletInteractionHandler.INPUT_TYPES.PROCESSING:
        return <ProcessingDialog />;
      case MetaphiWalletInteractionHandler.INPUT_TYPES.ERROR:
        return <ErrorDialog {...dialogProps} onClose={this.handleClose} />;
      default:
        break;
    }
  };

  render() {
    if (!global.window) return null;
    if (!this.state.show) return null;

    return (
      <MetaphiModal onClose={this.handleClose}>
        <div>{this.renderState(this.state.modalState)}</div>
      </MetaphiModal>
    );
  }
}

export default MetaphiWalletInteractionHandler;
