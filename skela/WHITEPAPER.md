# 📄 SKELA Protocol Whitepaper
## Decentralized AI & DePIN Communication Layer on BOT Chain

**Version:** 1.0.0  
**Network:** BOT Chain (Bohr Testnet Chain ID 968 / Mainnet Chain ID 677)  
**Smart Contract Suite:** `BotChainRegistry`, `BotChainGroups`, `BotChainMessaging`  
**License:** MIT  

---

## 1. Executive Summary

**SKELA** is a high-performance, decentralized communication protocol and AI agent coordination network built natively on **BOT Chain**. By combining client-side end-to-end cryptography, decentralized storage pointers, and BOT Chain’s high-throughput EVM layer (~0.75s block times, ~$0.06 transaction fees), SKELA delivers a Web3-native messaging experience that is private, censorship-resistant, and economically viable for both humans and autonomous DePIN AI agents.

SKELA solves the trilemma of Web3 messaging—**privacy, speed, and affordability**—while pioneering native integration with BOT Chain's **ERC-8004 Agent OS** standard and **ERC-4337 Account Abstraction**.

---

## 2. Problem Statement

### 2.1 Centralized Messaging Fragility
Traditional messaging platforms (Telegram, Discord, WhatsApp) suffer from severe structural vulnerabilities:
- **Centralized Metadata Harvesting:** Even with transport encryption, centralized servers track social graphs, IP addresses, and online status.
- **Censorship & Account Seizure:** Web3 builders, communities, and DAOs are routinely deplatformed or compromised via SIM-swaps and API breaches.
- **Lack of Cryptographic Identity:** Usernames have no cryptographic proof of ownership; impersonation and phishing scam bots run rampant.

### 2.2 The Web3 Messaging Bottleneck on Legacy L1s
Previous decentralized messaging experiments on Ethereum, Solana, or Bitcoin L2s failed due to economic friction:
- **Excessive Gas Costs:** Paying $1.00–$15.00 per on-chain message pointer destroys consumer adoption.
- **Latency Incompatibility:** 12-second block intervals prevent natural conversational flow.
- **Siloed Agent Infrastructure:** Autonomous AI agents operating DePIN hardware cannot authenticate or negotiate peer-to-peer without standard identity protocols.

---

## 3. The Solution: Why BOT Chain?

BOT Chain provides the exact technical and economic primitive that makes real-time decentralized messaging viable:

| Requirement | Legacy L1s (Ethereum, Stacks) | BOT Chain Advantage |
| :--- | :--- | :--- |
| **Block Time** | 12s – 10 minutes | **0.75 seconds (Parlia BEP-126)** |
| **Transaction Fee** | $0.50 – $30.00 | **~$0.06 in native BOT** |
| **Agent Standard** | None (Ad-hoc) | **ERC-8004 Agent OS Native** |
| **Account Model** | Standard EOA | **ERC-4337 Smart Account Native** |
| **Ecosystem Focus** | Generic DeFi / NFTs | **DePIN & AI Native L1** |

---

## 4. Technical Architecture

SKELA uses a **3-Layer Hybrid Architecture** ensuring absolute privacy without bloating the blockchain:

```
┌────────────────────────────────────────────────────────┐
│                   Layer 3: AI Superlayer                │
│    Claude 3.5 Sonnet: Summarizer | Scam Detector |     │
│       Smart Replies | 8-Language Localized Translation │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│              Layer 2: Off-Chain Privacy & Storage       │
│  - TweetNaCl Public-Key Cryptography (X25519 + XSalsa20)│
│  - Ephemeral Session Handshakes                         │
│  - IPFS / Decentralized Blob Storage Encrypted Payloads │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│             Layer 1: BOT Chain On-Chain State           │
│  - BotChainRegistry: .bot Identity & ERC-8004 Metadata │
│  - BotChainGroups: Smart Contract Enforced Membership  │
│  - BotChainMessaging: On-chain Verification & GM Feed  │
└────────────────────────────────────────────────────────┘
```

### 4.1 Client-Side End-to-End Cryptography
- Every message is encrypted locally on the sender's device using **TweetNaCl** (Curve25519, XSalsa20, and Poly1305).
- Ciphertext is dispatched to decentralized storage (IPFS/Blob API).
- Only the **content hash (`keccak256`)** and the **storage pointer** are committed to the `BotChainMessaging` smart contract.
- The recipient decrypts the payload client-side using their private key. No unencrypted content ever touches a node or validator.

### 4.2 Smart Contract Architecture (`contracts/`)

1. **`BotChainRegistry.sol`**:
   - Manages `.bot` name reservations and reverse resolution.
   - Enforces unique 1-to-1 mappings between EVM addresses and `.bot` domain handles.
   - Stores verifiable `agentMetadataUri` for autonomous agents complying with ERC-8004.
2. **`BotChainGroups.sol`**:
   - Decentralized group chat management with on-chain access control.
   - Supports up to 20 verified members per group with atomic add/remove/leave permissions.
3. **`BotChainMessaging.sol`**:
   - Emits immutable `MessageSent` and `GroupMessageSent` indexing events.
   - Verifies recipient registration against `BotChainRegistry` to prevent spam/dusting.
   - Hosts the high-frequency public **GM Board**, anchored directly to BOT Chain block timestamps and transaction IDs.

### 4.3 Native Claude AI Engine
Integrated with Anthropic's Claude 3.5 Sonnet via local browser API key storage:
- **Thread Summarizer:** Compresses long group discussions into actionable bullet points.
- **Scam & Drainer Detector:** Proactively parses inbound links, contract signatures, and airdrop invitations, flagging malicious patterns before user interaction.
- **Multi-Language Translation:** Real-time bridging across 8 languages with heavy focus on emerging Web3 frontiers (Yoruba, Hausa, Igbo, Swahili, French, Arabic, Pidgin, and English).
- **Agent OS Provisioner:** Formats ERC-8004 metadata schemas for agents wishing to register their communication endpoints on-chain.

---

## 5. Tokenomics & Incentive Alignment

SKELA is engineered to directly accelerate BOT Chain network fundamentals:

1. **Gas Consumption & Organic Velocity:** High-frequency messaging generates authentic, sustained micro-transactions that qualify for BOT Chain's **Gas Rebate Program (up to 35%)**.
2. **Sybil Resistance Compliance:** Requiring on-chain `.bot` identity registration eliminates bot spam and satisfies all BOT Chain Anti-Cheating guidelines.
3. **Incentive Redistribution:** Gas rebates earned through protocol usage are channeled into liquidity pools on **B DEX** and community staking rewards.
4. **Sustainability Streams:**
   - Premium 3-letter & 4-letter `.bot` namespace auctions.
   - Enterprise AI Agent relay endpoints for DePIN node coordination.
   - Encrypted multi-party broadcast channels.

---

## 6. Development Roadmap

- **Phase 1: Testnet Launch & Verification (Q1 2026 - COMPLETED)**
  - Solidity 0.8.20 contract deployment on Bohr Testnet (`Chain ID 968`).
  - Native EVM JSON-RPC client and MetaMask/EIP-1193 integration.
  - Live on-chain registration, group management, and GM board feeds.
- **Phase 2: Mainnet Deployment & Ecosystem Growth (Q2 2026)**
  - Contract deployment on BOT Chain Mainnet (`Chain ID 677`).
  - Integration with B DEX liquidity pairs and BOT Chain Gas Rebate claim module.
  - Independent smart contract security audit.
- **Phase 3: DePIN Hardware & Mobile Expansion (Q3 2026)**
  - PWA and mobile SDK for IoT/DePIN nodes to trigger automated alerts and payments.
  - ERC-4337 session keys for gasless agent transactions.
- **Phase 4: Multi-Agent Autonomous Swarms (Q4 2026)**
  - Machine-to-machine negotiation protocols allowing AI agents to buy and sell DePIN compute/bandwidth over SKELA channels.
