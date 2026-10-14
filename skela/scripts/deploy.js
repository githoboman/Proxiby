const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting SKELA deployment to BOT Chain...");
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "BOT");

  // 1. Deploy BotChainRegistry
  console.log("\n1️⃣ Deploying BotChainRegistry...");
  const Registry = await hre.ethers.getContractFactory("BotChainRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("✅ BotChainRegistry deployed to:", registryAddress);

  // 2. Deploy BotChainGroups
  console.log("\n2️⃣ Deploying BotChainGroups...");
  const Groups = await hre.ethers.getContractFactory("BotChainGroups");
  const groups = await Groups.deploy();
  await groups.waitForDeployment();
  const groupsAddress = await groups.getAddress();
  console.log("✅ BotChainGroups deployed to:", groupsAddress);

  // 3. Deploy BotChainMessaging
  console.log("\n3️⃣ Deploying BotChainMessaging...");
  const Messaging = await hre.ethers.getContractFactory("BotChainMessaging");
  const messaging = await Messaging.deploy(registryAddress, groupsAddress);
  await messaging.waitForDeployment();
  const messagingAddress = await messaging.getAddress();
  console.log("✅ BotChainMessaging deployed to:", messagingAddress);

  console.log("\n🎉 Deployment complete!");
  console.log("=========================================");
  console.log("NEXT_PUBLIC_BOTCHAIN_REGISTRY=" + registryAddress);
  console.log("NEXT_PUBLIC_BOTCHAIN_GROUPS=" + groupsAddress);
  console.log("NEXT_PUBLIC_BOTCHAIN_MESSAGING=" + messagingAddress);
  console.log("=========================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
