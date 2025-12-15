'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, LogOut, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EmployeeCardProps {
  employeeId: string;
  name: string;
  jobTitle: string;
  avatarUrl?: string;
  isCheckedIn: boolean;
  checkInTime?: Date;
  checkInLocation?: string;
}

export function EmployeeCard({
  employeeId,
  name,
  jobTitle,
  avatarUrl,
  isCheckedIn,
  checkInTime,
  checkInLocation,
}: EmployeeCardProps) {
  const [elapsedTime, setElapsedTime] = useState("00:00:00");

  useEffect(() => {
    if (!isCheckedIn || !checkInTime) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = now.getTime() - checkInTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setElapsedTime(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isCheckedIn, checkInTime]);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="dashboard-card bg-gradient-to-br from-card via-card to-primary/5 border border-border/50 rounded-2xl shadow-xl">
      <div className="flex flex-col md:flex-row items-center gap-6 p-5">
        {/* Avatar */}
        <div className="relative">
          <Avatar className="h-28 w-28 ring-4 ring-primary/20 shadow-lg">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div
            className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-card ${
              isCheckedIn ? "bg-green-300 animate-pulse" : "bg-destructive"
            }`}
          />
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col items-center md:items-start">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              {employeeId}
            </span>
            <h2 className="text-2xl font-bold text-foreground">{name}</h2>
          </div>

          <p className="text-muted-foreground font-medium mb-3">{jobTitle}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                isCheckedIn
                  ? "bg-green-100 text-green-800 animate-pulse"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full mr-2 ${
                  isCheckedIn ? "bg-green-500" : "bg-destructive"
                }`}
              />
              {isCheckedIn ? "Checked In" : "Checked Out"}
            </span>

            {isCheckedIn && checkInTime && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Since{" "}
                {checkInTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>

          {/* Location */}
          {isCheckedIn && checkInLocation && (
            <div className="mt-3 flex items-start justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              <span className="line-clamp-1">{checkInLocation}</span>
            </div>
          )}
        </div>

        {/* Timer & Actions */}
        <div className="flex flex-col items-center gap-4 p-4 rounded-2xl bg-muted/50">
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Working Hours
            </p>
            <div className="timer-display text-primary text-lg font-bold">
              {elapsedTime}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="destructive" size="lg" className="shadow-lg">
              <LogOut className="mr-2 h-4 w-4" />
              Check-Out
            </Button>
            <Button variant="outline" size="icon" className="shadow-md">
              <Clock className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
