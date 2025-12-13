'use client';

import Link from "next/link";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, PlusCircle, Pencil, Trash2, TrendingUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import React, { useEffect, useState } from "react"
import { AnimatedCounter } from "@/components/dashboard/animated-counter"
import { cn } from "@/lib/utils"

const users = [
  { name: "Liam Johnson", email: "liam@example.com", role: "Admin", status: "Active", avatar: "https://picsum.photos/seed/1/40/40" },
  { name: "Olivia Smith", email: "olivia@example.com", role: "Team Leader", status: "Active", avatar: "https://picsum.photos/seed/2/40/40" },
  { name: "Noah Williams", email: "noah@example.com", role: "Staff", status: "Inactive", avatar: "https://picsum.photos/seed/3/40/40" },
  { name: "Emma Brown", email: "emma@example.com", role: "Staff", status: "Active", avatar: "https://picsum.photos/seed/4/40/40" },
  { name: "Oliver Jones", email: "oliver@example.com", role: "Admin", status: "Active", avatar: "https://picsum.photos/seed/5/40/40" },
];


export default function UsersPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/dashboard/super-admin/`, {
          headers: {
            Authorization: ` Token ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-lg">Loading user data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-lg text-red-500">Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div className="text-center py-8 text-lg">No dashboard data available.</div>;
  }

  const kpiData = [
    { title: "Total Upload Leads", value: dashboardData.total_upload_leads || 0, icon: TrendingUp, change: "+0", changeType: "increase", subtext: "total leads uploaded", color: "text-blue-500", link: "#", postfix: "" },
    { title: "Total Assign Leads", value: dashboardData.total_assign_leads || 0, icon: TrendingUp, change: "+0", changeType: "increase", subtext: "total leads assigned", color: "text-green-500", link: "#", postfix: "" },
    { title: "Total Interested", value: dashboardData.total_interested || 0, icon: TrendingUp, change: "+0", changeType: "increase", subtext: "total interested leads", color: "text-yellow-500", link: "#", postfix: "" },
    { title: "Total Not Interested", value: dashboardData.total_not_interested || 0, icon: TrendingUp, change: "+0", changeType: "increase", subtext: "total not interested leads", color: "text-red-500", link: "#", postfix: "" },
    { title: "Total Other Location", value: dashboardData.total_other_location || 0, icon: TrendingUp, change: "+0", changeType: "increase", subtext: "leads from other locations", color: "text-indigo-500", link: "#", postfix: "" },
    { title: "Total Not Picked", value: dashboardData.total_not_picked || 0, icon: TrendingUp, change: "+0", changeType: "increase", subtext: "total not picked leads", color: "text-purple-500", link: "#", postfix: "" },
    { title: "Total Lost", value: dashboardData.total_lost || 0, icon: TrendingUp, change: "+0", changeType: "increase", subtext: "total lost leads", color: "text-pink-500", link: "#", postfix: "" },
    { title: "Total Visits", value: dashboardData.total_visits || 0, icon: TrendingUp, change: "+0", changeType: "increase", subtext: "total visits", color: "text-teal-500", link: "#", postfix: "" },
    { title: "Total Left Leads", value: dashboardData.total_left_leads || 0, icon: TrendingUp, change: "+0", changeType: "increase", subtext: "total left leads", color: "text-orange-500", link: "#", postfix: "" },
    { title: "Total Pending Followup", value: dashboardData.total_pending_followup || 0, icon: TrendingUp, change: "+0", changeType: "increase", subtext: "total pending followups", color: "text-cyan-500", link: "#", postfix: "" },
    { title: "Total Today Followup", value: dashboardData.total_today_followup || 0, icon: TrendingUp, change: "+0", changeType: "increase", subtext: "total today followups", color: "text-lime-500", link: "#", postfix: "" },
    { title: "Total Tomorrow Followup", value: dashboardData.total_tomorrow_followup || 0, icon: TrendingUp, change: "+0", changeType: "increase", subtext: "total tomorrow followups", color: "text-emerald-500", link: "#", postfix: "" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Manage Users</h1>
        <div className="ml-auto">
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {kpiData.map((kpi, i) => (
          <Link href={kpi.link} key={i}>
            <Card className={cn("transition-transform ease-in-out hover:shadow-md border-l-4 hover:scale-[1.02] duration-300", kpi.color?.replace('text-', 'border-'))}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className={cn("h-6 w-6", kpi.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  <AnimatedCounter from={0} to={kpi.value} />
                  {kpi.postfix}
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <span className={cn("mr-1", {
                    "text-green-500": kpi.changeType === "increase",
                    "text-red-500": kpi.changeType === "decrease",
                  })}>
                    <TrendingUp className="h-4 w-4" />
                  </span>
                  {kpi.change} {kpi.subtext}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            A list of all users in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.email}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "default" : "secondary"} className={user.status === 'Active' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
