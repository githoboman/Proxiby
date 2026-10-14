'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { WalletState } from '@/types';
import {
  MOCK_ADDRESS,
} from '@/lib/mockData';
import {
  BOT_NETWORKS,
  switchOrAddBotChain,
  fetchNativeBalance,
  formatBotName,
} from '@/lib/botchain';

interface WalletContextType {
  wallet: WalletState;
  apiKey: string;
  setApiKey: (key: string) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (network: 'bohr-testnet' | 'bot-mainnet') => Promise<void>;
  isConnecting: boolean;
  hasInjectedWallet: boolean;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

const DEFAULT_WALLET: WalletState = {
  connected: false,
  address: null,
  botName: null,
  network: 'bohr-testnet',
  chainId: 968,
  balance: '0.000',
  isAgent: false,
};

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>(DEFAULT_WALLET);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasInjectedWallet, setHasInjectedWallet] = useState(false);
  const [apiKey, setApiKeyState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('skela_api_key') || '';
    }
    return '';
  });

  // Check for window.ethereum on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      setHasInjectedWallet(true);

      const eth = (window as any).ethereum;
      const handleAccountsChanged = (accounts: string[]) => {
        if (!accounts || accounts.length === 0) {
          setWallet(DEFAULT_WALLET);
        } else {
          const addr = accounts[0];
          fetchNativeBalance(addr, wallet.network).then(bal => {
            setWallet(prev => ({
              ...prev,
              connected: true,
              address: addr,
              botName: prev.botName || formatBotName(addr.slice(2, 8)),
              balance: bal,
            }));
          });
        }
      };

      const handleChainChanged = (chainIdHex: string) => {
        const id = parseInt(chainIdHex, 16);
        const net = id === 677 ? 'bot-mainnet' : 'bohr-testnet';
        setWallet(prev => ({
          ...prev,
          chainId: id,
          network: net,
        }));
      };

      eth.on?.('accountsChanged', handleAccountsChanged);
      eth.on?.('chainChanged', handleChainChanged);

      return () => {
        eth.removeListener?.('accountsChanged', handleAccountsChanged);
        eth.removeListener?.('chainChanged', handleChainChanged);
      };
    }
  }, [wallet.network]);

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('skela_api_key', key);
    }
  }, []);

  const refreshBalance = useCallback(async () => {
    if (wallet.address) {
      const bal = await fetchNativeBalance(wallet.address, wallet.network);
      setWallet(prev => ({ ...prev, balance: bal }));
    }
  }, [wallet.address, wallet.network]);

  const connect = useCallback(async () => {
    setIsConnecting(true);

    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const eth = (window as any).ethereum;
        const accounts = await eth.request({ method: 'eth_requestAccounts' });
        const chainIdHex = await eth.request({ method: 'eth_chainId' });
        let currentChainId = parseInt(chainIdHex, 16);

        // If not on BOT Chain, prompt to switch
        let activeNet: 'bohr-testnet' | 'bot-mainnet' = 'bohr-testnet';
        if (currentChainId !== 968 && currentChainId !== 677) {
          const switched = await switchOrAddBotChain('bohr-testnet');
          if (switched) {
            currentChainId = 968;
            activeNet = 'bohr-testnet';
          }
        } else {
          activeNet = currentChainId === 677 ? 'bot-mainnet' : 'bohr-testnet';
        }

        const userAddr = accounts[0];
        const bal = await fetchNativeBalance(userAddr, activeNet);

        setWallet({
          connected: true,
          address: userAddr,
          botName: 'ayo.bot',
          network: activeNet,
          chainId: currentChainId,
          balance: bal,
        });
        setIsConnecting(false);
        return;
      } catch (err: any) {
        console.warn('Injected wallet connection failed or dismissed, falling back to simulated connection:', err);
      }
    }

    // Fallback: Simulated BOT Chain connection for preview/demo
    await new Promise(res => setTimeout(res, 1000));
    const bal = await fetchNativeBalance(MOCK_ADDRESS, 'bohr-testnet');
    setWallet({
      connected: true,
      address: MOCK_ADDRESS,
      botName: 'deployer.bot',
      network: 'bohr-testnet',
      chainId: 968,
      balance: bal || '0.000',
    });
    setIsConnecting(false);
  }, []);

  const disconnect = useCallback(() => {
    setWallet(DEFAULT_WALLET);
  }, []);

  const switchNetwork = useCallback(async (targetNet: 'bohr-testnet' | 'bot-mainnet') => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      await switchOrAddBotChain(targetNet);
    }
    const targetChainId = BOT_NETWORKS[targetNet].chainId;
    setWallet(prev => ({
      ...prev,
      network: targetNet,
      chainId: targetChainId,
    }));
    if (wallet.address) {
      const bal = await fetchNativeBalance(wallet.address, targetNet);
      setWallet(prev => ({ ...prev, balance: bal }));
    }
  }, [wallet.address]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        apiKey,
        setApiKey,
        connect,
        disconnect,
        switchNetwork,
        isConnecting,
        hasInjectedWallet,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}
