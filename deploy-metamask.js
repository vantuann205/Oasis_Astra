#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Deploy Smart Contract với MetaMask\n');
console.log('📝 Nhập private key MetaMask (có TEST token):\n');

rl.question('Private Key: ', async (privateKey) => {
  if (!privateKey) {
    console.log('❌ Private key không hợp lệ!');
    rl.close();
    return;
  }

  try {
    // Remove 0x prefix if exists
    const cleanKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
    
    // Update .env temporarily
    const envContent = `PRIVATE_KEY=${cleanKey}`;
    fs.writeFileSync('.env', envContent);
    
    console.log('\n🔨 Compiling contracts...');
    execSync('npx hardhat compile', { stdio: 'inherit' });
    
    console.log('\n🚀 Deploying to Sapphire Testnet...');
    execSync('npx hardhat run scripts/deploy-simple.ts --network sapphire-testnet', { stdio: 'inherit' });
    
    // Clean up .env
    fs.writeFileSync('.env', '# Private key removed after deployment');
    
    console.log('\n✅ Deployment completed!');
    console.log('🔒 Private key đã được xóa khỏi .env file');
    
  } catch (error) {
    console.error('❌ Lỗi deploy:', error.message);
    // Clean up .env on error
    fs.writeFileSync('.env', '# Private key removed after error');
  }
  
  rl.close();
});