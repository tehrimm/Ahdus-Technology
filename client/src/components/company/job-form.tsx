import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { insertJobSchema, InsertJob } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Extend the basic job schema for our form
const jobFormSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  description: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  salary: z.string().optional(),
  jobType: z.string().optional(),
  requirements: z.string().optional(),
  department: z.string().min(1, "Please select a department"),
  languageProficiency: z.string().min(1, "Please select language proficiency"),
  visaRequired: z.boolean().default(false).optional(),
  officeType: z.enum(["Office", "Work from Home"]).default("Office"),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

interface JobFormProps {
  onSubmit: (data: InsertJob) => Promise<void>;
  defaultValues?: Partial<JobFormValues>;
  isOpen?: boolean;
  onClose?: () => void;
}

export function JobForm({ onSubmit, defaultValues = {}, isOpen = true, onClose }: JobFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      salary: "",
      jobType: "",
      requirements: "",
      department: "",
      languageProficiency: "",
      visaRequired: false,
      officeType: "Office",
      ...defaultValues
    }
  });

  const handleSubmit = async (data: JobFormValues) => {
    setIsSubmitting(true);
    try {
      // Transform data to match API expectations
      const jobData: InsertJob = {
        title: data.title,
        description: data.description || "",
        location: data.location,
        salary: data.salary || "",
        jobType: data.jobType || "full-time",
        requirements: `Department: ${data.department}\nLanguage: ${data.languageProficiency}\nVisa Required: ${data.visaRequired ? 'Yes' : 'No'}\nType: ${data.officeType}\n${data.requirements || ''}`,
        companyId: 1 // This will be overridden in the API handler
      };
      
      console.log("Submitting job data:", jobData);

      await onSubmit(jobData);
      toast({
        title: "Job posted successfully",
        description: "Your job has been posted and is now visible to candidates.",
      });
      
      if (onClose) {
        onClose();
      } else {
        setLocation("/company/jobs");
      }
      
      form.reset();
    } catch (error) {
      console.error("Error submitting job:", error);
      toast({
        title: "Error posting job",
        description: "There was a problem posting the job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      setLocation("/company/jobs");
    }
  };

  const content = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter Job Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="Austria">Austria</SelectItem>
                  <SelectItem value="Switzerland">Switzerland</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="languageProficiency"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Language Proficiency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="A1">A1</SelectItem>
                  <SelectItem value="A2">A2</SelectItem>
                  <SelectItem value="B1">B1</SelectItem>
                  <SelectItem value="B2">B2</SelectItem>
                  <SelectItem value="C1">C1</SelectItem>
                  <SelectItem value="C2">C2</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="salary"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  placeholder="Enter Amount" 
                  type="text" 
                  {...field} 
                  value={field.value === null ? '' : field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="visaRequired"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Visa Required</FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <FormLabel>Select Type</FormLabel>
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="officeType"
              render={({ field }) => (
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant={field.value === "Office" ? "default" : "outline"}
                    onClick={() => form.setValue("officeType", "Office")}
                    className="flex-1"
                  >
                    Office
                  </Button>
                  <Button
                    type="button"
                    variant={field.value === "Work from Home" ? "default" : "outline"}
                    onClick={() => form.setValue("officeType", "Work from Home")}
                    className="flex-1"
                  >
                    Work from Home
                  </Button>
                </div>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" type="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add"}
          </Button>
        </div>
      </form>
    </Form>
  );

  // If used as a dialog
  if (onClose) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Job</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  // If used as a standalone page
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Add New Job</h2>
      {content}
    </div>
  );
}
