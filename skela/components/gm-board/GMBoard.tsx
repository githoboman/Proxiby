'use client';
import React, { useState } from 'react';
import { Zap, Send, ExternalLink, ShieldCheck } from 'lucide-react';
import type { GMPost } from '@/types';
import { MOCK_GM_POSTS, MOCK_ADDRESS } from '@/lib/mockData';
import { truncateAddress, formatBotName, getExplorerTxUrl } from '@/lib/botchain';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { formatTimeAgo } from '@/components/ui/Utils';
import { useWallet } from '@/context/WalletContext';

export default function GMBoard() {
  const { wallet, refreshBalance } = useWallet();
  const [posts, setPosts] = useState<GMPost[]>(MOCK_GM_POSTS);
  const [message, setMessage] = useState('');
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    if (!message.trim() || message.length > 140) return;
    setPosting(true);

    // Fast block inclusion simulation (~0.75s on BOT Chain)
    await new Promise(res => setTimeout(res, 800));

    const randomHex = Math.random().toString(16).substring(2, 8);
    const newPost: GMPost = {
      id: posts.length + 1,
      author: wallet.address || MOCK_ADDRESS,
      authorBotName: wallet.botName || 'ayo.bot',
      message: message.trim(),
      blockNumber: 421895 + posts.length,
      timestamp: Date.now(),
      txHash: `0x${randomHex}...${Math.random().toString(16).substring(2, 6)}`,
    };

    setPosts([newPost, ...posts]);
    setMessage('');
    setPosting(false);
    refreshBalance();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#2d2e3a] shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Zap size={18} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">GM Board</h2>
              <p className="text-[#6b7280] text-sm">Public on-chain feed anchored to BOT Chain blocks</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#22232e] border border-[#2d2e3a] text-xs text-[#9ca3af]">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Fast 0.75s Finality · ~$0.06 Gas</span>
          </div>
        </div>

        {/* Compose */}
        <div className="bg-[#22232e] rounded-2xl border border-[#2d2e3a] p-4">
          <textarea
            id="gm-compose"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Say GM to the BOT Chain & DePIN community… (max 140 chars)"
            maxLength={140}
            rows={2}
            className="w-full bg-transparent text-[#f0f0f8] placeholder-[#6b7280] text-sm resize-none outline-none"
          />
          <div className="flex items-center justify-between mt-3">
            <span className={`text-xs ${message.length > 120 ? 'text-amber-400' : 'text-[#6b7280]'}`}>
              {message.length}/140
            </span>
            <Button
              id="gm-post-btn"
              onClick={handlePost}
              loading={posting}
              disabled={!message.trim()}
              size="sm"
            >
              <Send size={14} />
              Post to BOT Chain
            </Button>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {posts.map((post, i) => (
          <GMPostCard key={post.id} post={post} index={i} network={wallet.network} />
        ))}
      </div>
    </div>
  );
}

function GMPostCard({ post, index, network }: { post: GMPost; index: number; network: 'bohr-testnet' | 'bot-mainnet' }) {
  return (
    <div
      className="bg-[#1a1b23] rounded-2xl border border-[#2d2e3a] p-4 hover:border-purple-500/30 transition-all duration-200 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-3">
        <Avatar address={post.author} bnsName={post.authorBotName} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-white font-semibold text-sm">
              {post.authorBotName || formatBotName(post.author.slice(2, 8))}
            </span>
            <span className="text-[#6b7280] text-xs font-mono">{truncateAddress(post.author, 6)}</span>
            <span className="text-[#6b7280] text-xs">·</span>
            <span className="text-[#6b7280] text-xs">{formatTimeAgo(post.timestamp)}</span>
            <span className="text-[#6b7280] text-xs">·</span>
            <span className="text-purple-400/80 text-[11px] font-mono bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
              Block #{post.blockNumber}
            </span>
          </div>

          <p className="text-[#e2e8f0] text-sm leading-relaxed mb-2 break-words">
            {post.message}
          </p>

          {post.txHash && (
            <div className="flex items-center gap-1.5">
              <a
                href={getExplorerTxUrl(post.txHash, network)}
                target="_blank"
                rel="noreferrer"
                className="text-[#6b7280] hover:text-purple-400 text-xs font-mono inline-flex items-center gap-1 transition-colors"
              >
                <span>Tx: {post.txHash}</span>
                <ExternalLink size={11} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
