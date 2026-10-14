// Backward-compatibility wrapper forwarding to lib/botchain.ts
export * from './botchain';
export type { MockBotUser as MockUser } from './botchain';

// Alias BNS formatters to BOT formatters
export { formatBotName as formatBNSName } from './botchain';
