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
  _callbacks = {};
  _options;

  constructor(options) {
    this._options = options;
    this._SOURCE_URL = options.pluginUrl || "https://metaphi.xyz/wallet/plugin";
  }

  /** Public Functions */

  // Client-side only.
  init() {
    if (!global.window) {
      throw new Error("Metaphi Wallet should be initialized client-side.");
    }

    // Setup iframe.
    const ifrm = document.createElement("iframe");
    ifrm.setAttribute("id", WALLET_EMBED_ID);
    document.body.appendChild(ifrm); // to place at end of document
    const source = this._getSource();
    ifrm.setAttribute("src", source);

    // Setup listener, for callbacks.
    window.addEventListener("message", (event) => {
      if (event.origin.startsWith(this._SOURCE_URL)) {
        const request = event.data;
        if (request.callbackId !== undefined) {
          const callbackFn = callbacks[request.callbackId];
          callbackFn();
          delete callbacks[request.callbackId];
        }
      }
    });
  }

  // Client-side only.
  destroy = () => {
    // Remove iframe.
    // Remove listeners.
  };

  connect = (callback) => {
    this._sendEvent({ event: "connect", payload }, callback);
  };

  disconnect = (callback) => {
    this._sendEvent({ event: "disconnect", payload }, callback);
  };

  signTransation = (payload, callback) => {
    this._sendEvent({ event: "signTransaction", payload }, callback);
  };

  signMessage = (payload, callback) => {
    this._sendEvent({ event: "personalSign", payload }, callback);
  };

  getAddress = () => {
    // return address;
  };

  getProvider = () => {
    // return web3 provider
  };

  /** Private Instances */
  _getInstance = () => {
    return document.getElementById(WALLET_EMBED_ID);
  };

  // Get callback Id.
  _getCallbackId = (callbackFn) => {
    if (!callbackFn) {
      return null;
    }
    const callbackId = uuidv4();
    this._callbacks[callbackId] = callbackFn;
    return callbackFn;
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

  _getSource = () => {
    return `${this._SOURCE_URL}?clientId=${clientId}&apiKey=${apiKey}&rpc=${rpc}`;
  };
}

export default WalletPlugin;
