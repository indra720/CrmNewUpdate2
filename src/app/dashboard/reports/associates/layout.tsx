import type { ReactNode } from "react";
import type { Viewport } from "next";

// Ye server-side viewport config hai
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function AssociatesReportsLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Koi 'use client' yahan nahi lagega
  // Koi hooks nahi, koi browser-only cheez nahi
  return <>{children}</>;
}
