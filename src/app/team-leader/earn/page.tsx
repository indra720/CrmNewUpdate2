'use client';

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

// Types (loose / flexible to accept backend variations)
interface DayData {
  day: number;
  date: string;
  day_name: string;
  leads: number;
  salary: number;
}

interface StaffListItem {
  id: number;
  username: string;
  email?: string;
  mobile?: string;
}

export default function EarnCalendarPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [calendarData, setCalendarData] = useState<DayData[]>([]);
  const [staffData, setStaffData] = useState<{ name?: string; email?: string; mobile?: string } | null>(null);
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const [monthsList, setMonthsList] = useState<[number, string][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [staffId, setStaffId] = useState<string>(''); // initially empty
  const [staffList, setStaffList] = useState<StaffListItem[]>([]);

  const { toast } = useToast();
  const yearsList = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  // 1) Fetch staff list for the team leader dashboard
  async function fetchStaffList() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found.");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/team-leader/staff-dashboard/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Staff list HTTP error: ${res.status}`);
      const json = await res.json();
      const list: StaffListItem[] = json.staff_list || [];
      setStaffList(list);
      // set default staffId to first staff if not already set
      if (list.length > 0 && !staffId) {
        setStaffId(String(list[0].id));
      }
    } catch (err: any) {
      //console.error("fetchStaffList error:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to fetch staff list",
        variant: "destructive",
      });
    }
  }

  // 2) Fetch calendar for the selected staff
  async function fetchCalendar() {
    if (!staffId) {
      setError("No staff selected");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found.");

      //console.log("=== FETCHING STAFF CALENDAR ===", { staffId, year, month });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/team-leader/staff-calendar/${staffId}/?year=${year}&month=${month}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      //console.log("API Response Status:", response.status);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      //console.log("API Response Data:", data);


      const calendarArr: any[] = data.calendar_data || data.daily_productivity_data || data.calendar || [];
      const mappedCalendar: DayData[] = calendarArr.map((d: any) => ({
        day: d.day,
        date: (d.date || '').toString(),
        day_name: d.day_name || d.dayName || '',
        leads: Number(d.leads || d.count || 0),
        salary: Number(d.salary || d.daily_earn || 0),
      }));

      // staff detail may be in data.staff_details or data.staff
      const staffDetails = data.staff_details || data.staff || {};
      // monthly salary might be monthly_salary or monthlySalary
      const monthly = Number(data.monthly_salary ?? data.monthlySalary ?? data.monthly_salary ?? 0);
      // total / earned salary may be earn_salary or total_salary
      const total = Number(data.earn_salary ?? data.total_salary ?? data.totalEarned ?? 0);
      // months list fallback
      const months = data.months_list || data.monthsList || [];

      setCalendarData(mappedCalendar);
      setStaffData({ name: staffDetails.username || staffDetails.name || staffDetails.full_name || '', email: staffDetails.email || '', mobile: staffDetails.mobile || '' });
      setMonthlySalary(monthly || 0);
      setTotalSalary(total || 0);
      // map months into [number, string][] if needed
      if (Array.isArray(months) && months.length > 0 && Array.isArray(months[0])) {
        setMonthsList(months);
      } else if (Array.isArray(months) && months.length === 12 && typeof months[0] === 'string') {
        // example: ['January','February',...]
        setMonthsList(months.map((name: string, i: number) => [i + 1, name]));
      } else {
        // fallback: generate months
        setMonthsList((prev) => prev.length ? prev : Array.from({ length: 12 }, (_, i) => [i + 1, new Date(0, i).toLocaleString('default', { month: 'long' })]));
      }

      toast({
        title: "Success",
        description: "Calendar data loaded successfully",
        className: "bg-green-500 text-white",
      });

    } catch (err: any) {
      //console.error("=== API ERROR ===", err);
      setError(err.message || "Failed to fetch calendar data");
      toast({
        title: "Error",
        description: err.message || "Failed to fetch calendar data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  // Load staff list on mount
  useEffect(() => {
    fetchStaffList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch calendar when staffId / year / month changes
  useEffect(() => {
    // Only fetch if a staffId exists
    if (staffId) fetchCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffId, year, month]);

  function handleFilterSubmit(e: React.FormEvent) {
    e.preventDefault();
    // fetchCalendar() will be triggered by effect, but call directly for immediate response
    fetchCalendar();
  }

  function getCellBgColor(leads?: number) {
    if (leads === undefined || leads === 0) return "bg-gray-100 border border-gray-200";
    if (leads >= 15) return "bg-gradient-to-tr from-purple-500 to-blue-500 text-white shadow-lg";
    if (leads >= 10) return "bg-gradient-to-tr from-purple-400 to-blue-400 text-white shadow-md";
    if (leads >= 5) return "bg-gradient-to-tr from-purple-300 to-blue-300 text-gray-800 shadow-sm";
    return "bg-gradient-to-tr from-purple-200 to-blue-200 text-gray-700";
  }

  const DayCell = ({ dayData }: { dayData: DayData }) => {
    const bgColor = getCellBgColor(dayData.leads);
    return (
      <div className={cn("p-3 h-24 md:h-28 flex flex-col justify-between rounded-lg transition-all hover:scale-105", bgColor)}>
        <div className="font-bold text-lg text-right">{dayData.day}</div>
        <div className="text-sm">
          <div className="font-medium">Leads: {dayData.leads}</div>
          <div className="font-medium">Earn: ₹{dayData.salary}</div>
        </div>
        {dayData.leads > 0 && (
          <div className="text-xs opacity-75">
            {dayData.leads >= 15 ? "🔥 Excellent!" : dayData.leads >= 10 ? "✨ Great!" : dayData.leads >= 5 ? "👍 Good" : "📈 Start"}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Earn Calendar</h1>

      {/* Staff Selector (populated from team-leader/staff-dashboard) */}
      <Card>
        <CardHeader>
          <form onSubmit={handleFilterSubmit} className="flex flex-col sm:flex-row gap-4 items-center w-full">
            <Select value={staffId} onValueChange={(val) => setStaffId(val)}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Select Staff" />
              </SelectTrigger>

              <SelectContent>
                {staffList.map(s => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.username} ({s.email || s.mobile})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>


            <Select value={String(month)} onValueChange={(value) => setMonth(Number(value))}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {monthsList.map(([monthNum, monthName]) => (
                  <SelectItem key={monthNum} value={String(monthNum)}>{monthName}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={String(year)} onValueChange={(value) => setYear(Number(value))}>
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {yearsList.map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Filter
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">
              <p>{error}</p>
              <Button onClick={fetchCalendar} className="mt-4">Try Again</Button>
            </div>
          ) : (
            <>
              {staffData && (
                <Card className="mb-4">
                  <CardHeader>
                    <div className="text-lg font-semibold">Staff: {staffData.name} ({staffData.email})</div>
                  </CardHeader>
                </Card>
              )}

              {/* Legend and Calendar UI */}
              <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                <h3 className="text-sm font-semibold mb-3">Performance Legend:</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
                    <span>0 Leads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-tr from-purple-200 to-blue-200 rounded"></div>
                    <span>1-4 Leads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-tr from-purple-300 to-blue-300 rounded"></div>
                    <span>5-9 Leads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-tr from-purple-400 to-blue-400 rounded"></div>
                    <span>10-14 Leads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-tr from-purple-500 to-blue-500 rounded"></div>
                    <span>15+ Leads</span>
                  </div>
                </div>
              </div>

              <div className="hidden md:grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-muted-foreground pb-2">{day}</div>
                ))}
              </div>

              <div className="hidden md:grid grid-cols-7 gap-2">
                {calendarData.map((dayData, index) => <DayCell key={index} dayData={dayData} />)}
              </div>
              
              <div className="md:hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Week</TableHead>
                        <TableHead>Leads</TableHead>
                        <TableHead>Earn</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {calendarData.map((dayData, index) => (
                        <TableRow key={index}>
                          <TableCell>{dayData.day}</TableCell>
                          <TableCell>{dayData.day_name}</TableCell>
                          <TableCell>{dayData.leads}</TableCell>
                          <TableCell>₹{dayData.salary}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-lg font-semibold">Monthly Salary: <span className="text-primary">₹{monthlySalary.toLocaleString()}</span></div>
                <div className="text-lg font-semibold">Total Earned: <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">₹{totalSalary.toLocaleString()}</span></div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}