"use client";

import DashboardLayout from "../dashboardlayout/page";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Zap,
  TrendingDown,
  Target,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, ReactNode, useCallback, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatItem {
  total: ReactNode;
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

interface ActivityLog {
  date: string;
  day: string;
  checkIn: string;
  checkOut: string;
  workingHours: string;
  status: string;
  location: string;
}

export default function Attendance() {

  const { toast } = useToast();
  const [statsData, setStatsData] = useState<StatItem[]>([
    {
      label: "This Month", value: "0 Days", icon: Calendar, color: "text-primary",
      total: ""
    },
    {
      label: "Avg Hours/Day", value: "0 hrs", icon: Clock, color: "text-success",
      total: ""
    },
    {
      label: "On-Time Rate", value: "0%", icon: TrendingDown, color: "text-warning",
      total: ""
    },
    {
      label: "Tasks Done", value: "0", icon: Target, color: "text-primary",
      total: ""
    },
  ]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [calendarData, setCalendarData] = useState([]);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(true);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [isLoadingLog, setIsLoadingLog] = useState(true);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const fetchStats = useCallback(async () => {
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
  }, [toast]);

  const fetchCalendarData = useCallback(async () => {
    setIsLoadingCalendar(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "No auth token found. Please log in.",
          variant: "destructive",
        });
        setIsLoadingCalendar(false);
        return;
      }

      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const monthParam = `${year}-${month}`;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/attendance/calendar/?month=${monthParam}`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCalendarData(data.calendar);

    } catch (error: any) {
      console.error("Failed to fetch calendar data:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load calendar data.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCalendar(false);
    }
  }, [toast]);

  const fetchAndProcessActivities = useCallback(async () => {
    setIsLoadingLog(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "No auth token found for activities.",
          variant: "destructive",
        });
        setIsLoadingLog(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/attendance/activities/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const activities = data.results;

      if (!activities || activities.length === 0) {
        setActivityLog([]);
        setIsLoadingLog(false);
        return;
      }

      const checkInActivity = activities.find((act: any) => act.type === 'check_in');
      const checkOutActivities = activities.filter((act: any) => act.type === 'check_out');
      const lastCheckOutActivity = checkOutActivities.length > 0 ? checkOutActivities[checkOutActivities.length - 1] : null;

      if (!checkInActivity) {
        setActivityLog([]);
        setIsLoadingLog(false);
        return;
      }

      const today = new Date();
      const date = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const day = today.toLocaleDateString('en-US', { weekday: 'long' });

      const checkInTime = checkInActivity.time;
      const checkOutTime = lastCheckOutActivity ? lastCheckOutActivity.time : '--:--';

      let workingHours = 'In Progress';
      if (lastCheckOutActivity) {
        workingHours = '--';
      }

      const todayLogEntry: ActivityLog = {
        date: date,
        day: day,
        checkIn: checkInTime,
        checkOut: checkOutTime,
        workingHours: workingHours,
        status: 'present',
        location: checkInActivity.location,
      };

      setActivityLog([todayLogEntry]);

    } catch (error: any) {
      console.error("Failed to fetch recent activities:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load recent activities.",
        variant: "destructive",
      });
      setActivityLog([]);
    } finally {
      setIsLoadingLog(false);
    }
  }, [toast]);

  useEffect(() => {
    // Initial check
    const checkInData = localStorage.getItem('checkInData');
    setIsCheckedIn(!!checkInData);

    const refreshAllData = () => {
      fetchStats();
      fetchCalendarData();
      fetchAndProcessActivities();
      const updatedCheckInData = localStorage.getItem('checkInData');
      setIsCheckedIn(!!updatedCheckInData);
    };

    refreshAllData(); // Initial fetch

    window.addEventListener('attendanceUpdated', refreshAllData);

    return () => {
      window.removeEventListener('attendanceUpdated', refreshAllData);
    };
  }, [fetchStats, fetchCalendarData, fetchAndProcessActivities]);


  const getStatusColor = (status: any) => {
    switch (status) {
      case "present":
        return "bg-emerald-500";

      case "half day":          // ✅ ADD
        return "bg-blue-500";

      case "absent":
        return "bg-red-500";

      case "late":
        return "bg-amber-500";

      case "weekend":
        return "bg-slate-300";

      case "today":
        return "bg-blue-600";

      case "future":
        return "bg-muted";

      default:
        return "bg-muted";
    }
  };


  const getStatusBadge = (status: any) => {
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

  const getCalendarDayClass = (day: any) => {
    const status = day.status.toLowerCase();

    // 🔵 HALF DAY
    if (status === "half day") {
      return "bg-blue-500 text-white shadow-md";
    }

    if (status === "today") {
      if (isCheckedIn) {
        return "bg-emerald-500 text-white ring-4 ring-emerald-200 shadow-lg";
      }
      return "bg-blue-600 text-white ring-4 ring-blue-200 shadow-lg";
    }

    if (status === "future") {
      return "bg-slate-100 text-slate-400";
    }

    return `${getStatusColor(status)} text-white hover:shadow-md`;
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
              {isLoadingCalendar ? (
                Array.from({ length: 35 }).map((_, index) => (
                  <Skeleton key={index} className="aspect-square rounded-lg" />
                ))
              ) : (
                calendarData.map((day: any) => (
                  <div
                    key={day.date}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-200 hover:scale-110 cursor-pointer ${getCalendarDayClass(day)}`}
                  >
                    {day.day}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Attendance Log */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Recent Activity
            </h2>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {isLoadingLog ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="group bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                    <div className="hidden md:flex md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-[70px] w-[70px] rounded-xl" />
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-[58px] w-[100px]"><Skeleton className="h-full w-full" /></div>
                          <div className="h-[58px] w-[100px]"><Skeleton className="h-full w-full" /></div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                    <div className="block md:hidden space-y-3">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))
              ) : activityLog.length > 0 ? (
                activityLog.map((log, index) => (
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
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-slate-500">No recent activity for today.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}











