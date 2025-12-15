'use client';

import { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { EmployeeCard } from "@/app/staff/overview/EmployeeCard/EmployeeCard";
import { NavigationTabs } from "@/app/staff/overview/Navigation/NavigationTabs";

const tabs = [
  { id: "overview", label: "Overview", path: "/staff/overview" },
  { id: "activities", label: "Activities", path: "/staff/overview/activities" },
  { id: "feeds", label: "Feeds", path: "/staff/overview/feeds" },
  { id: "profile", label: "Profile", path: "/staff/overview/profile" },
  { id: "approvals", label: "Approvals", path: "/staff/overview/approvals" },
  { id: "leave", label: "Leave", path: "/staff/overview/leave" },
  { id: "attendance", label: "Attendance", path: "/staff/overview/attendance" },
  { id: "location", label: "Location", path: "/staff/overview/location" },
  
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const activeTab =
    [...tabs].sort((a, b) => b.path.length - a.path.length).find(tab => pathname.startsWith(tab.path))?.id || "overview";

  const checkInTime = new Date();
  checkInTime.setHours(checkInTime.getHours() - 6);
  checkInTime.setMinutes(checkInTime.getMinutes() - 43);

  const handleTabChange = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) router.push(tab.path);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        <EmployeeCard
          employeeId="VL12438"
          name="Ajit Singh"
          jobTitle="Technical Lead"
          isCheckedIn={true}
          checkInTime={checkInTime}
          checkInLocation="TechCorp Solutions, Sector 62, Noida, UP 201301"
        />

        
          <NavigationTabs
            tabs={tabs.map(t => ({ id: t.id, label: t.label }))}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
       

        {children}
      </div>
    </div>
  );
}







