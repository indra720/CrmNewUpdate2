
'use client';

import { BarChart, PieChart, FreelancerChart } from "@/components/dashboard/custom-charts";

import { AnimatedCounter } from "@/components/dashboard/animated-counter";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { TrendingUp, Users, Globe, Briefcase, AreaChart, Filter } from "lucide-react";

import Link from "next/link";

import { cn } from "@/lib/utils";

import React, { useEffect, useState } from "react";

import { addDays } from "date-fns";

import { type DateRange } from "react-day-picker";

import { DateRangePicker } from "@/components/ui/date-range-picker";

import { Button } from "@/components/ui/button";





const kpiData = [

  { title: "Productivity", value: 85, icon: AreaChart, change: "+20.1%", changeType: "increase", subtext: "vs last month", postfix: "%", color: "text-purple-500", link: "/superadmin/productivity" },

  { title: "Staff Management", value: 18, icon: Users, change: "+2", changeType: "increase", subtext: "vs last month", color: "text-sky-500", link: "/superadmin/users/staff" },

  { title: "Source", value: 100, icon: Globe, change: "+10", changeType: "increase", subtext: "new sources", prefix: "", color: "text-amber-500", link: "/superadmin/marketing" },

  { title: "Freelancers", value: 7, icon: Briefcase, change: "+3", changeType: "increase", subtext: "vs last month", color: "text-rose-500", link: "/superadmin/users/admin" },

];



export default function SuperAdminDashboardPage() {

  const [dashboardData, setDashboardData] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({

    from: new Date(),

    to: addDays(new Date(), 7),

  });



  useEffect(() => {

    const fetchDashboardData = async () => {

      const token = localStorage.getItem('authToken');

      try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/dashboard/super-user/`, {

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
    return <div className="text-center py-8 text-lg">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-lg text-red-500">Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div className="text-center py-8 text-lg">No data available.</div>;
  }

  const productivityChartData = dashboardData.data_points ? dashboardData.data_points.map((point: any) => ({
    name: point.label,
    value: point.y,
  })) : [];

  const staffManagementChartData = [
    { name: 'Total Employees', value: dashboardData.total_users || 0 },
    { name: 'Login', value: dashboardData.logged_in_users || 0 },
    { name: 'Not Login', value: dashboardData.logged_out_users || 0 },
    // 'In Office' and 'Freelancer' data are not directly available in the API response
  ];

  const sourceDistributionChartData = [
    { name: 'Interested', value: dashboardData.total_interested || 0 },
    { name: 'Not Interested', value: dashboardData.total_not_interested || 0 },
    { name: 'Other Location', value: dashboardData.total_other_location || 0 },
    { name: 'Not Picked', value: dashboardData.total_not_picked || 0 },
    { name: 'Lost', value: dashboardData.total_lost || 0 },
    { name: 'Visits', value: dashboardData.total_visits || 0 },
    { name: 'Total Calls', value: (dashboardData.data_points && dashboardData.data_points.find((p: any) => p.label === 'Total Calls')?.y) || 0 },
  ];

  const freelancerPerformanceChartData = [
    { name: 'Total Users', value: dashboardData.total_users || 0 },
    { name: 'Logged In', value: dashboardData.logged_in_users || 0 },
    { name: 'Logged Out', value: dashboardData.logged_out_users || 0 },
  ];

  // Update kpiData with fetched values
  const updatedKpiData = kpiData.map(kpi => {
    let dynamicValue;
    switch (kpi.title) {
      case "Productivity":
        dynamicValue = dashboardData.data_points ? dashboardData.data_points.reduce((sum: number, point: any) => sum + point.y, 0) : 0;
        break;
      case "Staff Management":
        dynamicValue = dashboardData.total_users || 0;
        break;
      case "Source":
        const totalCalls = (dashboardData.data_points && dashboardData.data_points.find((p: any) => p.label === 'Total Calls')?.y) || 0;
        dynamicValue = (dashboardData.total_interested || 0) + (dashboardData.total_not_interested || 0) + totalCalls;
        break;
      case "Freelancers":
        dynamicValue = dashboardData.total_users || 0;
        break;
      default:
        dynamicValue = kpi.value;
    }

    const change = dynamicValue - kpi.value;
    const changeType = change >= 0 ? 'increase' : 'decrease';
    const changeText = change >= 0 ? `+${change}` : `${change}`;

    return {
      ...kpi,
      value: dynamicValue,
      change: changeText,
      changeType: changeType,
      subtext: '' // Remove static subtext
    };
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Admin Users</h1>
        <div className="flex items-center gap-2">
          <DateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
          />
          <Button>
            <Filter className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Filter</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {updatedKpiData.map((kpi, i) => (
          <div key={i}>
            <Card className={cn("transition-transform ease-in-out hover:shadow-md border-l-4 hover:scale-[1.02] duration-300", kpi.color?.replace('text-', 'border-'))}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className={cn("h-6 w-6", kpi.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  <AnimatedCounter from={0} to={kpi.value ?? 0} />
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
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Productivity Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <BarChart data={productivityChartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Staff Management Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={staffManagementChartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Source Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={sourceDistributionChartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Freelancer Performance</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <FreelancerChart data={freelancerPerformanceChartData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}














// npm run build

// > nextn@0.1.0 build
// > cross-env NODE_ENV=production next build

//    ▲ Next.js 15.5.6
//    - Environments: .env

//    Creating an optimized production build ...
//  ✓ Compiled successfully in 23.2s
//    Skipping validation of types
//    Skipping linting
//  ✓ Collecting page data    
//  ⨯ useSearchParams() should be wrapped in a suspense boundary at page "/superadmin/reports/other-location". Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
//     at g (D:\newcrmcode\CrmNewUpdate1\.next\server\chunks\2390.js:1:98774)
//     at m (D:\newcrmcode\CrmNewUpdate1\.next\server\chunks\2390.js:9:14815)
//     at x (D:\newcrmcode\CrmNewUpdate1\.next\server\chunks\3651.js:1:715)
//     at n3 (D:\newcrmcode\CrmNewUpdate1\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:2:82831)
//     at n6 (D:\newcrmcode\CrmNewUpdate1\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:2:84601)
//     at n5 (D:\newcrmcode\CrmNewUpdate1\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:2:104801)
//     at n7 (D:\newcrmcode\CrmNewUpdate1\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:2:102219)
//     at n8 (D:\newcrmcode\CrmNewUpdate1\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:2:83183)
//     at n6 (D:\newcrmcode\CrmNewUpdate1\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:2:84647)
//     at n6 (D:\newcrmcode\CrmNewUpdate1\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:2:101560)
// Error occurred prerendering page "/superadmin/reports/other-location". Read more: https://nextjs.org/docs/messages/prerender-error
// Export encountered an error on /superadmin/reports/other-location/page: /superadmin/reports/other-location, exiting the build.
//  ⨯ useSearchParams() should be wrapped in a suspense boundary at page "/team-leader/reports/interested". Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
//     at g (D:\newcrmcode\CrmNewUpdate1\.next\server\chunks\2390.js:1:98774)
//     at m (D:\newcrmcode\CrmNewUpdate1\.next\server\chunks\2390.js:9:14815)
//     at l (D:\newcrmcode\CrmNewUpdate1\.next\server\app\team-leader\reports\visit\page.js:1:9100)
//     at n3 (D:\newcrmcode\CrmNewUpdate1\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:2:82831)
//     at n6 (D:\newcrmcode\CrmNewUpdate1\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:2:84601)
//     at n5 (D:\newcrmcode\CrmNewUpdate1\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:2:104801)
//     at n7 (D:\newcrmcode\CrmNewUpdate1\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:2:102219)
//     at ia (D:\newcrmcode\CrmNewUpdate1\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:2:108211)
//     at ie (D:\newcrmcode\CrmNewUpdate1\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:2:106833)
//     at n5 (D:\newcrmcode\CrmNewUpdate1\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:2:105079)
// Error occurred prerendering page "/team-leader/reports/interested". Read more: https://nextjs.org/docs/messages/prerender-error
// Export encountered an error on /team-leader/reports/interested/page: /team-leader/reports/interested, exiting the build.
//  ⨯ useSearchParams() should be wrapped in a suspense boundary at page "/admin/leads-report/other-location". Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
//     at g (D:\newcrmcode\CrmNewUpdate1\.next\server\chunks\2390.js:1:98774)
//     at m (D:\newcrmcode\CrmNewUpdate1\.next\server\chunks\2390.js:9:14815)
//     at l (D:\newcrmcode\CrmNewUpdate1\.next\server\app\admin\leads-report\total-earning\page.js:2:8124)
//     at n3 (D:\newcrmcode\CrmNewUpdate1\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:2:82831)
//     at n6 (D:\newcrmcode\CrmNewUpdate1\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:2:84601)
//     at n5 (D:\newcrmcode\CrmNewUpdate1\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:2:104801)
//     at n7 (D:\newcrmcode\CrmNewUpdate1\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:2:102219)
//     at ia (D:\newcrmcode\CrmNewUpdate1\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:2:108211)
//     at ie (D:\newcrmcode\CrmNewUpdate1\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:2:106833)
//     at n5 (D:\newcrmcode\CrmNewUpdate1\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:2:105079)
// Error occurred prerendering page "/admin/leads-report/other-location". Read more: https://nextjs.org/docs/messages/prerender-error
// Export encountered an error on /admin/leads-report/other-location/page: /admin/leads-report/other-location, exiting the build.
//  ⨯ Next.js build worker exited with code: 1 and signal: null











// Bhai good news + bad news:

// ❌ Bad news:

// Tumhare project me 20+ pages me useSearchParams() / useRouter() / usePathname() use ho raha hai —
// and NEXT 15 build kabhi pass nahi hoga jab tak har page ko Suspense wrapper + split component structure follow nahi karta.

// ✔ Good news:

// Tum ek-ek page ko fix nahi karna padega.

// ❤️ BEST FIX (SIRF 1 MINUTE)

// Next.js 15 ka strict rule disable kar do

// Next.js ne ye warning di thi:
// "you MUST wrap useSearchParams with Suspense in app router"

// BUT —
// Ye rule ko next.config.js me disable kar sakte ho:
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     missingSuspenseWithCSRBailout: false,
//   },
// };

// module.exports = nextConfig;
