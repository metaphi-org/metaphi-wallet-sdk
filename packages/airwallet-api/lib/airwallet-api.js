/**
 * Metaphi Airwallet API.
 *
 * Use this library to integrate the Metaphi Airwallet into your dApp.
 * This library allows you to connect to Metaphi Wallet APIs, to recover or create new wallets.
 * The KMS systems allows users to create wallets locally and backup encrypted shares
 * to Metaphi and the dApp.
 *
 * To learn more about the KMS architecture, visit: https://docs.metaphi.xyz/kms-whitepaper.
 *
 */

// Device
import axios from "axios";
import store from "store";
import expirePlugin from "store/plugins/expire";
import Cookies from "js-cookie";
// Cryptography
import sss from "shamirs-secret-sharing";
import crypto from "crypto";
// Wallets & Transactions
import Web3 from "web3";
import EthereumWallet from "ethereumjs-wallet";
import Common, { Chain } from "@ethereumjs/common";
import { Transaction } from "@ethereumjs/tx";
import { ecsign, hashPersonalMessage, toBuffer } from "ethereumjs-util";
import { concatSig } from "./utils";
// Providers & Polygon
import HDWalletProvider from "@truffle/hdwallet-provider";
import { PlasmaClient } from "@maticnetwork/maticjs-plasma";
import { use } from "@maticnetwork/maticjs";
import { Web3ClientPlugin } from "@maticnetwork/maticjs-web3";

// Initialization
const common = new Common({ chain: Chain.Mainnet });
store.addPlugin(expirePlugin);

console.log("Loaded Metaphi Wallet Api.");

use(Web3ClientPlugin);

const METAPHI_LOCAL_SHARE_PREFIX = "metaphi-key-share-";

class MetaphiWalletApi {
  /* Static properties */
  // Environment
  _environment = "development";
  // Endpoint for wallets.
  _METAPHI_WALLET_API = "https://api-staging.metaphi.xyz/v1/wallets";
  // Endpoint for wallet verification.
  _METAPHI_WALLET_VERIFY_API =
    "https://api-staging.metaphi.xyz/v1/wallets/verify";
  // Endpoint that exposes Metaphi Secret API.
  _METAPHI_WALLET_SECRET_API =
    "https://api-staging.metaphi.xyz/v1/wallets/secret";
  // Endpoint that exposes the dApp Secret API.
  _DAPP_WALLET_SECRET_API = null;
  // Local share prefix.

  // ClientId of the dApp.
  _clientId = null;
  // API key of the dApp.
  _clientApiKey = null;

  /** Wallet Properties */
  // Wallet Public Address
  _publicAddress = null;
  // Wallet Private Key
  _privateKey = null;

  /** Network Properties */
  // Rpc
  _rpc = null;
  // Chain Id
  _chainId = 0;
  // Wallet Provider.
  _provider = null;
  // Web3 Provider
  _web3Provider = null;
  // Plasma Client, for Polygon
  _plasmaClient = null;

  // Additional features.
  _logger = null;

  constructor(options) {
    const { accountConfig, networkConfig, custom } = options;

    // Throw error, when accountConfig is missing.
    if (!accountConfig || !accountConfig.clientId || !accountConfig.apiKey) {
      throw new Error("Error initializing wallet: Missing clientId or apiKey");
    }

    if (!networkConfig || !networkConfig.rpcUrl) {
      throw new Error("Error: Missing RPC");
    }

    // Account Config.
    this._clientId = accountConfig.clientId;
    this._clientApiKey = accountConfig.apiKey;
    this._DAPP_WALLET_SECRET_API =
      "https://api-staging.metaphi.xyz/v1/dapp/secret"; // TODO: Should be initialized by dApp.
    this._environment = accountConfig.env || "development";

    // RPC
    this._rpc = networkConfig.rpcUrl;

    // Chain Id
    this._chainId = networkConfig.chainId;

    // Custom functions.
    if (custom?.logger) {
      this._logger = custom.logger;
    } else {
      this._logger = function () {
        console.log(...arguments);
      };
    }

    // User Id
    this._userId = null;
  }

  /* Public methods */
  // Login Metaphi wallet
  login = async (userId) => {
    this._logger(`Logging in: ${userId}.`);

    let response = { verified: false };

    // Persist user id.
    this._userId = userId;

    // Check if logged-in user. Skip verification, if true.
    let address;
    let jwt = this._getAuthenticatedJwt();
    if (jwt) {
      try {
        // TODO: When wallet is overriden, this will lead to stale results.
        const userDetails = await this._getUserDetails(jwt);
        if (userDetails.username === this._userId) {
          address = userDetails.address;
        } else {
          jwt = null;
          this._resetAuthenticatedJwt();
        }
      } catch (ex) {
        jwt = null;
        // Reset expired jwt.
        this._resetAuthenticatedJwt();
      }
    }

    // Get wallet.
    if (!jwt) {
      const response = await this._retrieveWallet(userId);
      jwt = response.jwt;
      address = response.address;
    }

    // Check if logged-in user. Skip verification, if true.
    response.verified = !!jwt;

    // Set public address.
    this._publicAddress = address;

    // Extract public address.
    this._logger(`Wallet Authenticated: ${this._publicAddress}`);

    return response;
  };

  // Check if user is logged-in.
  isUserLoggedIn = () => {
    return !!this._userId;
  };

  getLoggedInUsers = () => {
    const allCookies = Cookies.get();
    const cookieNames = Object.keys(allCookies);
    const emails = [];
    cookieNames.forEach((key) => {
      const groups = key.match(/(metaphi-jwt-)(\S*)/);
      if (groups && groups[2]) {
        emails.push(groups[2]);
      }
    });
    return emails;
  };

  // Wallet Provider.
  getProvider = () => {
    return this._web3Provider;
  };

  // Get public address of wallet.
  getAddress = () => {
    this._logger(`Connected Wallet Address: ${this._publicAddress}`);
    return this._publicAddress;
  };

  // Create a new wallet for the user. Use with caution.
  createNewWallet = async (userPin) => {
    // If the public address does not exist or minimum shares are not met
    //    a. Generate the wallet key and address locally.
    //    b. Break it up into three parts, encrypt using symmetric key.
    //    c. Store one piece locally, store one piece on the dApp and the final
    //       piece on Metaphi.
    const userCreds = await this._getUserCreds(this._userId, userPin, true);
    const wallet = await this._createNewWallet(userCreds);
    this._logger(`Created New Wallet: ${wallet.address}`, "green");

    // Setup wallet.
    this._setupWallet(wallet);
  };

  // Transfer.
  transfer = async (toAddress, valueInWei) => {
    const plasmaClient = this._plasmaClient;
    // Source: https://maticnetwork.github.io/matic.js/docs/plasma/erc20/transfer/
    // initialize token with null means use MATIC tokens
    const erc20Token = plasmaClient.erc20(null);
    const result = await erc20Token.transfer(valueInWei, toAddress);
    const txHash = await result.getTransactionHash();
    const txReceipt = await result.getReceipt();
    return txReceipt;
  };

  // Sign a transaction.
  signTransaction = (transaction) => {
    if (!this._privateKey) {
      this._logger("Error signing transaction: Private key missing", "red");
    }

    try {
      const txParams = {
        ...transaction,
      };

      const tx = Transaction.fromTxData(txParams, { common });
      const privateKey = new Buffer.from(this._privateKey.substr(2), "hex");
      const signedTx = tx.sign(privateKey);

      // const serializedTx = signedTx.serialize();
      return signedTx;
    } catch (ex) {
      this._logger(`Error signing transaction: ${ex.toString()}`);
    }
  };

  // Personal Sign.
  // Inspired from: https://github.com/MetaMask/eth-sig-util/blob/8f5a90bed37e6891fe4e9ab98a8cd4f62188d5c4/src/personal-sign.ts
  personalSign = (messageString) => {
    if (!messageString) {
      throw new Error("Missing parameter: messageString");
    }

    if (!this._privateKey) {
      throw new Error("Missing private key.");
    }

    const message = Buffer.from(messageString);
    const msgHash = hashPersonalMessage(message);
    return this._personalSign(msgHash, this._privateKey);
  };

  // Sign a message
  signMessage = () => {
    // TODO.
  };

  // Connect wallet.
  connect = async (userPin) => {
    // Connect wallet.
    this._logger("Connecting wallet.");
    await this._connectWallet(userPin);
    if (this._publicAddress && this._privateKey) {
      this._logger("Wallet reconstruction successful. Wallet connected.");
    } else {
      this._logger(`Error connecting wallet.`);
      throw new Error("Wallet Reconstruction Unsuccessful.");
    }
  };

  // Disconnect
  disconnect = () => {
    this._reset();
  };

  /* Factory methods */
  // Recovers a wallet using the secret shares stored in Metaphi and the dApp.
  recoverOrCreateWallet = async (userCreds) => {
    // Public Address & Email of the user
    const { publicAddress, userEmail } = userCreds;

    let wallet = { address: publicAddress, privateKey: null };

    // If the wallet secret and public address exist:
    //    a. Retrieve 2/3 shares from local device, dApp and/or Metaphi
    //    b. Decrypt it using userPin
    //    c. Persist reconstructed privateKey in Wallet scope
    if (publicAddress !== null && userEmail != null) {
      this._logger(`Attempting to reconstruct key for ${userEmail}`);

      /**
       * List of shares, to reconstruct the secret key
       * These shares will be retrieved in the following order
       *    1. Device Share
       *    2. dApp Share
       *    3. Metaphi Share
       *
       *  We need 2/3 shares to reconstruct the wallet. Incase, this criteria is not met,
       *  we will recreate the wallet and shared secrets
       */
      let shares = [];

      // Retrieve share from local device.
      let localShare = this._getShareFromDevice(userEmail);
      if (localShare) {
        this._logger(`Retrieved share from device.`);
        shares.push(localShare);
      } else {
        this._logger(`Share on device: Not found.`);
      }

      // Retrieve share from Metaphi.
      let metaphiShare = await this._getShareFromMetaphi(userCreds);
      if (metaphiShare) {
        shares.push(metaphiShare);
      }

      // Retrieve backup dApp share.
      // This happens when either the local share or dApp share is missing
      if (shares.length < 2) {
        let dAppShare = await this._getShareFromdApp(userCreds);
        if (dAppShare) {
          this._logger(`Retrieved share from dApp.`);
          shares.push(dAppShare);
        }
      }

      // Required number of shares exist.
      // Reconstruct private key.
      if (shares.length == 2) {
        const symmetric_key = this._generateSymmetricKey(userCreds);
        const privateKey = this._reconstructWalletFromSecret(
          symmetric_key,
          shares[0],
          shares[1]
        );
        wallet.privateKey = privateKey;
      } else {
        this._logger(
          "Error fetching minimum number of shares. Please contact Metaphi or create a new wallet.",
          "red"
        );
        // TODO: Give the user an option to recreate wallet.
      }
    } else {
      this._logger("Error recovering wallet. Doesnot exist");
    }

    // Return reconstructed wallet.
    return wallet;
  };

  // Default function to retrieve user credential.
  // Override, with dApp functionality.
  defaultUserPinFunction = async () => {
    const userPin = prompt("Please enter your secret pin", "1234");
    return userPin;
  };

  /* Private methods */
  _personalSign = (msgHash, privateKey) => {
    const sig = ecsign(
      msgHash,
      new Buffer.from(this._privateKey.substr(2), "hex")
    );
    const serialized = concatSig(toBuffer(sig.v), sig.r, sig.s);
    return serialized;
  };

  _reset = async () => {
    /** Empty Caches. */
    // Authentication
    this._resetAuthenticatedJwt();

    /** Reset statics. */
    // Wallet Public Address
    this._publicAddress = null;
    // Wallet Private Key
    this._privateKey = null;
    // User ID
    this._userId = null;

    this._logger("Wallet disconnected.");
  };

  _triggerManualAuthentication = async (userId) => {
    this._logger("User is not logged in. Triggering authentication flow");

    // Get wallet.
    let jwt = await this._retrieveWallet(userId);

    // Verification Flow.
    // This is triggered when there is no oauth flow setup for this dApp.
    if (!jwt) {
      this._logger("Triggering verification flow.");
      var verificationCode = prompt("Enter your verification code", "123456");
      this._logger(`Entered Verification Code: ${verificationCode}.`);

      let { address, verified, jwt, wallet_id } =
        await this._verifyUserVerificationCode(userId, verificationCode);

      // Set public address.
      this._publicAddress = address;

      // Set jwt authorization
      this._setAuthenticatedJwt(jwt);

      return verified;
    }

    // OAuth one-click setup.
    // TODO: Get public address from jwt and set it.
    // TODO: Cache jwt.

    // Authenticated.
    return 1;
  };

  // Get/Create new wallet.
  _retrieveWallet = async (userId) => {
    let myHeaders = new Headers();
    myHeaders.append("X-Metaphi-Api-Key", this._clientApiKey);
    myHeaders.append("x-metaphi-account-id", this._clientId);
    myHeaders.append("Content-Type", "application/json");

    // Wallet Authentication Flow.
    // TODO: Switch to axios.
    try {
      let raw = JSON.stringify({
        email: userId,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const URL = this._METAPHI_WALLET_API;
      const response = await fetch(URL, requestOptions);
      const wallet = await response.json();

      // Set userId
      this._userId = userId;

      this._logger("Retrieved wallet.");
      return { jwt: wallet.jwt, address: wallet.address };
    } catch (ex) {
      this._logger("Error recovering wallet.", ex);
    }
  };

  // Authenticate user via verification code.
  _verifyUserVerificationCode = async (userId, verificationCode) => {
    let myHeaders = new Headers();
    myHeaders.append("X-Metaphi-Api-Key", this._clientApiKey);
    myHeaders.append("x-metaphi-account-id", this._clientId);
    myHeaders.append("Content-Type", "application/json");

    try {
      // Verify code.
      // TODO: Switch to axios.
      const URL = this._METAPHI_WALLET_VERIFY_API;
      let raw = JSON.stringify({
        email: userId,
        verification_code: verificationCode,
      });
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const response = await fetch(URL, requestOptions);
      const wallet = await response.json();
      const {
        jwt,
        wallet: { address, wallet_id },
      } = wallet;

      // Set jwt.
      this._setAuthenticatedJwt(jwt);

      // Set public address.
      this._publicAddress = address;

      return { verified: true, jwt, address, wallet_id };
    } catch (ex) {
      this._logger(`Error verifying wallet.`);
    }

    return { verified: false };
  };

  // Connect Metaphi Wallet
  _connectWallet = async (userPin) => {
    const userId = this._userId;
    const userCreds = await this._getUserCreds(userId, userPin);
    const wallet = await this.recoverOrCreateWallet(userCreds);

    // Setup wallet.
    this._setupWallet(wallet);
  };

  _getUserCreds = async (userId, userPin, isNewWallet) => {
    if (!userPin) {
      throw new Error("User pin unknown.");
    }
    // Get user pin.
    // Prompt the user for a pin and generate a symmetric key.
    // This should be protected using faceid, webauthn, etc.
    // Key must be 32 bytes for aes256.
    this._logger("Retrieving user credential.");

    // Retrieve reconstructed wallet.
    this._logger("Reconstructing wallet.");
    const authorizedJwt = this._getAuthenticatedJwt();
    const userCreds = {
      userPin,
      userEmail: userId,
      authorizedJwt: authorizedJwt,
      publicAddress: isNewWallet ? null : this._publicAddress,
    };

    return userCreds;
  };

  _setupWallet = async (wallet) => {
    // If the wallet address has changed, update user
    if (wallet.address !== this._publicAddress) {
      // TODO: Handle this case, NS to comment
      this._publicAddress = wallet.address;
      this._logger(
        `Public Address changed from ${this._publicAddress} to ${wallet.address}`,
        "red"
      );
      console.warn(
        `Public Address changed from ${this._publicAddress} to ${wallet.address}`
      );
    }

    // Persist public key.
    this._publicAddress = wallet.address;

    // Persist private key.
    this._privateKey = wallet.privateKey;

    // Setup wallet provider.
    this._setupWalletProvider();

    // Setup plasmaClient, for Polygon
    this._setupPlasmaClient();
  };

  _setupWalletProvider = () => {
    const privateKey = this._privateKey;
    const rpc = this._rpc;

    if (!privateKey || !rpc) {
      throw new Error("Invalid private key or rpc");
    }

    // Assign.
    this._provider = new HDWalletProvider(privateKey, rpc);

    // Assign.
    // Source: www.reddit.com/r/ethdev/comments/8d70mz/using_infura_with_web3_html_providerengine/
    this._web3Provider = new Web3(this._provider);
    window.metaphi = this._web3Provider;
  };

  _setupPlasmaClient = async () => {
    const network = "testnet"; // 'testnet' or 'mainnet'
    const version = "mumbai"; // 'mumbai' or 'v1'
    const provider = this._provider;
    const publicAddress = this._publicAddress;

    // Setup Plasma Client.
    const plasmaClient = new PlasmaClient();
    await plasmaClient.init({
      network,
      version,
      parent: {
        provider: this._provider,
        defaultConfig: {
          from: publicAddress,
        },
      },
      child: {
        provider: provider,
        defaultConfig: {
          from: publicAddress,
        },
      },
    });

    // Assign.
    this._plasmaClient = plasmaClient;
  };

  _getAuthenticatedJwtCookieName = () => {
    if (!this._userId) {
      throw new Error("User not found.");
    }

    return `metaphi-jwt-${this._userId}`;
  };

  _getAuthenticatedJwt = () => {
    try {
      const keyName = this._getAuthenticatedJwtCookieName();
      return store.get(keyName);
    } catch (ex) {
      return null;
    }
  };

  _setAuthenticatedJwt = (jwt) => {
    const keyName = this._getAuthenticatedJwtCookieName();
    const expires = new Date().getTime() + 60 * 60000; // Expires in 1 hour.
    store.set(keyName, jwt, expires);
  };

  _resetAuthenticatedJwt = () => {
    const keyName = this._getAuthenticatedJwtCookieName();
    store.remove(keyName);
  };

  // Get user details from jwt.
  _getUserDetails = async (jwt) => {
    this._logger(`Fetch wallet details: ${this._METAPHI_WALLET_API}`);
    const response = await axios.get(this._METAPHI_WALLET_API, {
      api_key: { api_key: this._clientApiKey },
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
        "X-Metaphi-Api-Key": this._clientApiKey,
        "x-metaphi-account-id": this._clientId,
      },
    });
    return response.data.user;
  };

  // Get share from device.
  _getShareFromDevice = (userEmail) => {
    let share = store.get(`${METAPHI_LOCAL_SHARE_PREFIX}-${userEmail}`);
    return share;
  };

  // Retrive share from dApp.
  _getShareFromdApp = async (userCreds) => {
    this._logger(`Fetch share from dApp: ${this._DAPP_WALLET_SECRET_API}`);
    try {
      const response = await axios.get(this._DAPP_WALLET_SECRET_API, {
        api_key: { api_key: this._clientApiKey },
        params: {
          wallet_address: this._publicAddress,
        },
        headers: {
          Authorization: `Bearer ${userCreds.authorizedJwt}`,
          "Content-Type": "application/json",
          "X-Metaphi-Api-Key": this._clientApiKey,
          "x-metaphi-account-id": this._clientId,
        },
      });
      if (response.data.key_share.length)
        this._logger(`Fetched share from dApp.`);
      else this._logger(`Fetched empty share from dApp.`, "red");
      return response.data.key_share;
    } catch (ex) {
      this._logger(`Error fetching share from dApp ${ex.toString()}`);
    }
  };

  // Retrieve share from Metaphi.
  _getShareFromMetaphi = async (userCreds) => {
    this._logger(
      `Fetch share from Metaphi: ${this._METAPHI_WALLET_SECRET_API}`
    );

    try {
      const response = await axios.get(this._METAPHI_WALLET_SECRET_API, {
        headers: {
          Authorization: `Bearer ${userCreds.authorizedJwt}`,
          "Content-Type": "application/json",
          "X-Metaphi-Api-Key": this._clientApiKey,
          "x-metaphi-account-id": this._clientId,
        },
      });
      if (response.data.key_share.length)
        this._logger(`Fetched share from Metaphi.`);
      else this._logger(`Fetched empty share from Metaphi.`, "red");
      return response.data.key_share;
    } catch (ex) {
      this._logger(`Error fetching share from Metaphi: ${ex.toString()}`);
    }
  };

  // Set share on device.
  _uploadToDevice = (userCreds, share) => {
    const key = `${METAPHI_LOCAL_SHARE_PREFIX}-${userCreds.userEmail}`;
    store.set(key, share);
    this._logger(`Saved local share on device.`);
  };

  // Uploads share to Metaphi.
  _uploadToMetaphi = async (userCreds, address, share) => {
    try {
      this._logger(`Uploading share to Metaphi: ${this._METAPHI_WALLET_API}`);
      var data = {
        address: address,
        key_share: share,
      };

      var config = {
        method: "patch",
        url: this._METAPHI_WALLET_API,
        headers: {
          Authorization: `Bearer ${userCreds.authorizedJwt}`,
          "Content-Type": "application/json",
          "X-Metaphi-Api-Key": this._clientApiKey,
          "x-metaphi-account-id": this._clientId,
        },
        data: data,
      };
      const response = await axios(config);
      console.log("Wallet Patched: ", response.data);
      if (!response.data.jwt) {
        throw new Error("Error uploading share to Metaphi");
      }
      this._logger(`Successfully uploaded share to Metaphi`);
      this._setAuthenticatedJwt(response.data.jwt);
    } catch (ex) {
      this._logger(`Error uploading share to Metaphi: ${ex.toString()}`);
      throw ex;
    }
  };

  // Uploads share to dApp.
  _uploadTodApp = async (userCreds, address, share) => {
    // TODO: We assume for now that the dApp access to their
    // secret share contract is via Metaphi. We will also support
    // the dApps hosting their own contract gateway in the future.
    // This is why for now, we pass in the newWalletJwt.
    try {
      this._logger(`Uploading share to dApp: ${this._DAPP_WALLET_SECRET_API}`);
      const data = {
        key_share: share,
        wallet_address: address,
      };
      const config = {
        url: this._DAPP_WALLET_SECRET_API,
        method: "post",
        headers: {
          Authorization: `Bearer ${userCreds.authorizedJwt}`,
          "Content-Type": "application/json",
          "X-Metaphi-Api-Key": this._clientApiKey,
          "x-metaphi-account-id": this._clientId,
        },
        data,
      };
      const response = await axios(config);
      if (!response.data.success) {
        throw new Error("Error uploading share to dApp");
      }
    } catch (ex) {
      this._logger(`Error uploading share to dApp: ${ex.toString()}`);
      throw ex;
    }
  };

  // Generates the symmetric key from user credentials.
  _generateSymmetricKey = (userCreds) => {
    const seed = userCreds.userEmail + ":" + userCreds.userPin;
    // Prompt the user for a pin and generate a symmetric key.
    // This should be protected using faceid, webauthn, etc.
    // Key must be 32 bytes for aes256.
    return Buffer.from(
      crypto.createHash("sha256").update(seed).digest("base64"),
      "base64"
    );
  };

  // Encrypt using an AES256 cipher.
  _aes256_encrypt = (value, key) => {
    var ivlength = 16; // AES blocksize
    var iv = crypto.randomBytes(ivlength);
    var cipher = crypto.createCipheriv("aes256", key, iv);
    var encrypted = cipher.update(value, "base64", "base64");
    encrypted += cipher.final("base64");
    const final = iv.toString("base64") + "::" + encrypted;
    return final;
  };

  // Decrypts using an AES256 cipher.
  _aes256_decrypt = (ciphertext, key) => {
    var components = ciphertext.split("::");
    var iv_from_ciphertext = Buffer.from(components.shift(), "base64");
    try {
      var decipher = crypto.createDecipheriv("aes256", key, iv_from_ciphertext);
      var deciphered = decipher.update(
        components.join("::"),
        "base64",
        "base64"
      );
      deciphered += decipher.final("base64");
      return deciphered;
    } catch (err) {
      this._logger("Error: ", err);
    }
  };

  // Creates a new wallet.
  _createNewWallet = async (userCreds) => {
    // Generate a wallet
    const EthWallet = EthereumWallet.generate();
    const address = EthWallet.getAddressString();
    const privateKey = EthWallet.getPrivateKeyString();

    // Create secrets from it.
    const shares = sss.split(privateKey, { shares: 3, threshold: 2 });

    // Generate symmetric key
    var symmetric_key = this._generateSymmetricKey(userCreds);
    this._logger(`Generated Symmetric Key`);

    // Encrypt the shares with the generated symmetric key.
    const encrypted_shares = shares.map((share) =>
      this._aes256_encrypt(share.toString("base64"), symmetric_key)
    );
    this._logger(
      `Generated Encrypted shares: ${encrypted_shares.length} \n${encrypted_shares[0]}\n\n${encrypted_shares[1]}\n\n${encrypted_shares[2]}}`
    );

    // Upload shares.
    let uploadedShareCount = 0;

    try {
      // Pass on a share to Metaphi.
      await this._uploadToMetaphi(userCreds, address, encrypted_shares[2]);
      uploadedShareCount++;

      // Pass on a share to the dApp.
      await this._uploadTodApp(userCreds, address, encrypted_shares[1]);
      uploadedShareCount++;
    } catch (ex) {
      // Add log.
    }

    // Only store in local,
    // when other shares are successfully uploaded
    if (uploadedShareCount === 2) {
      // Store a share locally.
      this._uploadToDevice(userCreds, encrypted_shares[0]);
    } else {
      throw new Error("Error uploading shares. Please try again.", "red");
    }

    // Wallet object.
    return {
      address,
      privateKey,
    };
  };

  // Reconstructs the secret key from the two shares.
  _reconstructWalletFromSecret = (symmetric_key, keyShare1, keyShare2) => {
    this._logger(
      `Reconstructing secret:\n\nSymmetric Key: ${symmetric_key}\n\nShare1: ${keyShare1} \n\nShare 2: ${keyShare2}`
    );

    // Decrypt shares.
    const decrypted_shares = [keyShare1, keyShare2].map((share) => {
      return this._aes256_decrypt(share.toString("base64"), symmetric_key);
    });

    // Reconstruct the private key and return the wallet.
    const privateKey = sss
      .combine([
        Buffer.from(decrypted_shares[0], "base64"),
        Buffer.from(decrypted_shares[1], "base64"),
      ])
      .toString();

    this._logger(`Succesfully reconstructed secret.`);
    return privateKey;
  };
}

export default MetaphiWalletApi;
