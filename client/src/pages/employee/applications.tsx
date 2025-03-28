import React, { useEffect, useState } from "react";
import { EmployeeLayout } from "@/components/employee/employee-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Application, Job } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { useData } from "@/lib/data-context";

export default function ApplicationsPage() {
  const { applications, jobs } = useData();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const getJobTitle = (jobId: number) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.title || "Unknown Position";
  };

  const getTimeAgo = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <EmployeeLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-1">Track the status of your job applications</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-48"></div>
                        <div className="h-4 bg-gray-200 rounded w-64"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            applications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-medium text-gray-800 mb-2">No applications yet</h3>
                  <p className="text-gray-600 mb-4">
                    You haven't applied to any jobs yet. Start browsing available positions.
                  </p>
                  <Button 
                    onClick={() => window.location.href = "/employee/jobs"} 
                    variant="default"
                  >
                    Browse Jobs
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    jobTitle={getJobTitle(application.jobId)}
                  />
                ))}
              </div>
            )
          )}
        </TabsContent>

        <TabsContent value="active">
          {!isLoading && (
            <div className="space-y-4">
              {applications.filter(a => a.status === "pending" || a.status === "reviewing").length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-xl font-medium text-gray-800 mb-2">No active applications</h3>
                    <p className="text-gray-600">
                      You don't have any applications currently under review.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                applications
                  .filter(a => a.status === "pending" || a.status === "reviewing")
                  .map((application) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      jobTitle={getJobTitle(application.jobId)}
                    />
                  ))
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="accepted">
          {!isLoading && (
            <div className="space-y-4">
              {applications.filter(a => a.status === "accepted").length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-xl font-medium text-gray-800 mb-2">No accepted applications</h3>
                    <p className="text-gray-600">
                      None of your applications have been accepted yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                applications
                  .filter(a => a.status === "accepted")
                  .map((application) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      jobTitle={getJobTitle(application.jobId)}
                    />
                  ))
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected">
          {!isLoading && (
            <div className="space-y-4">
              {applications.filter(a => a.status === "rejected").length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-xl font-medium text-gray-800 mb-2">No rejected applications</h3>
                    <p className="text-gray-600">
                      None of your applications have been rejected.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                applications
                  .filter(a => a.status === "rejected")
                  .map((application) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      jobTitle={getJobTitle(application.jobId)}
                    />
                  ))
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </EmployeeLayout>
  );
}

interface ApplicationCardProps {
  application: Application;
  jobTitle: string;
}

function ApplicationCard({ application, jobTitle }: ApplicationCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="new">Pending Review</Badge>;
      case "reviewing":
        return <Badge variant="reviewing">In Review</Badge>;
      case "accepted":
        return <Badge variant="accepted">Accepted</Badge>;
      case "rejected":
        return <Badge variant="rejected">Rejected</Badge>;
      default:
        return <Badge variant="new">Pending Review</Badge>;
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{jobTitle}</h3>
            <p className="text-gray-600 mt-1">Applied {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}</p>
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-sm text-gray-500">German: {formatGermanLevel(application.germanProficiency)}</span>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-500">{formatVisaStatus(application.visaStatus)}</span>
            </div>
          </div>
          <div>
            {getStatusBadge(application.status)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatGermanLevel(level: string): string {
  const levels: Record<string, string> = {
    "A1": "A1 - Beginner",
    "A2": "A2 - Elementary",
    "B1": "B1 - Intermediate",
    "B2": "B2 - Upper Intermediate",
    "C1": "C1 - Advanced",
    "C2": "C2 - Proficient",
    "Native": "Native"
  };
  
  return levels[level] || level;
}

function formatVisaStatus(status: string): string {
  const statuses: Record<string, string> = {
    "EU Citizen": "EU Citizen",
    "Have Work Permit": "Work Permit",
    "Need Sponsorship": "Needs Sponsorship"
  };
  
  return statuses[status] || status;
}
