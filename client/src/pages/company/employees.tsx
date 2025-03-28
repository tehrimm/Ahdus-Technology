import React, { useState } from "react";
import { CompanyLayout } from "@/components/company/company-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreVertical, Mail, Phone, ExternalLink } from "lucide-react";

// Sample employees data
const employees = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+49 123 456 7890",
    department: "Engineering",
    position: "Senior Frontend Developer",
    status: "active",
    joinDate: "2021-05-12",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
  },
  {
    id: 2,
    name: "Emily Wilson",
    email: "emily.wilson@example.com",
    phone: "+49 123 456 7891",
    department: "Design",
    position: "UX/UI Designer",
    status: "active",
    joinDate: "2022-01-15",
    photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "+49 123 456 7892",
    department: "Engineering",
    position: "DevOps Engineer",
    status: "active",
    joinDate: "2021-09-01",
    photo: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
  },
  {
    id: 4,
    name: "Sarah Brown",
    email: "sarah.brown@example.com",
    phone: "+49 123 456 7893",
    department: "Marketing",
    position: "Marketing Manager",
    status: "active",
    joinDate: "2022-03-10",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  {
    id: 5,
    name: "Robert Martinez",
    email: "robert.martinez@example.com",
    phone: "+49 123 456 7894",
    department: "Engineering",
    position: "Backend Developer",
    status: "onleave",
    joinDate: "2021-11-18",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
  },
  {
    id: 6,
    name: "Jennifer Lee",
    email: "jennifer.lee@example.com",
    phone: "+49 123 456 7895",
    department: "Operations",
    position: "Office Manager",
    status: "active",
    joinDate: "2022-02-01",
    photo: "https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=464&q=80"
  }
];

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Filter employees based on search and department
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase()) ||
      employee.position.toLowerCase().includes(search.toLowerCase());
    
    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  // Get unique departments for the filter
  const departments = ["all", ...new Set(employees.map(e => e.department))];

  return (
    <CompanyLayout title="Employees" description="Manage your company employees and their information">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle>Employee Directory</CardTitle>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search employees..."
                className="pl-8 w-full sm:w-[200px] lg:w-[300px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === "all" ? "All Departments" : dept}
                </option>
              ))}
            </select>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <img
                          src={employee.photo}
                          alt={employee.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <Badge
                        variant={employee.status === "active" ? "fulltime" : "hybrid"}
                        className="capitalize"
                      >
                        {employee.status === "active" ? "Active" : "On Leave"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(employee.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredEmployees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="h-10 w-10 text-gray-400 mb-2" />
                        <h3 className="text-lg font-medium text-gray-900">No employees found</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Try adjusting your search or filter to find what you're looking for.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </CompanyLayout>
  );
}
