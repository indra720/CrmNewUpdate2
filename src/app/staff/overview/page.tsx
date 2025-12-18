'use client';
import { TrendingUp, Clock, Calendar, Target, TrendingDown } from "lucide-react";
import React, { useEffect, useState } from 'react';
import DashboardLayout from "./dashboardlayout/page";
import { GreetingCard } from "./GreetingCard/GreetingCard";
import { WorkScheduleCard } from "./workschedulecard/page";
import { ReportingToCard } from "./reportingtocard/page";
import { DepartmentMembersCard } from "./departmentmemberscard/page";
import { UpcomingHolidaysCard } from "./upcomingholiday/page";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";


// ... (existing workDays, departmentMembers, upcomingHolidays) ...

interface StatItem {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

export default function Overview() {
  const { toast } = useToast();
  const [statsData, setStatsData] = useState<StatItem[]>([
    { label: "This Month", value: "0 Days", icon: Calendar, color: "text-primary" },
    { label: "Avg Hours/Day", value: "0 hrs", icon: Clock, color: "text-success" },
    { label: "On-Time Rate", value: "0%", icon: TrendingDown, color: "text-warning" },
    { label: "Tasks Done", value: "0", icon: Target, color: "text-primary" },
  ]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          toast({
            title: "Authentication Error",
            description: "No auth token found. Please log in.",
            variant: "destructive",
          });
          setIsLoadingStats(false);
          return;
        }

        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const monthParam = `${year}-${month}`;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/attendance/tracker/?month=${monthParam}`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setStatsData(prevStats => prevStats.map(stat => {
          if (stat.label === "This Month") {
            return { ...stat, value: `${data.present_days || 0} Days` };
          }
          if (stat.label === "Avg Hours/Day") {
            return { ...stat, value: `${data.avg_working_hours ? data.avg_working_hours.toFixed(1) : 0} hrs` };
          }
          if (stat.label === "On-Time Rate") {
            return { ...stat, label: "Late Arrivals", value: `${data.late_arrivals || 0}` };
          }
          if (stat.label === "Tasks Done") {
            return { ...stat, label: "Absent Days", value: `${data.absent_days || 0} Days` };
          }
          return stat;
        }));

      } catch (error: any) {
        console.error("Failed to fetch attendance tracker stats:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load attendance stats.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const workDays = [
    { day: "Mon", date: 8, status: "present" as const, hours: "21:06 hrs" },
    { day: "Tue", date: 9, status: "present" as const, hours: "19:03 hrs" },
    { day: "Wed", date: 10, status: "present" as const, hours: "22:34 hrs" },
    { day: "Thu", date: 11, status: "today" as const },
    { day: "Fri", date: 12, status: "absent" as const },
    { day: "Sat", date: 13, status: "weekend" as const },
    { day: "Sun", date: 14, status: "weekend" as const },
  ];
  
  const departmentMembers = [
    { id: "1", name: "Priya Sharma", status: "present" as const },
    { id: "2", name: "Rahul Kumar", status: "present" as const },
    { id: "3", name: "Sneha Patel", status: "yet-to-check-in" as const },
    { id: "4", name: "Vikram Singh", status: "present" as const },
  ];
  
  const upcomingHolidays = [
    { id: "1", name: "Christmas", date: "25 Dec 2025", icon: "🎄" },
    { id: "2", name: "New Year", date: "01 Jan 2026", icon: "🎉" },
  ];

  return (
    <DashboardLayout>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoadingStats ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="dashboard-card flex items-center gap-4 border border-border bg-card rounded-md shadow-sm p-6">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div>
                <Skeleton className="h-7 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))
        ) : (
          statsData.map((stat, index) => (
            <div
              key={stat.label}
              className="dashboard-card flex items-center gap-4 animate-fade-in border border-border bg-card rounded-md shadow-sm p-6"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`h-12 w-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GreetingCard name={""}/>
          
          <WorkScheduleCard weekRange="08-14 Dec 2025" shiftType="Flexi Shift -24hrs" days={workDays}/>
        </div>
        <div className="space-y-6">
          
          <ReportingToCard managerName={"Rajesh Gupta"} managerTitle={"Engineering Manager"} status={"yet-to-check-in"}/>
         
          
          <DepartmentMembersCard members={departmentMembers} departmentName={"Engineering"}/> 
          <UpcomingHolidaysCard holidays={upcomingHolidays}/>
        </div>
      </div>
    </DashboardLayout>
  );
}













// {
//     "present_days": 0,
//     "absent_days": 31,
//     "late_arrivals": 1,
//     "avg_working_hours": 0
// }