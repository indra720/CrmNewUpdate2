import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { EmployeeCard } from "@/app/staff/overview/EmployeeCard/EmployeeCard"
import { NavigationTabs } from "@/app/staff/overview/Navigation/NavigationTabs";

const tabs = [
  { id: "overview", label: "Overview", path: "/overview" },
  { id: "activities", label: "Activities", path: "/activities" },
  { id: "feeds", label: "Feeds", path: "/feeds" },
  { id: "profile", label: "Profile", path: "/profile" },
  { id: "approvals", label: "Approvals", path: "/approvals" },
  { id: "leave", label: "Leave", path: "/leave" },
  { id: "attendance", label: "Attendance", path: "/attendance" },
  { id: "location", label: "Location", path: "/location" },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const activeTab = tabs.find(tab => tab.path === location.pathname)?.id || "overview";
  
  // Simulate check-in time (6 hours and 43 minutes ago)
  const checkInTime = new Date();
  checkInTime.setHours(checkInTime.getHours() - 6);
  checkInTime.setMinutes(checkInTime.getMinutes() - 43);

  const handleTabChange = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      navigate(tab.path);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Employee Card */}
        <div className="animate-fade-in">
          <EmployeeCard
            employeeId="VL12438"
            name="Ajit Singh"
            jobTitle="Technical Lead"
            isCheckedIn={true}
            checkInTime={checkInTime}
            checkInLocation="TechCorp Solutions, Sector 62, Noida, UP 201301"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <NavigationTabs
            tabs={tabs.map(t => ({ id: t.id, label: t.label }))}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        {/* Page Content */}
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
