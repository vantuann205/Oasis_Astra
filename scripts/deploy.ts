import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying SimpleToken to Sapphire Testnet...");

  const SimpleToken = await ethers.getContractFactory("SimpleToken");
  const simpleToken = await SimpleToken.deploy();
  
  await simpleToken.waitForDeployment();
  const tokenAddress = await simpleToken.getAddress();
  
  console.log("✅ SimpleToken deployed to:", tokenAddress);
  
  const name = await simpleToken.name();
  const symbol = await simpleToken.symbol();
  const totalSupply = await simpleToken.totalSupply();
  const mintPrice = await simpleToken.mintPrice();
  
  console.log("📋 Token Info:");
  console.log("  Name:", name);
  console.log("  Symbol:", symbol);
  console.log("  Total Supply:", ethers.formatEther(totalSupply), "OAT");
  console.log("  Mint Price:", ethers.formatEther(mintPrice), "TEST");
  
  console.log("\n📝 Update TOKEN_ADDRESS in frontend/abi/tokenAbi.ts:");
  console.log(`export const TOKEN_ADDRESS = "${tokenAddress}";`);
  
  console.log("\n🌐 View on Explorer:");
  console.log(`https://testnet.explorer.sapphire.oasis.io/address/${tokenAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });