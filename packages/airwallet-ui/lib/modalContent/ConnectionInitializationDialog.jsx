import React from "react";

const ConnectionInitializationDialog = () => {
  handleUserPin = (e) => {
    this.setState({ userPin: e.target.value });
    if (e.target.value.length === 4) {
      // resolve
      this._resolve(e.target.value);
      this.updateState("processing");
    }
  };

  return <div></div>;
};

export default ConnectionInitializationDialog;
