'use client';

import { Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface DayStatus {
  day: string;
  date: number;
  status:
    | "present"
    | "absent"
    | "late"
    | "half day"
    | "weekend"
    | "today"
    | "future"
    | "pending_checkout";
  hours?: string;
}

export function WorkScheduleCard() {
  const { toast } = useToast();
  const [days, setDays] = useState<DayStatus[]>([]);
  const [weekRange, setWeekRange] = useState("");
  const [shiftType] = useState("General Shift");
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  /* =========================
      SAME CHECK-IN LOGIC AS ATTENDANCE
     ========================= */
  useEffect(() => {
    const updateCheckInStatus = () => {
      const checkInData = localStorage.getItem("checkInData");
      setIsCheckedIn(!!checkInData);
    };

    updateCheckInStatus();
    window.addEventListener("attendanceUpdated", updateCheckInStatus);

    return () => {
      window.removeEventListener("attendanceUpdated", updateCheckInStatus);
    };
  }, []);

  /* =========================
      FETCH CALENDAR (SAME AS ATTENDANCE)
     ========================= */
  useEffect(() => {
    const fetchWorkSchedule = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No auth token");

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/attendance/calendar/?month=${year}-${month}`,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Calendar fetch failed");

        const data = await response.json();
        const calendarData = data.calendar;

        const todayDate = now.getDate();
        const todayIndex = calendarData.findIndex(
          (d: any) => d.day === todayDate
        );

        if (todayIndex === -1) {
          setDays([]);
          setIsLoading(false);
          return;
        }

        const currentDayOfWeek = now.getDay(); // Sun = 0
        const startIndex =
          todayIndex - (currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1);

        const weekData: DayStatus[] = [];

        for (let i = 0; i < 7; i++) {
          const idx = startIndex + i;
          if (idx < 0 || idx >= calendarData.length) continue;

          const d = calendarData[idx];
          const isToday = d.day === todayDate;

          let finalStatus: DayStatus["status"];

          // ✅ EXACT SAME AS ATTENDANCE CALENDAR
          if (isToday) {
            if (d.check_out_time) {
              // Checkout done → backend status decides (present / half day / late)
              finalStatus = d.status.toLowerCase();
            } else if (isCheckedIn) {
              // Checked in but not checked out
              finalStatus = "pending_checkout";
            } else {
              // Today but not checked in
              finalStatus = "today";
            }
          } else {
            // Past / future days → backend status
            finalStatus = d.status.toLowerCase();
          }

          weekData.push({
            day: d.weekday,
            date: d.day,
            status: finalStatus,
            hours: d.working_hours || undefined,
          });
        }

        setDays(weekData);

        if (weekData.length) {
          const start = weekData[0].date;
          const end = weekData[weekData.length - 1].date;
          const monthName = now.toLocaleString("default", { month: "short" });
          setWeekRange(`${start} ${monthName} - ${end} ${monthName}`);
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to load work schedule",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkSchedule();
    window.addEventListener("attendanceUpdated", fetchWorkSchedule);

    return () => {
      window.removeEventListener("attendanceUpdated", fetchWorkSchedule);
    };
  }, [toast, isCheckedIn]);

  /* =========================
      COLORS (MATCH ATTENDANCE)
     ========================= */
  const getStatusColor = (
    status: DayStatus["status"],
    isTimeline = false
  ) => {
    switch (status) {
      case "present":
        return "bg-emerald-500";
      case "half day":
        return "bg-blue-500";
      case "late":
        return "bg-amber-500";
      case "absent":
        return "bg-red-500";
      case "pending_checkout":
        return "bg-orange-400";
      case "today":
        return "bg-blue-600";
      case "weekend":
        return isTimeline ? "bg-slate-300" : "bg-slate-200 text-slate-500";
      case "future":
        return isTimeline ? "bg-slate-200" : "bg-slate-100 text-slate-400";
      default:
        return "bg-muted";
    }
  };

  const getStatusLabel = (status: DayStatus["status"]) => {
    if (status === "half day") return "Half Day";
    if (status === "pending_checkout") return "Checked In";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  /* =========================
      LOADING
     ========================= */
  if (isLoading) {
    return (
      <div className="dashboard-card bg-card p-3">
        <Skeleton className="h-6 w-32 mb-3" />
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-2 flex-1 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-[96px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  /* =========================
      UI
     ========================= */
  return (
    <div className="dashboard-card bg-card p-3">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Work Schedule</h3>
            <p className="text-sm text-muted-foreground">{weekRange}</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium">
          {shiftType}
        </span>
      </div>

      {/* Timeline */}
      <div className="flex gap-1 mb-4">
        {days.map((day, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full ${getStatusColor(
              day.status,
              true
            )}`}
          />
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
        {days.map((day, i) => (
          <div
            key={i}
            className={`min-h-[96px] text-center p-2 rounded-xl font-semibold
              flex flex-col items-center justify-center gap-1
              ${
                day.status === "future" || day.status === "weekend"
                  ? getStatusColor(day.status)
                  : `${getStatusColor(day.status)} text-white ring-1 ring-black/5`
              }`}
          >
            <p className="text-[10px] opacity-80">{day.day}</p>
            <p className="text-lg leading-none">{day.date}</p>
            <p className="text-[10px] opacity-80">
              {getStatusLabel(day.status)}
            </p>
            {day.hours && (
              <p className="text-[10px] font-medium">{day.hours}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
