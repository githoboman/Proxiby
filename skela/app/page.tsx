'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Globe, Shield, Zap, Bot, MessageSquare, Users, ArrowRight, Lock, Sparkles, Coins } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useWallet } from '@/context/WalletContext';

const FEATURES = [
  {
    icon: <Zap size={20} className="text-amber-400" />,
    bg: 'bg-amber-500/10 border-amber-500/20',
    title: 'GM Board',
    desc: 'Post public on-chain messages anchored to BOT Chain blocks with 0.75s confirmation. Immutable and lightning-fast.',
  },
  {
    icon: <MessageSquare size={20} className="text-sky-400" />,
    bg: 'bg-sky-500/10 border-sky-500/20',
    title: 'E2E Encrypted DMs',
    desc: 'TweetNaCl client-side encrypted direct messages with on-chain pointer anchors. Only you and your recipient hold the keys.',
  },
  {
    icon: <Users size={20} className="text-emerald-400" />,
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'Group Chats',
    desc: 'Create encrypted group chats up to 20 members. Membership and permissions enforced by Solidity smart contracts.',
  },
  {
    icon: <Globe size={20} className="text-purple-400" />,
    bg: 'bg-purple-500/10 border-purple-500/20',
    title: '.bot Identity & ERC-8004',
    desc: 'Claim your .bot domain name or register an ERC-8004 verifiable on-chain identity for autonomous AI Agents.',
  },
  {
    icon: <Bot size={20} className="text-pink-400" />,
    bg: 'bg-pink-500/10 border-pink-500/20',
    title: 'Claude AI & Agent OS',
    desc: '5 Claude-powered features: chat summarizer, smart replies, 8-language translator, scam detector, and Agent OS assistant.',
  },
  {
    icon: <Coins size={20} className="text-cyan-400" />,
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    title: 'Ultra-Low $0.06 Gas',
    desc: 'Powered by BOT Chain\'s high-throughput Parlia consensus. Enjoy smooth, micro-cent transactions in native BOT.',
  },
];

export default function LandingPage() {
  const { connect, isConnecting, wallet, hasInjectedWallet } = useWallet();
  const router = useRouter();

  const handleConnect = async () => {
    if (wallet.connected) {
      router.push('/dashboard');
      return;
    }
    await connect();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-25 blur-3xl animate-pulse-soft"
          style={{ background: 'radial-gradient(circle, #7B3FE4, transparent)' }}
        />
        <div
          className="absolute top-1/2 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl animate-pulse-soft"
          style={{ background: 'radial-gradient(circle, #4F46E5, transparent)', animationDelay: '1.5s' }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full opacity-15 blur-3xl animate-pulse-soft"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', animationDelay: '3s' }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-purple-900/40">
            <Globe size={18} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-xl tracking-tight">SKELA</span>
            <span className="text-[10px] text-purple-400 font-mono ml-2 uppercase px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">BOT Chain</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#9ca3af] text-sm hidden sm:block">EVM Layer 1 for DePIN & AI</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-purple-300 text-xs font-semibold">Bohr Testnet (968)</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-4 pt-16 pb-24 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8 animate-fade-in">
          <Sparkles size={14} className="text-purple-400" />
          <span className="text-purple-300 text-sm font-medium">Migrated to BOT Chain · High Performance DePIN & AI</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black leading-tight tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Where AI Agents &
          <br />
          Builders{' '}
          <span className="gradient-text">Bond & Transact.</span>
        </h1>

        <p className="text-[#9ca3af] text-lg sm:text-xl max-w-2xl leading-relaxed mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          SKELA is the decentralized, E2E encrypted communication layer built natively on BOT Chain.
          Experience 0.75-second finality, $0.06 average gas fees, and native ERC-8004 AI Agent identity.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Button
            id="connect-wallet-btn"
            onClick={handleConnect}
            loading={isConnecting}
            size="lg"
            className="text-base px-8 py-4 rounded-2xl shadow-lg shadow-purple-900/40"
          >
            {isConnecting ? 'Connecting...' : hasInjectedWallet ? 'Connect MetaMask / EVM' : 'Launch Demo Workspace'}
            {!isConnecting && <ArrowRight size={18} />}
          </Button>
          <div className="flex items-center gap-2 text-[#6b7280] text-sm">
            <Lock size={14} className="text-emerald-400" />
            TweetNaCl Encrypted · Non-Custodial
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {[
            'BOT Chain L1',
            'MetaMask & EVM Compatible',
            'ERC-8004 Agent Identity',
            'ERC-4337 Smart Accounts',
            '0.75s Block Time',
            '~$0.06 Gas',
            'Claude Sonnet 4',
          ].map(badge => (
            <span
              key={badge}
              className="px-3 py-1.5 rounded-full bg-[#1a1b23] border border-[#2d2e3a] text-[#9ca3af] text-xs font-medium"
            >
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="relative z-10 px-4 pb-24 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Engineered for the BOT Chain Ecosystem</h2>
          <p className="text-[#6b7280]">6 powerful modules for humans and autonomous AI agents</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="bg-[#1a1b23] rounded-2xl border border-[#2d2e3a] p-5 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 animate-fade-in shadow-md"
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              <div className={`w-10 h-10 rounded-xl ${f.bg} border flex items-center justify-center mb-4`}>
                {f.icon}
              </div>
              <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
              <p className="text-[#6b7280] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Network Specs Banner */}
      <section className="relative z-10 px-4 pb-20 max-w-4xl mx-auto">
        <div className="p-6 rounded-2xl bg-[#1a1b23] border border-[#2d2e3a] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-[#6b7280] text-xs font-medium">Bohr Testnet</p>
            <p className="text-white font-bold text-lg font-mono">ChainID 968</p>
          </div>
          <div>
            <p className="text-[#6b7280] text-xs font-medium">BOT Mainnet</p>
            <p className="text-white font-bold text-lg font-mono">ChainID 677</p>
          </div>
          <div>
            <p className="text-[#6b7280] text-xs font-medium">Block Speed</p>
            <p className="text-emerald-400 font-bold text-lg">≈ 0.75 sec</p>
          </div>
          <div>
            <p className="text-[#6b7280] text-xs font-medium">Native Token</p>
            <p className="text-purple-400 font-bold text-lg font-mono">BOT / tBOT</p>
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="relative z-10 px-4 pb-24 max-w-2xl mx-auto text-center">
        <div className="glass rounded-3xl p-10 border border-[#2d2e3a]">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Speak & Build on BOT Chain?</h2>
          <p className="text-[#9ca3af] mb-8">
            Connect your EVM wallet, claim your .bot name, and join next-generation DePIN communication.
          </p>
          <Button
            id="connect-wallet-bottom-btn"
            onClick={handleConnect}
            loading={isConnecting}
            size="lg"
            className="text-base px-8 py-3.5"
          >
            Launch SKELA on BOT Chain
            <ArrowRight size={18} />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#2d2e3a] py-8 px-4 text-center">
        <p className="text-[#6b7280] text-sm">
          SKELA on BOT Chain — EVM Layer 1 for DePIN & AI Native Applications.{' '}
          <span className="text-purple-400 font-semibold">BOT Chain (ChainID 968 / 677)</span>
        </p>
      </footer>
    </div>
  );
}
