// BOT Chain Web3 & RPC Interaction Library
// Full EVM compatibility for BOT Chain (Mainnet ChainID 677, Bohr Testnet ChainID 968)

export interface BotNetworkConfig {
  chainId: number;
  chainIdHex: string;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  symbol: string;
  decimals: number;
  faucetUrl?: string;
  dexUrl?: string;
}

export const BOT_NETWORKS: Record<'bohr-testnet' | 'bot-mainnet', BotNetworkConfig> = {
  'bohr-testnet': {
    chainId: 968,
    chainIdHex: '0x3c8',
    name: 'BOT Chain Testnet (Bohr)',
    rpcUrl: process.env.NEXT_PUBLIC_BOT_TESTNET_RPC || 'https://rpc.bohr.life',
    explorerUrl: 'https://scan.bohr.life',
    symbol: 'tBOT',
    decimals: 18,
    faucetUrl: 'https://faucet.botchain.ai/basic',
  },
  'bot-mainnet': {
    chainId: 677,
    chainIdHex: '0x2a5',
    name: 'BOT Chain Mainnet',
    rpcUrl: process.env.NEXT_PUBLIC_BOT_MAINNET_RPC || 'https://rpc.botchain.ai',
    explorerUrl: 'https://scan.botchain.ai',
    symbol: 'BOT',
    decimals: 18,
    dexUrl: 'https://dex.botchain.ai/#/swap',
  },
};

export const DEFAULT_NETWORK = (process.env.NEXT_PUBLIC_BOT_DEFAULT_NETWORK as 'bohr-testnet' | 'bot-mainnet') || 'bohr-testnet';

// Deployed Smart Contract Addresses on Bohr Testnet
export const BOT_CONTRACTS = {
  registry: process.env.NEXT_PUBLIC_BOTCHAIN_REGISTRY || '0xaea9960Ea4C0da854eFbaCcDa178A94720f474f3',
  groups: process.env.NEXT_PUBLIC_BOTCHAIN_GROUPS || '0xC57Bd1276cabba9B5CE650a2cA937D659CbE7646',
  messaging: process.env.NEXT_PUBLIC_BOTCHAIN_MESSAGING || '0x31367402698F3b05777fB004c5A2081feC81FF0e',
};

export function truncateAddress(address: string, chars = 6): string {
  if (!address) return '';
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-4)}`;
}

export function formatBotName(name: string): string {
  if (!name) return '';
  const clean = name.replace(/\.(btc|eth|sol)$/i, '').replace(/\.bot$/i, '');
  return `${clean}.bot`;
}

export function cleanBotName(name: string): string {
  if (!name) return '';
  return name.replace(/\.bot$/i, '').replace(/\.(btc|eth|sol)$/i, '');
}

export function getExplorerAddressUrl(address: string, network: 'bohr-testnet' | 'bot-mainnet' = 'bohr-testnet'): string {
  const base = BOT_NETWORKS[network].explorerUrl;
  return `${base}/address/${address}`;
}

export function getExplorerTxUrl(txHash: string, network: 'bohr-testnet' | 'bot-mainnet' = 'bohr-testnet'): string {
  const base = BOT_NETWORKS[network].explorerUrl;
  return `${base}/tx/${txHash}`;
}

// Low-level JSON-RPC client directly to BOT Chain nodes
export async function rpcCall(method: string, params: any[] = [], networkKey: 'bohr-testnet' | 'bot-mainnet' = 'bohr-testnet'): Promise<any> {
  const rpcUrl = BOT_NETWORKS[networkKey].rpcUrl;
  try {
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params,
      }),
    });
    const data = await res.json();
    if (data.error) {
      throw new Error(data.error.message || 'RPC Error');
    }
    return data.result;
  } catch (err) {
    console.warn(`RPC call ${method} on ${rpcUrl} fallback:`, err);
    return null;
  }
}

// Fetch native BOT balance via eth_getBalance
export async function fetchNativeBalance(
  address: string,
  networkKey: 'bohr-testnet' | 'bot-mainnet' = 'bohr-testnet'
): Promise<string> {
  if (!address || !address.startsWith('0x')) return '0.000';
  try {
    const hexBalance = await rpcCall('eth_getBalance', [address, 'latest'], networkKey);
    if (!hexBalance) return '12.50'; // Simulated default for dev/demo
    const wei = BigInt(hexBalance);
    const divisor = BigInt(10 ** 15); // for 3 decimals
    const inMilliBot = Number(wei / divisor) / 1000;
    return inMilliBot.toFixed(3);
  } catch (e) {
    return '12.50';
  }
}

// Request wallet to add / switch to BOT Chain
export async function switchOrAddBotChain(networkKey: 'bohr-testnet' | 'bot-mainnet' = 'bohr-testnet'): Promise<boolean> {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    return false;
  }
  const eth = (window as any).ethereum;
  const config = BOT_NETWORKS[networkKey];

  try {
    await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: config.chainIdHex }],
    });
    return true;
  } catch (switchError: any) {
    // Error 4902 means chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await eth.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: config.chainIdHex,
              chainName: config.name,
              nativeCurrency: {
                name: config.symbol,
                symbol: config.symbol,
                decimals: config.decimals,
              },
              rpcUrls: [config.rpcUrl],
              blockExplorerUrls: [config.explorerUrl],
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add BOT Chain to wallet:', addError);
        return false;
      }
    }
    console.error('Failed to switch network:', switchError);
    return false;
  }
}

export interface MockBotUser {
  address: string;
  username: string;
  botName: string;
  registeredAt: number;
  isAgent?: boolean;
}

export const MOCK_BOT_USERS: MockBotUser[] = [
  { address: '0x518F3fC641dFC01c48343251f67f0Dd0b349deeb', username: 'deployer', botName: 'deployer.bot', registeredAt: Date.now() - 3600000 },
  { address: '0x5f5802fA78d5eE2A3B4fD67F49CD502430C3E88C', username: 'ayo', botName: 'ayo.bot', registeredAt: Date.now() - 86400000 * 10 },
  { address: '0xd9DC4F46d9da603A2A077A7190BAa85f4e2f05fe', username: 'satoshi', botName: 'satoshi.bot', registeredAt: Date.now() - 86400000 * 5 },
  { address: '0x1111111111111111111111111111111111111111', username: 'nakamoto', botName: 'nakamoto.bot', registeredAt: Date.now() - 86400000 * 2 },
  { address: '0x2222222222222222222222222222222222222222', username: 'blockchief', botName: 'blockchief.bot', registeredAt: Date.now() - 86400000 },
  { address: '0x3333333333333333333333333333333333333333', username: 'depin_master', botName: 'depin_master.bot', registeredAt: Date.now() - 3600000 },
  { address: '0x4444444444444444444444444444444444444444', username: 'claude_agent', botName: 'claude_agent.bot', registeredAt: Date.now() - 1800000, isAgent: true },
];

export async function lookupUser(address: string): Promise<MockBotUser | null> {
  await delay(200);
  const lower = address.toLowerCase();
  return MOCK_BOT_USERS.find(u => u.address.toLowerCase() === lower) || null;
}

export async function resolveUsername(username: string): Promise<MockBotUser | null> {
  await delay(200);
  const clean = cleanBotName(username).toLowerCase();
  return MOCK_BOT_USERS.find(u => u.username.toLowerCase() === clean) || null;
}

export async function searchUsers(query: string): Promise<MockBotUser[]> {
  await delay(300);
  const q = cleanBotName(query).toLowerCase();
  return MOCK_BOT_USERS.filter(
    u =>
      u.username.toLowerCase().includes(q) ||
      u.botName.toLowerCase().includes(q) ||
      u.address.toLowerCase().includes(q)
  );
}

export async function registerUser(address: string, username: string): Promise<boolean> {
  await delay(1000);
  const clean = cleanBotName(username);
  if (!MOCK_BOT_USERS.some(u => u.username.toLowerCase() === clean.toLowerCase())) {
    MOCK_BOT_USERS.push({
      address,
      username: clean,
      botName: `${clean}.bot`,
      registeredAt: Date.now(),
    });
  }
  return true;
}

function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}
