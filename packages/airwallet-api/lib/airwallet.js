import MetaphiWalletApi from "./airwallet-api";

// https://stackoverflow.com/questions/34869352/how-to-declare-private-variables-and-private-methods-in-es6-class

const s_wallet = Symbol();

/**
 * Wrapper class. For wallet.
 *
 *
 */
class MetaphiWallet {
  constructor(options) {
    this[s_wallet] = new MetaphiWalletApi(options);
  }

  /**
   * Logs a user in.
   * @param {String} userId - Email or phone.
   * @returns {Object}
   */
  login = async function (userId) {
    return await this[s_wallet].login(userId);
  };

  /**
   * Verifies a user.
   * @param {String} userId - Email or phone.
   * @param {Number} verificationCode - Authorization Code
   * @returns {Boolean}
   */
  verifyAuthenticationCode = async function (userId, verificationCode) {
    return await this[s_wallet]._verifyUserVerificationCode(
      userId,
      verificationCode
    );
  };

  /**
   * Transfer value to an address.
   * @param {Address} toAddress
   * @param {Number} value - in wei
   * @returns
   */
  transfer = async function (toAddress, value) {
    return await this[s_wallet].transfer(toAddress, value);
  };

  /**
   * Get web3 provider instance.
   * @returns {Provider}
   */
  getProvider = function () {
    return this[s_wallet].getProvider();
  };

  /**
   * Get wallet public address.
   * @returns {Address}
   */
  getAddress = function () {
    return this[s_wallet].getAddress();
  };

  /**
   * Sign a transaction
   * @param {Object} transaction object
   * @returns {String} signature
   */
  signTransaction = function (transaction) {
    return this[s_wallet].signTransaction(transaction);
  };

  /**
   * Sign a message.
   * @param {String} message
   * @returns {String} signed message
   */
  personalSign = function (message) {
    return this[s_wallet].personalSign(message);
  };

  /**
   * Connect wallet.
   * @param {Number} userPin
   * @returns {Boolean}
   */
  connect = async function (userPin) {
    return await this[s_wallet].connect(userPin);
  };

  /**
   * Disconnect wallet.
   * @returns {void}
   */
  disconnect = function () {
    return this[s_wallet].disconnect();
  };

  /**
   * Check if user is already authenticated.
   * @returns {Boolean}
   */
  isUserLoggedIn = function () {
    return this[s_wallet].isUserLoggedIn();
  };

  /**
   * Get list of userIds for logged in users.
   * @returns {Array}
   */
  getLoggedInUsers = function () {
    return this[s_wallet].getLoggedInUsers();
  };

  /**
   * Get private key. Use with caution!
   * @returns {String}
   */
  getPrivateKey = function () {
    return this[s_wallet]._privateKey;
  };
}

/**
 * Exposed proxy.
 *
 */
export default class MetaphiWalletProxy {
  constructor(options) {
    const wallet = new MetaphiWallet(options);
    return new Proxy(wallet, {
      get(oTarget, sKey) {
        return oTarget[sKey] || oTarget.getItem(sKey) || undefined;
      },
    });
  }
}
