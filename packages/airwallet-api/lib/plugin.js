const { MetaphiJsonRpcProvider } = require('./MetaphiProvider')
const { uuidv4, getMetaphiIframeDomain } = require('./utils')
const { MetaphiIframe, MetaphiInputTypes, WALLET_EMBED_ID } = require('./constants')

/**
 * Class to handle communication with a Metaphi Wallet instance, 
 * embedded in an Iframe.
 * 
 */
class WalletPlugin {
  _callbacks = { callbackFns: {} };
  _options;
  _isLoaded = false;
  _wallet = {};
  _provider = null;
  _walletUI = null;
  _networkConfig = null

  constructor(options) {
    // Set options.
    this._options = options;
    this._accountConfig = options.accountConfig;
    this._networkConfig = options.networkConfig;

    // Set metaphi iframe domain.
    this._metaphiBaseDomain = getMetaphiIframeDomain(options.env);
    console.log('Metaphi Base Domain: ', this._metaphiBaseDomain)

    if (options.custom.userInputMethod) {
      this._walletUI = options.custom.userInputMethod;
    }

    // Setup provider. This provider doesnot have a signer yet.
    this._setupProvider()

    console.log('Metaphi wallet initialized.', options);
  }

  /** Public Functions */
  // Client-side only.
  init = () => {
    if (!global.window) {
      throw new Error('Metaphi Wallet should be initialized client-side.');
    }

    const embed = document.getElementById(WALLET_EMBED_ID);
    const root = document.getElementById('mWalletContainer');
    if (!embed) {
      // Setup iframe.
      const ifrm = document.createElement('iframe');
      ifrm.setAttribute('id', WALLET_EMBED_ID);
      const source = this._getIframeSource();
      ifrm.setAttribute('src', source);
      ifrm.setAttribute('height', 0);
      ifrm.setAttribute('width', 0);
      ifrm.setAttribute('style', 'position: absolute; top: 0; left: 0;');
      root.appendChild(ifrm); // to place at end of document

      // Setup listener, for callbacks.
      window.addEventListener('message', this._receiveMessage);

      this._isLoaded = true;
    }
  };

  // Client-side only.
  destroy = () => {
    // Remove iframe.
    // Remove listeners.
    window.removeEventListener('message', this._receiveMessage);
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
    this._getCallbackStore()['on_connect'].push(callback);

    this._login(callback);
  };

  /**
   * Disconnect wallet.
   * @param {Function} callback
   */
  disconnect = (callback) => {
    // Add callback.
    this._getCallbackStore()['on_disconnect'].push(callback);

    this._sendEvent({ event: 'disconnect' }, callback);
  };

  /**
   * 
   * @param {Object} payload  { message: String }
   * @param {function} callback
   */
  signMessage = async (payload, callback) => {
    const tx = { ...payload, address: this._wallet.address };
    const ok = await this.getUserInput(MetaphiInputTypes.TRANSACTION_SIGN, tx);
    if (!ok) {
      if (callback) callback({ err: 'User didnot authorize signing.' });
    }

    this._sendEvent({ event: 'signMessage', payload }, callback);
  };

  /**
   *
   * @param {Object} payload  { transaction: Object }
   * @param {Function} callback
   */
  signTransaction = async (transaction, callback) => {
    console.log("actual sign transaction function", transaction)
    const payload = { transaction }
    const ok = await this.getUserInput(MetaphiInputTypes.TRANSACTION_SIGN, transaction);
    if (!ok) {
      if (callback) callback({ err: 'User didnot authorize signing.' });
    }

    this._sendEvent({ event: 'signTransaction', payload }, callback);
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
   * Get chain ID. 
   * 
   * @returns Number
   */
  getChainId = () => {
    return this._networkConfig.chainId
  }

  /**
   * Get provider instance.
   *
   * @returns {JsonRpcProvider} jsonRpc provider
   */
  getProvider = () => {
    return this._provider;
  };

  /**
   *
   * @param {*} callback
   */
  getUserInput = async (inputType, payload = {}) => {
    let value

    if (this._walletUI) {
      value = await this._walletUI.getUserInput(inputType, payload);
    } else {
      // Default inputs.
      switch (inputType) {
        case MetaphiInputTypes.EMAIL:
          value = prompt('Please enter your email.');
          break;
        case MetaphiInputTypes.VERIFICATION_CODE:
          value = prompt('Please enter authorization code send to your email.');
          break;
        case MetaphiInputTypes.USER_PIN:
        case MetaphiInputTypes.PIN_RECONNECT:
          value = prompt('Please enter your user pin.');
          break;
        case MetaphiInputTypes.TRANSACTION_SIGN:
          value = confirm('Sign this message?');
          break;
      }
    }

    return value
  };

  showUserError = (error, inputType) => {
    if (!this._walletUI) {
      this.showUserErrorDefault(error);
    } else {
      this._walletUI.showError(error, inputType);
    }
  };

  showUserErrorDefault = (error) => {
    alert(error.message);
  };

  // Internal. Only exposed, for testing.
  createWallet = (callback) => {
    this._sendEvent({ event: 'createWallet' }, callback);
  };

  /** Private Instances */
  _getInstance = () => {
    return document.getElementById(WALLET_EMBED_ID);
  };

  _getPluginSourceUrl = () => {

  }

  _initCallbackStore = () => {
    window['__METAPHI__'] = {
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
    if (!window['__METAPHI__']) {
      this._initCallbackStore();
    }
    return window['__METAPHI__'].callbacks;
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
    if (method === 'wallet_connected') {
      this._wallet.address = data.address;
    }

    if (method === 'wallet_disconnected') {
      this._wallet = {};
    }
  };

  /** 
   * Get logged-in user from Metaphi Iframe.
   * @returns Promise<LoggedInUser { email: string, autoconnect: boolean }>
   */
  _getLoggedInUser = () => {
    return new Promise((resolve, reject) => {
      this._sendEvent({ event: MetaphiIframe.GET_LOGGED_IN_USER }, ({loggedInUser, err}) => {
        if (err) reject(err)
        resolve(loggedInUser)
      });
    })
  }

  // Event
  _login = async () => {
    let email
    // Case 1. User is already logged-in. 
    // If the user is logged-in, Metaphi will have the emailId
    // and a corresponding jwt. Additionally, if the user-pin is 
    // cached with Metaphi, autoconnect will be set to true.
    // LoggedInUser: { email: string, autoconnect: boolean }
    const loggedInUser = await this._getLoggedInUser()

    if  (loggedInUser) {
      email = loggedInUser.email

      // Case 1a. If user has autoconnect set to true, 
      // login the user automatically
      if (loggedInUser.autoconnect) {
        this._sendLoginEvent(email)
        return
      }

      // Case 1b. If user has autoconnect is set to false, 
      // prompt the user for the pin. And then, autoconnect.
      const userPin = await this.getUserInput(MetaphiInputTypes.PIN_RECONNECT, { email });
      this._sendLoginEvent(email, userPin)
      return
    }

    // Case 2. User is not logged-in.
    email = await this.getUserInput(MetaphiInputTypes.EMAIL);
    this._sendLoginEvent(email)
  };

  _sendLoginEvent = (email, userPin) => {
    // Login event.
    const payload = { email, userPin };
    this._sendEvent({ event: 'login', payload });
  }

  // Event listener
  _handleLogin = (payload) => {
    if (payload.err) {
      console.log(`Error: ${payload.err}`);
      return;
    }

    if (payload.verified) {
      // Trigger connect step.
      return this._connect(payload.email, payload.autoconnect);
    }

    // Trigger verification step.
    return this._verify(payload.email);
  };

  // Event
  _verify = async (email) => {
    const verificationCode = await this.getUserInput(MetaphiInputTypes.VERIFICATION_CODE);
    const payload = {
      email,
      verificationCode,
    };
    this._sendEvent({ event: 'verify', payload });
  };

  // Listener
  _handleVerify = (payload) => {
    if (payload.err) {
      this.showUserError({ message: payload.err }, 'verificationcode');
      return;
    }

    if (!payload.verified) {
      this.showUserError(
        {
          message: 'Incorrect verification code.',
        },
        'verificationcode',
      );
      return;
    }

    // verifying.
    if (!payload.err && payload.verified) {
      this._connect(payload.email);
    }
  };

  // Event.
  _connect = async (email, autoconnect) => {
    let userPin
    if (!autoconnect) {
      userPin = await this.getUserInput(MetaphiInputTypes.USER_PIN);
    }
    
    this._sendConnectEvent(email, userPin)
  };

  // Send connect event.
  _sendConnectEvent = async (email, userPin) => {
    const payload = { email, userPin };
    this._sendEvent({ event: 'connect', payload });
    this._walletUI.updateState(MetaphiInputTypes.PROCESSING);
  }

  // Listener.
  _handleConnect = (payload) => {
    this._wallet.address = payload.address;
    if (payload.connected) {
      this._walletUI.updateState(MetaphiInputTypes.SUCCESS, {
        address: payload.address,
        dApp: this._accountConfig.dApp,
      });
    } else {
      this.showUserError({ message: 'Error connecting wallet.' });
    }
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
    if (typeof callbackFn === 'function') callbackFn(payload);
    else if (Array.isArray(callbackFn)) {
      callbackFn.forEach((fn) => {
        fn(payload);
      });
      // Remove all, expect the first natives function.
      callbackFn.splice(1);
    }

    // Delete non-internal callbacks.
    const isInternalCallback = callbackId === '_METAPHI_INTERNAL_CALLBACK_';
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
    const targetDomain = this._metaphiBaseDomain
    frame.contentWindow.postMessage(request, targetDomain);
  };

  // Handle message.
  _receiveMessage = (event) => {
    if (event.origin.startsWith(this._metaphiBaseDomain)) {
      this._executeCallback(event.data.callbackId, event.data.payload);
    }
  };

  _getIframeSource = () => {
    const rpc = this._networkConfig.rpcUrl;
    const apiKey = this._accountConfig.apiKey;
    const clientId = this._accountConfig.clientId;
    const source = this._accountConfig.domain;
    const src = `${this._metaphiBaseDomain}/wallet/plugin?clientId=${clientId}&apiKey=${apiKey}&rpc=${rpc}&source=${source}`;
    return src;
  };

  _setupProvider = () => {
    const { rpcUrl, name, chainId } = this._networkConfig
    this._provider = new MetaphiJsonRpcProvider(rpcUrl, { name, chainId }, this)

    // web3 convention.
    if (global.window) {
      global.window.ethereum = this._provider;
    }
  }
}

if (global.window) {
  global.window.WalletPlugin = WalletPlugin;
  console.log('Metaphi is loaded.', !!global.window.WalletPlugin);
}

export default WalletPlugin;
