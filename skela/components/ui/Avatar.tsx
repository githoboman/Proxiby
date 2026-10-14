'use client';
import React from 'react';

interface AvatarProps {
  address: string;
  bnsName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const COLORS = [
  'from-purple-500 to-indigo-600',
  'from-pink-500 to-rose-600',
  'from-amber-500 to-orange-600',
  'from-emerald-500 to-teal-600',
  'from-sky-500 to-blue-600',
  'from-violet-500 to-purple-600',
];

function getColor(address: string): string {
  const idx = address.charCodeAt(2) % COLORS.length;
  return COLORS[idx];
}

function getInitials(address: string, bnsName?: string): string {
  if (bnsName) return bnsName.slice(0, 2).toUpperCase();
  return address.slice(2, 4).toUpperCase();
}

export default function Avatar({ address, bnsName, size = 'md' }: AvatarProps) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br ${getColor(address)} flex items-center justify-center font-bold text-white shrink-0`}
    >
      {getInitials(address, bnsName)}
    </div>
  );
}
