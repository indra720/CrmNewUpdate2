"use client";

import { useState } from "react";
import {
  Users, UserCheck, UserX, Clock, Home, TrendingUp, ShieldCheck,
  Bell, Settings, LogOut, User, Download, FileText, Search,
  MapPin, AlertTriangle, CheckCircle2, XCircle, ChevronDown, Calendar,
  Building2, BarChart3, PieChart, ArrowUpRight, ArrowDownRight, Eye,
  ChevronLeft, ChevronRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, Legend
} from "recharts";

import DashboardLayout from "../dashboardlayout/page";


const colorMap = {
  primary: "text-primary bg-primary/10",
  success: "text-success bg-success/10",
  destructive: "text-destructive bg-destructive/10",
  warning: "text-warning bg-warning/10",
  info: "text-info bg-info/10",
  secondary: "text-secondary bg-secondary/10",
};

const kpiData = [
  { title: "Total Employees", value: "1,247", icon: Users, change: "+12", trend: "up", color: "primary" },
  { title: "Active Today", value: "1,089", icon: UserCheck, change: "+45", trend: "up", color: "success" },
  { title: "Absent Today", value: "67", icon: UserX, change: "-8", trend: "down", color: "destructive" },
  { title: "Late Check-ins", value: "23", icon: Clock, change: "+5", trend: "up", color: "warning" },
  { title: "On Leave", value: "54", icon: Calendar, change: "+3", trend: "up", color: "info" },
  { title: "Work From Home", value: "89", icon: Home, change: "+12", trend: "up", color: "secondary" },
  { title: "Avg Working Hours", value: "8.2h", icon: TrendingUp, change: "+0.3h", trend: "up", color: "success" },
  { title: "Compliance Rate", value: "94.2%", icon: ShieldCheck, change: "+2.1%", trend: "up", color: "success" },
];

const attendanceTrendData = [
  { day: "Mon", present: 1050, absent: 45, wfh: 78, leave: 74 },
  { day: "Tue", present: 1080, absent: 38, wfh: 82, leave: 47 },
  { day: "Wed", present: 1065, absent: 52, wfh: 75, leave: 55 },
  { day: "Thu", present: 1090, absent: 35, wfh: 80, leave: 42 },
  { day: "Fri", present: 1020, absent: 60, wfh: 95, leave: 72 },
];

const pieChartData = [
  { name: "Present", value: 1089, color: "#22c55e" },
  { name: "Absent", value: 67, color: "#ef4444" },
  { name: "On Leave", value: 54, color: "#f59e0b" },
  { name: "WFH", value: 89, color: "#3b82f6" },
];

const alerts = [
  { id: 1, type: "not_checked_in", message: "Rahul Sharma has not checked in", time: "Expected: 9:00 AM", severity: "warning" },
  { id: 2, type: "late", message: "Priya Patel arrived 45 mins late", time: "10:45 AM", severity: "error" },
  { id: 3, type: "geo_fence", message: "Amit Kumar checked in from outside geo-fence", time: "9:15 AM", severity: "error" },
  { id: 4, type: "missing_checkout", message: "Sneha Gupta missed yesterday's checkout", time: "Yesterday", severity: "warning" },
  { id: 5, type: "not_checked_in", message: "Vijay Singh has not checked in", time: "Expected: 9:30 AM", severity: "warning" },
];

const employeeAttendance = [
  { id: 1, name: "Rahul Sharma", dept: "Engineering", checkIn: "9:02 AM", checkOut: "6:15 PM", hours: "9h 13m", status: "Present", location: "Office", avatar: "" },
  { id: 2, name: "Priya Patel", dept: "Design", checkIn: "10:45 AM", checkOut: "-", hours: "5h 30m", status: "Late", location: "Office", avatar: "" },
  { id: 3, name: "Amit Kumar", dept: "Sales", checkIn: "9:15 AM", checkOut: "6:00 PM", hours: "8h 45m", status: "Present", location: "Client Site", avatar: "" },
  { id: 4, name: "Sneha Gupta", dept: "HR", checkIn: "8:55 AM", checkOut: "5:30 PM", hours: "8h 35m", status: "Present", location: "WFH", avatar: "" },
  { id: 5, name: "Vijay Singh", dept: "Finance", checkIn: "-", checkOut: "-", hours: "-", status: "Absent", location: "-", avatar: "" },
  { id: 6, name: "Anjali Verma", dept: "Marketing", checkIn: "9:00 AM", checkOut: "6:30 PM", hours: "9h 30m", status: "Present", location: "Office", avatar: "" },
  { id: 7, name: "Ravi Mehta", dept: "Engineering", checkIn: "9:10 AM", checkOut: "-", hours: "7h 05m", status: "Present", location: "Office", avatar: "" },
  { id: 8, name: "Pooja Sharma", dept: "Support", checkIn: "-", checkOut: "-", hours: "-", status: "On Leave", location: "-", avatar: "" },
];

const leaveRequests = [
  { id: 1, name: "Karan Malhotra", type: "Sick Leave", dates: "Dec 18-19", days: 2, avatar: "" },
  { id: 2, name: "Neha Kapoor", type: "Casual Leave", dates: "Dec 20", days: 1, avatar: "" },
  { id: 3, name: "Sanjay Rao", type: "Privilege Leave", dates: "Dec 22-26", days: 5, avatar: "" },
];

const attendanceCorrections = [
  { id: 1, name: "Divya Nair", issue: "Missed Punch", date: "Dec 15", request: "Check-out at 6:30 PM" },
  { id: 2, name: "Arjun Reddy", issue: "Wrong Time", date: "Dec 14", request: "Check-in at 9:00 AM" },
];

export default function HRDashboardPage() {
  const [dateRange, setDateRange] = useState("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-muted/30">

        {/* HEADER */}
        <header className="sticky top-0 z-40 bg-background border-b">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">HR Dashboard</h1>
                <p className="text-xs text-muted-foreground">
                  Workforce Analytics & Management
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32 h-9">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>HR</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem><User className="h-4 w-4 mr-2" />Profile</DropdownMenuItem>
                  <DropdownMenuItem><Settings className="h-4 w-4 mr-2" />Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-6 space-y-6">

          {/* KPI CARDS */}
          <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {kpiData.map((kpi, i) => (
              <div
                key={i}
                className="bg-card p-4 rounded-xl border hover:shadow-md transition"
              >
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-2 ${colorMap[kpi.color]}`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.title}</p>
                <div className={`flex items-center gap-1 text-xs mt-1 ${kpi.trend === "up" ? "text-success" : "text-destructive"}`}>
                  {kpi.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.change}
                </div>
              </div>
            ))}
          </section>

          {/* 👇 Baaki Charts, Alerts, Table, Approvals
              tumhara existing code SAME rahega
              sirf layout ke andar wrap ho jayega */}
        </main>
      </div>
    </DashboardLayout>
  );
}
