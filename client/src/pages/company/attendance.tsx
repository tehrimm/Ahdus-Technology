import React, { useState } from "react";
import { CompanyLayout } from "@/components/company/company-layout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Sample employees data for attendance
const attendanceData = [
  {
    id: 1,
    name: "Lorem Ipsum",
    designation: "Team Lead - Design",
    type: "Office",
    checkInTime: "09:27 AM",
    status: "On Time"
  },
  {
    id: 2,
    name: "Lorem Ipsum",
    designation: "Web Designer",
    type: "Office",
    checkInTime: "10:15 AM",
    status: "Late"
  },
  {
    id: 3,
    name: "Lorem Ipsum",
    designation: "Medical Assistant",
    type: "Remote",
    checkInTime: "10:24 AM",
    status: "Late"
  },
  {
    id: 4,
    name: "Lorem Ipsum",
    designation: "Marketing Coordinator",
    type: "Office",
    checkInTime: "09:10 AM",
    status: "On Time"
  },
  {
    id: 5,
    name: "Lorem Ipsum",
    designation: "Data Analyst",
    type: "Office",
    checkInTime: "09:15 AM",
    status: "On Time"
  },
  {
    id: 6,
    name: "Lorem Ipsum",
    designation: "Phyton Developer",
    type: "Remote",
    checkInTime: "09:29 AM",
    status: "On Time"
  },
  {
    id: 7,
    name: "Lorem Ipsum",
    designation: "UI/UX Design",
    type: "Remote",
    checkInTime: "09:29 AM",
    status: "On Time"
  },
  {
    id: 8,
    name: "Lorem Ipsum",
    designation: "React JS",
    type: "Remote",
    checkInTime: "09:29 AM",
    status: "On Time"
  },
  {
    id: 9,
    name: "Lorem Ipsum",
    designation: "IOS Developer",
    type: "Remote",
    checkInTime: "10:50 AM",
    status: "Late"
  },
  {
    id: 10,
    name: "Lorem Ipsum",
    designation: "HR",
    type: "Remote",
    checkInTime: "09:29 AM",
    status: "On Time"
  },
  {
    id: 11,
    name: "Lorem Ipsum",
    designation: "Sales Manager",
    type: "Remote",
    checkInTime: "09:29 AM",
    status: "On Time"
  },
  {
    id: 12,
    name: "Lorem Ipsum",
    designation: "React JS Developer",
    type: "Remote",
    checkInTime: "11:30 AM",
    status: "Late"
  }
];

export default function AttendancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter employees based on search query
  const filteredEmployees = attendanceData.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate employees
  const totalEmployees = filteredEmployees.length;
  const pageCount = Math.ceil(totalEmployees / parseInt(perPage));
  const startIndex = (currentPage - 1) * parseInt(perPage);
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + parseInt(perPage));

  return (
    <CompanyLayout title="Attendance" description="All Employee Attendance">
      {/* Search input */}
      <div className="relative w-full max-w-sm mx-auto mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input 
          placeholder="Search" 
          className="pl-10 pr-4 py-2 w-full" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Attendance table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="font-medium">Employee Name</TableHead>
              <TableHead className="font-medium">Designation</TableHead>
              <TableHead className="font-medium">Type</TableHead>
              <TableHead className="font-medium">Check In Time</TableHead>
              <TableHead className="font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEmployees.map((employee) => (
              <TableRow key={employee.id} className="border-b last:border-0">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-gray-200">
                      <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{employee.name}</span>
                  </div>
                </TableCell>
                <TableCell>{employee.designation}</TableCell>
                <TableCell>{employee.type}</TableCell>
                <TableCell>{employee.checkInTime}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline"
                    className={
                      employee.status === "On Time" 
                        ? "bg-green-50 text-green-600 border-green-200" 
                        : "bg-red-50 text-red-600 border-red-200"
                    }
                  >
                    {employee.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span>Showing</span>
          <Select
            value={perPage}
            onValueChange={(value) => {
              setPerPage(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-16 h-8">
              <SelectValue>{perPage}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span>Showing 1 to 10 out of 60 records</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {[...Array(Math.min(pageCount, 5))].map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="icon"
              className="w-8 h-8"
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          
          {pageCount > 5 && (
            <>
              <span>...</span>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                onClick={() => setCurrentPage(pageCount)}
              >
                {pageCount}
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8"
            onClick={() => setCurrentPage(Math.min(pageCount, currentPage + 1))}
            disabled={currentPage === pageCount}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CompanyLayout>
  );
}
