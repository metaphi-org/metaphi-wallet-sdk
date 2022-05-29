import React from "react";

const NumericInput = ({ label }) => {
  return (
    <div>
      <label>{label}</label>
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
  );
};

export default NumericInput;
