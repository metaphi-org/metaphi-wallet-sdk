
const { JsonRpcProvider, JsonRpcSigner } = require('@ethersproject/providers')
const { defineReadOnly } = require("@ethersproject/properties")
const { Eip1193Bridge } = require('@ethersproject/experimental')
const { toUtf8Bytes } = require("@ethersproject/strings")
const { Signer } = require('@ethersproject/abstract-signer')

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

    signMessage = async (message) => {
        let self = this
        return new Promise((resolve, reject) => {
            self.provider.getWallet().signMessage({ message: message }, ({ sig, err }) => {
                if (sig) resolve(sig)
                if (err) reject(err)
            })
        })
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