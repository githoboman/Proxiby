export interface User {
  address: string; // 0x... EVM address
  username?: string;
  botName?: string; // .bot domain
  bnsName?: string; // backward compat alias
  publicKey?: string;
  isAgent?: boolean;
  agentId?: string;
}

export interface GMPost {
  id: number;
  author: string;
  authorBotName?: string;
  authorBns?: string;
  message: string;
  blockNumber: number;
  timestamp: number;
  txHash?: string;
}

export interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  encryptedContent?: string;
  timestamp: number;
  isRead: boolean;
  storagePointer?: string; // IPFS CID or BOT Chain Blob ref
  contentHash?: string;
  spamVerdict?: SpamVerdict;
}

export interface Conversation {
  id: string;
  participant: string;
  participantBotName?: string;
  participantBns?: string;
  lastMessage?: Message;
  unreadCount: number;
}

export interface Group {
  id: number;
  name: string;
  creator: string;
  members: string[];
  createdAt: number;
  lastMessage?: Message;
}

export interface BotIdentityProfile {
  address: string;
  botName?: string;
  username?: string;
  registered: boolean;
  isAgent?: boolean;
  agentId?: string;
  metadataUri?: string;
}

// Backward compat
export type BNSProfile = BotIdentityProfile;

export type SpamVerdictType = 'SAFE' | 'SUSPICIOUS' | 'SPAM';

export interface SpamVerdict {
  verdict: SpamVerdictType;
  confidence: number;
  reason: string;
}

export type AITab =
  | 'summarizer'
  | 'smart-replies'
  | 'translator'
  | 'spam-detector'
  | 'agent-os'
  | 'bns-assistant';

export type DashboardView =
  | 'gm-board'
  | 'dms'
  | 'groups'
  | 'bot-identity'
  | 'bns-search'
  | 'ai-panel';

export interface WalletState {
  connected: boolean;
  address: string | null;
  botName: string | null;
  bnsName?: string | null;
  network: 'bohr-testnet' | 'bot-mainnet';
  chainId: number;
  balance: string; // In BOT
  isAgent?: boolean;
  agentId?: string;
}
