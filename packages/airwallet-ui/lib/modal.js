import React from 'react';
import { MetaphiInputTypes } from '@metaphi/airwallet-api';
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
 * React component to handle Metaphi Inputs and Dialog promts.
 * Handle all interactions between the user and Metaphi.
 * 
 * 
 */
class MetaphiWalletInteractionHandler extends React.Component {
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
    return this.getUserInput(MetaphiInputTypes.EMAIL);
  };

  getVerificationCode = async () => {
    return this.getUserInput(
      MetaphiInputTypes.VERIFICATION_CODE,
    );
  };

  getUserPin = async () => {
    return this.getUserInput(
      MetaphiInputTypes.USER_PIN);
  };

  getUserSigningConfirmation = async (payload) => {
    return this.getUserInput(
      MetaphiInputTypes.TRANSACTION_SIGN,
      payload,
    );
  };

  getUserTransactionConfirmation = async (payload) => {
    return this.getUserInput(
      MetaphiInputTypes.TRANSACTION_SIGN,
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
    if (state === MetaphiInputTypes.PROCESSING)
      this.setState({
        modalState: MetaphiInputTypes.PROCESSING,
      });
    if (state === MetaphiInputTypes.SUCCESS) {
      this.setState({
        modalState: MetaphiInputTypes.SUCCESS,
        modalProps,
      });
    }
  };

  showError = (error, inputType) => {
    this.setState({
      show: true,
      modalState: MetaphiInputTypes.ERROR,
      modalProps: { message: error.message },
    });
  };

  renderState = (modalState) => {
    const dialogProps = this.state.modalProps;

    switch (modalState) {
      case MetaphiInputTypes.EMAIL:
        return <LoginFormDialog mode={0} resolve={this._resolve} />;
      case MetaphiInputTypes.VERIFICATION_CODE:
        return <LoginFormDialog mode={1} resolve={this._resolve} />;
      case MetaphiInputTypes.USER_PIN:
        return (
          <ConnectionInitializationDialog
            resolve={this._resolve}
            {...dialogProps}
          />
        );
      case MetaphiInputTypes.TRANSACTION_SIGN:
        return (
          <TransactionSigningDialog
            resolve={this._resolve}
            {...dialogProps}
            onClose={this.handleClose}
          />
        );
      case MetaphiInputTypes.SUCCESS:
        return <SuccessDialog {...dialogProps} onClose={this.handleClose} />;
      case MetaphiInputTypes.PROCESSING:
        return <ProcessingDialog />;
      case MetaphiInputTypes.ERROR:
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
