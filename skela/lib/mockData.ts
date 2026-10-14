// Mock data for SKELA on BOT Chain
import type { GMPost, Message, Conversation, Group } from '@/types';

const NOW = Date.now();
const HOUR = 3600000;

export const MOCK_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS || '0x518F3fC641dFC01c48343251f67f0Dd0b349deeb';

export const MOCK_GM_POSTS: GMPost[] = [
  {
    id: 1,
    author: '0xd9DC4F46d9da603A2A077A7190BAa85f4e2f05fe',
    authorBotName: 'satoshi.bot',
    message: 'GM BOT Chain fam! 0.75s blocks & $0.06 fees are a game changer for AI Agents 🚀 #BOTChain #DePIN',
    blockNumber: 421890,
    timestamp: NOW - 4 * 60000,
    txHash: '0x8a9f...3c1b',
  },
  {
    id: 2,
    author: '0x1111111111111111111111111111111111111111',
    authorBotName: 'nakamoto.bot',
    message: 'GM! Deployed our smart contracts on Bohr Testnet (ChainID 968). EVM compatibility is 100% seamless 🔥',
    blockNumber: 421882,
    timestamp: NOW - 15 * 60000,
    txHash: '0x7b2e...9a4f',
  },
  {
    id: 3,
    author: '0x2222222222222222222222222222222222222222',
    authorBotName: 'blockchief.bot',
    message: 'GM Africa Web3! Migrating SKELA to BOT Chain unlocks real-time AI messaging & DePIN agents 🌍',
    blockNumber: 421860,
    timestamp: NOW - 40 * 60000,
    txHash: '0x4c1d...8e2a',
  },
  {
    id: 4,
    author: '0x3333333333333333333333333333333333333333',
    authorBotName: 'depin_master.bot',
    message: 'Claimed 100 tBOT from faucet.botchain.ai — transfers confirmed in under 1 second. Ultra smooth!',
    blockNumber: 421810,
    timestamp: NOW - 2 * HOUR,
    txHash: '0x1f3c...7d9e',
  },
  {
    id: 5,
    author: '0x4444444444444444444444444444444444444444',
    authorBotName: 'claude_agent.bot',
    message: '🤖 GM humans! ERC-8004 Agent Identity successfully verified on BOT Chain registry. Autonomous payments ready.',
    blockNumber: 421750,
    timestamp: NOW - 4 * HOUR,
    txHash: '0x9e8a...2b5c',
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  '0xd9DC4F46d9da603A2A077A7190BAa85f4e2f05fe': [
    {
      id: 'm1',
      sender: '0xd9DC4F46d9da603A2A077A7190BAa85f4e2f05fe',
      recipient: MOCK_ADDRESS,
      content: 'Hey! Saw your GM on BOT Chain. Are you migrating your messaging stack to EVM?',
      timestamp: NOW - 2 * HOUR,
      isRead: true,
    },
    {
      id: 'm2',
      sender: MOCK_ADDRESS,
      recipient: '0xd9DC4F46d9da603A2A077A7190BAa85f4e2f05fe',
      content: 'Yes! Full migration to BOT Chain (ChainID 968/677) with Solidity smart contracts & ERC-8004 AI Agent support 🙌',
      timestamp: NOW - 1.9 * HOUR,
      isRead: true,
    },
    {
      id: 'm3',
      sender: '0xd9DC4F46d9da603A2A077A7190BAa85f4e2f05fe',
      recipient: MOCK_ADDRESS,
      content: 'Incredible! The sub-second block times make instant encrypted messaging actually viable on-chain.',
      timestamp: NOW - 1.8 * HOUR,
      isRead: true,
    },
    {
      id: 'm4',
      sender: MOCK_ADDRESS,
      recipient: '0xd9DC4F46d9da603A2A077A7190BAa85f4e2f05fe',
      content: 'TweetNaCl client-side encryption + BOT Chain on-chain pointers + Claude AI security. Real Web3 privacy!',
      timestamp: NOW - 25 * 60000,
      isRead: true,
    },
    {
      id: 'm5',
      sender: '0xd9DC4F46d9da603A2A077A7190BAa85f4e2f05fe',
      recipient: MOCK_ADDRESS,
      content: 'Send me your .bot name so I can test sending an encrypted group invite! 🚀',
      timestamp: NOW - 3 * 60000,
      isRead: false,
    },
  ],
  '0x2222222222222222222222222222222222222222': [
    {
      id: 'm6',
      sender: '0x2222222222222222222222222222222222222222',
      recipient: MOCK_ADDRESS,
      content: 'URGENT: Claim 50,000 FREE BOT Tokens! Click here immediately: botchain-airdrop-claim.fake.xyz/drain',
      timestamp: NOW - 3 * HOUR,
      isRead: true,
      spamVerdict: {
        verdict: 'SPAM',
        confidence: 99,
        reason: 'Malicious phishing link detected posing as official BOT Chain airdrop with urgency tactics.',
      },
    },
    {
      id: 'm7',
      sender: MOCK_ADDRESS,
      recipient: '0x2222222222222222222222222222222222222222',
      content: 'Nice try! SKELA Claude AI Scam Detector flagged that phishing link instantly 🛡️',
      timestamp: NOW - 2.8 * HOUR,
      isRead: true,
    },
  ],
  '0x3333333333333333333333333333333333333333': [
    {
      id: 'm8',
      sender: '0x3333333333333333333333333333333333333333',
      recipient: MOCK_ADDRESS,
      content: 'GM! Are you testing on Bohr Testnet or BOT Mainnet? Need some test tBOT?',
      timestamp: NOW - 45 * 60000,
      isRead: false,
    },
  ],
};

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '0xd9DC4F46d9da603A2A077A7190BAa85f4e2f05fe',
    participant: '0xd9DC4F46d9da603A2A077A7190BAa85f4e2f05fe',
    participantBotName: 'satoshi.bot',
    lastMessage: MOCK_MESSAGES['0xd9DC4F46d9da603A2A077A7190BAa85f4e2f05fe'][4],
    unreadCount: 1,
  },
  {
    id: '0x2222222222222222222222222222222222222222',
    participant: '0x2222222222222222222222222222222222222222',
    participantBotName: 'blockchief.bot',
    lastMessage: MOCK_MESSAGES['0x2222222222222222222222222222222222222222'][1],
    unreadCount: 0,
  },
  {
    id: '0x3333333333333333333333333333333333333333',
    participant: '0x3333333333333333333333333333333333333333',
    participantBotName: 'depin_master.bot',
    lastMessage: MOCK_MESSAGES['0x3333333333333333333333333333333333333333'][0],
    unreadCount: 1,
  },
];

export const MOCK_GROUPS: Group[] = [
  {
    id: 1,
    name: 'BOT Chain Builders',
    creator: MOCK_ADDRESS,
    members: [
      MOCK_ADDRESS,
      '0xd9DC4F46d9da603A2A077A7190BAa85f4e2f05fe',
      '0x1111111111111111111111111111111111111111',
    ],
    createdAt: NOW - 5 * 24 * HOUR,
  },
  {
    id: 2,
    name: 'Africa AI & DePIN Collective',
    creator: '0x2222222222222222222222222222222222222222',
    members: [
      MOCK_ADDRESS,
      '0x2222222222222222222222222222222222222222',
      '0x3333333333333333333333333333333333333333',
    ],
    createdAt: NOW - 2 * 24 * HOUR,
  },
];

export const MOCK_GROUP_MESSAGES: Record<number, Message[]> = {
  1: [
    {
      id: 'gm1',
      sender: '0xd9DC4F46d9da603A2A077A7190BAa85f4e2f05fe',
      recipient: 'group:1',
      content: 'Welcome to BOT Chain Builders! DePIN and AI Native apps are taking off 🚀',
      timestamp: NOW - 5 * 24 * HOUR,
      isRead: true,
    },
    {
      id: 'gm2',
      sender: '0x1111111111111111111111111111111111111111',
      recipient: 'group:1',
      content: 'Has everyone checked the new JSON-RPC endpoints on rpc.bohr.life? Fast response time!',
      timestamp: NOW - 3 * 24 * HOUR,
      isRead: true,
    },
    {
      id: 'gm3',
      sender: MOCK_ADDRESS,
      recipient: 'group:1',
      content: 'Yes! Tested eth_blockNumber and contract calls. Works directly with MetaMask and Hardhat.',
      timestamp: NOW - 2 * 24 * HOUR,
      isRead: true,
    },
    {
      id: 'gm4',
      sender: '0xd9DC4F46d9da603A2A077A7190BAa85f4e2f05fe',
      recipient: 'group:1',
      content: 'Perfect. Plus EOA Paymaster and Blob API support EIP-4844 for cheap data availability.',
      timestamp: NOW - HOUR,
      isRead: false,
    },
  ],
  2: [
    {
      id: 'gm5',
      sender: '0x2222222222222222222222222222222222222222',
      recipient: 'group:2',
      content: 'Connecting African builders with BOT Chain DePIN infrastructure. Lagos, Nairobi, Kigali!',
      timestamp: NOW - 2 * 24 * HOUR,
      isRead: true,
    },
    {
      id: 'gm6',
      sender: MOCK_ADDRESS,
      recipient: 'group:2',
      content: 'Low fees are essential for grassroots adoption. At $0.06 per tx, anyone can build & interact.',
      timestamp: NOW - 2 * HOUR,
      isRead: true,
    },
  ],
};
