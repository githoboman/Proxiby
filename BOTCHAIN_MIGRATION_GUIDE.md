# 🚀 SKELA — Migration Guide: Stacks to BOT Chain

This document provides a comprehensive breakdown of the architectural migration of SKELA from the Stacks blockchain (Bitcoin L2) to **BOT Chain** (EVM Layer 1 for DePIN and AI Native Web3).

---

## 📊 High-Level Migration Matrix

| Component | Stacks (Previous) | BOT Chain (Current) | Rationale & Advantages |
|:---|:---|:---|:---|
| **Network Architecture** | Stacks Nakamoto (Bitcoin L2) | **BOT Chain EVM Layer 1** | Sub-second finality (~0.75s blocks) vs ~5s Stacks blocks |
| **Transaction Fees** | Variable STX fees | **~$0.06 average gas** in native BOT | 10x cheaper; affordable for high-frequency messaging |
| **Consensus Mechanism** | Proof-of-Transfer (PoX) settling on BTC | **Parlia PoSA with BEP-126/341** | High-throughput, deterministic block production |
| **Smart Contract Language** | Clarity (`.clar`) | **Solidity (`^0.8.20`)** | Broad EVM toolchain (Hardhat, Foundry, Remix, MetaMask) |
| **User Identity** | BNS (`.btc` names) | **.bot Domains & ERC-8004 Agent ID** | Verifiable on-chain identity for humans & autonomous AI Agents |
| **Wallet Integration** | Leather / Xverse (`@stacks/connect`) | **MetaMask & EIP-1193 + Agent OS** | Universal Web3 browser support + ERC-4337 smart account wallets |
| **Off-Chain Storage** | Stacks Gaia Storage | **Decentralized Storage / IPFS / Blob** | Standardized CID pointers and EIP-4844 Blob compatibility |
| **AI Capabilities** | Claude AI Features | **Claude AI + BOT Chain Agent OS** | Automated agent wallets, autonomous payments, and scam detection |

---

## ⚙️ Network Connectivity

### Bohr Testnet
- **Chain ID:** `968` (`0x3c8`)
- **RPC:** `https://rpc.bohr.life`
- **Explorer:** [https://scan.bohr.life/](https://scan.bohr.life/)
- **Faucet:** [https://faucet.botchain.ai/basic](https://faucet.botchain.ai/basic)
- **Currency:** `tBOT`

### BOT Mainnet
- **Chain ID:** `677` (`0x2a5`)
- **RPC:** `https://rpc.botchain.ai`
- **Explorer:** [https://scan.botchain.ai](https://scan.botchain.ai)
- **Official DEX:** [https://dex.botchain.ai/#/swap](https://dex.botchain.ai/#/swap)
- **Currency:** `BOT`

---

## 📜 Smart Contract Replacements

| Stacks Contract (`.clar`) | BOT Chain Contract (`.sol`) | Description |
|:---|:---|:---|
| `skela-registry.clar` | `contracts/BotChainRegistry.sol` | User registration, `.bot` domain binding, address-to-name lookup, and ERC-8004 agent profile linkage. |
| `skela-messaging.clar` | `contracts/BotChainMessaging.sol` | Stores encrypted message storage pointers & hashes on-chain; hosts public on-chain GM Board anchored to block numbers. |
| `skela-groups.clar` | `contracts/BotChainGroups.sol` | Group creation and membership management for group chats (up to 20 members). |
| *New* | `contracts/interfaces/IERC8004.sol` | Standard interface for BOT Chain ERC-8004 Agent Identity. |

---

## 🛠️ Deploying to BOT Chain

```bash
cd skela

# 1. Ensure private key and RPC are set in .env.local
# 2. Deploy to Bohr Testnet
npx hardhat run scripts/deploy.js --network botTestnet

# 3. Deploy to BOT Mainnet
npx hardhat run scripts/deploy.js --network botMainnet
```

---

## 🤖 BOT Chain Agent OS Integration

SKELA now natively supports BOT Chain's **Agent OS**:
1. **Agent Wallet (ERC-4337):** AI Agents can be created via `https://wallet-api.bohr.life/v1/wallets` and deployed with zero private key handling by the client system. Gas for deployment is sponsored by BOT Chain.
2. **Agent Identity (ERC-8004):** Once created, agents register on `0xb43edfb9c7609cf645e932b2ff20f26f0d4488de` via `https://identity-api.bohr.life/v1/agents/identities` to obtain a verifiable on-chain `agentId` and decentralized description metadata.
