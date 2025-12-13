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

// Type definitions
interface DayData {
  day: number;
  date: string;
  day_name: string;
  leads: number;
  salary: number;
}

interface StaffData {
  name: string;
  email: string;
  mobile: string;
  salary: string;
}

interface ApiResponse {
  staff: StaffData;
  year: number;
  month: number;
  monthly_salary: string;
  total_salary: number;
  months_list: [number, string][];
  daily_productivity_data: DayData[];
}

export default function ProductivityPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [calendarData, setCalendarData] = useState<DayData[]>([]);
  const [staffData, setStaffData] = useState<StaffData | null>(null);
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const [monthsList, setMonthsList] = useState<[number, string][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { toast } = useToast();
  
  const yearsList = Array.from({length: 10}, (_, i) => new Date().getFullYear() - 5 + i);

  async function fetchCalendar() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const staffId = localStorage.getItem("userId");

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }
      if (!staffId) {
        throw new Error("User ID not found. Please log in again.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/staff/productivity-calendar/${staffId}/?year=${year}&month=${month}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      setCalendarData(data.daily_productivity_data || []);
      setStaffData(data.staff);
      setMonthlySalary(parseFloat(data.monthly_salary) || 0);
      setTotalSalary(data.total_salary || 0);
      setMonthsList(data.months_list || []);

    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message || "Failed to fetch calendar data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCalendar();
  }, [year, month]);

  function handleFilterSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchCalendar();
  }

  function getCellBgColor(leads?: number) {
    if (leads === undefined || leads === 0) return "bg-red-500 text-white"; // Red for 0 leads
    return "bg-green-500 text-white"; // Green for 1+ leads
  }

  const DayCell = ({ dayData }: { dayData: DayData }) => {
    const bgColor = getCellBgColor(dayData.leads);

    return (
      <div className={cn("p-2 h-20 md:h-24 flex flex-col justify-between rounded-lg transition-all hover:scale-105", bgColor)}>
        <div className="font-semibold text-base text-right">{dayData.day}</div>
        <div className="text-xs">
          <div className="font-medium">Leads: {dayData.leads}</div>
          <div className="font-medium">Earn: ₹{dayData.salary}</div>
        </div>
        {dayData.leads > 0 && (
          <div className="text-xs opacity-75">
            {dayData.leads >= 15 ? "🔥" : dayData.leads >= 10 ? "✨" : dayData.leads >= 5 ? "👍" : "📈"}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Productivity Calendar</h1>
      
      <Card>
        <CardHeader>
          <form onSubmit={handleFilterSubmit} className="flex flex-col gap-4 items-center sm:flex-row">
            <div className="w-full sm:w-auto">
              <Select value={String(month)} onValueChange={(value) => setMonth(Number(value))}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {monthsList.length > 0 ? (
                    monthsList.map(([monthNum, monthName]) => (
                      <SelectItem key={monthNum} value={String(monthNum)}>{monthName}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value={String(new Date().getMonth() + 1)} disabled>
                      {new Date().toLocaleString('default', { month: 'long' })}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-4 w-full sm:w-auto">
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
            </div>
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

                  <Button onClick={fetchCalendar} className="mt-4">
                    Try Again
                  </Button>
                </div>
            ) : (
             <>
                <div className="hidden md:grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center font-semibold text-muted-foreground pb-2">{day}</div>
                    ))}
                </div>
                <div className="hidden md:grid grid-cols-7 gap-2">
                    {calendarData.map((dayData, index) => (
                      <DayCell key={index} dayData={dayData} />
                    ))}
                </div>
                <div className="md:hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Week</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Earn</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {calendarData.map((dayData, index) => (
                        <TableRow key={index}>
                          <TableCell>{dayData.day}</TableCell>
                          <TableCell>{dayData.day_name}</TableCell>
                          <TableCell>Leads</TableCell>
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