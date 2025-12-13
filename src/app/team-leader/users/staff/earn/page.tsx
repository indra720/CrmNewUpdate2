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
import { Loader2 } from "lucide-react";

const mockData = {
  "structured_calendar_data": [
    [{"day": 0}, {"day": 0}, {"day": 0}, {"day": 1, "day_name": "Wed"}, {"day": 2, "day_name": "Thu"}, {"day": 3, "day_name": "Fri"}, {"day": 4, "day_name": "Sat"}],
    [{"day": 5, "day_name": "Sun"}, {"day": 6, "day_name": "Mon"}, {"day": 7, "day_name": "Tue"}, {"day": 8, "day_name": "Wed"}, {"day": 9, "day_name": "Thu"}, {"day": 10, "day_name": "Fri"}, {"day": 11, "day_name": "Sat"}],
    [{"day": 12, "day_name": "Sun"}, {"day": 13, "day_name": "Mon"}, {"day": 14, "day_name": "Tue"}, {"day": 15, "day_name": "Wed"}, {"day": 16, "day_name": "Thu"}, {"day": 17, "day_name": "Fri"}, {"day": 18, "day_name": "Sat"}],
    [{"day": 19, "day_name": "Sun"}, {"day": 20, "day_name": "Mon"}, {"day": 21, "day_name": "Tue"}, {"day": 22, "day_name": "Wed"}, {"day": 23, "day_name": "Thu"}, {"day": 24, "day_name": "Fri"}, {"day": 25, "day_name": "Sat"}],
    [{"day": 26, "day_name": "Sun"}, {"day": 27, "day_name": "Mon"}, {"day": 28, "day_name": "Tue"}, {"day": 29, "day_name": "Wed"}, {"day": 30, "day_name": "Thu"}, {"day": 31, "day_name": "Fri"}, {"day": 0}]
  ],
  "productivity_data": {
    "1": {"leads": 5, "salary": 200}, "2": {"leads": 12, "salary": 500}, "3": {"leads": 16, "salary": 800},
    "4": {"leads": 0, "salary": 0}, "5": {"leads": 8, "salary": 300}, "6": {"leads": 11, "salary": 450},
    "7": {"leads": 18, "salary": 900}, "8": {"leads": 3, "salary": 150}, "9": {"leads": 7, "salary": 280},
    "10": {"leads": 14, "salary": 600}, "11": {"leads": 2, "salary": 100}, "12": {"leads": 19, "salary": 1000},
    "13": {"leads": 0, "salary": 0}, "14": {"leads": 5, "salary": 200}, "15": {"leads": 9, "salary": 350},
    "16": {"leads": 13, "salary": 550}, "17": {"leads": 1, "salary": 50}, "18": {"leads": 20, "salary": 1200},
    "19": {"leads": 4, "salary": 180}, "20": {"leads": 6, "salary": 250}, "21": {"leads": 10, "salary": 400},
    "22": {"leads": 17, "salary": 850}, "23": {"leads": 0, "salary": 0}, "24": {"leads": 8, "salary": 300},
    "25": {"leads": 15, "salary": 750}, "26": {"leads": 1, "salary": 50}, "27": {"leads": 9, "salary": 350},
    "28": {"leads": 11, "salary": 450}, "29": {"leads": 18, "salary": 900}, "30": {"leads": 0, "salary": 0},
    "31": {"leads": 22, "salary": 1500}
  },
  "monthly_salary": 15000,
  "total_salary": 12360
};

export default function EarnCalendarPage() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [calendarData, setCalendarData] = useState([]);
  const [productivityData, setProductivityData] = useState({});
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const monthsList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const yearsList = Array.from({length: 10}, (_, i) => new Date().getFullYear() - 5 + i);

  async function fetchCalendar() {
    setLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); 
      const data = mockData;
      setCalendarData(data.structured_calendar_data || []);
      setProductivityData(data.productivity_data || {});
      setMonthlySalary(data.monthly_salary || 0);
      setTotalSalary(data.total_salary || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCalendar();
  }, []);

  function handleFilterSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchCalendar();
  }

  function getCellBgColor(leads?: number) {
    if (leads === undefined || leads === 0) return "bg-card";
    if (leads >= 15) return "bg-green-500/20 text-green-800 dark:bg-green-500/10 dark:text-green-300";
    if (leads >= 10) return "bg-blue-500/20 text-blue-800 dark:bg-blue-500/10 dark:text-blue-300";
    return "bg-amber-500/20 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300";
  }

  const DayCell = ({ day }: { day: any }) => {
    if (day.day === 0) {
      return <div className="p-2 h-24 md:h-28 hidden sm:block"></div>;
    }
    const dayProd = productivityData[day.day as keyof typeof productivityData] || { leads: 0, salary: 0 };
    const bgColor = getCellBgColor(dayProd.leads);

    return (
      <div className={cn("p-2 h-full flex flex-col justify-between rounded-lg", bgColor)}>
        <div className="font-bold text-lg text-right">{day.day}</div>
        <div className="text-sm">
          <div>Leads: {dayProd.leads}</div>
          <div>Earn: ₹{dayProd.salary}</div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Earn Calendar</h1>
      <Card>
        <CardHeader>
          <form onSubmit={handleFilterSubmit} className="flex flex-col sm:flex-row gap-4 items-center">
            <Select value={String(month)} onValueChange={(value) => setMonth(Number(value))}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {monthsList.map((name, idx) => (
                  <SelectItem key={idx} value={String(idx)}>{name}</SelectItem>
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
                <div className="text-center text-red-500 py-10">{error}</div>
            ) : (
             <>
                <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center font-semibold text-muted-foreground pb-2 hidden md:block">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {calendarData.flat().map((day, index) => <DayCell key={index} day={day} />)}
                </div>
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-semibold">Monthly Salary: <span className="text-primary">₹{monthlySalary.toLocaleString()}</span></div>
                    <div className="text-lg font-semibold">Total Earned: <span className="text-green-600">₹{totalSalary.toLocaleString()}</span></div>
                </div>
             </>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
