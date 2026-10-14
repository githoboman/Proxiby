'use client';
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Lock, Zap } from 'lucide-react';
import type { Conversation, Message } from '@/types';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_ADDRESS } from '@/lib/mockData';
import { truncateAddress } from '@/lib/botchain';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { SpamBadge } from '@/components/ui/Badge';
import { formatTimeAgo, EmptyState, LoadingDots } from '@/components/ui/Utils';
import { useWallet } from '@/context/WalletContext';
import { getSmartReplies } from '@/lib/claude';

export default function DMView() {
  const { apiKey, wallet } = useWallet();
  const currentAddress = wallet.address || MOCK_ADDRESS;

  const [conversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const selectConversation = (conv: Conversation) => {
    setActiveConv(conv);
    const msgs = MOCK_MESSAGES[conv.participant] || [];
    setMessages(msgs);
    setSmartReplies([]);

    // Load smart replies from last incoming message
    const lastIncoming = [...msgs].reverse().find(m => m.sender !== currentAddress && m.sender !== MOCK_ADDRESS);
    if (lastIncoming && apiKey) {
      setLoadingReplies(true);
      getSmartReplies(lastIncoming.content, apiKey)
        .then(setSmartReplies)
        .catch(() => setSmartReplies(['Got it!', 'Thanks!', 'Sounds good!', 'Tell me more.']))
        .finally(() => setLoadingReplies(false));
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !activeConv) return;
    setSending(true);
    await new Promise(res => setTimeout(res, 500));

    const newMsg: Message = {
      id: `m${Date.now()}`,
      sender: currentAddress,
      recipient: activeConv.participant,
      content: input.trim(),
      timestamp: Date.now(),
      isRead: true,
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setSending(false);
    setSmartReplies([]);
  };

  return (
    <div className="h-full flex">
      {/* Conversation list */}
      <div className="w-72 shrink-0 border-r border-[#2d2e3a] flex flex-col">
        <div className="p-4 border-b border-[#2d2e3a]">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare size={18} className="text-purple-400" />
            <h2 className="font-bold text-white">Direct Messages</h2>
          </div>
          <p className="text-[#6b7280] text-xs">E2E encrypted · BOT Chain On-Chain Pointer</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => selectConversation(conv)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left ${
                activeConv?.id === conv.id
                  ? 'bg-purple-500/15 border border-purple-500/20'
                  : 'hover:bg-[#22232e] border border-transparent'
              }`}
            >
              <div className="relative">
                <Avatar address={conv.participant} bnsName={conv.participantBotName || conv.participantBns} size="sm" />
                {conv.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">
                  {conv.participantBotName || conv.participantBns || truncateAddress(conv.participant)}
                </p>
                <p className="text-[#6b7280] text-xs truncate">
                  {conv.lastMessage?.content || 'Start a conversation'}
                </p>
              </div>
              {conv.lastMessage && (
                <span className="text-[#6b7280] text-xs shrink-0">
                  {formatTimeAgo(conv.lastMessage.timestamp)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeConv ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-[#2d2e3a] flex items-center gap-3 shrink-0">
              <Avatar address={activeConv.participant} bnsName={activeConv.participantBotName || activeConv.participantBns} size="sm" />
              <div>
                <p className="text-white font-semibold text-sm">
                  {activeConv.participantBotName || activeConv.participantBns || truncateAddress(activeConv.participant)}
                </p>
                <p className="text-[#6b7280] text-xs font-mono">{truncateAddress(activeConv.participant, 10)}</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <Lock size={12} />
                <span>TweetNaCl E2E Encrypted</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <MessageBubble key={msg.id} message={msg} index={i} currentAddress={currentAddress} />
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Smart replies */}
            {(smartReplies.length > 0 || loadingReplies) && (
              <div className="px-4 py-2 flex gap-2 flex-wrap border-t border-[#2d2e3a] bg-[#1a1b23]">
                {loadingReplies ? (
                  <div className="flex items-center gap-2 text-[#6b7280] text-xs">
                    <Zap size={12} className="text-purple-400" />
                    <LoadingDots />
                  </div>
                ) : (
                  <>
                    <span className="text-[#6b7280] text-xs flex items-center gap-1">
                      <Zap size={12} className="text-purple-400" /> AI Suggestions:
                    </span>
                    {smartReplies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(reply)}
                        className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs hover:bg-purple-500/20 transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-[#2d2e3a] shrink-0">
              <div className="flex items-end gap-3 bg-[#22232e] rounded-2xl border border-[#2d2e3a] p-3">
                <textarea
                  id="dm-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Type an encrypted message (Enter to send, Shift+Enter for newline)"
                  rows={1}
                  className="flex-1 bg-transparent text-[#f0f0f8] placeholder-[#6b7280] text-sm resize-none outline-none"
                />
                <Button
                  id="dm-send-btn"
                  onClick={sendMessage}
                  loading={sending}
                  disabled={!input.trim()}
                  size="sm"
                >
                  <Send size={14} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            icon="💬"
            title="Select a contact"
            subtitle="Choose a conversation from the left to start encrypted messaging on BOT Chain"
          />
        )}
      </div>
    </div>
  );
}

function MessageBubble({ message, index, currentAddress }: { message: Message; index: number; currentAddress: string }) {
  const isOwn = message.sender.toLowerCase() === currentAddress.toLowerCase() || message.sender === MOCK_ADDRESS;

  return (
    <div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="max-w-[70%] space-y-1">
        {message.spamVerdict && (
          <div className={`mb-1 ${isOwn ? 'text-right' : 'text-left'}`}>
            <SpamBadge verdict={message.spamVerdict.verdict} confidence={message.spamVerdict.confidence} />
            <p className="text-xs text-[#6b7280] mt-0.5">{message.spamVerdict.reason}</p>
          </div>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isOwn
              ? 'gradient-bg text-white rounded-br-sm shadow-md shadow-purple-900/20'
              : 'bg-[#22232e] text-[#e0e0f0] border border-[#2d2e3a] rounded-bl-sm'
          }`}
        >
          {message.content}
        </div>
        <p className={`text-xs text-[#6b7280] ${isOwn ? 'text-right' : 'text-left'}`}>
          {formatTimeAgo(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
