# SKELA — Development Guide (BOT Chain Edition)

> Decentralized Communication Layer for BOT Chain  
> "Where AI Agents & DePIN Builders Build, Bond, and Transact."

---

## Project Overview

SKELA is an AI-powered, E2E encrypted messaging and identity platform built natively on **BOT Chain** (EVM Layer 1 for DePIN and AI applications). It combines on-chain Solidity smart contracts, decentralized off-chain storage pointers, Claude AI security & NLP features, and BOT Chain Agent OS (ERC-8004 Agent Identity & ERC-4337 Smart Accounts).

---

## Repository Structure

```
Proxiby/
├── CLAUDE (3).md                 ← this file
├── BOTCHAIN_MIGRATION_GUIDE.md   ← detailed migration breakdown
├── skela/
│   ├── contracts/
│   │   ├── BotChainRegistry.sol  ← user registration + .bot domain resolution
│   │   ├── BotChainMessaging.sol ← DMs, GM Board, message pointers
│   │   ├── BotChainGroups.sol    ← group creation + membership
│   │   └── interfaces/
│   │       └── IERC8004.sol      ← ERC-8004 Agent Identity interface
│   ├── hardhat.config.js         ← Hardhat configuration for BOT Chain (968 / 677)
│   ├── scripts/
│   │   └── deploy.js             ← Deployment script
│   ├── lib/
│   │   ├── botchain.ts           ← JSON-RPC client, network configs, address helpers
│   │   ├── agentOS.ts            ← Agent OS client (ERC-4337 wallets & ERC-8004 identities)
│   │   ├── encryption.ts         ← TweetNaCl client-side E2E encryption
│   │   ├── storage.ts            ← Decentralized storage adapter
│   │   └── claude.ts             ← Claude Sonnet AI integration
│   ├── context/
│   │   └── WalletContext.tsx     ← EVM provider with one-click BOT Chain switch
│   ├── components/               ← React components (GM Board, DMs, Groups, Identity, AI)
│   ├── app/                      ← Next.js App Router (Landing & Dashboard)
│   └── types/                    ← TypeScript definitions
```

---

## Tech Stack

| Layer | Technology | Notes |
|:---|:---|:---|
| **Blockchain** | BOT Chain (EVM L1) | ~0.75s block time, Parlia consensus |
| **Smart Contracts** | Solidity (`^0.8.20`) | Deployable via Hardhat / Foundry / Remix |
| **Transaction Fees** | Native BOT / tBOT | ~$0.06 average transaction cost |
| **Identity** | .bot Domains & ERC-8004 | Human usernames + autonomous AI Agent registry |
| **Wallets** | MetaMask / EVM + Agent OS | Browser wallets + ERC-4337 smart account wallets |
| **Storage** | IPFS / Blob API / Pointers | Encrypted payloads stored off-chain |
| **Encryption** | TweetNaCl | Client-side E2E encryption |
| **AI** | Claude (Anthropic) | Chat summarizer, smart replies, translator, scam detector |

---

## Smart Contracts

### 1. `BotChainRegistry.sol`
- Functions: `register(string username)`, `registerAgent(string username, string metadataUri)`, `getUser(address addr)`, `resolveUsername(string username)`, `isRegistered(address addr)`.
- Enforces unique `.bot` usernames and maps to EVM addresses.

### 2. `BotChainMessaging.sol`
- Functions: `sendMessage(address recipient, string pointer, bytes32 contentHash)`, `sendGroupMessage(uint256 groupId, string pointer, bytes32 contentHash)`, `postGM(string message)`.
- Enforces recipient registration and group membership.

### 3. `BotChainGroups.sol`
- Functions: `createGroup(string name)`, `addMember(uint256 groupId, address member)`, `removeMember(uint256 groupId, address member)`, `leaveGroup(uint256 groupId)`.
- Gated group memberships up to 20 members.
