import React from "react";
import { CompanyLayout } from "@/components/company/company-layout";
import { JobForm } from "@/components/company/job-form";
import { useData } from "@/lib/data-context";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { InsertJob } from "@shared/schema";
import { useAuth } from "@/lib/auth-context";

export default function JobCreatePage() {
  const { user } = useAuth();
  const { addJob } = useData();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSubmit = async (data: InsertJob) => {
    try {
      console.log("In JobCreatePage handleSubmit with data:", data);
      console.log("Current user:", user);
      
      // Add company ID to the job data
      const jobData: InsertJob = {
        ...data,
        companyId: user?.id || 1, // Fallback to 1 if no user (shouldn't happen in practice)
      };
      
      console.log("Prepared job data with companyId:", jobData);
      
      const result = await addJob(jobData);
      console.log("Job added successfully:", result);
      
      toast({
        title: "Job posted successfully",
        description: "Your job has been posted and is now visible to candidates.",
      });
      
      // Redirect to the jobs list
      navigate("/company/jobs");
    } catch (error) {
      console.error("Error in JobCreatePage handleSubmit:", error);
      toast({
        title: "Error posting job",
        description: "There was a problem posting the job. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <CompanyLayout title="Post a New Job" description="Create a new job posting to attract qualified candidates">
      <JobForm onSubmit={handleSubmit} />
    </CompanyLayout>
  );
}
