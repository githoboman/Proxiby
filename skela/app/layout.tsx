import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WalletProvider } from '@/context/WalletContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SKELA — Decentralized AI & DePIN Messaging on BOT Chain',
  description: 'AI-powered, E2E encrypted messaging and ERC-8004 Agent OS communication platform built natively on BOT Chain. Ultra-fast 0.75s blocks, gas rebates, and DePIN agent interactions.',
  keywords: ['BOT Chain', 'DePIN', 'AI Agents', 'ERC-8004', 'Web3', 'Messaging', 'Decentralized', 'Bohr Testnet', 'Agent OS'],
  openGraph: {
    title: 'SKELA — Decentralized AI & DePIN Messaging on BOT Chain',
    description: 'AI-powered, E2E encrypted messaging and ERC-8004 Agent OS communication platform built natively on BOT Chain.',
    type: 'website',
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
