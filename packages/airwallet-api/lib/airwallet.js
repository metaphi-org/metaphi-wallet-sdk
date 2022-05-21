import MetaphiWalletApi from "./airwallet-api";

console.log("Metaphi Wallet Loaded.");
class MetaphiWallet {
  // walletInstance
  _wallet = null;

  constructor(options) {
    console.log("im here", options);
    this._wallet = new MetaphiWalletApi(options);
  }

  login = this._wallet.login;
  verifyAuthenticationCode = this.wallet._verifyUserVerificationCode;
  transfer = this._wallet.transfer;
  getProvider = this._wallet.getProvider;
  getAddress = this._wallet.getAddress;
  signTransaction = this._wallet.signTransaction;
  personalSign = this._wallet.personalSign;
  connect = this._wallet.connect;
  disconnect = this._wallet.disconnect;
  isUserLoggedIn = this._wallet.isUserLoggedIn;
  getLoggedInUsers = this._wallet.getLoggedInUsers;
  getPrivateKey = () => this._wallet.privateKey;
}

export default MetaphiWallet;
