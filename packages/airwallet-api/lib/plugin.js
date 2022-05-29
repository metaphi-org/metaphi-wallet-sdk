const Web3 = require("web3");
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
  _isLoaded = false;
  _wallet = {};
  _provider = null;
  _userInputMethod = null;

  constructor(options) {
    this._options = options;
    this._accountConfig = options.accountConfig;
    this._networkConfig = options.networkConfig;
    this._SOURCE_URL = "https://metaphi.xyz";
    this._provider = new Web3(
      new Web3.providers.HttpProvider(options.networkConfig.rpcUrl)
    );

    console.log("Wallet Options", options);
    if (options.custom.userInputMethod) {
      this._userInputMethod = options.custom.userInputMethod;
    }
  }

  /** Public Functions */
  // Client-side only.
  init = () => {
    if (!global.window) {
      throw new Error("Metaphi Wallet should be initialized client-side.");
    }

    const embed = document.getElementById(WALLET_EMBED_ID);
    const root = document.getElementById("mWalletContainer");
    if (!embed) {
      // Setup iframe.
      const ifrm = document.createElement("iframe");
      ifrm.setAttribute("id", WALLET_EMBED_ID);
      const source = this._getSource();
      ifrm.setAttribute("src", source);
      ifrm.setAttribute("height", 0);
      ifrm.setAttribute("width", 0);
      ifrm.setAttribute("style", "position: absolute; top: 0; left: 0;");
      root.appendChild(ifrm); // to place at end of document

      // Setup listener, for callbacks.
      window.addEventListener("message", this._receiveMessage);

      this._isLoaded = true;
    }
  };

  // Client-side only.
  destroy = () => {
    // Remove iframe.
    // Remove listeners.
    window.removeEventListener("message", this._receiveMessage);
    this._isLoaded = false;
  };

  /**
   * Check, if loaded.
   *
   * @returns {Boolean}
   */
  isLoaded = () => {
    return this._isLoaded;
  };

  /**
   * Connect wallet.
   * @param {Function} callback
   */
  connect = (callback) => {
    // Add callback.
    this._getCallbackStore()["on_connect"].push(callback);

    this._login(callback);
  };

  /**
   * Disconnect wallet.
   * @param {Function} callback
   */
  disconnect = (callback) => {
    // Add callback.
    this._getCallbackStore()["on_disconnect"].push(callback);

    this._sendEvent({ event: "disconnect" }, callback);
  };

  /**
   *
   * @param {Object} payload  { message: String }
   * @param {function} callback
   */
  signMessage = async (payload, callback) => {
    const ok = await this.getUserInput("signMessage");
    if (!ok) {
      if (callback) callback({ err: "User didnot authorize signing." });
    }

    this._sendEvent({ event: "signMessage", payload }, callback);
  };

  /**
   *
   * @param {Object} payload  { transaction: Object }
   * @param {Function} callback
   */
  signTransaction = async (payload, callback) => {
    const ok = await this.getUserInput("signTransaction");
    if (!ok) {
      if (callback) callback({ err: "User didnot authorize signing." });
    }

    this._sendEvent({ event: "signTransaction", payload }, callback);
  };

  /**
   * Get address of connected wallet.
   *
   * @returns {String}
   */
  getAddress = () => {
    return this._wallet.address;
  };

  /**
   * Get provider instance.
   *
   * @returns {Object} web3 provider
   */
  getProvider = () => {
    return this._provider;
  };

  /**
   *
   * @param {*} callback
   */
  getUserInput = async (inputType) => {
    // TODO: Add backup for when user input is not available
    if (!this._userInputMethod) {
      return await this.getUserInputDefault(inputType);
    }

    let value;
    switch (inputType.toLowerCase()) {
      case "email":
        value = await this._userInputMethod.getEmail();
        break;
      case "verificationcode":
        value = await this._userInputMethod.getVerificationCode();
        break;
      case "pin":
        value = await this._userInputMethod.getUserPin();
        break;
      case "signmessage":
        value = confirm("Sign this message?");
        break;
      case "signtransaction":
        value = confirm("Sign this transaction?");
        break;
    }
    return value;
  };

  getUserInputDefault = (inputType) => {
    let value;
    switch (inputType.toLowerCase()) {
      case "email":
        value = prompt("Please enter your email.");
        break;
      case "verificationcode":
        value = prompt("Please enter authorization code send to your email.");
        break;
      case "pin":
        value = prompt("Please enter your 6-digit pin.");
        break;
      case "signmessage":
        value = confirm("Sign this message?");
        break;
      case "signtransaction":
        value = confirm("Sign this transaction?");
        break;
    }
    return value;
  };

  showUserMessage = () => {
    this._userInputMethod.updateState("success");
  };

  // Internal. Only exposed, for testing.
  createWallet = (callback) => {
    this._sendEvent({ event: "createWallet" }, callback);
  };

  /** Private Instances */
  _getInstance = () => {
    return document.getElementById(WALLET_EMBED_ID);
  };

  _initCallbackStore = () => {
    window["__METAPHI__"] = {
      callbacks: {
        _METAPHI_INTERNAL_CALLBACK_: this._handleInternalCallback,
        // events
        on_connect: [this._handleConnect],
        on_disconnect: [this._handleDisconnect],
        on_verify: [this._handleVerify],
        on_login: [this._handleLogin],
      },
    };
  };

  _getCallbackStore = () => {
    if (!window["__METAPHI__"]) {
      this._initCallbackStore();
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

  _handleInternalCallback = (payload) => {
    const { method, data } = payload;
    if (method === "wallet_connected") {
      this._wallet.address = data.address;
    }

    if (method === "wallet_disconnected") {
      this._wallet = {};
    }
  };

  // Event
  _login = async () => {
    const email = await this.getUserInput("email");
    if (!email) return;

    // Login event.
    const payload = { email };
    this._sendEvent({ event: "login", payload });
  };

  // Event listener
  _handleLogin = (payload) => {
    if (payload.err) {
      alert(`Error: ${payload.err}`);
      return;
    }

    if (payload.verified) {
      // Trigger connect step.
      return this._connect(payload.email);
    }

    // Trigger verification step.
    return this._verify(payload.email);
  };

  // Event
  _verify = async (email) => {
    const verificationCode = await this.getUserInput("verificationCode");
    const payload = {
      email,
      verificationCode,
    };
    this._sendEvent({ event: "verify", payload });
  };

  // Listener
  _handleVerify = (payload) => {
    if (payload.err) {
      alert(`Error: ${payload.err}`);
      return;
    }

    if (!payload.verified) {
      alert("Incorrect verification code.");
      return;
    }

    // verifying.
    if (!payload.err && payload.verified) {
      this._connect(payload.email);
    }
  };

  // Event.
  _connect = async (email) => {
    const userPin = await this.getUserInput("Pin");
    const payload = { email, userPin };
    this._sendEvent({ event: "connect", payload });
  };

  // Listener.
  _handleConnect = (payload) => {
    this.showUserMessage();
    this._wallet.address = payload.address;
  };

  _handleDisconnect = () => {
    // handle connect.
  };

  // Execute callback.
  _executeCallback = (callbackId, payload) => {
    if (!callbackId) {
      return;
    }

    const callbackFn = this._getCallbackStore()[callbackId];
    if (typeof callbackFn === "function") callbackFn(payload);
    else if (Array.isArray(callbackFn)) {
      callbackFn.forEach((fn) => {
        fn(payload);
      });
      // Remove all, expect the first natives function.
      callbackFn.splice(1);
    }

    // Delete non-internal callbacks.
    const isInternalCallback = callbackId === "_METAPHI_INTERNAL_CALLBACK_";
    if (!isInternalCallback && !Array.isArray(callbackFn))
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

console.log("Is window?", !!global.window);
if (global.window) {
  global.window.WalletPlugin = WalletPlugin;
}

export default WalletPlugin;
