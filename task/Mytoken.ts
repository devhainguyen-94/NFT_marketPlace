import { task } from "hardhat/config";
import { MyToken } from "../typechain-types";

// Deploy Task
task("deploy", "Deploys the MyToken contract")
  .addParam("owner", "The owner of the contract")
  .setAction(async ({ owner }, hre) => {
    const MyToken = await hre.ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy(owner);
    const deploymentTx = await myToken.deploymentTransaction();
    const receipt = await deploymentTx?.wait();
    console.log("🚀 ~ .setAction ~ receipt:", receipt);

    console.log(`✅ MyToken deployed at: ${await myToken.getAddress()}`);
    console.log(`📜 Deployment Tx Hash: ${deploymentTx?.hash}`);
    console.log(`⛓ Block Hash: ${receipt?.blockHash}`);
    console.log(`🔢 Block Number: ${receipt?.blockNumber}`);
  });

// Mint Task
task("mint", "Mints a new NFT")
  .addParam("contract", "The contract address")
  .addParam("to", "Address to mint NFT to")
  .addParam("id", "Token ID to mint")
  .setAction(async ({ contract, to, id }, hre) => {
    const myToken = (await hre.ethers.getContractAt(
      "MyToken",
      contract
    )) as MyToken;

    console.log(`🔹 Minting token ID ${id} to ${to}...`);
    const tx = await myToken.safeMint(to, id);
    const receipt = await tx.wait();
    console.log(`✅ NFT with Token ID ${id} minted to ${to}`);
    console.log(`📜 Tx Hash: ${tx.hash}`);
    console.log(`⛓ Block Hash: ${receipt?.blockHash}`);
    console.log(`🔢 Block Number: ${receipt?.blockNumber}`);
    console.log(`📌 Gas Used: ${receipt?.gasUsed.toString()}`);
  });

// BalanceOf Task
task("balanceOf", "Gets the balance of an address")
  .addParam("contract", "The contract address")
  .addParam("address", "The address to check balance")
  .setAction(async ({ contract, address }, hre) => {
    const myToken = (await hre.ethers.getContractAt(
      "MyToken",
      contract
    )) as MyToken;

    console.log(`🔍 Checking NFT balance for ${address}...`);
    const balance = await myToken.balanceOf(address);
    console.log(`✅ Address ${address} owns ${balance.toString()} NFTs`);
  });

// OwnerOf Task
task("ownerOf", "Gets the owner of a specific token")
  .addParam("contract", "The contract address")
  .addParam("tokenId", "The token ID")
  .setAction(async ({ contract, tokenId }, hre) => {
    const myToken = (await hre.ethers.getContractAt(
      "MyToken",
      contract
    )) as MyToken;

    console.log(`🔍 Checking owner of Token ID ${tokenId}...`);
    const owner = await myToken.ownerOf(tokenId);
    console.log(`✅ Token ID ${tokenId} is owned by ${owner}`);
  });

// Transfer Task
task("transfer", "Transfers an NFT")
  .addParam("contract", "The contract address")
  .addParam("from", "Current owner address")
  .addParam("to", "Recipient address")
  .addParam("tokenId", "The token ID")
  .setAction(async ({ contract, from, to, tokenId }, hre) => {
    const myToken = (await hre.ethers.getContractAt(
      "MyToken",
      contract
    )) as MyToken;

    console.log(`🔄 Transferring Token ID ${tokenId} from ${from} to ${to}...`);
    const tx = await myToken.transferFrom(from, to, tokenId);
    const receipt = await tx.wait();

    console.log(`✅ Token ID ${tokenId} transferred from ${from} to ${to}`);
    console.log(`📜 Tx Hash: ${tx.hash}`);
    if (receipt) {
      console.log(`⛓ Block Hash: ${receipt.blockHash}`);
      console.log(`🔢 Block Number: ${receipt.blockNumber}`);
      console.log(`📌 Gas Used: ${receipt.gasUsed.toString()}`);
    } else {
      console.error("Receipt is null");
    }

    if (receipt && receipt.logs.length > 0) {
      console.log(`📡 Events emitted:`);
      receipt.logs.forEach((log, index) => {
        console.log(`🔸 Event #${index + 1}:`);
        console.log(`   - Address: ${log.address}`);
        console.log(`   - Topics: ${log.topics}`);
        console.log(`   - Data: ${log.data}`);
      });
    }
  });
