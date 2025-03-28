import React, { useState } from "react";
import { CompanyLayout } from "@/components/company/company-layout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Sample payroll data
const payrollData = [
  {
    id: 1,
    name: "Lorem Ipsum",
    ctc: "$45000",
    salaryPerMonth: "$3500",
    deduction: "-",
    status: "Completed"
  },
  {
    id: 2,
    name: "Lorem Ipsum",
    ctc: "$78000",
    salaryPerMonth: "$6400",
    deduction: "$100",
    status: "Completed"
  },
  {
    id: 3,
    name: "Lorem Ipsum",
    ctc: "$60000",
    salaryPerMonth: "$5000",
    deduction: "$250",
    status: "Completed"
  },
  {
    id: 4,
    name: "Lorem Ipsum",
    ctc: "$34000",
    salaryPerMonth: "$2800",
    deduction: "-",
    status: "Pending"
  },
  {
    id: 5,
    name: "Lorem Ipsum",
    ctc: "$40000",
    salaryPerMonth: "$3400",
    deduction: "-",
    status: "Pending"
  },
  {
    id: 6,
    name: "Lorem Ipsum",
    ctc: "$45000",
    salaryPerMonth: "$3500",
    deduction: "-",
    status: "Completed"
  },
  {
    id: 7,
    name: "Lorem Ipsum",
    ctc: "$55000",
    salaryPerMonth: "$4000",
    deduction: "$50",
    status: "Pending"
  },
  {
    id: 8,
    name: "Lorem Ipsum",
    ctc: "$60000",
    salaryPerMonth: "$5000",
    deduction: "$150",
    status: "Completed"
  },
  {
    id: 9,
    name: "Lorem Ipsum",
    ctc: "$25000",
    salaryPerMonth: "$2200",
    deduction: "-",
    status: "Pending"
  },
  {
    id: 10,
    name: "Lorem Ipsum",
    ctc: "$30000",
    salaryPerMonth: "$2700",
    deduction: "-",
    status: "Completed"
  },
  {
    id: 11,
    name: "Lorem Ipsum",
    ctc: "$78000",
    salaryPerMonth: "$6400",
    deduction: "-",
    status: "Completed"
  },
  {
    id: 12,
    name: "Lorem Ipsum",
    ctc: "$45000",
    salaryPerMonth: "$3500",
    deduction: "$100",
    status: "Pending"
  }
];

export default function PayrollPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter employees based on search query
  const filteredEmployees = payrollData.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate employees
  const totalEmployees = filteredEmployees.length;
  const pageCount = Math.ceil(totalEmployees / parseInt(perPage));
  const startIndex = (currentPage - 1) * parseInt(perPage);
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + parseInt(perPage));

  return (
    <CompanyLayout title="Payroll" description="All Employee Payroll">
      <div className="flex justify-between items-center mb-6">
        {/* Search input */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search" 
            className="pl-10 pr-4 py-2 w-full" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Export button */}
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Payroll table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="font-medium">Employee Name</TableHead>
              <TableHead className="font-medium">CTC</TableHead>
              <TableHead className="font-medium">Salary Per Month</TableHead>
              <TableHead className="font-medium">Deduction</TableHead>
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
                <TableCell>{employee.ctc}</TableCell>
                <TableCell>{employee.salaryPerMonth}</TableCell>
                <TableCell>{employee.deduction}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline"
                    className={
                      employee.status === "Completed" 
                        ? "bg-green-50 text-green-600 border-green-200" 
                        : "bg-yellow-50 text-yellow-600 border-yellow-200"
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