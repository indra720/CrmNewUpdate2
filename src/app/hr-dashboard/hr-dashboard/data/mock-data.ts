export const hrSidebarSections = [
  { id: "overview", label: "Overview", icon: "LayoutDashboard" },
  { id: "attendance", label: "Attendance", icon: "Clock3" },
  { id: "leave", label: "Leave Requests", icon: "CalendarDays" },
  { id: "corrections", label: "Corrections", icon: "FileCheck2" },
  { id: "reports", label: "Reports", icon: "BarChart3" },
  { id: "settings", label: "Settings", icon: "Settings" },
];

export const hrKpiData = [
  { title: "Total Employees", value: "1,247", change: "+12%", trend: "up" },
  { title: "Active Today", value: "1,089", change: "+45", trend: "up" },
  { title: "Absent Today", value: "67", change: "-8", trend: "down" },
  { title: "Late Check-ins", value: "23", change: "+5", trend: "up" },
  { title: "On Leave", value: "54", change: "+3", trend: "up" },
  { title: "WFH", value: "89", change: "+12", trend: "up" },
  { title: "Avg Hours", value: "8.2h", change: "+0.3h", trend: "up" },
  { title: "Compliance", value: "94.2%", change: "+2.1%", trend: "up" },
];

export const hrAttendanceTrendData = [
  { day: "Mon", present: 1050, absent: 45, wfh: 78, leave: 74 },
  { day: "Tue", present: 1080, absent: 38, wfh: 82, leave: 47 },
  { day: "Wed", present: 1065, absent: 52, wfh: 75, leave: 55 },
  { day: "Thu", present: 1090, absent: 35, wfh: 80, leave: 42 },
  { day: "Fri", present: 1020, absent: 60, wfh: 95, leave: 72 },
];

export const hrPieChartData = [
  { name: "Present", value: 1089, color: "#22c55e" },
  { name: "Absent", value: 67, color: "#ef4444" },
  { name: "On Leave", value: 54, color: "#f59e0b" },
  { name: "WFH", value: 89, color: "#3b82f6" },
];

export const hrAlerts = [
  { id: 1, title: "Not checked in", message: "Rahul Sharma has not checked in yet", time: "Expected 9:00 AM", severity: "warning" },
  { id: 2, title: "Late arrival", message: "Priya Patel arrived 45 mins late", time: "10:45 AM", severity: "danger" },
  { id: 3, title: "Geo-fence issue", message: "Amit Kumar checked in outside the allowed range", time: "9:15 AM", severity: "danger" },
  { id: 4, title: "Missing checkout", message: "Sneha Gupta missed yesterday's checkout", time: "Yesterday", severity: "warning" },
];

export const hrEmployeeAttendance = [
  { id: 1, name: "Rahul Sharma", dept: "Engineering", checkIn: "9:02 AM", checkOut: "6:15 PM", hours: "9h 13m", status: "Present", location: "Office" },
  { id: 2, name: "Priya Patel", dept: "Design", checkIn: "10:45 AM", checkOut: "-", hours: "5h 30m", status: "Late", location: "Office" },
  { id: 3, name: "Amit Kumar", dept: "Sales", checkIn: "9:15 AM", checkOut: "6:00 PM", hours: "8h 45m", status: "Present", location: "Client Site" },
  { id: 4, name: "Sneha Gupta", dept: "HR", checkIn: "8:55 AM", checkOut: "5:30 PM", hours: "8h 35m", status: "Present", location: "WFH" },
  { id: 5, name: "Vijay Singh", dept: "Finance", checkIn: "-", checkOut: "-", hours: "-", status: "Absent", location: "-" },
  { id: 6, name: "Anjali Verma", dept: "Marketing", checkIn: "9:00 AM", checkOut: "6:30 PM", hours: "9h 30m", status: "Present", location: "Office" },
];

export const hrLeaveRequests = [
  { id: 1, name: "Karan Malhotra", type: "Sick Leave", dates: "Dec 18-19", days: 2 },
  { id: 2, name: "Neha Kapoor", type: "Casual Leave", dates: "Dec 20", days: 1 },
  { id: 3, name: "Sanjay Rao", type: "Privilege Leave", dates: "Dec 22-26", days: 5 },
];

export const hrCorrections = [
  { id: 1, name: "Divya Nair", issue: "Missed Punch", date: "Dec 15", request: "Check-out at 6:30 PM" },
  { id: 2, name: "Arjun Reddy", issue: "Wrong Time", date: "Dec 14", request: "Check-in at 9:00 AM" },
];
