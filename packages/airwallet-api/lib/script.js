import MetaphiWalletApi from "./airwallet-api";

function main() {
  const accountConfig = {
    clientId: 54,
    apiKey: "7114fdad-e68c-478a-8c90-23bae177abc0",
  };

  const networkConfig = {
    rpcUrl: "https://matic-mumbai.chainstacklabs.com",
  };

  // Detect params to construct wallet instance.
  const wallet = new MetaphiWalletApi({
    accountConfig,
    networkConfig,
  });

  // Expose public methods in wallet, to window.
  window.metaphi = {
    ethereum: {
      login: wallet.login,
      isUserLoggedIn: wallet.isUserLoggedIn,
    },
  };
}

main();
