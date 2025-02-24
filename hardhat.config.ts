import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "./task/Mytoken";
const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://ethereum-sepolia.rpc.subquery.network/public",
      chainId: 0xaa36a7,
      accounts: [""],
    },
  },
};

export default config;
