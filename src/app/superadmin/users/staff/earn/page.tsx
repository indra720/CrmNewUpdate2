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

export default function EarnCalendarPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [calendarData, setCalendarData] = useState<DayData[]>([]);
  const [staffData, setStaffData] = useState<StaffData | null>(null);
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const [monthsList, setMonthsList] = useState<[number, string][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [staffId, setStaffId] = useState('1'); // Default staff ID

  const [staffList, setStaffList] = useState<any[]>([]);

  const { toast } = useToast();
  
  const yearsList = Array.from({length: 10}, (_, i) => new Date().getFullYear() - 5 + i);

  async function fetchStaffList() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/superuser/staff-report/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStaffList(data.staff_list);
    } catch (err: any) {
      //console.error("Error fetching staff list:", err);
    }
  }

  useEffect(() => {
    fetchStaffList();
  }, []);
  
  async function fetchCalendar() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      //console.log("=== FETCHING STAFF CALENDAR ===");
      //console.log("Staff ID:", staffId);
      //console.log("Year:", year);
      //console.log("Month:", month);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/staff/${staffId}/calendar/?year=${year}&month=${month}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      //console.log("API Response Status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      //console.log("API Response Data:", data);

      setCalendarData(data.daily_productivity_data || []);
      setStaffData(data.staff);
      setMonthlySalary(parseFloat(data.monthly_salary) || 0);
      setTotalSalary(data.total_salary || 0);
      setMonthsList(data.months_list || []);

      toast({
        title: "Success",
        description: "Calendar data loaded successfully",
        className: "bg-green-500 text-white",
      });

    } catch (err: any) {
      //console.error("=== API ERROR ===");
      //console.error("Error:", err);
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
  }, [staffId, year, month]);

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
      
      {staffData && (
        <Card>
          <CardHeader>
            <div className="text-lg font-semibold">
              Staff: {staffData.name} ({staffData.email})
            </div>
          </CardHeader>
        </Card>
      )}
      


      <Card>
        <CardHeader>
          <form onSubmit={handleFilterSubmit} className="flex flex-col sm:flex-row gap-4 items-center">
            <Select value={String(staffId)} onValueChange={setStaffId}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select Staff" />
              </SelectTrigger>
              <SelectContent>
                {staffList.map((staff) => (
                  <SelectItem key={staff.id} value={String(staff.id)}>
                    {staff.name}
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
                  <Button onClick={fetchCalendar} className="mt-4">
                    Try Again
                  </Button>
                </div>
            ) : (
             <>
                {/* Color Legend */}
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




// class StaffProductivityCalendarAPIView(APIView):
//     def get(self, request, staff_id, year=None, month=None):
//         year = int(request.GET.get('year', datetime.now().year))
//         month = int(request.GET.get('month', datetime.now().month))

//         if request.user.is_superuser or request.user.is_team_leader or request.user.is_admin:
//             staff = Staff.objects.get(id=staff_id)
//         else:
//             staff = Staff.objects.get(user__id=staff_id)

//         days_in_month = monthrange(year, month)[1]
//         salary_arg = staff.salary if staff.salary else 0
//         daily_salary = round(float(salary_arg) / days_in_month)

//         leads_data = LeadUser.objects.filter(
//             assigned_to=staff,
//             updated_date__year=year,
//             updated_date__month=month,
//             status='Intrested'
//         ).values('updated_date__day').annotate(count=Count('id'))

//         productivity_data = {}
//         total_salary = 0

//         for lead in leads_data:
//             day = lead['updated_date__day']
//             leads_count = lead['count']
//             daily_earned_salary = daily_salary if leads_count >= 10 else round((daily_salary / 10) * leads_count, 2)
//             productivity_data[day] = {'leads': leads_count, 'salary': daily_earned_salary}
//             total_salary += daily_earned_salary

//         calendar_data = monthcalendar(year, month)
//         weekdays = list(day_name)
//         structured_calendar_data = []

//         for week in calendar_data:
//             for i, day in enumerate(week):
//                 if day != 0:
//                     structured_calendar_data.append({'day': day, 'day_name': weekdays[i]})

//         months_list = [(i, calendar.month_name[i]) for i in range(1, 13)]

//         response_data = {
//             'staff': StaffProfileSerializer(staff).data,
//             'year': year,
//             'month': month,
//             'productivity_data': [{'day': day, 'day_name': weekdays[(day - 1) % 7], 'leads': data['leads'], 'salary': data['salary']}
//                                   for day, data in productivity_data.items()],
//             'structured_calendar_data': structured_calendar_data,
//             'days_in_month': days_in_month,
//             'total_salary': round(total_salary, 2),
//             'monthly_salary': salary_arg,
//             'months_list': months_list,
//         }

//         return Response(response_data)
    
