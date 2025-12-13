"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, XCircle, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TaskData {
  date: string;
  task: string;
}

interface AttendanceData {
  present_days: string[];
  absent_days: string[];
}

interface AttendanceDialogProps {
  userId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AttendanceDialog({
  userId,
  isOpen,
  onClose,
}: AttendanceDialogProps): JSX.Element {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayTask, setSelectedDayTask] = useState<TaskData | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({ present_days: [], absent_days: [] });
  const [taskData, setTaskData] = useState<TaskData[]>([]);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);

  useEffect(() => {
    if (!userId || !isOpen) return;

    const fetchAttendance = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/attendance/${userId}/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });

        if (!response.ok) {
          //console.error("Failed to fetch attendance");
          // Reset data on failure
          setAttendanceData({ present_days: [], absent_days: [] });
          setPresentCount(0);
          setAbsentCount(0);
          setTaskData([]);
          return;
        }

        const data = await response.json();

        const present_days: string[] = [];
        const absent_days: string[] = [];
        const tasks: TaskData[] = [];

        data.calendar_data.forEach((day: any) => {
          if (day.attendance_status === 'present') {
            present_days.push(day.date);
          } else if (day.attendance_status === 'absent') {
            absent_days.push(day.date);
          }
          if (day.has_task && day.task_description) { // Assuming task_description is provided
            tasks.push({ date: day.date, task: day.task_description });
          }
        });

        setAttendanceData({ present_days, absent_days });
        setPresentCount(data.present_count);
        setAbsentCount(data.absent_count);
        setTaskData(tasks);

      } catch (error) {
        //console.error("Error fetching attendance:", error);
        setAttendanceData({ present_days: [], absent_days: [] });
        setPresentCount(0);
        setAbsentCount(0);
        setTaskData([]);
      }
    };

    fetchAttendance();
  }, [userId, currentDate, isOpen]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handlePrevYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
  };

  const handleNextYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
  };

  const totalDaysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const presentPercentage = totalDaysInMonth > 0 ? (presentCount / totalDaysInMonth) * 100 : 0;
  const absentPercentage = totalDaysInMonth > 0 ? (absentCount / totalDaysInMonth) * 100 : 0;

  const handleDayClick = (day: Date) => {
    const clickedDate = day.toISOString().split('T')[0];
    const task = taskData.find(t => t.date === clickedDate);
    setSelectedDayTask(task || null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background via-background to-secondary/30 p-0"
        style={{
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none'  /* IE and Edge */
        }}
        onScroll={(e) => {
          // For Webkit browsers (Chrome, Safari)
          const target = e.target as HTMLElement;
          if (target) {
            target.style.setProperty('-webkit-overflow-scrolling', 'touch');
            target.style.setProperty('-webkit-scrollbar-width', 'none');
            target.style.setProperty('scrollbar-width', 'none');
            target.style.setProperty('-ms-overflow-style', 'none');
          }
        }}
      >
        <div className="p-6 pb-0">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
                <CalendarIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Attendance Overview
                </DialogTitle>
                <DialogDescription className="text-base mt-1">
                  Viewing attendance records for user <span className="font-semibold text-foreground">#{userId}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="space-y-6 py-4 px-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Present Card */}
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-green-50 dark:bg-green-950/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/20 rounded-full blur-2xl -mr-16 -mt-16" />
              <CardHeader className="pb-3 relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Present Days
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-4xl font-bold text-green-800 mb-2">
                  {presentCount}
                </div>
                <div className="space-y-2">
                  <Progress value={presentPercentage} className="h-2 bg-green-200" indicatorClassName="bg-green-600" />
                  <p className="text-sm text-muted-foreground font-medium">
                    {presentPercentage.toFixed(1)}% of total month
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Absent Card */}
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-red-50 dark:bg-red-950/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-400/20 rounded-full blur-2xl -mr-16 -mt-16" />
              <CardHeader className="pb-3 relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-red-700 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Absent Days
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-4xl font-bold text-red-800 mb-2">
                  {absentCount}
                </div>
                <div className="space-y-2">
                  <Progress value={absentPercentage} className="h-2 bg-red-200" indicatorClassName="bg-red-600" />
                  <p className="text-sm text-muted-foreground font-medium">
                    {absentPercentage.toFixed(1)}% of total month
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Current Month Card */}
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-blue-50 dark:bg-blue-950/30 sm:col-span-2 lg:col-span-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl -mr-16 -mt-16" />
              <CardHeader className="pb-3 relative">
                <CardTitle className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Viewing Period
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl font-bold text-blue-800 mb-1">
                  {currentDate.toLocaleString("default", { month: "long" })}
                </div>
                <p className="text-lg text-muted-foreground font-semibold">
                  {currentDate.getFullYear()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Calendar Section - Full Width */}
        </div>
        
        <div className="w-full border-t bg-gradient-to-br from-card via-card to-secondary/20">
          <div className="px-6 py-6 space-y-4">
              {/* Navigation Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handlePrevYear}
                    className="h-9 w-9 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <ChevronLeft className="h-4 w-4 -ml-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handlePrevMonth}
                    className="h-9 w-9 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
                
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
                </h2>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleNextMonth}
                    className="h-9 w-9 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleNextYear}
                    className="h-9 w-9 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <ChevronRight className="h-4 w-4 -ml-3" />
                  </Button>
                </div>
              </div>

              {/* Calendar Component */}
              <div className="rounded-xl bg-background/50 backdrop-blur-sm p-6 border shadow-inner">
                <Calendar
                  month={currentDate}
                  onMonthChange={setCurrentDate}
                  modifiers={{
                    present: attendanceData.present_days.map(day => new Date(day)),
                    absent: attendanceData.absent_days.map(day => new Date(day)),
                  }}
                  modifiersClassNames={{
                    present: "!bg-green-100 !text-green-800 font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 border-green-300",
                    absent: "!bg-red-100 !text-red-800 font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 border-red-300",
                  }}
                  className="p-0 w-full max-w-full mx-auto pointer-events-auto"
                  classNames={{
                    months: "w-full",
                    month: "w-full space-y-4",
                    table: "w-full border-collapse",
                    head_row: "flex w-full",
                    head_cell: "flex-1 text-center text-sm font-semibold text-muted-foreground uppercase",
                    row: "grid grid-cols-7 gap-2 w-full mt-2", // Added gap-2 here
                    cell: "flex-1 text-center p-0 relative flex items-center justify-center",
                    day: "h-14 w-full text-base font-semibold transition-all duration-200 hover:bg-muted rounded-lg flex items-center justify-center text-black",
                    day_selected: "bg-primary text-primary-foreground",
                    nav_button: "h-8 w-8 hover:bg-primary hover:text-primary-foreground transition-colors rounded-md",
                  }}
                  onDayClick={handleDayClick}
                />
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-8 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-md bg-green-100 border-2 border-green-300 shadow-sm" />
                  <span className="text-sm font-semibold text-muted-foreground">Present Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-md bg-red-100 border-2 border-red-300 shadow-sm" />
                  <span className="text-sm font-semibold text-muted-foreground">Absent Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Task Popup */}
          {selectedDayTask && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full relative">
                <button onClick={() => setSelectedDayTask(null)} className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full">
                  <X className="h-5 w-5 text-gray-600" />
                </button>
                <h3 className="text-lg font-bold mb-2">Task for {selectedDayTask.date}</h3>
                <p className="text-gray-700">{selectedDayTask.task}</p>
              </div>
            </div>
          )}
      </DialogContent>
    </Dialog>
  );
}