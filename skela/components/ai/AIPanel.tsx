'use client';
import React, { useState } from 'react';
import { Bot, FileText, MessageSquare, Globe, Shield, Sparkles } from 'lucide-react';
import type { AITab } from '@/types';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { SpamBadge } from '@/components/ui/Badge';
import { LoadingDots } from '@/components/ui/Utils';
import { useWallet } from '@/context/WalletContext';
import {
  summarizeChat,
  getSmartReplies,
  translateMessage,
  detectSpam,
  findBotIdentity,
  SUPPORTED_LANGUAGES,
  type SpamResult,
} from '@/lib/claude';

const TABS: { id: AITab; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'summarizer', label: 'Summarizer', icon: <FileText size={15} />, desc: 'Summarize conversations' },
  { id: 'smart-replies', label: 'Smart Replies', icon: <MessageSquare size={15} />, desc: '4 context-aware reply suggestions' },
  { id: 'translator', label: 'Translator', icon: <Globe size={15} />, desc: '8 African & global languages' },
  { id: 'spam-detector', label: 'Scam Detector', icon: <Shield size={15} />, desc: 'Detect EVM phishing & drainers' },
  { id: 'agent-os', label: 'Agent OS & Identity', icon: <Sparkles size={15} />, desc: 'ERC-8004 metadata & .bot names' },
];

export default function AIPanel() {
  const [activeTab, setActiveTab] = useState<AITab>('summarizer');
  const { apiKey } = useWallet();

  const noKey = !apiKey;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#2d2e3a] shrink-0">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shadow-lg shadow-purple-900/30">
              <Bot size={18} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Panel & Agent OS</h2>
              <p className="text-[#6b7280] text-sm">Claude Sonnet 4 · DePIN & BOT Chain Native</p>
            </div>
          </div>
          <Badge variant="purple" size="md">claude-sonnet-4</Badge>
        </div>

        {noKey && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2 mb-4">
            <span className="text-amber-400 text-lg">⚠️</span>
            <p className="text-amber-300 text-xs leading-relaxed">
              No API key set. Go to <strong>Settings</strong> in the sidebar to add your Anthropic API key to enable live Claude inferences.
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {TABS.map(tab => (
            <button
              key={tab.id}
              id={`ai-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'gradient-bg text-white shadow-md shadow-purple-900/30'
                  : 'bg-[#22232e] text-[#9ca3af] border border-[#2d2e3a] hover:text-white hover:border-purple-500/30'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'summarizer' && <SummarizerTab apiKey={apiKey} />}
        {activeTab === 'smart-replies' && <SmartRepliesTab apiKey={apiKey} />}
        {activeTab === 'translator' && <TranslatorTab apiKey={apiKey} />}
        {activeTab === 'spam-detector' && <SpamDetectorTab apiKey={apiKey} />}
        {activeTab === 'agent-os' && <AgentOSTab apiKey={apiKey} />}
      </div>
    </div>
  );
}

// ─── Summarizer ────────────────────────────────────────────────────────────────

function SummarizerTab({ apiKey }: { apiKey: string }) {
  const [conversation, setConversation] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async () => {
    if (!conversation.trim() || !apiKey) return;
    setLoading(true); setError(''); setResult('');
    try {
      const res = await summarizeChat(conversation, apiKey);
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    }
    setLoading(false);
  };

  return (
    <AIFeatureLayout
      icon="📝"
      title="Chat Summarizer"
      description="Paste any message history or meeting transcript on BOT Chain to generate a crisp 3-5 bullet summary."
    >
      <textarea
        id="summarizer-input"
        value={conversation}
        onChange={e => setConversation(e.target.value)}
        placeholder="Paste chat messages here… (e.g. Alice: Let's launch the DePIN node on Bohr Testnet... Bob: Sounds great, average fees are $0.06...)"
        rows={6}
        className="w-full bg-[#22232e] border border-[#2d2e3a] rounded-xl p-4 text-white text-sm outline-none resize-none focus:border-purple-500/50 transition-colors placeholder-[#6b7280] mb-3"
      />
      <Button id="summarizer-btn" onClick={run} loading={loading} disabled={!conversation.trim() || !apiKey} size="md">
        Summarize Chat
      </Button>
      <AIResult result={result} loading={loading} error={error} />
    </AIFeatureLayout>
  );
}

// ─── Smart Replies ─────────────────────────────────────────────────────────────

function SmartRepliesTab({ apiKey }: { apiKey: string }) {
  const [lastMessage, setLastMessage] = useState('');
  const [replies, setReplies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async () => {
    if (!lastMessage.trim() || !apiKey) return;
    setLoading(true); setError(''); setReplies([]);
    try {
      const res = await getSmartReplies(lastMessage, apiKey);
      setReplies(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    }
    setLoading(false);
  };

  return (
    <AIFeatureLayout
      icon="💬"
      title="Smart Reply Suggestions"
      description="Enter an incoming message to generate 4 context-aware Web3 responses."
    >
      <input
        id="smart-replies-input"
        value={lastMessage}
        onChange={e => setLastMessage(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && run()}
        placeholder="e.g. 'Did you claim test tokens from faucet.botchain.ai?'"
        className="w-full bg-[#22232e] border border-[#2d2e3a] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-500/50 transition-colors placeholder-[#6b7280] mb-3"
      />
      <Button id="smart-replies-btn" onClick={run} loading={loading} disabled={!lastMessage.trim() || !apiKey} size="md">
        Generate Replies
      </Button>
      {loading && <div className="mt-4"><LoadingDots /></div>}
      {error && <ErrorBox error={error} />}
      {replies.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {replies.map((reply, i) => (
            <div key={i} className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200 text-xs">
              {reply}
            </div>
          ))}
        </div>
      )}
    </AIFeatureLayout>
  );
}

// ─── Translator ────────────────────────────────────────────────────────────────

function TranslatorTab({ apiKey }: { apiKey: string }) {
  const [text, setText] = useState('');
  const [targetLang, setTargetLang] = useState('Yoruba');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async () => {
    if (!text.trim() || !apiKey) return;
    setLoading(true); setError(''); setResult('');
    try {
      const res = await translateMessage(text, targetLang, apiKey);
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    }
    setLoading(false);
  };

  return (
    <AIFeatureLayout
      icon="🌍"
      title="Multi-Language Translator"
      description="Translate Web3 messages into African & international languages."
    >
      <div className="space-y-3">
        <textarea
          id="translator-input"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter text to translate…"
          rows={3}
          className="w-full bg-[#22232e] border border-[#2d2e3a] rounded-xl p-3 text-white text-sm outline-none resize-none focus:border-purple-500/50 placeholder-[#6b7280]"
        />
        <div className="flex items-center gap-3">
          <select
            value={targetLang}
            onChange={e => setTargetLang(e.target.value)}
            className="bg-[#22232e] border border-[#2d2e3a] text-white text-xs rounded-xl px-3 py-2 outline-none"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          <Button id="translate-btn" onClick={run} loading={loading} disabled={!text.trim() || !apiKey} size="sm">
            Translate
          </Button>
        </div>
        <AIResult result={result} loading={loading} error={error} />
      </div>
    </AIFeatureLayout>
  );
}

// ─── Scam Detector ─────────────────────────────────────────────────────────────

function SpamDetectorTab({ apiKey }: { apiKey: string }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState<SpamResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async () => {
    if (!text.trim() || !apiKey) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await detectSpam(text, apiKey);
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    }
    setLoading(false);
  };

  return (
    <AIFeatureLayout
      icon="🛡️"
      title="EVM Phishing & Scam Detector"
      description="Evaluate suspicious BOT Chain messages, fake airdrop links, and wallet drainers in real-time."
    >
      <textarea
        id="spam-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste suspicious message or airdrop link here…"
        rows={4}
        className="w-full bg-[#22232e] border border-[#2d2e3a] rounded-xl p-3 text-white text-sm outline-none resize-none focus:border-purple-500/50 placeholder-[#6b7280] mb-3"
      />
      <Button id="spam-detect-btn" onClick={run} loading={loading} disabled={!text.trim() || !apiKey} size="md">
        Analyze Security
      </Button>
      {loading && <div className="mt-4"><LoadingDots /></div>}
      {error && <ErrorBox error={error} />}
      {result && (
        <div className="mt-4 p-4 rounded-xl bg-[#1c1d27] border border-[#2d2e3a] space-y-2">
          <div className="flex items-center gap-2">
            <SpamBadge verdict={result.verdict} confidence={result.confidence} />
            <span className="text-xs text-[#9ca3af]">Confidence: {result.confidence}%</span>
          </div>
          <p className="text-sm text-[#e2e8f0]">{result.reason}</p>
        </div>
      )}
    </AIFeatureLayout>
  );
}

// ─── Agent OS & BOT Identity Assistant ─────────────────────────────────────────

function AgentOSTab({ apiKey }: { apiKey: string }) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async () => {
    if (!query.trim() || !apiKey) return;
    setLoading(true); setError(''); setResult('');
    try {
      const res = await findBotIdentity(query, apiKey);
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    }
    setLoading(false);
  };

  return (
    <AIFeatureLayout
      icon="🤖"
      title="Agent OS & .bot Identity Assistant"
      description="Describe your project, DePIN service, or autonomous AI Agent to receive optimized .bot names and ERC-8004 identity schemas for BOT Chain."
    >
      <textarea
        id="agent-os-input"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="e.g. 'I am creating an autonomous trading agent that monitors BOT DEX pools and pays low $0.06 fees. What .bot name and ERC-8004 metadata should I use?'"
        rows={4}
        className="w-full bg-[#22232e] border border-[#2d2e3a] rounded-xl p-4 text-white text-sm outline-none resize-none focus:border-purple-500/50 transition-colors placeholder-[#6b7280] mb-3"
      />
      <Button id="agent-os-btn" onClick={run} loading={loading} disabled={!query.trim() || !apiKey} size="md">
        Generate Agent Specifications
      </Button>
      <AIResult result={result} loading={loading} error={error} />
    </AIFeatureLayout>
  );
}

// ─── Shared Sub-components ─────────────────────────────────────────────────────

function AIFeatureLayout({
  icon,
  title,
  description,
  children,
}: {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h3 className="text-white font-bold text-base flex items-center gap-2 mb-1">
          <span>{icon}</span> {title}
        </h3>
        <p className="text-[#6b7280] text-xs">{description}</p>
      </div>
      {children}
    </div>
  );
}

function AIResult({ result, loading, error }: { result: string; loading: boolean; error: string }) {
  if (loading) return <div className="mt-4"><LoadingDots /></div>;
  if (error) return <ErrorBox error={error} />;
  if (!result) return null;
  return (
    <div className="mt-4 bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 animate-fade-in">
      <p className="text-purple-300 text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
    </div>
  );
}

function ErrorBox({ error }: { error: string }) {
  return (
    <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );
}
