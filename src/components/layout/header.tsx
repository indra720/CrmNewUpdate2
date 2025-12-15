
'use client';

import { Bell, PanelLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { UserNav } from '../user-nav';
import { ThemeToggle } from '../theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { usePathname } from 'next/navigation';
import { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';

function getTitleFromPathname(pathname: string) {
  if (pathname === '/admin') return 'Admin Dashboard';
  if (pathname === '/superadmin') return 'Super Admin Dashboard';
  if (pathname === '/team-leader') return 'Team Leader Dashboard';
  if (pathname === '/staff') return 'Staff Dashboard';

  const parts = pathname.split('/').filter(Boolean);
  const lastPart = parts[parts.length - 1];

  if (
    lastPart &&
    (/^[0-9a-fA-F-]{36}$/.test(lastPart) || /^\d+$/.test(lastPart))
  ) {
    const prev = parts[parts.length - 2];
    return prev
      ? prev.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : 'Dashboard';
  }

  return lastPart
    ? lastPart.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Dashboard';
}

function getRoleFromPathname(pathname: string) {
  if (pathname.startsWith('/superadmin')) return 'superadmin';
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/team-leader')) return 'team-leader';
  if (pathname.startsWith('/staff')) return 'staff';
  return '';
}

export function Header({ setSidebarOpen }: { setSidebarOpen?: (open: boolean) => void }) {
  const pathname = usePathname();
  const headerTitle = useMemo(() => getTitleFromPathname(pathname), [pathname]);
  const role = useMemo(() => getRoleFromPathname(pathname), [pathname]);
  const notificationsUrl = role ? `/${role}/notifications` : '/login';


  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);


  async function fetchNotifications() {
    const token = localStorage.getItem('authToken');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/today-interested/`, {
        method: "GET",
        headers:{
          'Authorization': ` Token ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!res.ok) return;

      const data = await res.json();

      const mapped = data.leads.map((item: any) => ({
        title: "Follow-up Today",
        description: item.name,
        time: item.follow_up_time,
        avatar: item.name?.slice(0, 2)?.toUpperCase(),
      }));
      console.log(mapped);

      setNotifications(mapped);
      setUnreadCount(data.count);

    } catch (error) {
      console.log("Notification Fetch Error:", error);
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between gap-4 border-b bg-card px-4 shadow-sm md:px-6'
      )}
    >
      <div className="flex items-center gap-4">
        {setSidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 lg:hidden text-foreground hover:bg-accent hover:text-accent-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        )}

        <div className="flex items-center gap-2">
          <h1 className="text-lg md:text-xl font-semibold">{headerTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 ml-auto">
        <ThemeToggle />

        {/* NOTIFICATION BUTTON */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hover:bg-accent">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_8px_2px_hsl(var(--primary))]"></span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-80" align="end">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center py-4 text-sm text-muted-foreground">No notifications</p>
              ) : (
                notifications.map((n, index) => (
                  <DropdownMenuItem key={index} className="flex items-start gap-3 p-2">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback>{n.avatar}</AvatarFallback>
                    </Avatar>

                    <div className="grid gap-1">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.description}</p>
                      <p className="text-xs text-muted-foreground">{n.time}</p>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </div>

            <DropdownMenuSeparator />
            <Link href={notificationsUrl} passHref>
              <DropdownMenuItem className="justify-center text-sm text-primary hover:!bg-accent hover:!text-primary cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>

        <UserNav />
      </div>
    </header>
  );
}
