import React, { useState, useEffect } from "react";
import { CompanyLayout } from "@/components/company/company-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApplicantCard } from "@/components/company/applicant-card";
import { AiMatchmaking } from "@/components/company/ai-matchmaking";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/lib/data-context";
import { useLocation } from "wouter";
import { Application, Job } from "@shared/schema";
import { Search, FileText, Users, Briefcase, Mail, Phone, Download, Link2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CandidatesPage() {
  const { toast } = useToast();
  const { applications, jobs, updateApplicationStatus } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewingApplication, setViewingApplication] = useState<Application | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [location] = useLocation();

  // Get URL params for job filter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get("job");
    if (jobId) {
      setSelectedJob(jobId);
    }
  }, [location]);

  // Filter applications based on search, job and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesJob = selectedJob === "all" || app.jobId === parseInt(selectedJob);
    const matchesStatus = selectedStatus === "all" || app.status === selectedStatus;
    
    return matchesSearch && matchesJob && matchesStatus;
  });

  const getJobById = (id: number): Job | undefined => {
    return jobs.find(job => job.id === id);
  };

  const handleViewApplication = (application: Application) => {
    setViewingApplication(application);
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = async (status: string) => {
    if (!viewingApplication) return;
    
    setIsLoading(true);
    try {
      await updateApplicationStatus(viewingApplication.id, status);
      toast({
        title: "Status updated",
        description: `Application status has been updated to ${status}.`,
      });
      setViewingApplication(prev => prev ? { ...prev, status } : null);
    } catch (error) {
      toast({
        title: "Error updating status",
        description: "There was an error updating the application status.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CompanyLayout title="Candidates" description="Manage and review job applications">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search candidates..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select
              value={selectedJob}
              onValueChange={setSelectedJob}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id.toString()}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {selectedJob !== "all" && (
            <div className="mt-4 sm:mt-0">
              <AiMatchmaking 
                job={jobs.find(job => job.id === parseInt(selectedJob)) || null} 
                applications={applications.filter(app => app.jobId === parseInt(selectedJob))}
                onSelectCandidate={handleViewApplication}
              />
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Candidates</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="reviewing">In Review</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>All Applications ({filteredApplications.length})</span>
                {filteredApplications.length > 0 && (
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export List
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-white divide-y divide-gray-200">
                {filteredApplications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No applications found</h3>
                    <p className="text-gray-500 mb-6 text-center max-w-md">
                      {applications.length === 0
                        ? "There are no job applications yet."
                        : "No applications match your current filters. Try adjusting your search criteria."}
                    </p>
                  </div>
                ) : (
                  filteredApplications.map((application) => (
                    <ApplicantCard
                      key={application.id}
                      application={application}
                      job={getJobById(application.jobId)}
                      onViewDetails={() => handleViewApplication(application)}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>New Applications</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-white divide-y divide-gray-200">
                {filteredApplications.filter(app => app.status === "pending").length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Briefcase className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No new applications</h3>
                    <p className="text-gray-500 text-center max-w-md">
                      There are no new applications waiting for review.
                    </p>
                  </div>
                ) : (
                  filteredApplications
                    .filter(app => app.status === "pending")
                    .map((application) => (
                      <ApplicantCard
                        key={application.id}
                        application={application}
                        job={getJobById(application.jobId)}
                        onViewDetails={() => handleViewApplication(application)}
                      />
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviewing">
          <Card>
            <CardHeader>
              <CardTitle>Applications In Review</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-white divide-y divide-gray-200">
                {filteredApplications.filter(app => app.status === "reviewing").length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No applications in review</h3>
                    <p className="text-gray-500 text-center max-w-md">
                      There are no applications currently being reviewed.
                    </p>
                  </div>
                ) : (
                  filteredApplications
                    .filter(app => app.status === "reviewing")
                    .map((application) => (
                      <ApplicantCard
                        key={application.id}
                        application={application}
                        job={getJobById(application.jobId)}
                        onViewDetails={() => handleViewApplication(application)}
                      />
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accepted">
          <Card>
            <CardHeader>
              <CardTitle>Accepted Applications</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-white divide-y divide-gray-200">
                {filteredApplications.filter(app => app.status === "accepted").length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No accepted applications</h3>
                    <p className="text-gray-500 text-center max-w-md">
                      There are no applications that have been accepted yet.
                    </p>
                  </div>
                ) : (
                  filteredApplications
                    .filter(app => app.status === "accepted")
                    .map((application) => (
                      <ApplicantCard
                        key={application.id}
                        application={application}
                        job={getJobById(application.jobId)}
                        onViewDetails={() => handleViewApplication(application)}
                      />
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Application Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          
          {viewingApplication && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                      <img
                        src={viewingApplication.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(viewingApplication.name)}`}
                        alt={viewingApplication.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-center">{viewingApplication.name}</h3>
                    <Badge variant={viewingApplication.status === "pending" ? "new" : viewingApplication.status === "reviewing" ? "reviewing" : viewingApplication.status === "accepted" ? "accepted" : "rejected"} className="mt-2">
                      {viewingApplication.status.charAt(0).toUpperCase() + viewingApplication.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <a href={`mailto:${viewingApplication.email}`} className="text-sm text-primary hover:underline">{viewingApplication.email}</a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <a href={`tel:${viewingApplication.phone}`} className="text-sm">{viewingApplication.phone}</a>
                    </div>
                    {viewingApplication.linkedinUrl && (
                      <div className="flex items-center">
                        <Link2 className="h-4 w-4 mr-2 text-gray-500" />
                        <a href={viewingApplication.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">LinkedIn Profile</a>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Applied For</h4>
                    <div className="bg-gray-50 rounded-md p-3">
                      <p className="font-medium">{getJobById(viewingApplication.jobId)?.title || "Unknown Position"}</p>
                      <p className="text-sm text-gray-500">Applied {new Date(viewingApplication.appliedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3 space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Application Details</h4>
                    <dl className="divide-y divide-gray-100">
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-500">German Proficiency</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          {formatGermanLevel(viewingApplication.germanProficiency)}
                        </dd>
                      </div>
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-500">Visa Status</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          {formatVisaStatus(viewingApplication.visaStatus)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Resume/CV</h4>
                    <div className="border border-gray-200 rounded-md p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-10 w-10 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium">Candidate Resume</p>
                          <p className="text-xs text-gray-500">PDF Document</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  {viewingApplication.coverLetter && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Cover Letter</h4>
                      <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                        <p className="text-sm whitespace-pre-line">{viewingApplication.coverLetter}</p>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Application Status</h4>
                    <Select
                      value={viewingApplication.status}
                      onValueChange={handleUpdateStatus}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending Review</SelectItem>
                        <SelectItem value="reviewing">In Review</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CompanyLayout>
  );
}

function formatGermanLevel(level: string): string {
  const levels: Record<string, string> = {
    a1: "A1 - Beginner",
    a2: "A2 - Elementary",
    b1: "B1 - Intermediate",
    b2: "B2 - Upper Intermediate",
    c1: "C1 - Advanced",
    c2: "C2 - Proficient",
    native: "Native Speaker"
  };
  
  return levels[level] || level;
}

function formatVisaStatus(status: string): string {
  const statuses: Record<string, string> = {
    "eu-citizen": "EU Citizen (No Visa Required)",
    "work-permit": "Have German Work Permit",
    "blue-card": "EU Blue Card Holder",
    "need-sponsorship": "Needs Visa Sponsorship"
  };
  
  return statuses[status] || status;
}
