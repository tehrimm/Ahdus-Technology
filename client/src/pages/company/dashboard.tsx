import React, { useState } from "react";
import { CompanyLayout } from "@/components/company/company-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useData } from "@/lib/data-context";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, parse } from "date-fns";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

// Import necessary icons
import { 
  Users, 
  Briefcase, 
  CalendarCheck,
  FileText,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from "lucide-react";

export default function DashboardPage() {
  const { jobs, applications } = useData();
  const [selectedDay, setSelectedDay] = useState<number | null>(6); // Default to today
  const today = new Date();
  
  const formatValue = (value: number) => {
    if (value >= 1000) {
      return (value / 1000).toFixed(0) + "k";
    }
    return value.toString();
  };
  
  // Generate week days for calendar
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 0 });
  const currentWeekEnd = endOfWeek(today, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd }).map(
    (day, index) => ({
      date: day,
      dayNum: format(day, 'd'),
      dayName: format(day, 'EEE').substring(0, 2),
      isToday: format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'),
      events: index === 1 || index === 3 || index === 6,
      index
    })
  );
  
  // Data for attendance chart
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const attendanceData = days.map(day => ({
    name: day,
    present: Math.floor(Math.random() * 40) + 60,
    late: Math.floor(Math.random() * 20) + 10,
    absent: Math.floor(Math.random() * 10),
  }));
  
  // Schedule data for the right side panel
  const currentEvents = [
    {
      time: "09:30",
      title: "Practical Task Review",
      subtitle: "UI/UX Designer",
    },
    {
      time: "12:00",
      title: "Resume Review",
      subtitle: "Magento Developer",
    },
    {
      time: "01:30",
      title: "Final HR Round",
      subtitle: "Sales Manager",
    }
  ];
  
  const tomorrowEvents = [
    {
      time: "09:30",
      title: "Practical Task Review",
      subtitle: "Front end Developer",
    },
    {
      time: "11:00",
      title: "TL Meeting",
      subtitle: "React JS",
    }
  ];
  
  // Calculate July 2023
  const [currentMonth, setCurrentMonth] = useState("July, 2023");

  return (
    <CompanyLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Employee Card */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <span className="text-sm text-gray-600">Total Employee</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold">560</div>
                  <div className="flex items-center text-xs text-green-500">
                    <span className="inline-block mr-1">+12%</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Update: July 16, 2023</div>
              </CardContent>
            </Card>
            
            {/* Total Applicant Card */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <span className="text-sm text-gray-600">Total Applicant</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold">1050</div>
                  <div className="flex items-center text-xs text-green-500">
                    <span className="inline-block mr-1">+6%</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Update: July 14, 2023</div>
              </CardContent>
            </Card>
            
            {/* Today Attendance Card */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <span className="text-sm text-gray-600">Today Attendance</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold">470</div>
                  <div className="flex items-center text-xs text-red-500">
                    <span className="inline-block mr-1">-8%</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Update: July 14, 2023</div>
              </CardContent>
            </Card>
            
            {/* Total Projects Card */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <span className="text-sm text-gray-600">Total Projects</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold">250</div>
                  <div className="flex items-center text-xs text-green-500">
                    <span className="inline-block mr-1">+12%</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Update: July 10, 2023</div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Overview Chart */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex justify-between items-center px-6 py-4">
              <CardTitle className="text-lg font-medium">Attendance Overview</CardTitle>
              <div className="flex items-center">
                <Button variant="ghost" size="sm">Today</Button>
                <Button variant="ghost" size="sm"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm"><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={attendanceData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  barSize={18}
                  barGap={8}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                    ticks={[0, 20, 40, 60, 80, 100]}
                  />
                  <Tooltip />
                  <Bar dataKey="absent" stackId="a" fill="#EF4444" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="late" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="present" stackId="a" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3 width on large screens) */}
        <div className="space-y-6">
          {/* My Schedule Card */}
          <Card className="bg-white shadow-sm overflow-hidden">
            <CardHeader className="flex justify-between items-center p-4 border-b">
              <CardTitle className="text-lg font-medium">My Schedule</CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                <CalendarCheck className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              {/* Month Selector */}
              <div className="flex justify-between items-center mb-4">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="font-medium">{currentMonth}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Week Days */}
              <div className="grid grid-cols-7 text-center mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, index) => (
                  <div key={index} className="text-xs text-gray-500">{day}</div>
                ))}
              </div>
              
              {/* Calendar Dates */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {weekDays.map((day, index) => (
                  <Button
                    key={index}
                    variant={day.isToday ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0 rounded-full",
                      selectedDay === index && !day.isToday && "bg-blue-100 text-blue-600",
                      day.isToday && "bg-blue-500 text-white"
                    )}
                    onClick={() => setSelectedDay(index)}
                  >
                    {day.dayNum}
                  </Button>
                ))}
              </div>
              
              {/* Divider */}
              <div className="border-t my-4"></div>
              
              {/* Today's Date */}
              <div className="text-sm text-gray-700 mb-2">
                Wednesday, 06 July 2023
              </div>
              
              {/* Events */}
              <div className="space-y-4">
                {currentEvents.map((event, index) => (
                  <div key={index} className="border-l-2 border-blue-500 pl-4 py-1">
                    <div className="text-sm font-medium">{event.time}</div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-gray-500">{event.subtitle}</div>
                  </div>
                ))}
              </div>
              
              {/* Tomorrow's Date */}
              <div className="text-sm text-gray-700 mt-6 mb-2">
                Thursday, 07 July 2023
              </div>
              
              {/* Tomorrow's Events */}
              <div className="space-y-4">
                {tomorrowEvents.map((event, index) => (
                  <div key={index} className="border-l-2 border-blue-500 pl-4 py-1">
                    <div className="text-sm font-medium">{event.time}</div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-gray-500">{event.subtitle}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CompanyLayout>
  );
}
