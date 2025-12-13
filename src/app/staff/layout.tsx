'use client';

import { StaffSidebar } from '@/components/layout/staff-sidebar';
import { Header } from '@/components/layout/header';
import { MarketingProvider } from '@/components/marketing/provider';
import { useState } from 'react';

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <MarketingProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <StaffSidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
          <Header setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 p-4 sm:px-6 sm:py-0 md:p-8">
              {children}
          </main>
        </div>
      </div>
    </MarketingProvider>
  );
}
