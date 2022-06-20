/* tslint:disable */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Connector } from '@web3-react/types';
import { WalletPlugin } from '@metaphi/airwallet-api';
class MetaphiConnector extends Connector {
    /**
     * @param connectEagerly - A flag indicating whether connection should be initiated when the class is constructed.
     * @param options - Options to pass to `@metamask/detect-provider`
     */
    constructor(actions, connectEagerly = false, options) {
        super(actions);
        if (connectEagerly && this.serverSide) {
            throw new Error('connectEagerly = true is invalid for SSR, instead use the connectEagerly method in a useEffect');
        }
        // console.log("Metaphi Wallet Configuration")
        this.options = options;
        if (connectEagerly)
            void this.connectEagerly();
    }
    get serverSide() {
        return typeof window === 'undefined';
    }
    addPlugin() {
        return __awaiter(this, void 0, void 0, function* () {
            const loadPlugin = !this.serverSide && !this.mWalletInstance;
            if (!loadPlugin)
                return Promise.reject(false);
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                console.log('Adding metaphi plugin.');
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const opts = Object.assign(Object.assign({}, this.options), { custom: { userInputMethod: window.MetaphiModal } });
                this.mWalletInstance = new WalletPlugin(opts);
                yield ((_a = this.mWalletInstance) === null || _a === void 0 ? void 0 : _a.init());
                // Add Instance to window.
                window.mWallet = this.mWalletInstance;
                try {
                    function checkIframeLoaded() {
                        var _a;
                        // Get a handle to the iframe element
                        const iframe = document.getElementById('mWalletPlugin');
                        if (!iframe)
                            return false;
                        // @ts-ignore
                        const iframeDoc = iframe.contentDocument || ((_a = iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document);
                        // Check if loading is complete
                        if (iframeDoc.readyState == 'complete') {
                            // @ts-ignore
                            iframe.contentWindow.onload = function () {
                                console.log('Metaphi Iframe loaded');
                            };
                            // The loading is complete, call the function we want executed once the iframe is loaded
                            return resolve(true);
                            ;
                        }
                    }
                    checkIframeLoaded();
                    // If we are here, it is not loaded. Set things up so we check   the status again in 100 milliseconds
                    window.setTimeout(checkIframeLoaded, 100);
                }
                catch (ex) {
                    console.log('Error checking iframe', ex);
                    resolve(true);
                }
            }));
        });
    }
    isomorphicInitialize() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Isomorphic Initializing.");
            if (this.serverSide)
                return Promise.reject(false);
            // Add iframe and plugin instance.
            yield this.addPlugin();
            if (this.mWalletInstance === undefined)
                return Promise.reject(false);
            return new Promise((resolve, reject) => {
                var _a;
                (_a = this.mWalletInstance) === null || _a === void 0 ? void 0 : _a.connect((msg) => __awaiter(this, void 0, void 0, function* () {
                    console.log('Connector: Metaphi Wallet Connected.');
                    if (!this.mWalletInstance) {
                        return reject();
                    }
                    if (!msg.connected) {
                        return reject();
                    }
                    this.provider = this.mWalletInstance.getProvider();
                    this.customProvider = this.provider;
                    resolve();
                }));
            });
        });
    }
    /** {@inheritdoc Connector.connectEagerly} */
    connectEagerly() {
        return __awaiter(this, void 0, void 0, function* () {
            const cancelActivation = this.actions.startActivation();
            yield this.isomorphicInitialize();
            if (!this.provider || !this.mWalletInstance)
                return cancelActivation();
            const chainId = this.mWalletInstance.getChainId();
            const accounts = [this.mWalletInstance.getAddress()];
            return this.actions.update({ accounts, chainId });
        });
    }
    /**
     * Initiates a connection.
     *
     * @param desiredChainIdOrChainParameters - If defined, indicates the desired chain to connect to. If the user is
     * already connected to this chain, no additional steps will be taken. Otherwise, the user will be prompted to switch
     * to the chain, if one of two conditions is met: either they already have it added in their extension, or the
     * argument is of type AddEthereumChainParameter, in which case the user will be prompted to add the chain with the
     * specified parameters first, before being prompted to switch.
     */
    activate(desiredChainIdOrChainParameters) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let cancelActivation;
            if (!((_b = (_a = this.provider) === null || _a === void 0 ? void 0 : _a.isConnected) === null || _b === void 0 ? void 0 : _b.call(_a))) {
                cancelActivation = this.actions.startActivation();
            }
            yield this.isomorphicInitialize();
            if (!this.provider || !this.mWalletInstance) {
                if (cancelActivation)
                    cancelActivation();
                return;
            }
            const accounts = [this.mWalletInstance.getAddress()];
            const chainId = this.mWalletInstance.getChainId();
            return this.actions.update({ accounts, chainId });
        });
    }
    deactivate(...args) {
        var _a;
        (_a = this.mWalletInstance) === null || _a === void 0 ? void 0 : _a.disconnect();
        this.mWalletInstance = undefined;
        this.options = undefined;
    }
}
export { MetaphiConnector };
