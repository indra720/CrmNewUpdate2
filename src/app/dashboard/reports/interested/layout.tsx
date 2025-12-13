import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remaining Leads Reports",
  description: "View remaining leads",
};

// ✅ Inline type definition (Next.js 13.x ke liye)
export const viewport = {
  width: 'device-width' as const,
  initialScale: 1,
};

export default function InterestedReportsLayout({
  children,
}: {
  children: ReactNode;
}) {
  
  return <>{children}</>;
}
