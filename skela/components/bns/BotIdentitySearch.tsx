'use client';
import React, { useState } from 'react';
import { Search, Copy, CheckCheck, Sparkles, PlusCircle, ShieldCheck, Bot, ExternalLink } from 'lucide-react';
import { searchUsers, registerUser, type MockBotUser, truncateAddress, formatBotName, getExplorerAddressUrl } from '@/lib/botchain';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useWallet } from '@/context/WalletContext';
import { findBNSIdentity } from '@/lib/claude';

export default function BotIdentitySearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MockBotUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Register .bot name
  const [registerInput, setRegisterInput] = useState('');
  const [registering, setRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);

  // AI Assistant
  const [aiQuery, setAiQuery] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const { apiKey, wallet } = useWallet();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    const res = await searchUsers(query.trim());
    setResults(res);
    setSearching(false);
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(address);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRegister = async () => {
    if (!registerInput.trim() || !wallet.address) return;
    setRegistering(true);
    await registerUser(wallet.address, registerInput.trim());
    setRegisterSuccess(`${formatBotName(registerInput.trim())} claimed on BOT Chain!`);
    setRegisterInput('');
    setRegistering(false);
    setTimeout(() => setRegisterSuccess(null), 4000);
  };

  const askAI = async () => {
    if (!aiQuery.trim() || !apiKey) return;
    setAiLoading(true);
    try {
      const result = await findBNSIdentity(aiQuery, apiKey);
      setAiResult(result);
    } catch (e) {
      setAiResult('Error connecting to Claude. Please check your Anthropic API key in Settings.');
    }
    setAiLoading(false);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Search size={18} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">BOT Chain Identity & Registry</h2>
              <p className="text-[#6b7280] text-sm">Resolve .bot domain names, EVM addresses, and ERC-8004 AI Agents</p>
            </div>
          </div>
        </div>

        {/* Claim .bot Domain Card */}
        <div className="bg-[#1c1d27] rounded-2xl border border-purple-500/20 p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-2">
            <PlusCircle size={18} className="text-purple-400" />
            <h3 className="text-white font-bold text-sm">Register Your .bot Name</h3>
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-medium">
              EVM Native
            </span>
          </div>
          <p className="text-[#9ca3af] text-xs mb-4">
            Bind your EVM wallet address to an immutable on-chain identity on BOT Chain.
          </p>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                value={registerInput}
                onChange={e => setRegisterInput(e.target.value)}
                placeholder="e.g. yourname (will become yourname.bot)"
                className="w-full bg-[#12131a] border border-[#2d2e3a] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-purple-500 transition-colors font-mono"
              />
            </div>
            <Button
              onClick={handleRegister}
              loading={registering}
              disabled={!registerInput.trim() || !wallet.connected}
              size="sm"
            >
              Claim .bot Name
            </Button>
          </div>

          {registerSuccess && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <ShieldCheck size={14} />
              <span>{registerSuccess}</span>
            </div>
          )}
        </div>

        {/* Search box */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
              <input
                id="bns-search-input"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search by .bot domain or 0x address…"
                className="w-full bg-[#22232e] border border-[#2d2e3a] rounded-xl pl-10 pr-4 py-3 text-white text-sm outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
            <Button id="bns-search-btn" onClick={handleSearch} loading={searching} size="md">
              Search
            </Button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Search Results</p>
              {results.map(user => (
                <div
                  key={user.address}
                  className="bg-[#1a1b23] rounded-2xl border border-[#2d2e3a] p-4 hover:border-purple-500/30 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar address={user.address} bnsName={user.botName} size="md" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-white font-bold text-base">{user.botName}</p>
                        {user.isAgent ? (
                          <span className="flex items-center gap-1 text-[11px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-semibold">
                            <Bot size={11} />
                            ERC-8004 AI Agent
                          </span>
                        ) : (
                          <Badge variant="purple">Registered .bot</Badge>
                        )}
                      </div>
                      <p className="text-[#6b7280] text-xs font-mono">{truncateAddress(user.address, 12)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => copyAddress(user.address)}
                      title="Copy Address"
                      className="p-2 rounded-xl bg-[#22232e] text-[#9ca3af] hover:text-white border border-[#2d2e3a] transition-colors"
                    >
                      {copied === user.address ? <CheckCheck size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                    <a
                      href={getExplorerAddressUrl(user.address, wallet.network)}
                      target="_blank"
                      rel="noreferrer"
                      title="View on BOT Explorer"
                      className="p-2 rounded-xl bg-[#22232e] text-[#9ca3af] hover:text-purple-400 border border-[#2d2e3a] transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.length === 0 && query && !searching && (
            <div className="p-8 text-center text-[#6b7280] text-sm bg-[#1a1b23] rounded-2xl border border-[#2d2e3a]">
              No matching .bot identity found on BOT Chain for &quot;{query}&quot;. You can claim it above!
            </div>
          )}
        </div>

        {/* AI Assistant Section */}
        <div className="p-5 rounded-2xl bg-[#1a1b23] border border-[#2d2e3a] space-y-3">
          <div className="flex items-center gap-2 text-pink-400 text-sm font-bold">
            <Sparkles size={16} />
            <span>Claude AI Identity & Domain Recommender</span>
          </div>
          <p className="text-[#9ca3af] text-xs">
            Ask Claude to analyze DePIN niches, suggest premium .bot names, or verify autonomous AI Agent metadata.
          </p>

          <div className="flex gap-2">
            <input
              value={aiQuery}
              onChange={e => setAiQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && askAI()}
              placeholder="e.g. Suggest names for an AI weather oracle on BOT Chain"
              className="flex-1 bg-[#12131a] border border-[#2d2e3a] rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-pink-500/50"
            />
            <Button onClick={askAI} loading={aiLoading} size="sm">
              Ask AI
            </Button>
          </div>

          {aiResult && (
            <div className="mt-3 p-4 rounded-xl bg-[#12131a] border border-pink-500/20 text-[#e2e8f0] text-xs leading-relaxed whitespace-pre-wrap">
              {aiResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
