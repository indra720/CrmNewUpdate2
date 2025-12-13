'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const allRoutes = [
  { name: "Login", path: "/login" },
  { name: "Dashboard", path: "/admin" },
  { name: "Add Sell", path: "/admin/add-sell" },
  { name: "AI Lead Import", path: "/admin/import-lead" },
  { name: "AI Lead Scoring", path: "/admin/lead-scoring" },
  { name: "Leads Kanban", path: "/admin/leads" },
  { name: "User Profile", path: "/admin/profile" },
  { name: "Project", path: "/admin/project" },
  { name: "Reports", path: "/admin/reports" },
  { name: "Settings", path: "/admin/settings" },
  { name: "Time Sheet", path: "/admin/timesheet" },
  { name: "Users List", path: "/admin/users" },
  { name: "User Role: Admin", path: "/admin/users/admin" },
  { name: "User Role: Associates", path: "/admin/users/associates" },
  { name: "User Role: IT Staff", path: "/admin/users/it-staff" },
  { name: "User Role: Staff", path: "/admin/users/staff" },
  { name: "User Role: Team Leader", path: "/admin/users/team-leader" },
  { name: "SuperAdmin Dashboard", path: "/superadmin/dashboard" },
  { name: "SuperAdmin Manage Users", path: "/superadmin/manage-users" },
  { name: "SuperAdmin Add User", path: "/superadmin/manage-users/add" },
  { name: "SuperAdmin Reports", path: "/superadmin/reports" },
  { name: "SuperAdmin Settings", path: "/superadmin/settings" },
];

export default function AllRoutesPage() {
  return (
    <div className="container mx-auto py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Project Routes</CardTitle>
          <CardDescription>A list of all available pages in this project for easy navigation.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page / Route</TableHead>
                <TableHead className="text-right">Navigate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allRoutes.map((route) => (
                <TableRow key={route.path}>
                  <TableCell>
                    <div className="font-medium">{route.name}</div>
                    <div className="text-sm text-muted-foreground">{route.path}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={route.path} passHref>
                      <Button variant="outline" size="sm">
                        Go <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
