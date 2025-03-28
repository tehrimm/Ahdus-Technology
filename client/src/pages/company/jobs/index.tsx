import React, { useState } from "react";
import { CompanyLayout } from "@/components/company/company-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/lib/data-context";
import { useLocation } from "wouter";
import { Job, InsertJob } from "@shared/schema";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Globe, 
  MoreVertical, 
  ChevronDown
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { JobForm } from "@/components/company/job-form";

export default function JobsPage() {
  const { jobs, applications, addJob } = useData();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  
  // Filter jobs based on search query
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  // Count applications for each job
  const getApplicationCount = (jobId: number) => {
    return applications.filter(app => app.jobId === jobId).length;
  };

  // Handle job submission
  const handleAddJob = async (jobData: InsertJob) => {
    try {
      console.log("Adding new job:", jobData);
      await addJob({
        ...jobData,
        companyId: 1, // This will be overridden in the API handler
        // Ensure all required fields from the schema are provided
        jobType: jobData.jobType || 'full-time', 
      });
      setIsJobFormOpen(false);
    } catch (error) {
      console.error("Error adding job:", error);
    }
  };

  const getJobStatusBadge = (postedDate: Date, applications: number) => {
    const daysSincePosted = Math.floor((Date.now() - new Date(postedDate).getTime()) / (1000 * 60 * 60 * 24));
    
    if (applications === 0) {
      return <Badge className="rounded-full bg-yellow-500 text-white">Inactive Job</Badge>;
    } else if (daysSincePosted > 60) {
      return <Badge className="rounded-full bg-gray-500 text-white">Completed Job</Badge>;
    } else {
      return <Badge className="rounded-full bg-green-500 text-white">Active Job</Badge>;
    }
  };

  return (
    <CompanyLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold">Jobs</h1>
          <span className="text-gray-500 ml-2 text-sm">Show All Jobs</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search" 
              className="pl-9 w-48 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <Button 
              className="px-4 py-2 rounded-full bg-primary text-white"
              onClick={() => setIsJobFormOpen(true)}
            >
              Add New Job
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="w-full px-4 py-3">
            <Input 
              placeholder="Search (e.g. Solution Architect)"
              className="rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500 mb-6">
              {jobs.length === 0
                ? "You haven't posted any jobs yet. Create your first job posting to attract candidates."
                : "No jobs match your current search. Try adjusting your search criteria."}
            </p>
            <Button 
              className="px-4 py-2 rounded-full bg-primary text-white"
              onClick={() => setIsJobFormOpen(true)}
            >
              Add New Job
            </Button>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              applicationCount={getApplicationCount(job.id)}
              status={getJobStatusBadge(job.postedAt, getApplicationCount(job.id))}
            />
          ))
        )}
      </div>

      {isJobFormOpen && (
        <JobForm 
          onSubmit={handleAddJob} 
          isOpen={isJobFormOpen} 
          onClose={() => setIsJobFormOpen(false)} 
        />
      )}
    </CompanyLayout>
  );
}

interface JobCardProps {
  job: Job;
  applicationCount: number;
  status: React.ReactNode;
}

function JobCard({ job, applicationCount, status }: JobCardProps) {
  const getTimeAgo = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };
  
  const getDepartmentFromRequirements = (requirements: string) => {
    if (!requirements) return "Design";
    
    const match = requirements.match(/Department: ([^\n]+)/);
    return match ? match[1] : "Design";
  };
  
  const getLanguageProficiency = (requirements: string) => {
    if (!requirements) return "B1";
    
    const match = requirements.match(/Language: ([^\n]+)/);
    return match ? match[1] : "B1";
  };
  
  const getDepartment = getDepartmentFromRequirements(job.requirements || "");
  const languageProficiency = getLanguageProficiency(job.requirements || "");

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start">
            <div className="mr-3">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-lg">{job.title}</h3>
              <div className="text-gray-500 text-sm">
                {getDepartment} | {applicationCount} candidates applied | Joining Availability ({applicationCount === 0 ? 'immediate' : '1 month'})
              </div>
              <div className="flex mt-2 space-x-2">
                <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">Full-time</div>
                <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">Remote</div>
                <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">Design</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-2">
              {status}
              <Select defaultValue="active">
                <SelectTrigger className="w-40 h-7 text-xs border-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">In-Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
            <div className="text-gray-500 text-xs mt-2">
              Created {getTimeAgo(job.postedAt)}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-gray-600 text-sm">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600 text-sm">
            <Globe className="h-4 w-4 text-gray-400" />
            <span>Language Proficiency {languageProficiency}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600 text-sm">
            <svg 
              className="h-4 w-4 text-gray-400" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 6v6h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>${job.salary}/Month</span>
          </div>
        </div>
      </div>
    </div>
  );
}
