import React, { useState, useEffect } from "react";
import { EmployeeLayout } from "@/components/employee/employee-layout";
import { useSearch } from "@/lib/search-context";
import { JobCard } from "@/components/employee/job-card";
import { ApplicationForm } from "@/components/employee/application-form";
import { Job, InsertApplication } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/lib/data-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function JobsPage() {
  const { toast } = useToast();
  const { jobs, applications, addApplication } = useData();
  const { searchTerm, setSearchTerm } = useSearch(); // Use the shared search context
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  
  // Filter states
  const [jobType, setJobType] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [hasFiltersApplied, setHasFiltersApplied] = useState(false);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter jobs based on search term and filters
  useEffect(() => {
    if (!isLoading) {
      let results = [...jobs];
      
      // Apply search term filter
      if (searchTerm.trim() !== "") {
        const searchLower = searchTerm.toLowerCase();
        results = results.filter(job => 
          job.title.toLowerCase().includes(searchLower) || 
          job.description.toLowerCase().includes(searchLower) ||
          (job.requirements && job.requirements.toLowerCase().includes(searchLower))
        );
      }
      
      // Apply job type filter
      if (jobType) {
        results = results.filter(job => 
          job.jobType.toLowerCase() === jobType.toLowerCase()
        );
      }
      
      // Apply location filter
      if (location) {
        results = results.filter(job => 
          job.location.toLowerCase().includes(location.toLowerCase())
        );
      }
      
      setFilteredJobs(results);
      
      // Check if any filters are applied
      setHasFiltersApplied(jobType !== "" || location !== "");
    }
  }, [isLoading, jobs, searchTerm, jobType, location]);

  const handleApplyClick = (jobId: number) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setIsApplicationFormOpen(true);
    } else {
      toast({
        title: "Error",
        description: "Job not found. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCloseApplicationForm = () => {
    setIsApplicationFormOpen(false);
    setSelectedJob(null);
  };

  const handleSubmitApplication = async (application: InsertApplication) => {
    try {
      await addApplication(application);
      return;
    } catch (error) {
      throw error;
    }
  };

  const resetFilters = () => {
    setJobType("");
    setLocation("");
  };

  // Get unique locations from jobs
  const uniqueLocations = Array.from(new Set(jobs.map(job => {
    // Extract city from location (assuming format "City, Country")
    const parts = job.location.split(',');
    return parts[0].trim();
  })));

  // Get unique job types from jobs
  const uniqueJobTypes = Array.from(new Set(jobs.map(job => job.jobType)));

  return (
    <EmployeeLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Available Positions</h1>
        <p className="text-gray-600 mt-1">Browse and apply to our open positions</p>
      </div>

      {/* Search and filter section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input 
              type="text" 
              placeholder="Search by title, skills, or keywords" 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasFiltersApplied && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                {(jobType ? 1 : 0) + (location ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    {uniqueJobTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    {uniqueLocations.map((loc) => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-1/3 flex items-end">
                <Button 
                  variant="ghost" 
                  className="text-gray-500"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 p-6 animate-pulse">
              <div className="flex items-start justify-between">
                <div>
                  <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 mt-1"></div>
                </div>
                <div className="h-6 bg-blue-100 rounded-full w-20"></div>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center">
                  <div className="h-4 bg-gray-200 rounded w-64"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              
              <div className="mt-5">
                <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="h-8 bg-gray-200 rounded-full w-8"></div>
                <div className="h-9 bg-blue-200 rounded w-28"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-xl font-medium text-gray-800 mb-2">No matching jobs found</h3>
              <p className="text-gray-600">
                {jobs.length === 0 
                  ? "There are currently no job openings. Please check back later."
                  : "Try adjusting your search terms or filters to find more opportunities."}
              </p>
              {jobs.length > 0 && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    resetFilters();
                  }}
                >
                  Clear Search & Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-500">Showing {filteredJobs.length} of {jobs.length} positions</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    onApply={handleApplyClick} 
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      <ApplicationForm
        job={selectedJob}
        isOpen={isApplicationFormOpen}
        onClose={handleCloseApplicationForm}
        onSubmit={handleSubmitApplication}
      />
    </EmployeeLayout>
  );
}
