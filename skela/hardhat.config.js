// Hardhat configuration for BOT Chain deployment
// BOT Chain is an EVM-compatible Layer 1 for DePIN and AI Native applications
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env.local" });

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001";

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // BOT Chain Testnet (Bohr)
    botTestnet: {
      url: process.env.BOT_TESTNET_RPC || "https://rpc.bohr.life",
      chainId: 968,
      accounts: [PRIVATE_KEY],
      gasPrice: 20000000000, // 20 gwei
    },
    // BOT Chain Mainnet
    botMainnet: {
      url: process.env.BOT_MAINNET_RPC || "https://rpc.botchain.ai",
      chainId: 677,
      accounts: [PRIVATE_KEY],
      gasPrice: 20000000000,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./tests",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
