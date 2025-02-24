// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MyTokenModule = buildModule("MyTokenModule", (m) => {
  const MyToken = m.contract("MyToken", [m.getAccount(0)]);
  return { MyToken };
});

export default MyTokenModule;
