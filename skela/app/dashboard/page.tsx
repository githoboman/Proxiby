'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { DashboardView } from '@/types';
import Sidebar from '@/components/layout/Sidebar';
import GMBoard from '@/components/gm-board/GMBoard';
import DMView from '@/components/dms/DMView';
import GroupsView from '@/components/groups/GroupsView';
import BotIdentitySearch from '@/components/bns/BotIdentitySearch';
import AIPanel from '@/components/ai/AIPanel';
import SettingsModal from '@/components/settings/SettingsModal';
import { useWallet } from '@/context/WalletContext';

export default function DashboardPage() {
  const { wallet } = useWallet();
  const router = useRouter();
  const [activeView, setActiveView] = useState<DashboardView>('gm-board');
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Redirect to landing if not connected
  React.useEffect(() => {
    if (!wallet.connected) {
      router.push('/');
    }
  }, [wallet.connected, router]);

  if (!wallet.connected) return null;

  const views: Record<string, React.ReactNode> = {
    'gm-board': <GMBoard />,
    'dms': <DMView />,
    'groups': <GroupsView />,
    'bot-identity': <BotIdentitySearch />,
    'bns-search': <BotIdentitySearch />,
    'ai-panel': <AIPanel />,
  };

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onSettings={() => setSettingsOpen(true)}
      />
      <main className="flex-1 overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
        {views[activeView] || <GMBoard />}
      </main>
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
