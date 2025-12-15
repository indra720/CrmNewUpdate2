'use client';

import { CalendarDays, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Holiday {
  id: string;
  name: string;
  date: string;
  icon?: string;
}

interface UpcomingHolidaysCardProps {
  holidays: Holiday[];
}

export function UpcomingHolidaysCard({ holidays }: UpcomingHolidaysCardProps) {
  return (
    <div className="dashboard-card bg-card shadow-md rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <CalendarDays className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">
            Upcoming Holidays
          </h3>
        </div>

        <Button variant="ghost" size="sm" className="text-primary">
          View all
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {holidays.map((holiday) => (
          <div
            key={holiday.id}
            className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center text-2xl">
              {holiday.icon || "🎉"}
            </div>

            <div className="flex-1">
              <p className="font-medium text-foreground">
                {holiday.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {holiday.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
