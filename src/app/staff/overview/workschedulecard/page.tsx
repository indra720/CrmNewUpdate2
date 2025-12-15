'use client';

import { Calendar } from "lucide-react";

interface DayStatus {
  day: string;
  date: number;
  status: "present" | "absent" | "weekend" | "today";
  hours?: string;
}

interface WorkScheduleCardProps {
  weekRange: string;
  shiftType: string;
  days: DayStatus[];
}

export function WorkScheduleCard({
  weekRange,
  shiftType,
  days,
}: WorkScheduleCardProps) {
  const getStatusColor = (status: DayStatus["status"]) => {
    switch (status) {
      case "present":
        return "bg-success";
      case "absent":
        return "bg-destructive";
      case "weekend":
        return "bg-muted-foreground/30";
      case "today":
        return "bg-primary";
      default:
        return "bg-muted";
    }
  };

  const getStatusLabel = (status: DayStatus["status"]) => {
    switch (status) {
      case "present":
        return "Present";
      case "absent":
        return "Absent";
      case "weekend":
        return "Weekend";
      case "today":
        return "Today";
      default:
        return "";
    }
  };

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

      {/* Timeline bar */}
      <div className="flex gap-1 mb-4">
        {days.map((day, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full ${getStatusColor(day.status)}`}
          />
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
        {days.map((day, index) => (
          <div
            key={index}
            className={`text-center p-2 rounded-xl transition-colors ${
              day.status === "today"
                ? "bg-primary/10 ring-2 ring-primary"
                : "hover:bg-muted"
            }`}
          >
            <p className="text-xs text-muted-foreground mb-1">{day.day}</p>
            <p
              className={`text-lg font-semibold ${
                day.status === "today"
                  ? "text-primary"
                  : "text-foreground"
              }`}
            >
              {day.date}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {getStatusLabel(day.status)}
            </p>
            {day.hours && (
              <p className="text-xs font-medium text-success mt-1">
                {day.hours}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
