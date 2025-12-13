'use client';

import { MarketingProvider } from "@/components/marketing/provider";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <MarketingProvider children={""}>
      {children}
    </MarketingProvider>
  );
}