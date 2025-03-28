
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";
import { DataProvider } from "@/lib/data-context";
import { SearchProvider } from "@/lib/search-context";

// Auth Pages
import LoginPage from "@/pages/auth/login";
import SignupPage from "@/pages/auth/signup";

// Employee Pages
import EmployeeJobsPage from "@/pages/employee/jobs";
import EmployeeApplicationsPage from "@/pages/employee/applications";
import EmployeeProfilePage from "@/pages/employee/profile";

// Company Pages
import CompanyDashboardPage from "@/pages/company/dashboard";
import CompanyEmployeesPage from "@/pages/company/employees";
import CompanyDepartmentsPage from "@/pages/company/departments";
import CompanyAttendancePage from "@/pages/company/attendance";
import CompanyPayrollPage from "@/pages/company/payroll";
import CompanyJobsPage from "@/pages/company/jobs/index";
import CompanyJobCreatePage from "@/pages/company/jobs/create";
import CompanyCandidatesPage from "@/pages/company/candidates";

// Error Pages
import NotFound from "@/pages/not-found";

// Protected Route Wrapper
interface ProtectedRouteProps {
  component: React.ComponentType;
  requiredUserType?: 'employee' | 'company' | null;
}

const ProtectedRoute = ({ component: Component, requiredUserType = null }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect to="/auth/login" />;
  }
  
  if (requiredUserType && user && user.userType !== requiredUserType) {
    return <Redirect to={user.userType === 'employee' ? '/employee/jobs' : '/company/dashboard'} />;
  }
  
  return <Component />;
};

// Root Router Component
function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/signup" component={SignupPage} />
      
      {/* Employee Routes */}
      <Route path="/employee/jobs">
        <ProtectedRoute component={EmployeeJobsPage} requiredUserType="employee" />
      </Route>
      <Route path="/employee/applications">
        <ProtectedRoute component={EmployeeApplicationsPage} requiredUserType="employee" />
      </Route>
      <Route path="/employee/profile">
        <ProtectedRoute component={EmployeeProfilePage} requiredUserType="employee" />
      </Route>
      
      {/* Company Routes */}
      <Route path="/company/dashboard">
        <ProtectedRoute component={CompanyDashboardPage} requiredUserType="company" />
      </Route>
      <Route path="/company/employees">
        <ProtectedRoute component={CompanyEmployeesPage} requiredUserType="company" />
      </Route>
      <Route path="/company/departments">
        <ProtectedRoute component={CompanyDepartmentsPage} requiredUserType="company" />
      </Route>
      <Route path="/company/attendance">
        <ProtectedRoute component={CompanyAttendancePage} requiredUserType="company" />
      </Route>
      <Route path="/company/payroll">
        <ProtectedRoute component={CompanyPayrollPage} requiredUserType="company" />
      </Route>
      <Route path="/company/jobs">
        <ProtectedRoute component={CompanyJobsPage} requiredUserType="company" />
      </Route>
      <Route path="/company/jobs/create">
        <ProtectedRoute component={CompanyJobCreatePage} requiredUserType="company" />
      </Route>
      <Route path="/company/candidates">
        <ProtectedRoute component={CompanyCandidatesPage} requiredUserType="company" />
      </Route>
      
      {/* Default Redirect */}
      <Route path="/">
        <Redirect to="/auth/login" />
      </Route>
      
      {/* 404 Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

// For protected route access
import { useAuth } from "@/lib/auth-context";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <SearchProvider>
            <Router />
            <Toaster />
          </SearchProvider>
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
