import type { Actions, AddEthereumChainParameter, Provider } from '@web3-react/types';
import { Connector } from '@web3-react/types';
declare type MetaphiWallet = {
    connect: (callback: (msg: object) => void) => void;
    init: () => void;
    disconnect: () => void;
    getAddress: () => string;
    signMessage: (payload: {
        message: string;
    }, callback: (sig: {
        sig: string;
        err?: string;
    }) => void) => void;
    signTransation: (payload: {
        message: string;
    }, callback: (sig: object) => void) => void;
    getProvider: () => Provider;
    getChainId: () => number;
};
declare type MetaphiProvider = Provider & {
    isMetaphi?: boolean;
    isConnected?: () => boolean;
    providers?: MetaphiProvider[];
    signMessage: (message: string) => Promise<string>;
};
declare type MetaphAccountConfig = {
    clientId: string;
    apiKey: string;
    domain: string;
    dApp?: string;
};
declare type MetaphiNetworkConfig = {
    rpcUrl: string;
};
declare type MetaphiCustomConfig = {
    userInputMethod: any;
};
declare type MetaphiConfigOptions = {
    accountConfig: MetaphAccountConfig;
    networkConfig: MetaphiNetworkConfig;
    custom: MetaphiCustomConfig;
};
declare global {
    interface Window {
        MetaphiModal: any;
        mWallet: MetaphiWallet;
    }
}
declare module "@metaphi/airwallet-api";
declare class MetaphiConnector extends Connector {
    /** {@inheritdoc Connector.provider} */
    provider: MetaphiProvider | undefined;
    private options;
    private mWalletInstance;
    /**
     * @param connectEagerly - A flag indicating whether connection should be initiated when the class is constructed.
     * @param options - Options to pass to `@metamask/detect-provider`
     */
    constructor(actions: Actions, connectEagerly: boolean | undefined, options: MetaphiConfigOptions);
    private isomorphicInitialize;
    /** {@inheritdoc Connector.connectEagerly} */
    connectEagerly(): Promise<void>;
    /**
     * Initiates a connection.
     *
     * @param desiredChainIdOrChainParameters - If defined, indicates the desired chain to connect to. If the user is
     * already connected to this chain, no additional steps will be taken. Otherwise, the user will be prompted to switch
     * to the chain, if one of two conditions is met: either they already have it added in their extension, or the
     * argument is of type AddEthereumChainParameter, in which case the user will be prompted to add the chain with the
     * specified parameters first, before being prompted to switch.
     */
    activate(desiredChainIdOrChainParameters?: number | AddEthereumChainParameter): Promise<void>;
    deactivate(...args: unknown[]): Promise<void> | void;
}
export { MetaphiConnector };
