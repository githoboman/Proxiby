'use client';
import React, { useState } from 'react';
import { MessageSquare, Users, Globe, Search, Bot, Zap, Settings, LogOut, Copy, Check, ExternalLink } from 'lucide-react';
import type { DashboardView } from '@/types';
import { useWallet } from '@/context/WalletContext';
import Avatar from '@/components/ui/Avatar';
import { truncateAddress, BOT_NETWORKS, getExplorerAddressUrl } from '@/lib/botchain';

interface SidebarProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  onSettings: () => void;
}

const NAV_ITEMS: { id: DashboardView; label: string; icon: React.ReactNode; badge?: number }[] = [
  { id: 'gm-board', label: 'GM Board', icon: <Zap size={18} /> },
  { id: 'dms', label: 'Messages', icon: <MessageSquare size={18} />, badge: 2 },
  { id: 'groups', label: 'Groups', icon: <Users size={18} /> },
  { id: 'bot-identity', label: 'BOT Identity', icon: <Search size={18} /> },
  { id: 'ai-panel', label: 'AI Panel', icon: <Bot size={18} /> },
];

export default function Sidebar({ activeView, onViewChange, onSettings }: SidebarProps) {
  const { wallet, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (!wallet.address) return;
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const netConfig = BOT_NETWORKS[wallet.network];

  return (
    <aside className="w-64 h-full flex flex-col glass border-r border-[#2d2e3a] shrink-0">
      {/* Logo & Network Status */}
      <div className="p-5 border-b border-[#2d2e3a]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-purple-900/30">
              <Globe size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-none tracking-wide">SKELA</h1>
              <p className="text-[#9ca3af] text-[11px] mt-0.5 font-medium">BOT Chain L1</p>
            </div>
          </div>

          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20"
            title={`Connected to ${netConfig.name} (ChainID ${wallet.chainId})`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-purple-300 text-[11px] font-semibold">{wallet.chainId === 677 ? 'Mainnet' : 'Bohr (968)'}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="text-[#6b7280] text-xs font-semibold uppercase tracking-wider px-3 py-2">Navigation</p>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            onClick={() => onViewChange(item.id)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left
              ${activeView === item.id
                ? 'gradient-bg text-white shadow-md shadow-purple-900/30 font-semibold'
                : 'text-[#9ca3af] hover:text-white hover:bg-[#22232e]'
              }
            `}
          >
            {item.icon}
            <span className="flex-1">{item.label}</span>
            {item.badge && activeView !== item.id && (
              <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-bold">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Balance & User profile */}
      <div className="p-3 border-t border-[#2d2e3a] space-y-2">
        {/* Token Balance Pill */}
        <div className="px-3 py-2 rounded-xl bg-[#1c1d27] border border-[#2d2e3a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-[#9ca3af] text-xs font-medium">Balance</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-xs font-bold text-white">
            <span>{wallet.balance}</span>
            <span className="text-purple-400">{netConfig.symbol}</span>
          </div>
        </div>

        <button
          onClick={onSettings}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-[#9ca3af] hover:text-white hover:bg-[#22232e] transition-all duration-200"
        >
          <Settings size={16} />
          <span>Settings & Network</span>
        </button>

        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#22232e] border border-[#2d2e3a]">
          <Avatar address={wallet.address || '0x00'} bnsName={wallet.botName || undefined} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-white text-sm font-semibold truncate">{wallet.botName || 'Anonymous.bot'}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <p className="text-[#6b7280] text-xs font-mono truncate">{truncateAddress(wallet.address || '', 5)}</p>
              <button
                onClick={copyAddress}
                title="Copy Address"
                className="text-[#6b7280] hover:text-white transition-colors"
              >
                {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
              </button>
              <a
                href={getExplorerAddressUrl(wallet.address || '', wallet.network)}
                target="_blank"
                rel="noreferrer"
                title="View on BOT Explorer"
                className="text-[#6b7280] hover:text-purple-400 transition-colors"
              >
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
          <button
            onClick={disconnect}
            title="Disconnect"
            className="p-1.5 rounded-lg text-[#6b7280] hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
