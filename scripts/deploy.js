const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const ProfileFactory = await hre.ethers.getContractFactory("ProfileFactory");
  const profileFactory = await ProfileFactory.deploy();
  await profileFactory.waitForDeployment();

  console.log("ProfileFactory deployed to:", await profileFactory.getAddress());

  // Get the UserProfile contract address
  const userProfileAddress = await profileFactory.userProfileContract();
  console.log("UserProfile deployed to:", userProfileAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });