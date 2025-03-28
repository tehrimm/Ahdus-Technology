import React, { useState } from "react";
import { CompanyLayout } from "@/components/company/company-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useData } from "@/lib/data-context";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Search, PlusCircle, Users, Edit, Trash2, ChevronRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Mock employee data for UI display
const mockEmployees = {
  design: [
    { id: 1, name: "Ayesha Khan", role: "Lead UI/UX Designer", image: "" },
    { id: 2, name: "Bilal Ahmed", role: "Sr. UI/UX Designer", image: "" },
    { id: 3, name: "Sarah Malik", role: "Sr. UI/UX Designer", image: "" },
    { id: 4, name: "Danish Raza", role: "UI/UX Designer", image: "" },
    { id: 5, name: "Fatima Shaikh", role: "UI/UX Designer", image: "" },
  ],
  sales: [
    { id: 6, name: "Omar Siddiqui", role: "Sr. Sales Manager", image: "" },
    { id: 7, name: "Rizwan Ali", role: "Sr. Sales Manager", image: "" },
    { id: 8, name: "Naila Tariq", role: "BDM", image: "" },
    { id: 9, name: "Hassan Raza", role: "BDE", image: "" },
    { id: 10, name: "Zoya Khan", role: "Sales", image: "" },
  ],
  projectManager: [
    { id: 11, name: "Samiullah Khan", role: "Sr. Project Manager", image: "" },
    { id: 12, name: "Mariam Faisal", role: "Sr. Project Manager", image: "" },
    { id: 13, name: "Ahmed Rafiq", role: "Project Manager", image: "" },
    { id: 14, name: "Tahir Malik", role: "Project Manager", image: "" },
    { id: 15, name: "Rabia Farooq", role: "Project Manager", image: "" },
  ],
  marketing: [
    { id: 16, name: "Sania Javed", role: "Sr. Marketing Manager", image: "" },
    { id: 17, name: "Usman Sheikh", role: "Sr. Marketing Manager", image: "" },
    { id: 18, name: "Hina Aslam", role: "Marketing Coordinator", image: "" },
    { id: 19, name: "Ali Nawaz", role: "Marketing Coordinator", image: "" },
    { id: 20, name: "Farhan Iqbal", role: "Marketing", image: "" },
  ]
};


export default function DepartmentsPage() {
  const { departments } = useData();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateDepartment = () => {
    if (!departmentName.trim()) {
      toast({
        title: "Department name required",
        description: "Please enter a department name.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, we would submit this to the backend
    toast({
      title: "Department created",
      description: "The department has been created successfully.",
    });

    // Reset form and close dialog
    setDepartmentName("");
    setDepartmentDescription("");
    setOpenDialog(false);
  };

  const openEditDialog = (department: any) => {
    setSelectedDepartment(department.id);
    setDepartmentName(department.name);
    setDepartmentDescription(department.description || "");
    setOpenDialog(true);
  };

  const handleDeleteDepartment = (id: number) => {
    // In a real app, we would delete this from the backend
    toast({
      title: "Department deleted",
      description: "The department has been deleted successfully.",
    });
  };

  return (
    <CompanyLayout title="All Departments" description="All Departments Information">
      <div className="relative w-full max-w-sm mx-auto mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input 
          placeholder="Search" 
          className="pl-10 pr-4 py-2 w-full" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Design Department */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Design Department</h3>
              <p className="text-sm text-gray-500">20 Members</p>
            </div>
            <Button variant="link" className="text-primary px-0">View All</Button>
          </div>
          
          <div className="space-y-4">
            {mockEmployees.design.map(employee => (
              <div key={employee.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-gray-500">{employee.role}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Sales Department */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Sales Department</h3>
              <p className="text-sm text-gray-500">14 Members</p>
            </div>
            <Button variant="link" className="text-primary px-0">View All</Button>
          </div>
          
          <div className="space-y-4">
            {mockEmployees.sales.map(employee => (
              <div key={employee.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-gray-500">{employee.role}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Project Manager Department */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Project Manager Department</h3>
              <p className="text-sm text-gray-500">18 Members</p>
            </div>
            <Button variant="link" className="text-primary px-0">View All</Button>
          </div>
          
          <div className="space-y-4">
            {mockEmployees.projectManager.map(employee => (
              <div key={employee.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-gray-500">{employee.role}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Marketing Department */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Marketing Department</h3>
              <p className="text-sm text-gray-500">10 Members</p>
            </div>
            <Button variant="link" className="text-primary px-0">View All</Button>
          </div>
          
          <div className="space-y-4">
            {mockEmployees.marketing.map(employee => (
              <div key={employee.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-gray-500">{employee.role}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDepartment ? "Edit Department" : "Create Department"}
            </DialogTitle>
            <DialogDescription>
              {selectedDepartment
                ? "Update department information and team structure"
                : "Add a new department to organize your teams"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Department Name *
              </label>
              <Input
                id="name"
                placeholder="e.g. Engineering"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Describe the department's role and responsibilities"
                value={departmentDescription}
                onChange={(e) => setDepartmentDescription(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDepartment}>
              {selectedDepartment ? "Save Changes" : "Create Department"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CompanyLayout>
  );
}
