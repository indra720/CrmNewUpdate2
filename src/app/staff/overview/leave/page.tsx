'use client';

import DashboardLayout from "../dashboardlayout/page";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Clock, Check, X, Umbrella, Heart, Plane } from "lucide-react";

const leaveBalance = [
  { type: "Casual Leave", total: 12, used: 6, remaining: 6, icon: Umbrella, color: "text-primary" },
  { type: "Sick Leave", total: 12, used: 2, remaining: 10, icon: Heart, color: "text-destructive" },
  { type: "Earned Leave", total: 15, used: 5, remaining: 10, icon: Plane, color: "text-success" },
];

const leaveHistory = [
  {
    id: "1",
    type: "Casual Leave",
    from: "20 Dec 2025",
    to: "21 Dec 2025",
    days: 2,
    status: "approved",
    reason: "Personal work",
    appliedOn: "05 Dec 2025",
  },
  {
    id: "2",
    type: "Sick Leave",
    from: "26 Nov 2025",
    to: "26 Nov 2025",
    days: 1,
    status: "approved",
    reason: "Not feeling well",
    appliedOn: "26 Nov 2025",
  },
  {
    id: "3",
    type: "Casual Leave",
    from: "15 Nov 2025",
    to: "15 Nov 2025",
    days: 1,
    status: "rejected",
    reason: "Family function",
    appliedOn: "10 Nov 2025",
  },
  {
    id: "4",
    type: "Earned Leave",
    from: "01 Oct 2025",
    to: "05 Oct 2025",
    days: 5,
    status: "approved",
    reason: "Vacation",
    appliedOn: "15 Sep 2025",
  },
];

const upcomingLeaves = [
  {
    id: "1",
    type: "Casual Leave",
    from: "20 Dec 2025",
    to: "21 Dec 2025",
    days: 2,
  },
];

export default function Leave() {
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="status-badge status-badge-pending"><Clock className="h-3 w-3 mr-1" /> Pending</span>;
      case "approved":
        return <span className="status-badge status-badge-present"><Check className="h-3 w-3 mr-1" /> Approved</span>;
      case "rejected":
        return <span className="status-badge status-badge-absent"><X className="h-3 w-3 mr-1" /> Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 bg-card shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Leave Management</h1>
            <p className="text-muted-foreground">Track your leave balance and history</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Apply Leave
          </Button>
        </div>

        {/* Leave Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {leaveBalance.map((leave, index) => {
            const IconComponent = leave.icon;
            
            return (
              <div 
                key={leave.type} 
                className="dashboard-card animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`h-12 w-12 rounded-xl bg-muted flex items-center justify-center ${leave.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{leave.type}</p>
                    <p className="text-sm text-muted-foreground">Annual entitlement</p>
                  </div>
                </div>
                
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-4xl font-bold text-foreground">{leave.remaining}</p>
                    <p className="text-sm text-muted-foreground">days remaining</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{leave.used} used</p>
                    <p>{leave.total} total</p>
                  </div>
                </div>
                
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${leave.color === 'text-primary' ? 'bg-primary' : leave.color === 'text-destructive' ? 'bg-destructive' : 'bg-success'}`}
                    style={{ width: `${(leave.remaining / leave.total) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Upcoming Leaves */}
        {upcomingLeaves.length > 0 && (
          <div className="dashboard-card bg-gradient-to-r from-primary/5 via-card to-card">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Leave
            </h2>
            {upcomingLeaves.map((leave) => (
              <div key={leave.id} className="flex items-center justify-between p-4 rounded-xl bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {leave.days}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{leave.type}</p>
                    <p className="text-sm text-muted-foreground">{leave.from} - {leave.to}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Cancel</Button>
              </div>
            ))}
          </div>
        )}

        {/* Leave History */}
        <div className="dashboard-card">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Leave History
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Duration</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Days</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Reason</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveHistory.map((leave, index) => (
                  <tr 
                    key={leave.id} 
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="py-3 px-4 font-medium text-foreground">{leave.type}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {leave.from === leave.to ? leave.from : `${leave.from} - ${leave.to}`}
                    </td>
                    <td className="py-3 px-4 text-foreground">{leave.days}</td>
                    <td className="py-3 px-4 text-muted-foreground">{leave.reason}</td>
                    <td className="py-3 px-4">{getStatusBadge(leave.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}