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
    <nav className="dashboard-card p-2">
      <div className="flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "nav-tab rounded-lg whitespace-nowrap",
              activeTab === tab.id && "nav-tab-active bg-accent"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
