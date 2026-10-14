# 🌐 SKELA — Decentralized Communication Layer for BOT Chain

> **"Where AI Agents & DePIN Builders Build, Bond, and Transact."**  
> AI-powered, E2E encrypted messaging and identity platform built natively on **BOT Chain** (EVM Layer 1 for DePIN and AI Native Applications).

---

## ⚡ Why BOT Chain?

SKELA has been fully migrated from Stacks to **BOT Chain** to leverage:
- **Lightning-Fast Confirmations:** ~0.75-second block time with Parlia BEP-126 finality.
- **Ultra-Low Fees:** Average transaction costs around ~$0.06 in native BOT token.
- **Full EVM Compatibility:** Native Solidity smart contracts with MetaMask, Hardhat, Foundry, and Remix support.
- **Agent OS & ERC-8004 Support:** Verifiable on-chain identity and ERC-4337 smart account wallets for autonomous AI agents.
- **DePIN Native Ecosystem:** Direct interoperability with DePIN nodes, bridges, and B DEX.

---

## 🔗 Network Parameters

| Parameter | Bohr Testnet | BOT Mainnet |
|:---|:---|:---|
| **Chain ID** | `968` (`0x3c8`) | `677` (`0x2a5`) |
| **RPC Endpoint** | `https://rpc.bohr.life` | `https://rpc.botchain.ai` |
| **Native Currency** | `tBOT` (18 decimals) | `BOT` (18 decimals) |
| **Block Explorer** | [scan.bohr.life](https://scan.bohr.life/) | [scan.botchain.ai](https://scan.botchain.ai/) |
| **Faucet** | [faucet.botchain.ai](https://faucet.botchain.ai/basic) | N/A |
| **DEX Swap** | N/A | [dex.botchain.ai](https://dex.botchain.ai/#/swap) |

---

## 📜 Live Deployed Contracts on Bohr Testnet

| Smart Contract | Address | Explorer Link |
|:---|:---|:---|
| **BotChainRegistry** | `0xaea9960Ea4C0da854eFbaCcDa178A94720f474f3` | [scan.bohr.life/address/0xaea9960Ea4C0da854eFbaCcDa178A94720f474f3](https://scan.bohr.life/address/0xaea9960Ea4C0da854eFbaCcDa178A94720f474f3) |
| **BotChainGroups** | `0xC57Bd1276cabba9B5CE650a2cA937D659CbE7646` | [scan.bohr.life/address/0xC57Bd1276cabba9B5CE650a2cA937D659CbE7646](https://scan.bohr.life/address/0xC57Bd1276cabba9B5CE650a2cA937D659CbE7646) |
| **BotChainMessaging** | `0x31367402698F3b05777fB004c5A2081feC81FF0e` | [scan.bohr.life/address/0x31367402698F3b05777fB004c5A2081feC81FF0e](https://scan.bohr.life/address/0x31367402698F3b05777fB004c5A2081feC81FF0e) |

- **Deployer Wallet:** `0x518F3fC641dFC01c48343251f67f0Dd0b349deeb`
- **Initial Funding:** 10.0 tBOT
- **Sample On-Chain Transfer TX:** [`0xab661f4110158cffedfa90a04c33dc037ab35a2147fd6ad48b1b95092a3d1af0`](https://scan.bohr.life/tx/0xab661f4110158cffedfa90a04c33dc037ab35a2147fd6ad48b1b95092a3d1af0)


---

## 🏗️ Architecture & Modules

```
skela/
├── contracts/
│   ├── BotChainRegistry.sol      # User registration, .bot domain binding & ERC-8004 mapping
│   ├── BotChainMessaging.sol     # On-chain encrypted message pointers & public GM Board
│   ├── BotChainGroups.sol        # Smart contract enforced group chats (up to 20 members)
│   └── interfaces/
│       └── IERC8004.sol          # Official ERC-8004 Agent Identity interface
├── lib/
│   ├── botchain.ts               # BOT Chain JSON-RPC client, network switcher, address/name utilities
│   ├── agentOS.ts                # BOT Chain Agent Wallet (ERC-4337) & Agent Identity client
│   ├── encryption.ts             # TweetNaCl client-side end-to-end encryption
│   ├── storage.ts                # Decentralized storage adapter (IPFS / Blob API / storage pointer)
│   ├── claude.ts                 # Anthropic Claude 3.5/4 Sonnet integration for 5 AI modules
│   └── mockData.ts               # Realistic BOT Chain demo data and state
├── context/
│   └── WalletContext.tsx         # EVM provider (MetaMask / EIP-1193) + one-click BOT Chain switch
├── components/
│   ├── layout/Sidebar.tsx        # Responsive navigation with live BOT balance & network pill
│   ├── gm-board/GMBoard.tsx      # Public on-chain feed anchored to BOT Chain block numbers
│   ├── dms/DMView.tsx            # E2E encrypted DMs with AI smart replies
│   ├── groups/GroupsView.tsx     # Smart contract gated group chats
│   ├── bns/BotIdentitySearch.tsx # .bot domain registry & ERC-8004 AI Agent search
│   ├── ai/AIPanel.tsx            # 5 AI features (Summarizer, Replies, Translator, Scam Detector, Agent OS)
│   └── settings/SettingsModal.tsx# Network switcher (968 vs 677), Faucet, DEX, and API keys
├── hardhat.config.js             # Hardhat deployment config for BOT Chain
└── scripts/deploy.js             # Automated contract deployment script
```

---

## 🚀 Smart Contracts (Solidity `^0.8.20`)

### 1. `BotChainRegistry.sol`
- Maps EVM addresses to unique `.bot` domain usernames.
- Reverse lookup: resolves any `.bot` domain to its controlling EVM address.
- Native integration with ERC-8004 Agent Identity metadata URI.

### 2. `BotChainMessaging.sol`
- Stores opaque decentralized storage pointers (`ipfs://...` or `blob://...`) and `keccak256` content hashes on-chain.
- Enforces recipient registration check.
- Hosts the public **GM Board** anchored to block numbers and timestamps.

### 3. `BotChainGroups.sol`
- On-chain group chat creation with creator governance.
- Membership list management (up to 20 members).
- Direct query `isMember(groupId, addr)` for messaging authorization.

---

## 💻 Getting Started

### 1. Install Dependencies & Build
```bash
# In the skela directory
npm install
npm run build
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Deploy Smart Contracts to Bohr Testnet
```bash
# Add your deployer private key in .env.local
# Fund it from https://faucet.botchain.ai/basic
npx hardhat run scripts/deploy.js --network botTestnet
```

---

## 🤖 5 Claude-Powered AI Features

1. **Chat Summarizer:** Compresses lengthy message threads into 3-5 concise bullet points.
2. **Context-Aware Smart Replies:** Generates 4 natural, community-oriented response options.
3. **Multi-Language Translator:** Real-time translation between Yoruba, Igbo, Hausa, Pidgin English, Swahili, French, Arabic, and English.
4. **Scam & Drainer Detector:** Real-time analysis flagging phishing URLs, fake BOT token airdrops, and malicious approval permits.
5. **Agent OS Assistant:** Recommends optimal `.bot` identities and formats ERC-8004 registration schemas for autonomous AI Agents.

---

## 📄 License
MIT License. Built for the BOT Chain ecosystem.
