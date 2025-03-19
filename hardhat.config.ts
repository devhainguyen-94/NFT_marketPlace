import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "./task/Mytoken";
const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "http://127.0.0.1:8545",
      chainId: 0xaa36a7,
      accounts: ["c6ae84fcfe8fd6f4db17e4b438f87a0a375e46a4c25123e38d1df1b2fc4cd558"],
    },
  },
};

export default config;
