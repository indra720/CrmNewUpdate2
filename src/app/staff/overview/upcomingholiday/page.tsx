'use client';

import { useEffect, useState } from "react";
import { CalendarDays, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Holiday {
  id: string;
  name: string;
  date: string;
  icon?: string;
}

export function UpcomingHolidaysCard() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/holidays/`,
          {
            headers: {
              Authorization: token ? `Token ${token}` : "",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch holidays");
        }

        const data = await response.json();

        const formattedHolidays: Holiday[] = data.results.map((h: any) => ({
          id: h.id.toString(),
          name: h.name,
          date: new Date(h.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          icon: "🎉",
        }));

        setHolidays(formattedHolidays);
      } catch (error) {
        console.error("Holiday fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  return (
    <div className="dashboard-card bg-card shadow-md rounded-lg p-6">
      {/* Header */}
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

      {/* Content */}
      <div className="space-y-3">
        {loading ? (
          // Skeleton Loader
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-xl bg-muted/50"
            >
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : holidays.length > 0 ? (
          holidays.map((holiday) => (
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
          ))
        ) : (
          // Empty State
          <div className="text-center py-6 text-sm text-muted-foreground">
            No upcoming holidays
          </div>
        )}
      </div>
    </div>
  );
}
