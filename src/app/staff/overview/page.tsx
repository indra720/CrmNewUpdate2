import { TrendingUp, Clock, Calendar, Target } from "lucide-react";
import React from 'react'; // Added React import for JSX
import  DashboardLayout  from "./dashboardlayout/page";
import { GreetingCard } from "./GreetingCard/GreetingCard";
import { WorkScheduleCard } from "./workschedulecard/page";
import { ReportingToCard } from "./reportingtocard/page";
import { DepartmentMembersCard } from "./departmentmemberscard/page";
import { UpcomingHolidaysCard } from "./upcomingholiday/page";








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

const stats = [
  { label: "This Month", value: "22 Days", icon: Calendar, color: "text-primary" },
  { label: "Avg Hours/Day", value: "8.5 hrs", icon: Clock, color: "text-success" },
  { label: "On-Time Rate", value: "96%", icon: TrendingUp, color: "text-warning" },
  { label: "Tasks Done", value: "47", icon: Target, color: "text-primary" },
];

export default function Overview() {
  return (
    <DashboardLayout>
        {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="dashboard-card flex items-center gap-4 animate-fade-in bg-white rounded-md shadow-sm p-6"
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
        ))}
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
