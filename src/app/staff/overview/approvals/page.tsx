'use client';

import DashboardLayout from "../dashboardlayout/page";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Clock, Calendar, FileText, AlertCircle } from "lucide-react";

const pendingApprovals = [
  {
    id: "1",
    type: "Leave Request",
    employee: "Priya Sharma",
    department: "Engineering",
    requestDate: "10 Dec 2025",
    details: "Casual Leave: 16-17 Dec 2025 (2 days)",
    reason: "Personal work",
    status: "pending",
  },
  {
    id: "2",
    type: "WFH Request",
    employee: "Rahul Kumar",
    department: "Engineering",
    requestDate: "09 Dec 2025",
    details: "Work from Home: 13 Dec 2025",
    reason: "Internet service installation at home",
    status: "pending",
  },
  {
    id: "3",
    type: "Overtime Request",
    employee: "Sneha Patel",
    department: "Engineering",
    requestDate: "08 Dec 2025",
    details: "Overtime: 07 Dec 2025 (3 hours)",
    reason: "Project deadline",
    status: "pending",
  },
];

const myRequests = [
  {
    id: "1",
    type: "Leave Request",
    requestDate: "05 Dec 2025",
    details: "Casual Leave: 20-21 Dec 2025 (2 days)",
    status: "approved",
    approvedBy: "Rajesh Gupta",
  },
  {
    id: "2",
    type: "WFH Request",
    requestDate: "01 Dec 2025",
    details: "Work from Home: 02 Dec 2025",
    status: "approved",
    approvedBy: "Rajesh Gupta",
  },
  {
    id: "3",
    type: "Leave Request",
    requestDate: "25 Nov 2025",
    details: "Sick Leave: 26 Nov 2025 (1 day)",
    status: "rejected",
    approvedBy: "Rajesh Gupta",
  },
];

export default function Approvals() {
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="bg-amber-100 text-amber-800 rounded-full px-2 py-1 text-xs font-medium inline-flex items-center gap-1"><Clock className="h-3 w-3 mr-1" /> Pending</span>;
      case "approved":
        return <span className="bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium inline-flex items-center gap-1"><Check className="h-3 w-3 mr-1" /> Approved</span>;
      case "rejected":
        return <span className="bg-red-100 text-red-800 rounded-full px-2 py-1 text-xs font-medium inline-flex items-center gap-1"><X className="h-3 w-3 mr-1" /> Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 bg-card shadow-sm rounded-md p-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Approvals</h1>
          <p className="text-muted-foreground">Manage pending requests and track your applications</p>
        </div>

        {/* Pending Approvals (for manager role) */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Pending Approvals
            </h2>
            <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-sm font-medium">
              {pendingApprovals.length} pending
            </span>
          </div>

          <div className="space-y-4">
            {pendingApprovals.map((request, index) => (
              <div
                key={request.id}
                className="p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {request.employee.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{request.employee}</span>
                        <span className="text-sm text-muted-foreground">• {request.department}</span>
                      </div>
                      <p className="text-sm font-medium text-primary mb-1">{request.type}</p>
                      <p className="text-sm text-foreground">{request.details}</p>
                      <p className="text-sm text-muted-foreground mt-1">Reason: {request.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                      <X className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-green-600 border-green-600/30 hover:bg-green-600/10">
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Requests */}
        <div className="dashboard-card">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            My Requests
          </h2>

          <div className="space-y-3">
            {myRequests.map((request, index) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/30 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{request.type}</p>
                    <p className="text-sm text-muted-foreground">{request.details}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center">
                    {getStatusBadge(request.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">by {request.approvedBy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}