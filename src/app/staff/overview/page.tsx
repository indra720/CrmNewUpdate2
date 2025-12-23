'use client';
import { TrendingUp, Clock, Calendar, Target, TrendingDown } from "lucide-react";
import React, { useEffect, useState } from 'react';
import DashboardLayout from "./dashboardlayout/page";
import { GreetingCard } from "./GreetingCard/GreetingCard";

import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { WorkScheduleCard } from "./WorkScheduleCard";
import { ReportingToCard } from "./ReportingToCard";
import { DepartmentMembersCard } from "./DepartmentMembersCard";
import { UpcomingHolidaysCard } from "./UpcomingHolidaysCard";


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
          <GreetingCard name={""} />

          <WorkScheduleCard />
        </div>
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2">

          <ReportingToCard />


          <DepartmentMembersCard />
          <UpcomingHolidaysCard />
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