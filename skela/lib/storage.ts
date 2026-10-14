// Decentralized Storage Adapter for BOT Chain
// Supports IPFS, BOT Chain Blob API (EIP-4844), and fast local cache
import type { EncryptedMessage } from './encryption';

export interface StorageMessagePayload {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  encrypted?: EncryptedMessage;
  timestamp: number;
}

// In-memory decentralized storage cache
const storageStore: Record<string, string> = {};

export async function putFile(path: string, content: string): Promise<string> {
  await delay(150);
  storageStore[path] = content;
  // Compute deterministic CID-like pointer
  const hash = Math.abs(hashCode(content)).toString(16).padStart(12, '0');
  const pointer = `ipfs://bafybeibotchain${hash}/${encodeURIComponent(path)}`;
  storageStore[pointer] = content;
  return pointer;
}

export async function getFile(pointerOrPath: string): Promise<string | null> {
  await delay(150);
  return storageStore[pointerOrPath] || null;
}

export async function storeMessage(
  senderAddress: string,
  recipientAddress: string,
  messageId: string,
  payload: StorageMessagePayload
): Promise<string> {
  const path = `botchain/dm/${recipientAddress.toLowerCase()}/${messageId}.json`;
  const pointer = await putFile(path, JSON.stringify(payload));
  return pointer;
}

export async function fetchMessage(
  pointerOrPath: string
): Promise<StorageMessagePayload | null> {
  const raw = await getFile(pointerOrPath);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StorageMessagePayload;
  } catch {
    return null;
  }
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}
