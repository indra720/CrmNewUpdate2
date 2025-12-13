'use client';

import { MarketingDialog } from "@/components/marketing/dialog";
import { usePathname } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useMarketingDialog } from "@/components/marketing/provider";
import React from "react";

const MarketingFlowContent = () => {
  const { openDialog } = useMarketingDialog();
  const pathname = usePathname();

  useEffect(() => {
    const pathParts = pathname.split('/');
    const platform = pathParts[pathParts.length - 1];

    if (platform) {
        const platformTitle = platform.charAt(0).toUpperCase() + platform.slice(1);
        openDialog(platformTitle, platform);
    }
  }, [pathname, openDialog]);

  return <MarketingDialog />;
}

export function MarketingFlowClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MarketingFlowContent />
    </Suspense>
  );
}
