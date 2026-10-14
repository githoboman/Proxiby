'use client';
import React from 'react';
import type { SpamVerdictType } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'purple' | 'safe' | 'suspicious' | 'spam';
  size?: 'sm' | 'md';
}

export default function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  const variants = {
    default: 'bg-[#22232e] text-[#9ca3af] border-[#2d2e3a]',
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    safe: 'bg-green-500/15 text-green-400 border-green-500/25',
    suspicious: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    spam: 'bg-red-500/15 text-red-400 border-red-500/25',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}

export function SpamBadge({ verdict, confidence }: { verdict: SpamVerdictType; confidence: number }) {
  const icons = { SAFE: '🛡️', SUSPICIOUS: '⚠️', SPAM: '🚨' };
  const variants: Record<SpamVerdictType, 'safe' | 'suspicious' | 'spam'> = {
    SAFE: 'safe',
    SUSPICIOUS: 'suspicious',
    SPAM: 'spam',
  };
  return (
    <Badge variant={variants[verdict]}>
      {icons[verdict]} {verdict} ({confidence}%)
    </Badge>
  );
}
