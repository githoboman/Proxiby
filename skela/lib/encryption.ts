import nacl from 'tweetnacl';
import { encodeUTF8, decodeUTF8, encodeBase64, decodeBase64 } from 'tweetnacl-util';

export interface KeyPair {
  publicKey: string; // base64
  secretKey: string; // base64
}

export function generateKeyPair(): KeyPair {
  const kp = nacl.box.keyPair();
  return {
    publicKey: encodeBase64(kp.publicKey),
    secretKey: encodeBase64(kp.secretKey),
  };
}

export function getOrCreateKeyPair(address: string): KeyPair {
  const storageKey = `skela_keypair_${address}`;
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    return JSON.parse(stored) as KeyPair;
  }
  const kp = generateKeyPair();
  localStorage.setItem(storageKey, JSON.stringify(kp));
  return kp;
}

export interface EncryptedMessage {
  ciphertext: string; // base64
  nonce: string;      // base64
  senderPublicKey: string; // base64
}

export function encryptMessage(
  plaintext: string,
  recipientPublicKeyB64: string,
  senderKeyPair: KeyPair
): EncryptedMessage {
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const messageUint8 = decodeUTF8(plaintext);
  const recipientPublicKey = decodeBase64(recipientPublicKeyB64);
  const senderSecretKey = decodeBase64(senderKeyPair.secretKey);

  const encrypted = nacl.box(messageUint8, nonce, recipientPublicKey, senderSecretKey);

  return {
    ciphertext: encodeBase64(encrypted),
    nonce: encodeBase64(nonce),
    senderPublicKey: senderKeyPair.publicKey,
  };
}

export function decryptMessage(
  encryptedMsg: EncryptedMessage,
  recipientKeyPair: KeyPair
): string | null {
  try {
    const ciphertext = decodeBase64(encryptedMsg.ciphertext);
    const nonce = decodeBase64(encryptedMsg.nonce);
    const senderPublicKey = decodeBase64(encryptedMsg.senderPublicKey);
    const recipientSecretKey = decodeBase64(recipientKeyPair.secretKey);

    const decrypted = nacl.box.open(ciphertext, nonce, senderPublicKey, recipientSecretKey);
    if (!decrypted) return null;
    return encodeUTF8(decrypted);
  } catch {
    return null;
  }
}

export function hashContent(content: string): Uint8Array {
  const msgUint8 = decodeUTF8(content);
  return nacl.hash(msgUint8).slice(0, 32);
}
