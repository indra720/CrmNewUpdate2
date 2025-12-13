'use client';

import { MarketingProvider } from '@/components/marketing/provider';
import React from 'react';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <MarketingProvider children={''}>{children}</MarketingProvider>;
}