require("@nomiclabs/hardhat-waffle");
require('hardhat-deploy');
require("dotenv").config()

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
      }
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    feeCollector: {
      default: 0,
    },
  },
  networks: {
    localhost: {
      accounts: [process.env.PRIVATE_KEY]
    },
  },
};
