
const { JsonRpcProvider, JsonRpcSigner } = require('@ethersproject/providers')
const { defineReadOnly } = require("@ethersproject/properties")
const { Eip1193Bridge } = require('@ethersproject/experimental')
const { toUtf8Bytes } = require("@ethersproject/strings")
const { Signer } = require('@ethersproject/abstract-signer')
import { keccak256 } from "@ethersproject/keccak256";
import { serialize } from "@ethersproject/transactions";
import { ethers } from "ethers"

const _constructorGuard = 11;

// Source: https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/json-rpc-provider.ts#L320
class MetaphiJsonSigner extends Signer {
    constructor(constructorGuard, provider, addressOrIndex) {
        super();
        defineReadOnly(this, "provider", provider);
        if (addressOrIndex == null) {
            addressOrIndex = 0;
        }
        if (typeof (addressOrIndex) === "string") {
            defineReadOnly(this, "_address", this.provider.formatter.address(addressOrIndex));
            defineReadOnly(this, "_index", null);
        }
        else if (typeof (addressOrIndex) === "number") {
            defineReadOnly(this, "_index", addressOrIndex);
            defineReadOnly(this, "_address", null);
        }
    } 

    getAddress = async () => {
        return new Promise((resolve, reject) => resolve(this._address))
    }

    signMessage = async (message) => {
        let self = this
        return new Promise((resolve, reject) => {
            self.provider.getWallet().signMessage({ message: message }, ({ sig, err }) => {
                if (sig) resolve(sig)
                if (err) reject(err)
            })
        })
    }

    signTransaction = async (transaction) => {
        const txHash = keccak256(serialize(transaction))

        let self = this
        return new Promise((resolve, reject) => {
            self.provider.getWallet().signMessage({ message: txHash }, ({ sig, err }) => {
                console.log('Signed Transaction: ', sig)
                if (sig) resolve(serialize(transaction, sig))
                if (err) reject(err)
            })
        })
    }

    sendTransaction = async (transaction) => {
        this._checkProvider("sendTransaction");
        const tx = await this.populateTransaction(transaction);
        const txData = { 
            ...tx, 
        }
        const signedTx = await this.signTransaction(txData);
        return await this.provider.sendTransaction(signedTx);
    }
}

class MetaphiJsonRpcProvider extends JsonRpcProvider {
    _mWalletInstance = null

    constructor(url, network, _mWalletInstance) {
        super(url, network)
        this._mWalletInstance = _mWalletInstance
    }

    getSigner(addressOrIndex) {
        return new MetaphiJsonSigner(_constructorGuard, this, addressOrIndex);
    }

    getWallet() {
        return this._mWalletInstance
    }
}

export { MetaphiJsonRpcProvider }