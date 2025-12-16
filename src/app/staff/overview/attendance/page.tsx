import DashboardLayout from "../dashboardlayout/page";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Zap,
} from "lucide-react";

const attendanceStats = [
  { label: "Present Days", value: "22", total: "24", icon: CheckCircle, color: "text-success" },
  { label: "Absent Days", value: "1", total: "24", icon: XCircle, color: "text-destructive" },
  { label: "Late Arrivals", value: "2", total: "24", icon: AlertCircle, color: "text-warning" },
  { label: "Avg Working Hrs", value: "8.5", total: "hrs/day", icon: Clock, color: "text-primary" },
];

const attendanceLog = [
  {
    date: "11 Dec 2025",
    day: "Thursday",
    checkIn: "09:15 AM",
    checkOut: "--:--",
    workingHours: "In Progress",
    status: "present",
    location: "TechCorp Solutions, Sector 62, Noida",
  },
  {
    date: "10 Dec 2025",
    day: "Wednesday",
    checkIn: "09:00 AM",
    checkOut: "06:34 PM",
    workingHours: "9h 34m",
    status: "present",
    location: "TechCorp Solutions, Sector 62, Noida",
  },
  {
    date: "09 Dec 2025",
    day: "Tuesday",
    checkIn: "09:30 AM",
    checkOut: "06:03 PM",
    workingHours: "8h 33m",
    status: "late",
    location: "TechCorp Solutions, Sector 62, Noida",
  },
  {
    date: "08 Dec 2025",
    day: "Monday",
    checkIn: "09:05 AM",
    checkOut: "06:11 PM",
    workingHours: "9h 06m",
    status: "present",
    location: "TechCorp Solutions, Sector 62, Noida",
  },
  {
    date: "07 Dec 2025",
    day: "Sunday",
    checkIn: "--:--",
    checkOut: "--:--",
    workingHours: "--",
    status: "weekend",
    location: "--",
  },
  {
    date: "06 Dec 2025",
    day: "Saturday",
    checkIn: "--:--",
    checkOut: "--:--",
    workingHours: "--",
    status: "weekend",
    location: "--",
  },
  {
    date: "05 Dec 2025",
    day: "Friday",
    checkIn: "09:10 AM",
    checkOut: "06:45 PM",
    workingHours: "9h 35m",
    status: "present",
    location: "TechCorp Solutions, Sector 62, Noida",
  },
];

const monthlyCalendar = [
  { date: 1, status: "present" },
  { date: 2, status: "present" },
  { date: 3, status: "present" },
  { date: 4, status: "present" },
  { date: 5, status: "present" },
  { date: 6, status: "weekend" },
  { date: 7, status: "weekend" },
  { date: 8, status: "present" },
  { date: 9, status: "late" },
  { date: 10, status: "present" },
  { date: 11, status: "today" },
  { date: 12, status: "future" },
  { date: 13, status: "future" },
  { date: 14, status: "future" },
];

export default function Attendance() {
  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-success";
      case "absent":
        return "bg-destructive";
      case "late":
        return "bg-warning";
      case "weekend":
        return "bg-muted-foreground/30";
      case "today":
        return "bg-primary";
      case "future":
        return "bg-muted";
      default:
        return "bg-muted";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "present":
        return <span className="status-badge status-badge-present">Present</span>;
      case "late":
        return <span className="status-badge status-badge-pending">Late</span>;
      case "absent":
        return <span className="status-badge status-badge-absent">Absent</span>;
      case "weekend":
        return (
          <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
            Weekend
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 bg-muted/70 shadow-sm rounded-sm p-3 ">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-card shadow-sm rounded-sm p-6 text-center space-y-2">
          <div className="">
            <h1 className="text-2xl font-bold text-foreground md:text-left">Attendance</h1>
            <p className="text-muted-foreground">
              Track your daily attendance and working hours
            </p>
          </div>
          <div className="flex items-center gap-2 text-lg md:text-sm font-bold  text-muted-foreground ">
            <Calendar className="h-4 w-4" />
            December 2025
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
          {attendanceStats.map((stat, index) => (
            <div
              key={stat.label}
              className="dashboard-card animate-fade-in bg-card shadow-sm rounded-sm p-6"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center gap-3 mb-3 ">
                <div
                  className={`h-10 w-10 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold md:text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {stat.total}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar + Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Overview */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Monthly View
              </h2>
              <Zap className="h-5 w-5 text-amber-500" />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-slate-600">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-xs text-slate-600">Late</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-slate-600">Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <span className="text-xs text-slate-600">Weekend</span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-3">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                <div key={i} className="text-center text-xs font-semibold text-slate-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {monthlyCalendar.map((day) => (
                <div
                  key={day.date}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-200 hover:scale-110 cursor-pointer ${day.status === "today"
                      ? "bg-blue-600 text-white ring-4 ring-blue-200 shadow-lg"
                      : day.status === "future"
                        ? "bg-slate-100 text-slate-400"
                        : `${getStatusColor(day.status)} text-white hover:shadow-md`
                    }`}
                >
                  {day.date}
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Log */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Recent Activity
            </h2>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {attendanceLog.map((log, index) => (
                <div
                  key={log.date}
                  className="group bg-gradient-to-r from-slate-50 to-slate-100 hover:from-blue-50 hover:to-indigo-50 rounded-xl p-4 border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md"
                  style={{
                    animation: 'slideIn 0.5s ease-out',
                    animationDelay: `${index * 0.05}s`,
                    animationFillMode: 'both'
                  }}
                >
                  {/* Mobile Layout */}
                  <div className="block md:hidden space-y-3">
                    {/* Date and Status Row */}
                    <div className="flex items-center justify-between">
                      <div className="bg-white rounded-xl p-3 text-center min-w-[70px] shadow-sm border border-slate-200">
                        <p className="text-2xl font-bold text-slate-900">
                          {log.date.split(" ")[0]}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {log.day.slice(0, 3)}
                        </p>
                      </div>
                      {getStatusBadge(log.status)}
                    </div>

                    {/* Time Details */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Check In
                        </p>
                        <p className="font-bold text-slate-900">{log.checkIn}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Check Out
                        </p>
                        <p className="font-bold text-slate-900">{log.checkOut}</p>
                      </div>
                    </div>

                    {/* Working Hours */}
                    <div className="bg-white rounded-lg px-4 py-2 border border-slate-200 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Working Hours</span>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-semibold text-slate-900">
                          {log.workingHours}
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    {log.location !== "--" && (
                      <div className="bg-white rounded-lg px-4 py-2 border border-slate-200 flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-slate-600">{log.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:flex md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Date Box */}
                      <div className="bg-white rounded-xl p-3 text-center min-w-[70px] shadow-sm border border-slate-200 group-hover:border-blue-300 transition-colors">
                        <p className="text-2xl font-bold text-slate-900">
                          {log.date.split(" ")[0]}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {log.day.slice(0, 3)}
                        </p>
                      </div>

                      {/* Time Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-3 border border-slate-200">
                          <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Check In
                          </p>
                          <p className="font-bold text-slate-900">{log.checkIn}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-slate-200">
                          <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Check Out
                          </p>
                          <p className="font-bold text-slate-900">{log.checkOut}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      {/* Working Hours */}
                      <div className="bg-white rounded-lg px-4 py-2 border border-slate-200 inline-flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-semibold text-slate-900">
                          {log.workingHours}
                        </span>
                      </div>

                      {/* Location */}
                      {log.location !== "--" && (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="h-3 w-3 text-blue-500" />
                          <span className="truncate max-w-[200px]">{log.location}</span>
                        </div>
                      )}

                      {/* Status Badge */}
                      {getStatusBadge(log.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

