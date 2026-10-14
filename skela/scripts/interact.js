const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envFile = path.join(__dirname, '../.env.local');
let privateKey = '';
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('PRIVATE_KEY=')) {
      privateKey = trimmed.replace('PRIVATE_KEY=', '').trim();
    }
  });
}

async function main() {
  const deployed = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/deployedContracts.json')));
  const provider = new ethers.JsonRpcProvider('https://rpc.bohr.life');
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log('📍 Wallet Address:', wallet.address);

  const reg = new ethers.Contract(deployed.contracts.BotChainRegistry.address, deployed.contracts.BotChainRegistry.abi, wallet);
  const groups = new ethers.Contract(deployed.contracts.BotChainGroups.address, deployed.contracts.BotChainGroups.abi, wallet);
  const msg = new ethers.Contract(deployed.contracts.BotChainMessaging.address, deployed.contracts.BotChainMessaging.abi, wallet);

  // 1. Register .bot domain
  console.log('1️⃣ Calling BotChainRegistry.register("skela")...');
  const regTx = await reg.register('skela');
  console.log('TX_REGISTER:' + regTx.hash);
  const regReceipt = await regTx.wait();
  console.log('BLOCK_REGISTER:' + regReceipt.blockNumber);

  // 2. Create Group
  console.log('2️⃣ Calling BotChainGroups.createGroup("BOT Chain Early Believers")...');
  const grpTx = await groups.createGroup('BOT Chain Early Believers');
  console.log('TX_GROUP:' + grpTx.hash);
  const grpReceipt = await grpTx.wait();
  console.log('BLOCK_GROUP:' + grpReceipt.blockNumber);

  // 3. Post GM on GM Board
  console.log('3️⃣ Calling BotChainMessaging.postGM("GM BOT Chain! SKELA is officially live on Bohr Testnet 🚀")...');
  const gmTx = await msg.postGM('GM BOT Chain! SKELA is officially live on Bohr Testnet 🚀');
  console.log('TX_GM:' + gmTx.hash);
  const gmReceipt = await gmTx.wait();
  console.log('BLOCK_GM:' + gmReceipt.blockNumber);

  // 4. Send on-chain message pointer
  console.log('4️⃣ Calling BotChainMessaging.sendMessage pointer...');
  const contentHash = ethers.keccak256(ethers.toUtf8Bytes('Encrypted Payload via TweetNaCl'));
  const msgTx = await msg.sendMessage(wallet.address, 'ipfs://bafkreidskeladecentralizedmsg123', contentHash);
  console.log('TX_MSG:' + msgTx.hash);
  const msgReceipt = await msgTx.wait();
  console.log('BLOCK_MSG:' + msgReceipt.blockNumber);

  console.log('\n🎉 ALL REAL ON-CHAIN TRANSACTIONS CONFIRMED ON BOHR TESTNET!');
}

main().catch(err => {
  console.error('Error in interact.js:', err);
  process.exit(1);
});
