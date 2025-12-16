'use client'
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface NavigationTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}



export function NavigationTabs({ tabs, activeTab, onTabChange }: NavigationTabsProps) {
  return (
    <nav className="bg-card rounded-2xl p-2 transition-shadow duration-200 shadow-sm hover:shadow-md">
      <div className="flex overflow-x-auto w-full max-w-[290px] md:max-w-[600px] lg:max-w-full gap-2 mobile-scrollbar pb-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base font-medium text-muted-foreground transition-colors hover:text-foreground rounded-lg whitespace-nowrap flex-shrink-0 snap-center",
              activeTab === tab.id && "text-primary border-b-2 border-primary bg-accent"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}