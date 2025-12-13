"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Notification {
  title: string;
  description: string;
  time: string;
  avatar: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchNotifications() {
    setLoading(true);
    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/today-interested/`,
        {
          method: "GET",
          headers: {
            Authorization: ` Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        // Handle error silently for now
        setNotifications([]);
        return;
      };

      const data = await res.json();

      const mapped: Notification[] = data.leads.map((item: any) => ({
        title: "Follow-up Today",
        description: item.name,
        time: item.follow_up_time,
        avatar: item.name?.slice(0, 2)?.toUpperCase(),
      }));

      setNotifications(mapped);
    } catch (error) {
      console.error("Notification Fetch Error:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-6 w-6" />
            All Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-start gap-3 p-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="grid gap-2 w-full">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-2/4" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))
            ) : notifications.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No notifications found.
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 rounded-lg border bg-background hover:bg-accent"
                >
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback>{notification.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1 w-full">
                    <p className="font-semibold">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
