
'use client';

import { BarChart, PieChart } from "@/components/dashboard/custom-charts";
import { AnimatedCounter } from "@/components/dashboard/animated-counter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Globe, Briefcase } from "lucide-react";

const kpiData = [
  { title: "Total Profit", value: 51880, icon: TrendingUp, change: "+15.2%", changeType: "increase", subtext: "vs last month", prefix: "$" },
  { title: "Total Staff", value: 18, icon: Users, change: "+2", changeType: "increase", subtext: "vs last month" },
  { title: "Top Lead Source", value: 100, icon: Globe, change: "+100", changeType: "increase", subtext: "vs last month", prefix: "Website " },
  { title: "Total Freelancers", value: 7, icon: Briefcase, change: "+3", changeType: "increase", subtext: "vs last month" },
];

export default function StaffDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Staff Dashboard</h1>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="shadow-lg rounded-2xl border-border/50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="text-sm text-muted-foreground">{kpi.title}</p>
                      <div className="text-2xl font-bold mt-1">
                        <AnimatedCounter from={0} to={kpi.value} prefix={kpi.prefix} />
                      </div>
                      <p className={`text-xs mt-2 ${kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                          <span className="font-semibold">{kpi.change}</span>
                          <span className="text-muted-foreground ml-1">{kpi.subtext}</span>
                      </p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                      <kpi.icon className="h-6 w-6 text-primary" />
                  </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm bg-card text-card-foreground">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart />
          </CardContent>
        </Card>
        <Card className="shadow-sm bg-card text-card-foreground">
          <CardHeader className="flex flex-row justify-between items-center">
             <CardTitle>Staff Management</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart type="staff" />
          </CardContent>
        </Card>
        <Card className="shadow-sm bg-card text-card-foreground">
           <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Source</CardTitle>
          </CardHeader>
          <CardContent>
           <PieChart type="source" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
