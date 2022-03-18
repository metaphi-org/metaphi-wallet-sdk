const metaphiInstance = (function () {
  let config = {};

  return {
    init: function (configInit) {
      console.log('metaphi- config: ', configInit);
      config.api_key = configInit.api_key;
      config.account_id = configInit.account_id;
    },
    getConfig: function () {
      return config;
    },
  };
})();

export default metaphiInstance;
