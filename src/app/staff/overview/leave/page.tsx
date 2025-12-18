// 'use client';

// import DashboardLayout from "../dashboardlayout/page";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { DateRangePicker } from "@/components/ui/date-range-picker";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Calendar, Plus, Clock, Check, X, Umbrella, Heart, Plane } from "lucide-react";
// import * as React from "react";
// import { DateRange } from "react-day-picker";
// import { differenceInDays, format, isFuture } from 'date-fns';

// // This map helps add the icon and color to the data calculated on the frontend
// const leaveTypeDetails = {
//   "Casual Leave": { icon: Umbrella, color: "text-primary", bgColor: "bg-primary" },
//   "Sick Leave": { icon: Heart, color: "text-destructive", bgColor: "bg-destructive" },
//   "Earned Leave": { icon: Plane, color: "text-success", bgColor: "bg-success" },
// };

// // Hardcoded total entitlements as the API doesn't provide them
// const totalEntitlements = {
//   "Sick": 12,
//   "Casual": 12,
//   "Earned": 15
// };

// export default function Leave() {
//   // State for the form
//   const [date, setDate] = React.useState<DateRange | undefined>(undefined);
//   const [days, setDays] = React.useState(0);
//   const [leaveType, setLeaveType] = React.useState("");
//   const [reason, setReason] = React.useState("");
//   const [open, setOpen] = React.useState(false);

//   // State for fetched data
//   const [leaveHistory, setLeaveHistory] = React.useState([]);
//   const [leaveBalance, setLeaveBalance] = React.useState([]);
//   const [upcomingLeaves, setUpcomingLeaves] = React.useState([]);
//   const [isLoading, setIsLoading] = React.useState(true);

//   // Function to calculate leave balance from history
//   const calculateLeaveBalance = (leaves) => {
//     const usedDays = { "Sick": 0, "Casual": 0, "Earned": 0 };
//     leaves.forEach(leave => {
//       // Assuming 'Approved' status means the leave is used
//       if (leave.status === 'Approved' || leave.status === 'Pending') {
//          if (usedDays.hasOwnProperty(leave.leave_type)) {
//              usedDays[leave.leave_type] += leave.total_days;
//          }
//       }
//     });

//     return Object.keys(totalEntitlements).map(type => ({
//         type: `${type} Leave`, // e.g., "Sick Leave"
//         total: totalEntitlements[type],
//         used: usedDays[type],
//         remaining: totalEntitlements[type] - usedDays[type],
//         ...leaveTypeDetails[`${type} Leave`]
//     }));
//   };
  
//   const fetchLeaveData = async () => {
//     setIsLoading(true);
//     const token = localStorage.getItem("authToken");
//     if (!token) {
//       console.error("Authentication token not found.");
//       setIsLoading(false);
//       return;
//     }
    
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/leaves/leave_history/`, {
//          headers: {
//           Authorization: `Token ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const leaves = data.leaves || [];

//         // Set History
//         setLeaveHistory(leaves);

//         // Calculate and Set Balance
//         const calculatedBalance = calculateLeaveBalance(leaves);
//         setLeaveBalance(calculatedBalance);

//         // Filter and Set Upcoming Leaves
//         const upcoming = leaves.filter(leave => isFuture(new Date(leave.start_date)));
//         setUpcomingLeaves(upcoming);

//       } else {
//         console.error("Failed to fetch leave data:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error fetching leave data:", error);
//     }
//     setIsLoading(false);
//   };

//   // Fetch data on component mount
//   React.useEffect(() => {
//     fetchLeaveData();
//   }, []);

//   // Calculate days for form when date range changes
//   React.useEffect(() => {
//     if (date?.from && date?.to) {
//       const dayCount = differenceInDays(date.to, date.from) + 1;
//       setDays(dayCount);
//     } else {
//       setDays(0);
//     }
//   }, [date]);

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "Pending":
//         return <span className="status-badge status-badge-pending flex items-center"><Clock className="h-3 w-3 mr-1" /> Pending</span>;
//       case "Approved":
//         return <span className="status-badge status-badge-present flex items-center"><Check className="h-3 w-3 mr-1" /> Approved</span>;
//       case "Rejected":
//         return <span className="status-badge status-badge-absent flex items-center"><X className="h-3 w-3 mr-1" /> Rejected</span>;
//       default:
//         return <span className="status-badge">{status}</span>;
//     }
//   };

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     const token = localStorage.getItem("authToken");
//     if (!token) {
//       console.error("Authentication token not found.");
//       return;
//     }
//     if (!date?.from || !date?.to || !leaveType || !reason) {
//       console.error("All fields are required");
//       return;
//     }
//     const payload = {
//       leave_type: leaveType,
//       start_date: format(date.from, "yyyy-MM-dd"),
//       end_date: format(date.to, "yyyy-MM-dd"),
//       reason: reason,
//     };
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/leave/request/`, {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });
//       const responseData = await response.json();
//       if (response.ok) {
//         console.log("Leave application successful:", responseData);
//         setOpen(false); 
//         fetchLeaveData(); // Re-fetch data to show the new leave
//       } else {
//         console.error("Leave application failed:", responseData);
//       }
//     } catch (error) {
//       console.error("An error occurred:", error);
//     }
//   };


//   return (
//     <DashboardLayout>
//       <div className="space-y-6 bg-card shadow-md rounded-lg p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-foreground">Leave Management</h1>
//             <p className="text-muted-foreground">Track your leave balance and history</p>
//           </div>
//           <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//               <Button>
//                 <Plus className="h-4 w-4 mr-2" />
//                 Apply Leave
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[425px]">
//               <form onSubmit={handleSubmit}>
//                 <DialogHeader>
//                   <DialogTitle>Apply for Leave</DialogTitle>
//                   <DialogDescription>
//                     Fill in the details below to apply for leave.
//                   </DialogDescription>
//                 </DialogHeader>
//                 <div className="grid gap-4 py-4">
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="type" className="text-right">Type</Label>
//                     <Select onValueChange={setLeaveType} value={leaveType}>
//                       <SelectTrigger className="col-span-3">
//                         <SelectValue placeholder="Select a leave type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectGroup>
//                           <SelectLabel>Leave Types</SelectLabel>
//                           <SelectItem value="Sick">Sick Leave</SelectItem>
//                           <SelectItem value="Casual">Casual Leave</SelectItem>
//                           <SelectItem value="Earned">Earned Leave</SelectItem>
//                         </SelectGroup>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="duration" className="text-right">Duration</Label>
//                     <div className="col-span-3">
//                       <DateRangePicker date={date} setDate={setDate} />
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="days" className="text-right">Days</Label>
//                     <Input id="days" type="number" value={days} disabled className="col-span-3" />
//                   </div>
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="reason" className="text-right">Reason</Label>
//                     <Textarea id="reason" placeholder="e.g., Family function" className="col-span-3" value={reason} onChange={(e) => setReason(e.target.value)} />
//                   </div>
//                 </div>
//                 <DialogFooter>
//                   <Button type="submit">Apply</Button>
//                 </DialogFooter>
//               </form>
//             </DialogContent>
//           </Dialog>
//         </div>

//         {/* Leave Balance Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
//           {isLoading ? (
//             Array.from({ length: 3 }).map((_, index) => (
//               <div key={index} className="dashboard-card bg-card shadow-md rounded-md p-6">
//                 <Skeleton className="h-12 w-12 rounded-xl mb-4" />
//                 <Skeleton className="h-6 w-3/4 mb-2" />
//                 <Skeleton className="h-4 w-1/2" />
//               </div>
//             ))
//           ) : (
//             leaveBalance.map((leave) => {
//               const IconComponent = leave.icon;
//               return (
//                 <div key={leave.type} className="dashboard-card bg-card shadow-md rounded-md p-6">
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className={`h-12 w-12 rounded-xl bg-muted flex items-center justify-center ${leave.color}`}>
//                       {IconComponent && <IconComponent className="h-6 w-6" />}
//                     </div>
//                     <div>
//                       <p className="font-semibold text-foreground">{leave.type}</p>
//                       <p className="text-sm text-muted-foreground">Annual entitlement</p>
//                     </div>
//                   </div>
//                   <div className="flex items-end justify-between mb-3">
//                     <div>
//                       <p className="text-4xl font-bold text-foreground">{leave.remaining}</p>
//                       <p className="text-sm text-muted-foreground">days remaining</p>
//                     </div>
//                     <div className="text-right text-sm text-muted-foreground">
//                       <p>{leave.used} used</p>
//                       <p>{leave.total} total</p>
//                     </div>
//                   </div>
//                   <div className="h-2 bg-muted rounded-full overflow-hidden">
//                     <div className={`h-full rounded-full ${leave.bgColor}`} style={{ width: `${(leave.remaining / leave.total) * 100}%` }} />
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>

//         {/* Upcoming Leaves */}
//         {upcomingLeaves.length > 0 && (
//           <div className="dashboard-card bg-gradient-to-r from-primary/5 via-card to-card">
//             <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
//               <Calendar className="h-5 w-5 text-primary" /> Upcoming Leave
//             </h2>
//             {upcomingLeaves.map((leave) => (
//               <div key={leave.id} className="flex items-center justify-between p-4 rounded-xl bg-primary/5">
//                 <div className="flex items-center gap-3">
//                   <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
//                     {leave.total_days}
//                   </div>
//                   <div>
//                     <p className="font-medium text-foreground">{leave.leave_type} Leave</p>
//                     <p className="text-sm text-muted-foreground">{format(new Date(leave.start_date), "dd MMM yyyy")} - {format(new Date(leave.end_date), "dd MMM yyyy")}</p>
//                   </div>
//                 </div>
//                 <Button variant="outline" size="sm">Cancel</Button>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Leave History */}
//         <div className="dashboard-card">
//           <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
//             <Clock className="h-5 w-5 text-primary" /> Leave History
//           </h2>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-border">
//                   <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
//                   <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Duration</th>
//                   <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Days</th>
//                   <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Reason</th>
//                   <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {isLoading ? (
//                   Array.from({ length: 4 }).map((_, index) => (
//                     <tr key={index} className="border-b border-border/50">
//                       <td className="py-3 px-4"><Skeleton className="h-5 w-24" /></td>
//                       <td className="py-3 px-4"><Skeleton className="h-5 w-32" /></td>
//                       <td className="py-3 px-4"><Skeleton className="h-5 w-12" /></td>
//                       <td className="py-3 px-4"><Skeleton className="h-5 w-40" /></td>
//                       <td className="py-3 px-4"><Skeleton className="h-5 w-20" /></td>
//                     </tr>
//                   ))
//                 ) : (
//                   leaveHistory.map((leave) => (
//                     <tr key={leave.id} className="border-b border-border/50 hover:bg-muted/30">
//                       <td className="py-3 px-4 font-medium text-foreground">{leave.leave_type} Leave</td>
//                       <td className="py-3 px-4 text-muted-foreground">{format(new Date(leave.start_date), "dd MMM yyyy")} - {format(new Date(leave.end_date), "dd MMM yyyy")}</td>
//                       <td className="py-3 px-4 text-foreground">{leave.total_days}</td>
//                       <td className="py-3 px-4 text-muted-foreground">{leave.reason || 'N/A'}</td>
//                       <td className="py-3 px-4">{getStatusBadge(leave.status)}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }















'use client';

import DashboardLayout from "../dashboardlayout/page";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Plus, Clock, Check, X, Umbrella, Heart, Plane, Minus } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";
import { differenceInDays, format, isFuture } from 'date-fns';
import { useState, useEffect } from "react";

// This map helps add the icon and color to the data calculated on the frontend
const leaveTypeDetails = {
  "Casual Leave": { icon: Umbrella, color: "text-primary", bgColor: "bg-primary" },
  "Sick Leave": { icon: Heart, color: "text-destructive", bgColor: "bg-destructive" },
  "Earned Leave": { icon: Plane, color: "text-success", bgColor: "bg-success" },
};

// Hardcoded total entitlements as the API doesn't provide them
const totalEntitlements = {
  "Sick": 12,
  "Casual": 12,
  "Earned": 15
};

export default function Leave() {
  // State for the form
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const [days, setDays] = React.useState(0);
  const [leaveType, setLeaveType] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [open, setOpen] = React.useState(false);

  // State for fetched data
  const [leaveHistory, setLeaveHistory] = React.useState([]);
  const [leaveBalance, setLeaveBalance] = React.useState([]);
  const [upcomingLeaves, setUpcomingLeaves] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [screenSize, setScreenSize] = useState('lg');
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  // Screen size detection
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setScreenSize('lg');
        setExpandedRowId(null); // Close expanded on lg
      } else if (window.innerWidth >= 768) {
        setScreenSize('md');
      } else {
        setScreenSize('sm');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to calculate leave balance from history
  const calculateLeaveBalance = (leaves) => {
    const usedDays = { "Sick": 0, "Casual": 0, "Earned": 0 };
    leaves.forEach(leave => {
      // Only count 'Approved' as used for balance
      if (leave.status === 'Approved') {
         if (usedDays.hasOwnProperty(leave.leave_type)) {
             usedDays[leave.leave_type] += leave.total_days;
         }
      }
    });

    return Object.keys(totalEntitlements).map(type => ({
        type: `${type} Leave`, // e.g., "Sick Leave"
        total: totalEntitlements[type],
        used: usedDays[type],
        remaining: totalEntitlements[type] - usedDays[type],
        ...leaveTypeDetails[`${type} Leave`]
    }));
  };
  
  const fetchLeaveData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Authentication token not found.");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/leaves/leave_history/`, {
         headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const leaves = data.leaves || [];

        // Set History
        setLeaveHistory(leaves);

        // Calculate and Set Balance
        const calculatedBalance = calculateLeaveBalance(leaves);
        setLeaveBalance(calculatedBalance);

        // Filter and Set Upcoming Leaves
        const upcoming = leaves.filter(leave => isFuture(new Date(leave.start_date)));
        setUpcomingLeaves(upcoming);

      } else {
        console.error("Failed to fetch leave data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
    setIsLoading(false);
  };

  // Fetch data on component mount
  React.useEffect(() => {
    fetchLeaveData();
  }, []);

  // Calculate days for form when date range changes
  React.useEffect(() => {
    if (date?.from && date?.to) {
      const dayCount = differenceInDays(date.to, date.from) + 1;
      setDays(dayCount);
    } else {
      setDays(0);
    }
  }, [date]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="status-badge status-badge-pending flex items-center"><Clock className="h-3 w-3 mr-1" /> Pending</span>;
      case "Approved":
        return <span className="status-badge status-badge-present flex items-center"><Check className="h-3 w-3 mr-1" /> Approved</span>;
      case "Rejected":
        return <span className="status-badge status-badge-absent flex items-center"><X className="h-3 w-3 mr-1" /> Rejected</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Authentication token not found.");
      return;
    }
    if (!date?.from || !date?.to || !leaveType || !reason) {
      console.error("All fields are required");
      return;
    }
    const payload = {
      leave_type: leaveType,
      start_date: format(date.from, "yyyy-MM-dd"),
      end_date: format(date.to, "yyyy-MM-dd"),
      reason: reason,
    };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/leave/request/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();
      if (response.ok) {
        console.log("Leave application successful:", responseData);
        setOpen(false); 
        fetchLeaveData(); // Re-fetch data to show the new leave
      } else {
        console.error("Leave application failed:", responseData);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const renderTableHeaders = () => {
    if (screenSize === 'lg') {
      return (
        <tr className="border-b border-border">
          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Duration</th>
          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Days</th>
          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Reason</th>
          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
        </tr>
      );
    } else if (screenSize === 'md') {
      return (
        <tr className="border-b border-border">
          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Duration</th>
          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
        </tr>
      );
    } else {
      return (
        <tr className="border-b border-border">
          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Days</th>
        </tr>
      );
    }
  };

  const renderTableRow = (leave, index) => {
    const isExpanded = expandedRowId === leave.id;
    const formattedFrom = format(new Date(leave.start_date), "dd MMM yyyy");
    const formattedTo = format(new Date(leave.end_date), "dd MMM yyyy");

    if (screenSize === 'lg') {
      return (
        <tr key={leave.id} className="border-b border-border/50 hover:bg-muted/30">
          <td className="py-3 px-4 font-medium text-foreground">{leave.leave_type} Leave</td>
          <td className="py-3 px-4 text-muted-foreground">{formattedFrom} - {formattedTo}</td>
          <td className="py-3 px-4 text-foreground">{leave.total_days}</td>
          <td className="py-3 px-4 text-muted-foreground">{leave.reason || 'N/A'}</td>
          <td className="py-3 px-4">{getStatusBadge(leave.status)}</td>
        </tr>
      );
    } else {
      return (
        <React.Fragment key={leave.id}>
          <tr className="border-b border-border/50 hover:bg-muted/30" data-state={isExpanded && 'selected'}>
            {screenSize === 'md' ? (
              <>
                <td className="py-3 px-4 font-medium text-foreground">{leave.leave_type} Leave</td>
                <td className="py-3 px-4 text-muted-foreground">{formattedFrom} - {formattedTo}</td>
                <td className="py-3 px-4">{getStatusBadge(leave.status)}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => toggleRow(leave.id)}
                    className="p-1 rounded hover:bg-muted transition-colors text-green-600"
                  >
                    {isExpanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </button>
                </td>
              </>
            ) : (
              <>
                <td className="py-3 px-4">
                  <button
                    onClick={() => toggleRow(leave.id)}
                    className="p-1 rounded hover:bg-muted transition-colors text-green-600"
                  >
                    {isExpanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </button>
                </td>
                <td className="py-3 px-4 font-medium text-foreground">{leave.leave_type} Leave</td>
                <td className="py-3 px-4 text-foreground">{leave.total_days}</td>
              </>
            )}
          </tr>
          {isExpanded && (
            <tr>
              <td colSpan={screenSize === 'md' ? 4 : 3} className="p-0">
                <div className="p-4">
                  <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <div className="p-4 flex items-center gap-4 border-b border-border">
                      <div className="text-lg font-bold text-foreground">{leave.leave_type} Leave</div>
                    </div>
                    <div className="overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-border">
                        <div className="p-3 border-b border-r md:border-r-0 border-border flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-muted-foreground">Duration:</span>
                          <span className="text-sm font-medium ml-auto">{formattedFrom} - {formattedTo}</span>
                        </div>
                        <div className="p-3 border-b border-l md:border-l-0 border-border flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Days:</span>
                          <span className="text-sm font-medium ml-auto">{leave.total_days}</span>
                        </div>
                        <div className="p-3 border-b border-r md:border-r-0 border-border flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Reason:</span>
                          <span className="text-sm font-medium ml-auto">{leave.reason || 'N/A'}</span>
                        </div>
                        <div className="p-3 border-b border-l md:border-l-0 border-border flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Status:</span>
                          <span className="text-sm font-medium ml-auto">{getStatusBadge(leave.status)}</span>
                        </div>
                        <div className="p-3 border-b border-r md:border-r-0 border-border flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Applied On:</span>
                          <span className="text-sm font-medium ml-auto">{format(new Date(leave.applied_on), "dd MMM yyyy")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 bg-card shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Leave Management</h1>
            <p className="text-muted-foreground">Track your leave balance and history</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Apply Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-[90vw]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Apply for Leave</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to apply for leave.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">Type</Label>
                    <Select onValueChange={setLeaveType} value={leaveType}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a leave type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Leave Types</SelectLabel>
                          <SelectItem value="Sick">Sick Leave</SelectItem>
                          <SelectItem value="Casual">Casual Leave</SelectItem>
                          <SelectItem value="Earned">Earned Leave</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duration" className="text-right">Duration</Label>
                    <div className="col-span-3">
                      <DateRangePicker date={date} setDate={setDate} />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="days" className="text-right">Days</Label>
                    <Input id="days" type="number" value={days} disabled className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reason" className="text-right">Reason</Label>
                    <Textarea id="reason" placeholder="e.g., Family function" className="col-span-3" value={reason} onChange={(e) => setReason(e.target.value)} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Apply</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Leave Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="dashboard-card bg-card shadow-md rounded-md p-6">
                <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : (
            leaveBalance.map((leave) => {
              const IconComponent = leave.icon;
              return (
                <div key={leave.type} className="dashboard-card bg-card shadow-md rounded-md p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`h-12 w-12 rounded-xl bg-muted flex items-center justify-center ${leave.color}`}>
                      {IconComponent && <IconComponent className="h-6 w-6" />}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{leave.type}</p>
                      <p className="text-sm text-muted-foreground">Annual entitlement</p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <p className="text-4xl font-bold text-foreground">{leave.remaining}</p>
                      <p className="text-sm text-muted-foreground">days remaining</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{leave.used} used</p>
                      <p>{leave.total} total</p>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${leave.bgColor}`} style={{ width: `${(leave.remaining / leave.total) * 100}%` }} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Upcoming Leaves */}
        {upcomingLeaves.length > 0 && (
          <div className="dashboard-card bg-gradient-to-r from-primary/5 via-card to-card">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Upcoming Leave
            </h2>
            {upcomingLeaves.map((leave) => {
              const formattedFrom = format(new Date(leave.start_date), "dd MMM yyyy");
              const formattedTo = format(new Date(leave.end_date), "dd MMM yyyy");
              return (
                <div key={leave.id} className="flex items-center justify-between p-4 rounded-xl bg-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {leave.total_days}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{leave.leave_type} Leave</p>
                      <p className="text-sm text-muted-foreground">{formattedFrom} - {formattedTo}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Cancel</Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Leave History */}
        <div className="dashboard-card">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" /> Leave History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {renderTableHeaders()}
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="py-3 px-4"><Skeleton className="h-5 w-24" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-5 w-32" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-5 w-12" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-5 w-40" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-5 w-20" /></td>
                    </tr>
                  ))
                ) : (
                  leaveHistory.map((leave, index) => renderTableRow(leave, index))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}