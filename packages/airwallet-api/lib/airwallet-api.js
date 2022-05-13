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
import Cookies from "js-cookie";
// Cryptography
import sss from "shamirs-secret-sharing";
import crypto from "crypto";
// Wallets & Transactions
import EthereumWallet from "ethereumjs-wallet";
import Common, { Chain } from "@ethereumjs/common";
import { Transaction } from "@ethereumjs/tx";
// Initialization
const common = new Common({ chain: Chain.Mainnet });

console.log("Loaded Metaphi Api v0.6-alpha");
class MetaphiWalletApi {
  /* Static properties */
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

  // ClientId of the dApp.
  _clientId = null;
  // API key of the dApp.
  _clientApiKey = null;
  // Wallet Public Address
  _publicAddress = null;
  // Wallet Private Key
  _privateKey = null;

  // Additional features.
  _logger = console.log;
  _userPinFunction = this.defaultUserPinFunction;

  constructor(options) {
    const { accountConfig, custom } = options;

    // Throw error, when accountConfig is missing.
    if (!accountConfig || !accountConfig.clientId || !accountConfig.apiKey) {
      throw new Error("Error initializing wallet: Missing clientId or apiKey");
    }

    // Account Config.
    this._clientId = accountConfig.clientId;
    this._clientApiKey = accountConfig.apiKey;
    this._DAPP_WALLET_SECRET_API =
      "https://api-staging.metaphi.xyz/v1/dapp/secret"; // TODO: Should be initialized by dApp.

    // Custom functions.
    this._logger = custom?.logger || console.log;
    this._userPinFunction =
      custom?.userPinFunction || this.defaultUserPinFunction;

    // User Id
    this._userId = null;
  }

  /* Public methods */
  // Login Metaphi wallet
  login = async (userId) => {
    // Persist user id.
    this._userId = userId;

    this._logger(`Logging in: ${userId}.`);

    // Check if returning user.
    this._logger("Authenticate returning user.");
    let jwt = this._getAuthenticatedJwt();
    if (jwt) {
      const { wallet_id, address } = await this._getUserDetails(jwt);
      this._publicAddress = address;
      this._logger(`User is already logged in: ${address}`);
    } else {
      const response = await this._triggerManualAuthentication(userId);
      if (!response) {
        this._logger("Error authenticating user.", "red");
        return;
      }
    }

    // Extract public address.
    this._logger(`Wallet Authenticated: ${this._publicAddress}`);

    // Connect wallet.
    this._logger("Connecting wallet.");
    try {
      await this._connectWallet(userId);
      if (this._publicAddress && this._privateKey) {
        this._logger("Wallet reconstruction successful. Wallet connected.");
      } else {
        this._logger(`Error connecting wallet.`);
      }
    } catch (ex) {
      this._logger(`Error connecting wallet: ${ex.toString()}`);
    }
  };

  // Get public address of wallet.
  getAddress = () => {
    console.log(this);
    this._logger(`Connected Wallet Address: ${this._publicAddress}`);
    return this._publicAddress;
  };

  createNewWallet = async () => {
    // If the public address does not exist or minimum shares are not met
    //    a. Generate the wallet key and address locally.
    //    b. Break it up into three parts, encrypt using symmetric key.
    //    c. Store one piece locally, store one piece on the dApp and the final
    //       piece on Metaphi.
    const userCreds = await this._getUserCreds(this._userId, true);
    const wallet = await this._createNewWallet(userCreds);
    this._logger(`Created New Wallet: ${wallet.address}`, "green");

    // Setup wallet.
    this._setupWallet(wallet);
  };

  // Sign a message.
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

      const serializedTx = signedTx.serialize();
      return serializedTx;
    } catch (ex) {
      this._logger(`Error signing transaction: ${ex.toString()}`);
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

    let myHeaders = new Headers();
    myHeaders.append("X-Metaphi-Api-Key", this._clientApiKey);
    myHeaders.append("x-metaphi-account-id", this._clientId);
    myHeaders.append("Content-Type", "application/json");

    let jwt, authenticated;

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
      this._logger("Retrieved wallet.");
      jwt = wallet.jwt;
    } catch (ex) {
      this._logger("Error recovering wallet.", "red");
    }

    // Verification Flow.
    // This is triggered when there is no oauth flow setup for this dApp.
    if (!jwt) {
      this._logger("Triggering verification flow.");
      try {
        var verificationCode = prompt("Enter your verification code", "123456");
        this._logger(`Entered Verification Code: ${verificationCode}.`);

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
        jwt = wallet.jwt;
        const { address, wallet_id } = wallet.wallet;

        // Set public address
        this._publicAddress = address;

        // TODO: Cache wallet_id instead.

        authenticated = 1;
      } catch (ex) {
        console.log(ex);
        this._logger(`Error verifying wallet.`);
        return;
      }
    }

    // Set jwt authorization
    this._setAuthenticatedJwt(jwt);

    return authenticated;
  };

  // Connect Metaphi Wallet
  _connectWallet = async (userId) => {
    const userCreds = await this._getUserCreds(userId);
    const wallet = await this.recoverOrCreateWallet(userCreds);

    // Setup wallet.
    this._setupWallet(wallet);
  };

  _getUserCreds = async (userId, isNewWallet) => {
    // Get user pin.
    // Prompt the user for a pin and generate a symmetric key.
    // This should be protected using faceid, webauthn, etc.
    // Key must be 32 bytes for aes256.
    this._logger("Retrieving user credential.");
    const userPin = await this._userPinFunction();

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

  _setupWallet = (wallet) => {
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
  };

  _getAuthenticatedJwt = () => {
    const ID = this._userId;
    const cookieName = `${ID}-jwt`;
    return Cookies.get(cookieName);
  };

  _setAuthenticatedJwt = (jwt) => {
    const ID = this._userId;
    const cookieName = `${ID}-jwt`;
    Cookies.set(cookieName, jwt, { expires: 1, path: "" }); // Expires in 1 day
  };

  _resetAuthenticatedJwt = () => {
    const ID = this._userId;
    const cookieName = `${ID}-jwt`;
    Cookies.remove(cookieName, { path: "" });
  };

  // Get user details from jwt.
  _getUserDetails = async (jwt) => {
    this._logger(`Fetch wallet details: ${this._METAPHI_WALLET_API}`);
    try {
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
    } catch (ex) {
      this._logger(`Error fetching share from dApp ${ex.toString()}`);
    }
  };

  // Get share from device.
  _getShareFromDevice = (userEmail) => {
    let share = store.get(`${userEmail}-key-share`);
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
    const key = `${userCreds.userEmail}-key-share`;
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
      const result = await axios(config);
      this._logger(`Successfully uploaded share to Metaphi`);
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
      this._logger(
        `Uploading local share to dApp: ${this._DAPP_WALLET_SECRET_API}`
      );
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
      if (response.success) this._logger(`Successfully uploaded share to dApp`);
      else this._logger(`Error uploading share to dApp`);
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
      crypto.createHash("sha256").update(seed).digest("hex"),
      "hex"
    );
  };

  // Encrypts using an AES256 cipher.
  // Source: https://stackoverflow.com/questions/59528472/encrypt-decrypt-binary-data-crypto-js
  _aes256_encrypt = (value, key) => {
    var ivlength = 16; // AES blocksize
    var iv = crypto.randomBytes(ivlength);
    var cipher = crypto.createCipheriv("aes256", key, iv);
    var encrypted = cipher.update(value, "binary", "binary");
    encrypted += cipher.final("binary");
    const final = iv.toString("binary") + ":" + encrypted;
    console.log("IV encrypt----", iv, final.split(":"));
    return final;
  };

  // Decrypts using an AES256 cipher.
  _aes256_decrypt = (ciphertext, key) => {
    var components = ciphertext.split(":");
    var iv_from_ciphertext = Buffer.from(components.shift(), "binary");
    console.log("IV decrypt----", iv_from_ciphertext.toString("binary"));
    try {
      var decipher = crypto.createDecipheriv("aes256", key, iv_from_ciphertext);
      var deciphered = decipher.update(
        components.join(":"),
        "binary",
        "binary"
      );
      deciphered += decipher.final("binary");
      return deciphered;
    } catch (err) {
      console.log(err);
      this._logger("Error: ", err);
      console.log("IV: ", iv_from_ciphertext, components);
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
    console.log(shares);

    // Generate symmetric key
    var symmetric_key = this._generateSymmetricKey(userCreds);
    this._logger(`Generated Symmetric Key`);

    // Encrypt the shares with the generated symmetric key.
    const encrypted_shares = shares.map((share) =>
      this._aes256_encrypt(share.toString("binary"), symmetric_key)
    );
    this._logger(
      `Generated Encrypted shares: ${encrypted_shares.length} \n${encrypted_shares[0]}\n\n${encrypted_shares[1]}\n\n${encrypted_shares[2]}}`
    );

    // TODO: Remove later
    const decrypted_shares = encrypted_shares.map((share) => {
      return this._aes256_decrypt(share.toString("binary"), symmetric_key);
    });
    const key = this._reconstructWalletFromSecret(
      symmetric_key,
      decrypted_shares[2],
      decrypted_shares[0]
    );
    console.log("reconstructed key----", key);

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
      return this._aes256_decrypt(share.toString("binary"), symmetric_key);
    });

    // Reconstruct the private key and return the wallet.
    const privateKey = sss
      .combine([
        Buffer.from(decrypted_shares[0], "binary"),
        Buffer.from(decrypted_shares[1], "binary"),
      ])
      .toString();

    this._logger(`Succesfully reconstructed secret.`);
    return privateKey;
  };
}

export default MetaphiWalletApi;
