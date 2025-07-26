import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  paths: {
    sources: "./src",
  },
  networks: {
    sepolia: {
      url: "https://1rpc.io/sepolia",
      accounts: [process.env.PVT_KEY || ""],
    },
  },
};

export default config;
