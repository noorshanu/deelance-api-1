require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;
const etherscanApiKey = process.env.BSC_PROJECT_KEY;
module.exports = {
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: etherscanApiKey
  },
  defaultNetwork: "goerlitestnet", // <-- change here for other network, default use hardhat network.
  networks: {
    hardhat: {
    },
    
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 1000000000,
      accounts: [privateKey]
    },
    bsctestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      accounts: [privateKey],
      gas:'auto',
      gasPrice: 'auto',
    },
    goerlitestnet: {
      url: "https://goerli.infura.io/v3/",
      chainId: 5,
      accounts: [privateKey],
      gas:'auto',
      gasPrice: 'auto',
    },
    
  },
  solidity: {
    version: "0.8.9",
    settings: {
        optimizer: {
            enabled: true,
            runs: 200,
        },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  }
};