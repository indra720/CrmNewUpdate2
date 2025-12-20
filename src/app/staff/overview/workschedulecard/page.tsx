'use client';

import { Calendar, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface DayStatus {
  day: string;
  date: number;
  status: "present" | "absent" | "weekend" | "today" | "late" | "future";
  hours?: string;
}

export function WorkScheduleCard() {
  const { toast } = useToast();
  const [days, setDays] = useState<DayStatus[]>([]);
  const [weekRange, setWeekRange] = useState("");
  const [shiftType, setShiftType] = useState("General Shift"); // This can be dynamic later
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkSchedule = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          toast({
            title: "Authentication Error",
            description: "No auth token found.",
            variant: "destructive",
          });
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
        const calendarData = data.calendar;
        
        // Logic to find the current week
        const today = now.getDate();
        const todayIndex = calendarData.findIndex(d => d.day === today);

        if (todayIndex === -1) {
          throw new Error("Could not find today in calendar data.");
        }

        const currentDayOfWeek = now.getDay(); // Sunday is 0, Monday is 1
        const startOfWeekIndex = todayIndex - (currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1);

        const weekData = Array.from({ length: 7 }).map((_, i) => {
            const dayIndex = startOfWeekIndex + i;
            if (dayIndex < 0 || dayIndex >= calendarData.length) {
                // This can happen for days at the beginning/end of the month's first/last week
                return null;
            }
            const dayData = calendarData[dayIndex];
            const isToday = dayData.day === today;

            return {
                day: dayData.weekday,
                date: dayData.day,
                status: isToday ? "today" : dayData.status.toLowerCase(),
            };
        }).filter(Boolean);

        setDays(weekData as DayStatus[]);
        
        // Set week range for display
        if (weekData.length > 0) {
            const startDate = weekData[0].date;
            const endDate = weekData[weekData.length - 1].date;
            const monthName = now.toLocaleString('default', { month: 'short' });
            setWeekRange(`${startDate} ${monthName} - ${endDate} ${monthName}`);
        }

      } catch (error: any) {
        console.error("Failed to fetch work schedule:", error);
        toast({
          title: "Error",
          description: "Failed to load work schedule.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkSchedule();
  }, [toast]);

  const getStatusColor = (status: DayStatus["status"]) => {
    switch (status) {
      case "present":
        return "bg-green-500";
      case "absent":
        return "bg-red-500";
      case "late":
          return "bg-yellow-500";
      case "weekend":
        return "bg-gray-400";
      case "today":
        return "bg-blue-500";
      case "future":
        return "bg-gray-200";
      default:
        return "bg-gray-200";
    }
  };

  const getStatusLabel = (status: DayStatus["status"]) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  if (isLoading) {
    return (
        <div className="dashboard-card bg-card p-3">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
                <Skeleton className="h-8 w-24 rounded-full" />
            </div>
            <div className="flex gap-1 mb-4">
                {Array.from({ length: 7 }).map((_, index) => (
                    <Skeleton key={index} className="h-2 flex-1 rounded-full" />
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }).map((_, index) => (
                    <div key={index} className="text-center p-2 rounded-xl">
                        <Skeleton className="h-4 w-8 mx-auto mb-1" />
                        <Skeleton className="h-7 w-7 mx-auto rounded-full" />
                         <Skeleton className="h-4 w-12 mx-auto mt-1" />
                    </div>
                ))}
            </div>
        </div>
    );
  }

  return (
    <div className="dashboard-card bg-card p-3">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
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

      {/* Timeline bar */}
      <div className="flex gap-1 mb-4">
        {days.map((day, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full ${getStatusColor(day.status)}`}
            title={`${day.day}, ${day.date} - ${getStatusLabel(day.status)}`}
          />
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
        {days.map((day, index) => (
          <div
            key={index}
            className={`text-center p-2 rounded-xl transition-colors font-semibold ${
                day.status === 'today'
                  ? 'bg-primary/10 ring-2 ring-primary text-primary'
                  : (day.status === 'future' || day.status === 'weekend')
                  ? `${getStatusColor(day.status)} text-muted-foreground`
                  : `${getStatusColor(day.status)} text-white`
              }`}
          >
            <p className="text-xs opacity-80 mb-1">{day.day}</p>
            <p className="text-lg">
              {day.date}
            </p>
            <p className="text-xs opacity-80 mt-1">
              {getStatusLabel(day.status)}
            </p>
            {day.hours && (
              <p className="text-xs font-medium mt-1">
                {day.hours}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
