'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Users, Send, Plus, Crown } from 'lucide-react';
import type { Group, Message } from '@/types';
import { MOCK_GROUPS, MOCK_GROUP_MESSAGES, MOCK_ADDRESS } from '@/lib/mockData';
import { truncateAddress } from '@/lib/botchain';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { formatTimeAgo, EmptyState } from '@/components/ui/Utils';
import { useWallet } from '@/context/WalletContext';

const BOT_MAP: Record<string, string> = {
  [MOCK_ADDRESS]: 'ayo.bot',
  '0xd9DC4F46d9da603A2A077A7190BAa85f4e2f05fe': 'satoshi.bot',
  '0x1111111111111111111111111111111111111111': 'nakamoto.bot',
  '0x2222222222222222222222222222222222222222': 'blockchief.bot',
  '0x3333333333333333333333333333333333333333': 'depin_master.bot',
  '0x4444444444444444444444444444444444444444': 'claude_agent.bot',
};

export default function GroupsView() {
  const { wallet } = useWallet();
  const currentAddress = wallet.address || MOCK_ADDRESS;

  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const selectGroup = (group: Group) => {
    setActiveGroup(group);
    setMessages(MOCK_GROUP_MESSAGES[group.id] || []);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !activeGroup) return;
    setSending(true);
    await new Promise(res => setTimeout(res, 400));
    const newMsg: Message = {
      id: `gm${Date.now()}`,
      sender: currentAddress,
      recipient: `group:${activeGroup.id}`,
      content: input.trim(),
      timestamp: Date.now(),
      isRead: true,
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setSending(false);
  };

  return (
    <div className="h-full flex">
      {/* Groups list */}
      <div className="w-72 shrink-0 border-r border-[#2d2e3a] flex flex-col">
        <div className="p-4 border-b border-[#2d2e3a]">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-purple-400" />
              <h2 className="font-bold text-white">Groups</h2>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="p-1.5 rounded-lg gradient-bg text-white hover:opacity-90 transition-opacity"
              title="Create group on BOT Chain"
            >
              <Plus size={14} />
            </button>
          </div>
          <p className="text-[#6b7280] text-xs">On-chain membership · Max 20 members</p>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {groups.map(group => (
            <button
              key={group.id}
              onClick={() => selectGroup(group)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left ${
                activeGroup?.id === group.id
                  ? 'bg-purple-500/15 border border-purple-500/20'
                  : 'hover:bg-[#22232e] border border-transparent'
              }`}
            >
              <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm shadow-purple-900/30">
                {group.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{group.name}</p>
                <p className="text-[#6b7280] text-xs">{group.members.length} members</p>
              </div>
              {group.creator.toLowerCase() === currentAddress.toLowerCase() && (
                <span title="You are the creator" className="shrink-0">
                  <Crown size={12} className="text-amber-400" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Group chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeGroup ? (
          <>
            <div className="p-4 border-b border-[#2d2e3a] flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
                {activeGroup.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{activeGroup.name}</p>
                <p className="text-[#6b7280] text-xs">{activeGroup.members.length} members · BOT Chain Smart Contract</p>
              </div>
              <button
                onClick={() => setShowMembers(true)}
                className="px-3 py-1.5 rounded-xl bg-[#22232e] border border-[#2d2e3a] text-[#9ca3af] text-xs hover:text-white hover:border-purple-500/30 transition-colors flex items-center gap-1.5"
              >
                <Users size={12} />
                Members
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => {
                const isOwn = msg.sender.toLowerCase() === currentAddress.toLowerCase() || msg.sender === MOCK_ADDRESS;
                const botName = BOT_MAP[msg.sender];
                return (
                  <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} gap-2 animate-fade-in`} style={{ animationDelay: `${i * 30}ms` }}>
                    {!isOwn && <Avatar address={msg.sender} bnsName={botName} size="xs" />}
                    <div className="max-w-[70%]">
                      {!isOwn && (
                        <p className="text-xs text-[#6b7280] mb-1 ml-1">{botName || truncateAddress(msg.sender)}</p>
                      )}
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isOwn ? 'gradient-bg text-white rounded-br-sm' : 'bg-[#22232e] text-[#e0e0f0] border border-[#2d2e3a] rounded-bl-sm'}`}>
                        {msg.content}
                      </div>
                      <p className={`text-xs text-[#6b7280] mt-1 ${isOwn ? 'text-right' : ''}`}>{formatTimeAgo(msg.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div className="p-4 border-t border-[#2d2e3a] shrink-0">
              <div className="flex items-end gap-3 bg-[#22232e] rounded-2xl border border-[#2d2e3a] p-3">
                <textarea
                  id="group-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Message group on BOT Chain…"
                  rows={1}
                  className="flex-1 bg-transparent text-[#f0f0f8] placeholder-[#6b7280] text-sm resize-none outline-none"
                />
                <Button id="group-send-btn" onClick={sendMessage} loading={sending} disabled={!input.trim()} size="sm">
                  <Send size={14} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState icon="👥" title="Select a group" subtitle="Choose a group from the left or create a new one on BOT Chain" />
        )}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        currentAddress={currentAddress}
        onCreated={group => {
          setGroups(prev => [...prev, group]);
          setShowCreate(false);
          selectGroup(group);
        }}
      />

      {/* Members Modal */}
      {activeGroup && (
        <MembersModal
          isOpen={showMembers}
          onClose={() => setShowMembers(false)}
          group={activeGroup}
        />
      )}
    </div>
  );
}

function CreateGroupModal({
  isOpen,
  onClose,
  onCreated,
  currentAddress,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (g: Group) => void;
  currentAddress: string;
}) {
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);

  const create = async () => {
    if (!name.trim()) return;
    setCreating(true);
    await new Promise(res => setTimeout(res, 800));
    onCreated({
      id: Date.now(),
      name: name.trim(),
      creator: currentAddress,
      members: [currentAddress],
      createdAt: Date.now(),
    });
    setName('');
    setCreating(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Group on BOT Chain" size="sm">
      <div className="space-y-4">
        <div>
          <label className="text-[#9ca3af] text-sm mb-1.5 block">Group Name</label>
          <input
            id="group-name-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. BOT Chain AI Builders"
            maxLength={64}
            className="w-full bg-[#22232e] border border-[#2d2e3a] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
        <p className="text-xs text-[#6b7280]">
          Creates an on-chain group record in <code>BotChainGroups.sol</code> with creator admin permissions.
        </p>
        <Button id="create-group-btn" onClick={create} loading={creating} disabled={!name.trim()} className="w-full" size="md">
          <Plus size={16} /> Deploy Group
        </Button>
      </div>
    </Modal>
  );
}

function MembersModal({ isOpen, onClose, group }: { isOpen: boolean; onClose: () => void; group: Group }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${group.name} — Members`} size="md">
      <div className="space-y-2">
        {group.members.map(addr => (
          <div key={addr} className="flex items-center gap-3 p-3 rounded-xl bg-[#22232e] border border-[#2d2e3a]">
            <Avatar address={addr} bnsName={BOT_MAP[addr]} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{BOT_MAP[addr] || truncateAddress(addr)}</p>
              <p className="text-[#6b7280] text-xs font-mono truncate">{truncateAddress(addr, 10)}</p>
            </div>
            {addr === group.creator && (
              <span className="flex items-center gap-1 text-amber-400 text-xs">
                <Crown size={12} /> Creator
              </span>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}
