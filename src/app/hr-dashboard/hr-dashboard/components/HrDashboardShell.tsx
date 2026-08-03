"use client";

import { useMemo, useState } from "react";
import { BarChart3, CalendarDays, CheckCircle2, Clock3, FileCheck2, LayoutDashboard, Search, Settings, XCircle, AlertTriangle, Download, FileText, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import {
  hrAlerts,
  hrAttendanceTrendData,
  hrCorrections,
  hrEmployeeAttendance,
  hrKpiData,
  hrLeaveRequests,
  hrPieChartData,
  hrSidebarSections,
} from "../data/mock-data";

const statusStyles: Record<string, string> = {
  Present: "bg-success/10 text-success",
  Late: "bg-warning/10 text-warning",
  Absent: "bg-destructive/10 text-destructive",
  "On Leave": "bg-info/10 text-info",
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Clock3,
  CalendarDays,
  FileCheck2,
  BarChart3,
  Settings,
};

export function HrDashboardShell() {
  const [activeSection, setActiveSection] = useState("overview");
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All Departments");

  const departments = ["All Departments", "Engineering", "Design", "Sales", "HR", "Finance", "Marketing", "Support"];

  const filteredEmployees = useMemo(() => {
    return hrEmployeeAttendance.filter((employee) => {
      const matchesSearch = employee.name.toLowerCase().includes(search.toLowerCase());
      const matchesDept = dept === "All Departments" || employee.dept === dept;
      return matchesSearch && matchesDept;
    });
  }, [search, dept]);

  const renderOverview = () => (
    <div className="space-y-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {hrKpiData.map((kpi, idx) => {
          const Icon = idx % 2 === 0 ? LayoutDashboard : Clock3;
          return (
            <Card key={kpi.title}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{kpi.value}</h3>
                  <p className={`text-xs mt-1 ${kpi.trend === "up" ? "text-success" : "text-destructive"}`}>{kpi.change} vs yesterday</p>
                </div>
                <div className="rounded-full bg-muted p-3">
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hrAttendanceTrendData}>
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
          <CardHeader>
            <CardTitle>Today's Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={hrPieChartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
                  {hrPieChartData.map((entry, index) => (
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
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-col md:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search employee" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={dept} onValueChange={setDept}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((item) => (
                  <SelectItem key={item} value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" /> Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Employee Attendance</CardTitle>
          <span className="text-xs text-muted-foreground">{filteredEmployees.length} records</span>
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
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.dept}</TableCell>
                  <TableCell>{employee.checkIn}</TableCell>
                  <TableCell>{employee.checkOut}</TableCell>
                  <TableCell>{employee.hours}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`border-0 ${statusStyles[employee.status] ?? ""}`}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center gap-1 text-sm">
                    {employee.location !== "-" && <MapPin className="h-3.5 w-3.5 text-muted-foreground" />}
                    {employee.location}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderLeave = () => (
    <Card>
      <CardHeader>
        <CardTitle>Pending Leave Requests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {hrLeaveRequests.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.type} · {item.dates}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{item.days} day(s)</Badge>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-success"><CheckCircle2 className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"><XCircle className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderCorrections = () => (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Corrections</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {hrCorrections.map((item) => (
          <div key={item.id} className="rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <p className="font-medium">{item.name}</p>
              <Badge variant="outline">{item.date}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{item.issue}</p>
            <p className="text-sm text-muted-foreground">Requested: {item.request}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderReports = () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Alerts Panel</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {hrAlerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 rounded-lg border p-3">
              <AlertTriangle className={`mt-0.5 h-5 w-5 ${alert.severity === "danger" ? "text-destructive" : "text-warning"}`} />
              <div>
                <p className="font-medium">{alert.title}</p>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Compliance Snapshot</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex justify-between rounded-lg border p-3"><span>Attendance Compliance</span><span className="font-semibold text-foreground">94.2%</span></div>
          <div className="flex justify-between rounded-lg border p-3"><span>Pending Approvals</span><span className="font-semibold text-foreground">12</span></div>
          <div className="flex justify-between rounded-lg border p-3"><span>Geo-fence Violations</span><span className="font-semibold text-foreground">3</span></div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <Card>
      <CardHeader><CardTitle>HR Settings</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <div className="rounded-lg border p-3">Set attendance rules, grace period, leave policies, and alert preferences.</div>
        <div className="rounded-lg border p-3">Configure office location, shift timings, and approval workflow.</div>
        <div className="rounded-lg border p-3">Enable export and reminder automation for HR admins.</div>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "attendance": return renderAttendance();
      case "leave": return renderLeave();
      case "corrections": return renderCorrections();
      case "reports": return renderReports();
      case "settings": return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col lg:flex-row gap-4">
      <aside className="w-full lg:w-72 rounded-xl border bg-card p-3 shadow-sm">
        <div className="mb-4 px-2 py-2">
          <h2 className="text-lg font-semibold">HR Dashboard</h2>
          <p className="text-sm text-muted-foreground">Attendance • Leave • Reports</p>
        </div>
        <nav className="space-y-1">
          {hrSidebarSections.map((section) => {
            const Icon = iconMap[section.icon as keyof typeof iconMap] ?? LayoutDashboard;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              >
                <Icon className="h-4 w-4" />
                <span>{section.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">HR Attendance Dashboard</h1>
            <p className="text-sm text-muted-foreground">Role-based HR view with sidebar navigation and mock data.</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
        {renderContent()}
      </section>
    </div>
  );
}
