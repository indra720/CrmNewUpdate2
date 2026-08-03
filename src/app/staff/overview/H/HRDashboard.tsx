// "use client";

// import { useState } from "react";
// import {
//   Users, UserCheck, UserX, Clock, AlertTriangle
// } from "lucide-react";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
// } from "recharts";

// // Mock Data
// const kpiData = [
//   { title: "Total Employees", value: "1,247", icon: Users, color: "text-primary" },
//   { title: "Active Today", value: "1,089", icon: UserCheck, color: "text-success" },
//   { title: "Absent Today", value: "67", icon: UserX, color: "text-destructive" },
//   { title: "Late Check-ins", value: "23", icon: Clock, color: "text-warning" },
// ];

// const attendanceTrendData = [
//   { day: "Mon", present: 1050 },
//   { day: "Tue", present: 1080 },
//   { day: "Wed", present: 1065 },
//   { day: "Thu", present: 1090 },
//   { day: "Fri", present: 1020 },
// ];

// const employeeAttendance = [
//   { id: 1, name: "Rahul Sharma", checkIn: "9:02 AM", status: "Present", dept: "Engineering" },
//   { id: 2, name: "Priya Patel", checkIn: "10:45 AM", status: "Late", dept: "Design" },
//   { id: 3, name: "Amit Kumar", checkIn: "9:15 AM", status: "Present", dept: "Sales" },
// ];

// export default function HRDashboardPage() {
//   return (
//     <div className="space-y-6 p-1">
//       {/* KPI Section */}
//       <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {kpiData.map((kpi, i) => (
//           <Card key={i}>
//             <CardContent className="p-6 flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">{kpi.title}</p>
//                 <h3 className="text-2xl font-bold">{kpi.value}</h3>
//               </div>
//               <div className={`p-3 rounded-full bg-muted ${kpi.color}`}>
//                 <kpi.icon className="h-6 w-6" />
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </section>

//       {/* Charts Section */}
//       <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader><CardTitle>Attendance Trends</CardTitle></CardHeader>
//           <CardContent className="h-[300px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={attendanceTrendData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="day" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="present" fill="#3b82f6" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardHeader><CardTitle>Recent Alerts</CardTitle></CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {employeeAttendance.filter(e => e.status !== "Present").map((alert) => (
//                 <div key={alert.id} className="flex items-center gap-4 p-3 border rounded-lg">
//                   <AlertTriangle className="text-warning h-5 w-5" />
//                   <div>
//                     <p className="font-medium">{alert.name}</p>
//                     <p className="text-xs text-muted-foreground">Issue: {alert.status} at {alert.checkIn}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </section>

//       {/* Table Section */}
//       <Card>
//         <CardHeader><CardTitle>Employee Attendance Today</CardTitle></CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Department</TableHead>
//                 <TableHead>Check-in</TableHead>
//                 <TableHead>Status</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {employeeAttendance.map((e) => (
//                 <TableRow key={e.id}>
//                   <TableCell className="font-medium">{e.name}</TableCell>
//                   <TableCell>{e.dept}</TableCell>
//                   <TableCell>{e.checkIn}</TableCell>
//                   <TableCell>
//                     <span className={`px-2 py-1 rounded-full text-xs ${e.status === 'Present' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
//                       {e.status}
//                     </span>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


"use client";

import { useMemo, useState } from "react";
import {
  Users, UserCheck, UserX, Clock, Calendar, Home, TrendingUp, ShieldCheck,
  AlertTriangle, Search, Download, FileText, MapPin, CheckCircle2, XCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const kpiData = [
  { title: "Total Employees", value: "1,247", icon: Users, change: "+12", trend: "up", color: "text-primary" },
  { title: "Active Today", value: "1,089", icon: UserCheck, change: "+45", trend: "up", color: "text-success" },
  { title: "Absent Today", value: "67", icon: UserX, change: "-8", trend: "down", color: "text-destructive" },
  { title: "Late Check-ins", value: "23", icon: Clock, change: "+5", trend: "up", color: "text-warning" },
  { title: "On Leave", value: "54", icon: Calendar, change: "+3", trend: "up", color: "text-info" },
  { title: "Work From Home", value: "89", icon: Home, change: "+12", trend: "up", color: "text-secondary" },
  { title: "Avg Working Hours", value: "8.2h", icon: TrendingUp, change: "+0.3h", trend: "up", color: "text-success" },
  { title: "Compliance Rate", value: "94.2%", icon: ShieldCheck, change: "+2.1%", trend: "up", color: "text-success" },
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

const alertIconMap: Record<string, typeof AlertTriangle> = {
  not_checked_in: Clock,
  late: AlertTriangle,
  geo_fence: MapPin,
  missing_checkout: XCircle,
};

const employeeAttendance = [
  { id: 1, name: "Rahul Sharma", dept: "Engineering", checkIn: "9:02 AM", checkOut: "6:15 PM", hours: "9h 13m", status: "Present", location: "Office" },
  { id: 2, name: "Priya Patel", dept: "Design", checkIn: "10:45 AM", checkOut: "-", hours: "5h 30m", status: "Late", location: "Office" },
  { id: 3, name: "Amit Kumar", dept: "Sales", checkIn: "9:15 AM", checkOut: "6:00 PM", hours: "8h 45m", status: "Present", location: "Client Site" },
  { id: 4, name: "Sneha Gupta", dept: "HR", checkIn: "8:55 AM", checkOut: "5:30 PM", hours: "8h 35m", status: "Present", location: "WFH" },
  { id: 5, name: "Vijay Singh", dept: "Finance", checkIn: "-", checkOut: "-", hours: "-", status: "Absent", location: "-" },
  { id: 6, name: "Anjali Verma", dept: "Marketing", checkIn: "9:00 AM", checkOut: "6:30 PM", hours: "9h 30m", status: "Present", location: "Office" },
  { id: 7, name: "Ravi Mehta", dept: "Engineering", checkIn: "9:10 AM", checkOut: "-", hours: "7h 05m", status: "Present", location: "Office" },
  { id: 8, name: "Pooja Sharma", dept: "Support", checkIn: "-", checkOut: "-", hours: "-", status: "On Leave", location: "-" },
];

const leaveRequests = [
  { id: 1, name: "Karan Malhotra", type: "Sick Leave", dates: "Dec 18-19", days: 2 },
  { id: 2, name: "Neha Kapoor", type: "Casual Leave", dates: "Dec 20", days: 1 },
  { id: 3, name: "Sanjay Rao", type: "Privilege Leave", dates: "Dec 22-26", days: 5 },
];

const attendanceCorrections = [
  { id: 1, name: "Divya Nair", issue: "Missed Punch", date: "Dec 15", request: "Check-out at 6:30 PM" },
  { id: 2, name: "Arjun Reddy", issue: "Wrong Time", date: "Dec 14", request: "Check-in at 9:00 AM" },
];

const departments = ["All Departments", "Engineering", "Design", "Sales", "HR", "Finance", "Marketing", "Support"];

const statusStyles: Record<string, string> = {
  Present: "bg-success/10 text-success",
  Late: "bg-warning/10 text-warning",
  Absent: "bg-destructive/10 text-destructive",
  "On Leave": "bg-info/10 text-info",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function HRDashboardPage() {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All Departments");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const filteredEmployees = useMemo(() => {
    return employeeAttendance.filter((e) => {
      const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
      const matchesDept = dept === "All Departments" || e.dept === dept;
      return matchesSearch && matchesDept;
    });
  }, [search, dept]);

  const handleExport = (type: "csv" | "pdf") => {
    // Placeholder for real export logic — wire up to backend endpoint later
    console.log(`Exporting attendance report as ${type.toUpperCase()}`);
  };

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">HR Attendance Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of employee attendance, leaves, and compliance</p>
      </div>

      {/* KPI Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
                <h3 className="text-2xl font-bold mt-1">{kpi.value}</h3>
                <p className={`text-xs mt-1 ${kpi.trend === "up" ? "text-success" : "text-destructive"}`}>
                  {kpi.change} vs yesterday
                </p>
              </div>
              <div className={`p-3 rounded-full bg-muted ${kpi.color}`}>
                <kpi.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employee by name..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select value={dept} onValueChange={setDept}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              className="w-full md:w-[170px]"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Weekly Attendance Trend</CardTitle></CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" name="Present" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" name="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="wfh" name="WFH" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="leave" name="Leave" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Today's Distribution</CardTitle></CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Alerts + Leave + Corrections */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Recent Alerts</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => {
                const Icon = alertIconMap[alert.type] ?? AlertTriangle;
                return (
                  <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Icon className={`h-5 w-5 mt-0.5 ${alert.severity === "error" ? "text-destructive" : "text-warning"}`} />
                    <div>
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{alert.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pending Leave Requests</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaveRequests.map((lr) => (
                <div key={lr.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{lr.name}</p>
                    <p className="text-xs text-muted-foreground">{lr.type} · {lr.dates}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-success">
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Attendance Corrections</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendanceCorrections.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.issue} · {c.date}</p>
                    <p className="text-xs text-muted-foreground">Requested: {c.request}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-success">
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Employee Attendance Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Employee Attendance Today</CardTitle>
          <span className="text-xs text-muted-foreground">{filteredEmployees.length} of {employeeAttendance.length} employees</span>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-6">
                    No employees match your filters.
                  </TableCell>
                </TableRow>
              )}
              {filteredEmployees.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell>{e.dept}</TableCell>
                  <TableCell>{e.checkIn}</TableCell>
                  <TableCell>{e.checkOut}</TableCell>
                  <TableCell>{e.hours}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`border-0 ${statusStyles[e.status] ?? ""}`}>
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center gap-1 text-sm">
                    {e.location !== "-" && <MapPin className="h-3.5 w-3.5 text-muted-foreground" />}
                    {e.location}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}