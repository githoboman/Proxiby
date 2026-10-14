const fs = require('fs');
const path = require('path');
const https = require('https');
const { ethers } = require('ethers');
// Parse .env.local without external dotenv dependency
const envFile = path.join(__dirname, '../.env.local');
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  });
}

const SOLJSON_URL = 'https://binaries.soliditylang.org/bin/soljson-v0.8.20+commit.a1b79de6.js';
const CACHE_DIR = path.join(__dirname, '../cache');
const SOLJSON_FILE = path.join(CACHE_DIR, 'soljson-v0.8.20.js');

async function downloadSoljson() {
  if (fs.existsSync(SOLJSON_FILE)) {
    console.log('⚡ Using cached soljson compiler');
    return;
  }
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  console.log('⬇️ Downloading Solidity compiler v0.8.20 from binaries.soliditylang.org...');
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(SOLJSON_FILE);
    https.get(SOLJSON_URL, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download compiler: HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log('✅ Solidity compiler v0.8.20 ready');
          resolve();
        });
      });
    }).on('error', (err) => {
      fs.unlink(SOLJSON_FILE, () => {});
      reject(err);
    });
  });
}

function compileContracts() {
  console.log('🔨 Compiling Solidity smart contracts...');
  const soljson = require(SOLJSON_FILE);

  let compileStandard;
  if (typeof soljson.compileStandard === 'function') {
    compileStandard = (input) => JSON.parse(soljson.compileStandard(JSON.stringify(input)));
  } else if (typeof soljson.cwrap === 'function') {
    const c_compile = soljson.cwrap('solidity_compile', 'string', ['string', 'number']);
    compileStandard = (input) => JSON.parse(c_compile(JSON.stringify(input)));
  } else {
    // Try wrapper module
    const wrapper = require('solc/wrapper');
    const solc = wrapper(soljson);
    compileStandard = (input) => JSON.parse(solc.compile(JSON.stringify(input)));
  }

  const contractsDir = path.join(__dirname, '../contracts');
  const registrySrc = fs.readFileSync(path.join(contractsDir, 'BotChainRegistry.sol'), 'utf8');
  const groupsSrc = fs.readFileSync(path.join(contractsDir, 'BotChainGroups.sol'), 'utf8');
  const messagingSrc = fs.readFileSync(path.join(contractsDir, 'BotChainMessaging.sol'), 'utf8');

  const input = {
    language: 'Solidity',
    sources: {
      'BotChainRegistry.sol': { content: registrySrc },
      'BotChainGroups.sol': { content: groupsSrc },
      'BotChainMessaging.sol': { content: messagingSrc },
    },
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode.object'],
        },
      },
    },
  };

  const output = compileStandard(input);
  if (output.errors) {
    const errors = output.errors.filter((e) => e.severity === 'error');
    if (errors.length > 0) {
      console.error('Compilation errors:', errors);
      throw new Error('Solidity compilation failed');
    }
  }

  console.log('✅ Smart contracts compiled successfully');

  return {
    registry: {
      abi: output.contracts['BotChainRegistry.sol']['BotChainRegistry'].abi,
      bytecode: '0x' + output.contracts['BotChainRegistry.sol']['BotChainRegistry'].evm.bytecode.object,
    },
    groups: {
      abi: output.contracts['BotChainGroups.sol']['BotChainGroups'].abi,
      bytecode: '0x' + output.contracts['BotChainGroups.sol']['BotChainGroups'].evm.bytecode.object,
    },
    messaging: {
      abi: output.contracts['BotChainMessaging.sol']['BotChainMessaging'].abi,
      bytecode: '0x' + output.contracts['BotChainMessaging.sol']['BotChainMessaging'].evm.bytecode.object,
    },
  };
}

async function main() {
  await downloadSoljson();
  const compiled = compileContracts();

  const rpcUrl = process.env.NEXT_PUBLIC_BOT_TESTNET_RPC || 'https://rpc.bohr.life';
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('PRIVATE_KEY not found in .env.local');
  }

  console.log(`\n🌐 Connecting to Bohr Testnet (${rpcUrl})...`);
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log('📍 Deployer Address:', wallet.address);

  const balance = await provider.getBalance(wallet.address);
  console.log('💰 Deployer Balance:', ethers.formatEther(balance), 'tBOT');

  if (balance === 0n) {
    throw new Error('Wallet has 0 tBOT. Please fund it first at faucet.botchain.ai');
  }

  // Deploy 1: BotChainRegistry
  console.log('\n1️⃣ Deploying BotChainRegistry...');
  const RegistryFactory = new ethers.ContractFactory(compiled.registry.abi, compiled.registry.bytecode, wallet);
  const registry = await RegistryFactory.deploy();
  console.log('⏳ Transaction submitted, waiting for confirmation...');
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log('✅ BotChainRegistry deployed to:', registryAddress);

  // Deploy 2: BotChainGroups
  console.log('\n2️⃣ Deploying BotChainGroups...');
  const GroupsFactory = new ethers.ContractFactory(compiled.groups.abi, compiled.groups.bytecode, wallet);
  const groups = await GroupsFactory.deploy();
  console.log('⏳ Transaction submitted, waiting for confirmation...');
  await groups.waitForDeployment();
  const groupsAddress = await groups.getAddress();
  console.log('✅ BotChainGroups deployed to:', groupsAddress);

  // Deploy 3: BotChainMessaging
  console.log('\n3️⃣ Deploying BotChainMessaging...');
  const MessagingFactory = new ethers.ContractFactory(compiled.messaging.abi, compiled.messaging.bytecode, wallet);
  const messaging = await MessagingFactory.deploy(registryAddress, groupsAddress);
  console.log('⏳ Transaction submitted, waiting for confirmation...');
  await messaging.waitForDeployment();
  const messagingAddress = await messaging.getAddress();
  console.log('✅ BotChainMessaging deployed to:', messagingAddress);

  console.log('\n🎉 ALL CONTRACTS DEPLOYED SUCCESSFULLY TO BOHR TESTNET!');
  console.log('----------------------------------------------------');
  console.log('NEXT_PUBLIC_BOTCHAIN_REGISTRY=' + registryAddress);
  console.log('NEXT_PUBLIC_BOTCHAIN_GROUPS=' + groupsAddress);
  console.log('NEXT_PUBLIC_BOTCHAIN_MESSAGING=' + messagingAddress);
  console.log('----------------------------------------------------');

  // Save deployed addresses and ABIs to lib/deployedContracts.json
  const deployedInfo = {
    network: 'bohr-testnet',
    chainId: 968,
    deployedAt: new Date().toISOString(),
    deployer: wallet.address,
    contracts: {
      BotChainRegistry: { address: registryAddress, abi: compiled.registry.abi },
      BotChainGroups: { address: groupsAddress, abi: compiled.groups.abi },
      BotChainMessaging: { address: messagingAddress, abi: compiled.messaging.abi },
    },
  };

  const contractsJsonPath = path.join(__dirname, '../lib/deployedContracts.json');
  fs.writeFileSync(contractsJsonPath, JSON.stringify(deployedInfo, null, 2));
  console.log('💾 Saved contracts info to:', contractsJsonPath);

  // Update .env.local
  const envPath = path.join(__dirname, '../.env.local');
  let envContent = fs.readFileSync(envPath, 'utf8');
  envContent = envContent.replace(/NEXT_PUBLIC_BOTCHAIN_REGISTRY=.*/, `NEXT_PUBLIC_BOTCHAIN_REGISTRY=${registryAddress}`);
  envContent = envContent.replace(/NEXT_PUBLIC_BOTCHAIN_GROUPS=.*/, `NEXT_PUBLIC_BOTCHAIN_GROUPS=${groupsAddress}`);
  envContent = envContent.replace(/NEXT_PUBLIC_BOTCHAIN_MESSAGING=.*/, `NEXT_PUBLIC_BOTCHAIN_MESSAGING=${messagingAddress}`);
  fs.writeFileSync(envPath, envContent);
  console.log('📝 Updated .env.local with deployed contract addresses');
}

main().catch((err) => {
  console.error('❌ Deployment error:', err);
  process.exit(1);
});
