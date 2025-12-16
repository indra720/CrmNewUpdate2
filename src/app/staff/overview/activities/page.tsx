'use client';


import { LogIn, LogOut, Coffee, MapPin, Clock } from "lucide-react";
import DashboardLayout from "../dashboardlayout/page";

const activities = [
  {
    id: "1",
    type: "check-in",
    title: "Checked In",
    time: "09:15 AM",
    date: "Today",
    location: "TechCorp Solutions, Sector 62, Noida",
    icon: LogIn,
    color: "bg-success/10 text-success",
  },
  {
    id: "2",
    type: "break",
    title: "Lunch Break Started",
    time: "01:00 PM",
    date: "Today",
    location: "Office Cafeteria",
    icon: Coffee,
    color: "bg-warning/10 text-warning",
  },
  {
    id: "3",
    type: "break-end",
    title: "Lunch Break Ended",
    time: "02:00 PM",
    date: "Today",
    location: "TechCorp Solutions, Sector 62, Noida",
    icon: LogIn,
    color: "bg-primary/10 text-primary",
  },
  {
    id: "4",
    type: "check-out",
    title: "Checked Out",
    time: "06:30 PM",
    date: "Yesterday",
    location: "TechCorp Solutions, Sector 62, Noida",
    icon: LogOut,
    color: "bg-destructive/10 text-destructive",
  },
  {
    id: "5",
    type: "check-in",
    title: "Checked In",
    time: "09:00 AM",
    date: "Yesterday",
    location: "TechCorp Solutions, Sector 62, Noida",
    icon: LogIn,
    color: "bg-success/10 text-success",
  },
];

export default function ActivitiesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 bg-card shadow-sm rounded-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Activities
            </h1>
            <p className="text-muted-foreground">
              Your recent attendance activities
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Last updated: Just now
          </div>
        </div>

        {/* Activity List */}
        <div className="dashboard-card">
          <div className="space-y-1">
            {activities.map((activity, index) => {
              const Icon = activity.icon;

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center ${activity.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">
                        {activity.title}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {activity.date}
                      </span>
                    </div>

                    <p className="text-sm text-primary font-medium mb-1">
                      {activity.time}
                    </p>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">
                        {activity.location}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}