'use client';

import { ReactNode, useState, useEffect, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import { EmployeeCard } from "@/app/staff/overview/EmployeeCard/EmployeeCard";
import { NavigationTabs } from "@/app/staff/overview/Navigation/NavigationTabs";
import { useToast } from "@/hooks/use-toast";

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

interface ProfileData {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  staff_id: string;
  user: {
    profile_image: string | null;
  }
}

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardLayoutContent({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [staffName, setStaffName] = useState("Staff Member");
  const [staffLocation, setStaffLocation] = useState("N/A");
  const [staffId, setStaffId] = useState("N/A");
  const [staffProfileImage, setStaffProfileImage] = useState<string | undefined>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authentication token not found.');
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/staff/profile/`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ProfileData = await response.json();
        setStaffName(data.name || "Staff Member");
        setStaffLocation(`${data.address}, ${data.city}, ${data.state} ${data.pincode}` || "N/A");
        setStaffId(data.staff_id || "N/A");
        if (data.user?.profile_image) {
          setStaffProfileImage(`${process.env.NEXT_PUBLIC_API_BASE_URL}${data.user.profile_image}`);
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: "Failed to load staff profile for dashboard.",
          variant: "destructive",
        });
      }
    };

    fetchProfile();
  }, [toast]);

  const activeTab =
    [...tabs].sort((a, b) => b.path.length - a.path.length).find(tab => pathname.startsWith(tab.path))?.id || "overview";

  const handleTabChange = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) router.push(tab.path);
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto space-y-6">

        <EmployeeCard
          employeeId={staffId}
          name={staffName}
          jobTitle="Technical Lead"
          profileImageUrl={staffProfileImage}
          initialIsCheckedIn={false}
          checkInLocation={staffLocation}
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

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
