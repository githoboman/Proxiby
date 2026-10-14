'use client';
import React, { useState } from 'react';
import { Key, Save, Eye, EyeOff, Network, ExternalLink, Droplets, ArrowRightLeft } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useWallet } from '@/context/WalletContext';
import { BOT_NETWORKS, BOT_CONTRACTS, truncateAddress } from '@/lib/botchain';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { apiKey, setApiKey, wallet, switchNetwork } = useWallet();
  const [draftKey, setDraftKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [switching, setSwitching] = useState(false);

  const save = () => {
    setApiKey(draftKey.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleNetworkSwitch = async (target: 'bohr-testnet' | 'bot-mainnet') => {
    setSwitching(true);
    try {
      await switchNetwork(target);
    } catch (e) {
      console.error(e);
    }
    setSwitching(false);
  };

  const currentNetConfig = BOT_NETWORKS[wallet.network];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings & BOT Chain Config" size="md">
      <div className="space-y-6">
        {/* Network Switcher */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Network size={16} className="text-purple-400" />
            <label className="text-white font-semibold text-sm">Active BOT Chain Network</label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleNetworkSwitch('bohr-testnet')}
              disabled={switching}
              className={`p-3 rounded-xl border text-left transition-all ${
                wallet.network === 'bohr-testnet'
                  ? 'border-purple-500 bg-purple-500/15'
                  : 'border-[#2d2e3a] bg-[#1a1b23] hover:border-purple-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-semibold text-xs">Bohr Testnet</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono">
                  ID 968
                </span>
              </div>
              <p className="text-[#9ca3af] text-[11px] truncate">rpc.bohr.life</p>
            </button>

            <button
              onClick={() => handleNetworkSwitch('bot-mainnet')}
              disabled={switching}
              className={`p-3 rounded-xl border text-left transition-all ${
                wallet.network === 'bot-mainnet'
                  ? 'border-purple-500 bg-purple-500/15'
                  : 'border-[#2d2e3a] bg-[#1a1b23] hover:border-purple-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-semibold text-xs">BOT Mainnet</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                  ID 677
                </span>
              </div>
              <p className="text-[#9ca3af] text-[11px] truncate">rpc.botchain.ai</p>
            </button>
          </div>

          {/* Quick links */}
          <div className="flex gap-2 flex-wrap pt-1">
            <a
              href="https://faucet.botchain.ai/basic"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 transition-colors"
            >
              <Droplets size={12} /> Claim Test tBOT Tokens <ExternalLink size={10} />
            </a>
            <a
              href="https://dex.botchain.ai/#/swap"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 transition-colors"
            >
              <ArrowRightLeft size={12} /> B DEX Swap <ExternalLink size={10} />
            </a>
          </div>
        </div>

        {/* Connected Wallet Info */}
        <div className="bg-[#22232e] rounded-xl border border-[#2d2e3a] p-4 space-y-2">
          <p className="text-[#6b7280] text-xs font-semibold uppercase tracking-wider">Connected Account</p>
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold text-sm">{wallet.botName || 'Anonymous.bot'}</span>
            <Badge variant="purple">{currentNetConfig.name}</Badge>
          </div>
          <p className="text-[#9ca3af] text-xs font-mono break-all">{wallet.address || 'Not connected'}</p>
          <div className="flex items-center justify-between pt-1 border-t border-[#2d2e3a]/60 text-xs">
            <span className="text-[#6b7280]">Balance:</span>
            <span className="text-white font-mono font-bold">{wallet.balance} {currentNetConfig.symbol}</span>
          </div>
        </div>

        {/* Live Deployed Smart Contracts */}
        <div className="bg-[#22232e] rounded-xl border border-[#2d2e3a] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[#6b7280] text-xs font-semibold uppercase tracking-wider">Deployed Smart Contracts</p>
            <Badge variant="success">Live on Bohr Testnet</Badge>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between bg-[#1a1b23] px-3 py-2 rounded-lg border border-[#2d2e3a]/60">
              <span className="text-white font-medium">BotChainRegistry</span>
              <a
                href={`https://scan.bohr.life/address/${BOT_CONTRACTS.registry}`}
                target="_blank"
                rel="noreferrer"
                className="text-purple-400 hover:text-purple-300 font-mono inline-flex items-center gap-1"
              >
                {truncateAddress(BOT_CONTRACTS.registry, 6)} <ExternalLink size={11} />
              </a>
            </div>

            <div className="flex items-center justify-between bg-[#1a1b23] px-3 py-2 rounded-lg border border-[#2d2e3a]/60">
              <span className="text-white font-medium">BotChainGroups</span>
              <a
                href={`https://scan.bohr.life/address/${BOT_CONTRACTS.groups}`}
                target="_blank"
                rel="noreferrer"
                className="text-purple-400 hover:text-purple-300 font-mono inline-flex items-center gap-1"
              >
                {truncateAddress(BOT_CONTRACTS.groups, 6)} <ExternalLink size={11} />
              </a>
            </div>

            <div className="flex items-center justify-between bg-[#1a1b23] px-3 py-2 rounded-lg border border-[#2d2e3a]/60">
              <span className="text-white font-medium">BotChainMessaging</span>
              <a
                href={`https://scan.bohr.life/address/${BOT_CONTRACTS.messaging}`}
                target="_blank"
                rel="noreferrer"
                className="text-purple-400 hover:text-purple-300 font-mono inline-flex items-center gap-1"
              >
                {truncateAddress(BOT_CONTRACTS.messaging, 6)} <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>


        {/* Anthropic API Key */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Key size={16} className="text-purple-400" />
            <label className="text-white font-semibold text-sm">Anthropic Claude API Key</label>
          </div>
          <p className="text-[#6b7280] text-xs mb-2">
            Powers the 5 AI features (Summarizer, Smart Replies, 8-Language Translator, Scam Detector, and Agent OS Identity). Stored locally in your browser.
          </p>
          <div className="relative">
            <input
              id="api-key-input"
              type={showKey ? 'text' : 'password'}
              value={draftKey}
              onChange={e => setDraftKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full bg-[#22232e] border border-[#2d2e3a] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-500/50 transition-colors pr-12 font-mono"
            />
            <button
              onClick={() => setShowKey(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-white transition-colors"
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="flex gap-2 pt-1">
            <Button
              id="save-api-key-btn"
              onClick={save}
              size="md"
              variant={saved ? 'secondary' : 'primary'}
              className="flex-1"
            >
              <Save size={15} />
              {saved ? 'Saved!' : 'Save API Key'}
            </Button>
            {apiKey && (
              <Button
                onClick={() => { setDraftKey(''); setApiKey(''); }}
                size="md"
                variant="danger"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
