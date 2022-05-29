import React from "react";
// Components.
import MetaphiModal from "./MetaphiModal.jsx";
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
  constructor() {
    super();
    this.state = {
      show: false,
      modalState: 0,
      email: "",
      verificationCode: [],
      userPin: "",
    };
    this._resolve = null;

    // Append to window, to control state from outside.
    if (global.window) window.MetaphiModal = this;
  }

  show() {
    this.setState({ show: true });
  }

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handleVerificationCodeChange = (e) => {
    const index = e.target.id;
    let code = this.state.verificationCode;
    code[index] = e.target.value;
    this.setState({ verificationCode: code });
    // Focus on the next element
    if (index < 6) e.target?.nextElementSibling?.focus();
  };

  handleGetAuthCode = () => {
    this._resolve(this.state.email);
  };

  handleVerify = () => {
    const code = this.state.verificationCode.join("");
    this._resolve(code);
  };

  handleUserPin = (e) => {
    this.setState({ userPin: e.target.value });
    if (e.target.value.length === 4) {
      // resolve
      this._resolve(e.target.value);
      this.updateState("processing");
    }
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  getEmail = async (msg) => {
    console.log("getting email");
    this.setState({ show: true });
    let self = this;
    const myPromise = new Promise((resolve, reject) => {
      self._resolve = resolve;
    });
    return myPromise;
  };

  getVerificationCode = async () => {
    console.log("getting verification code");
    this.setState({ modalState: 1 });
    let self = this;
    const myPromise = new Promise((resolve, reject) => {
      self._resolve = resolve;
    });
    return myPromise;
  };

  getUserPin = async () => {
    console.log("getting user pin");
    this.setState({ modalState: 2 });
    let self = this;
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

  renderEmail = () => {
    return (
      <div>
        {/** Branding */}
        <div style={brandingStyle}>
          <div>Icon</div>
          <div>Metaphi</div>
        </div>
        {/** Blurb */}
        <div style={headingTextStyle}>
          To connect to Metaphi, please fill in the details below
        </div>
        {/** Email */}
        <div style={sectionStyle}>
          <label style={labelStyle}>Email Address</label>
          <input style={inputStyle} onChange={this.handleEmailChange} />
          <div style={linkButtonStyle} onClick={this.handleGetAuthCode}>
            Send Authentication Code
          </div>
        </div>
        {/** Authentication */}
        <div disabled={this.state.modalState !== 1}>
          <label style={labelStyle}>Authentication Code</label>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <input
              id="0"
              type="text"
              maxLength="1"
              style={roundedInputStyle}
              onChange={this.handleVerificationCodeChange}
            />
            <input
              id="1"
              type="text"
              maxLength="1"
              style={roundedInputStyle}
              onChange={this.handleVerificationCodeChange}
            />
            <input
              id="2"
              type="text"
              maxLength="1"
              style={roundedInputStyle}
              onChange={this.handleVerificationCodeChange}
            />
            <input
              id="3"
              type="text"
              maxLength="1"
              style={roundedInputStyle}
              onChange={this.handleVerificationCodeChange}
            />
            <input
              id="4"
              type="text"
              maxLength="1"
              style={roundedInputStyle}
              onChange={this.handleVerificationCodeChange}
            />
            <input
              id="5"
              type="text"
              maxLength="1"
              style={roundedInputStyle}
              onChange={this.handleVerificationCodeChange}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "48px",
          }}
        >
          {/** Continue */}
          <button style={mainButtonStyle} onClick={this.handleVerify}>
            Continue
          </button>
          {/** Information Link */}
          <a
            style={informationLinkStyle}
            href="https://metaphi.xyz"
            target="_blank"
            rel="noreferrer"
          >
            Learn more about Metaphi
          </a>
        </div>
      </div>
    );
  };

  renderKeyConstruction() {
    // TODO
    return (
      <div>
        Constructing Key
        <input onChange={this.handleUserPin} />
      </div>
    );
  }

  renderProcessing() {
    return <div>Processing...</div>;
  }

  renderSuccess() {
    return <div>Wallet Connected!</div>;
  }

  renderTransactionSigning() {
    // TODO
  }

  render() {
    if (!this.state.show) return null;

    return (
      <MetaphiModal>
        {/** Modal Content */}
        {this.state.modalState < 2 && this.renderEmail()}
        {this.state.modalState === 2 && this.renderKeyConstruction()}
        {this.state.modalState === 3 && this.renderProcessing()}
        {this.state.modalState === 4 && this.renderSuccess()}
        {this.state.modalState === 5 && this.renderTransactionSigning()}
      </MetaphiModal>
    );
  }
}

export default MetaphiInputHandler;
