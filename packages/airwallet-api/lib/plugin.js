const WALLET_EMBED_ID = "mWalletPlugin";

// Source: https://stackoverflow.com/a/2117523/3545099
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

class WalletPlugin {
  _callbacks = { callbackFns: {} };
  _options;

  constructor(options) {
    this._options = options;
    this._accountConfig = options.accountConfig;
    this._networkConfig = options.networkConfig;
    this._SOURCE_URL = "https://metaphi.xyz";
  }

  /** Public Functions */

  // Client-side only.
  init = () => {
    if (!global.window) {
      throw new Error("Metaphi Wallet should be initialized client-side.");
    }

    if (!document.getElementById(WALLET_EMBED_ID)) {
      // Setup iframe.
      const ifrm = document.createElement("iframe");
      ifrm.setAttribute("id", WALLET_EMBED_ID);
      const source = this._getSource();
      ifrm.setAttribute("src", source);
      ifrm.setAttribute("height", 0);
      ifrm.setAttribute("width", 0);
      document.getElementById("mWalletContainer").appendChild(ifrm); // to place at end of document

      // Setup listener, for callbacks.
      window.addEventListener("message", this._receiveMessage);
    }
  };

  // Client-side only.
  destroy = () => {
    // Remove iframe.
    // Remove listeners.
    window.removeEventListener("message", this._receiveMessage);
  };

  connect = (callback) => {
    this._sendEvent({ event: "connect" }, callback);
  };

  disconnect = (callback) => {
    this._sendEvent({ event: "disconnect" }, callback);
  };

  getAddress = (callback) => {
    this._sendEvent({ event: "getAddress" }, callback);
  };

  getPrivateKey = (callback) => {
    this._sendEvent({ event: "getPrivateKey" }, callback);
  };

  getProvider = (callback) => {
    this._sendEvent({ event: "getProvider" }, callback);
  };

  createWallet = (callback) => {
    this._sendEvent({ event: "createWallet" }, callback);
  };

  signTransation = (payload, callback) => {
    this._sendEvent({ event: "signTransaction", payload }, callback);
  };

  signMessage = (payload, callback) => {
    this._sendEvent({ event: "personalSign", payload }, callback);
  };

  /** Private Instances */
  _getInstance = () => {
    return document.getElementById(WALLET_EMBED_ID);
  };

  _getCallbackStore = () => {
    if (!window["__METAPHI__"]) {
      window["__METAPHI__"] = { callbacks: {} };
    }
    return window["__METAPHI__"].callbacks;
  };

  // Get callback Id.
  _getCallbackId = (callbackFn) => {
    if (!callbackFn) {
      return null;
    }
    const callbackId = uuidv4();
    this._getCallbackStore()[callbackId] = callbackFn;
    return callbackId;
  };

  // Execute callback.
  _executeCallback = (callbackId, payload) => {
    if (!callbackId) {
      return;
    }

    const callbackFn = this._getCallbackStore()[callbackId];
    callbackFn(payload);
    delete this._getCallbackStore()[callbackId];
  };

  // Send event.
  _sendEvent = ({ event, payload }, callback) => {
    const callbackId = this._getCallbackId(callback);
    const request = {
      method: event,
      payload: payload,
      callbackId,
    };
    this._postMessage(request);
  };

  // Post message to child frame.
  _postMessage = (request) => {
    const frame = this._getInstance();
    frame.contentWindow.postMessage(request, this._SOURCE_URL);
  };

  // Handle message.
  _receiveMessage = (event) => {
    if (event.origin.startsWith(this._SOURCE_URL)) {
      this._executeCallback(event.data.callbackId, event.data.payload);
    }
  };

  _getSource = () => {
    const rpc = this._networkConfig.rpcUrl;
    const apiKey = this._accountConfig.apiKey;
    const clientId = this._accountConfig.clientId;
    const source = this._accountConfig.domain;
    const src = `${this._SOURCE_URL}/wallet/plugin?clientId=${clientId}&apiKey=${apiKey}&rpc=${rpc}&source=${source}`;
    return src;
  };
}

export default WalletPlugin;
