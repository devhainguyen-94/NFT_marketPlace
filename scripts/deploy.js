// scripts/deploy.js
async function main() {
    // Lấy Hardhat network provider và deploy contract
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Lấy hợp đồng MyToken và triển khai
    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy();
    console.log("Token deployed to:", token.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
