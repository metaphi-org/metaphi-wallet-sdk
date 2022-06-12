const MetaphiIframe = Object.freeze({
    GET_LOGGED_IN_USER: 'get_logged_in_user'
})

const MetaphiInputTypes = Object.freeze({
    VERIFICATION_CODE: 1,
    USER_PIN: 2,
    TRANSACTION_SIGN: 3,
    SUCCESS: 4,
    PROCESSING: 5,
    ERROR: 6,
    CONNECT: 7,
    PIN_RECONNECT: 8,
    EMAIL: 9,
})

const WALLET_EMBED_ID = 'mWalletPlugin';

export { MetaphiIframe, MetaphiInputTypes, WALLET_EMBED_ID }

