import React, { useState } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileInput } from "@/components/ui/file-input";
import { Job, InsertApplication } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

const applicationFormSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  germanProficiency: z.string().min(1, "German proficiency level is required"),
  visaStatus: z.string().min(1, "Visa status is required"),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  coverLetter: z.string().optional(),
  // New fields for AI matching
  preferredLocation: z.string().optional(),
  preferredJobType: z.string().optional(),
  canJoinImmediately: z.boolean().default(false),
  noticePeriod: z.string().optional(),
  experience: z.number().min(0).max(50).optional(),
  education: z.string().optional(),
  skills: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms",
  }),
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

interface ApplicationFormProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (application: InsertApplication) => Promise<void>;
}

export function ApplicationForm({ job, isOpen, onClose, onSubmit }: ApplicationFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // AI Formatting Toggle State

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      name: user ? `${user.firstName} ${user.lastName}` : "",
      email: user?.email || "",
      phone: user?.phone || "",
      germanProficiency: "",
      visaStatus: "",
      linkedinUrl: "",
      coverLetter: "",
      // New fields
      preferredLocation: "",
      preferredJobType: "",
      canJoinImmediately: false,
      noticePeriod: "",
      experience: 0,
      education: "",
      skills: "",
      agreeToTerms: false,
    },
  });

  const handleSubmit = async (data: ApplicationFormValues) => {
    if (!resume) {
      toast({
        title: "Resume required",
        description: "Please upload your resume before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!job) return;

    setIsSubmitting(true);

    try {
      // In a real app, you would upload the files to a server and get URLs back
      const mockResumeUrl = `resume-${Date.now()}.pdf`;
      const mockPhotoUrl = profilePhoto ? `photo-${Date.now()}.jpg` : undefined;

      const applicationData: InsertApplication = {
        jobId: job.id,
        userId: user?.id || 0,
        name: data.name,
        email: data.email,
        phone: data.phone,
        resumeUrl: mockResumeUrl,
        photoUrl: mockPhotoUrl,
        coverLetter: data.coverLetter,
        germanProficiency: data.germanProficiency,
        visaStatus: data.visaStatus,
        linkedinUrl: data.linkedinUrl || undefined,
        // New fields for AI matching
        preferredLocation: data.preferredLocation || null,
        preferredJobType: data.preferredJobType || null,
        canJoinImmediately: data.canJoinImmediately || false,
        noticePeriod: !data.canJoinImmediately ? data.noticePeriod || null : null,
        experience: data.experience || null,
        education: data.education || null,
        skills: data.skills || null,
      };

      await onSubmit(applicationData);
      form.reset();
      setProfilePhoto(null);
      setResume(null);
      onClose();

      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:rounded-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Apply for {job?.title || "Position"}
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full" 
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Complete this form to apply for the position
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-1/3">
                <div className="text-center">
                  <div className="mx-auto w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 mb-4 overflow-hidden">
                    {profilePhoto ? (
                      <img
                        src={URL.createObjectURL(profilePhoto)}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-12 w-12 text-gray-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                        <p className="mt-1 text-xs text-gray-500">Upload Photo</p>
                      </div>
                    )}
                  </div>

                  <label
                    htmlFor="photo-upload"
                    className="mt-2 text-sm text-primary font-medium cursor-pointer"
                  >
                    {profilePhoto ? "Change Photo" : "Choose Photo"}
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => 
                      e.target.files && e.target.files[0] && setProfilePhoto(e.target.files[0])
                    }
                  />
                </div>
              </div>

              <div className="w-full sm:w-2/3 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="linkedinUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn Profile</FormLabel>
                        <FormControl>
                          <Input 
                            type="url" 
                            placeholder="https://linkedin.com/in/username" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <FormField
                control={form.control}
                name="germanProficiency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>German Language Proficiency *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select proficiency level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A1">A1 - Beginner</SelectItem>
                        <SelectItem value="A2">A2 - Elementary</SelectItem>
                        <SelectItem value="B1">B1 - Intermediate</SelectItem>
                        <SelectItem value="B2">B2 - Upper Intermediate</SelectItem>
                        <SelectItem value="C1">C1 - Advanced</SelectItem>
                        <SelectItem value="C2">C2 - Proficient</SelectItem>
                        <SelectItem value="Native">Native Speaker</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="visaStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visa Requirement *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visa status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EU Citizen">EU Citizen (No Visa Required)</SelectItem>
                        <SelectItem value="Have Work Permit">Have German Work Permit</SelectItem>
                        <SelectItem value="Need Sponsorship">Need Visa Sponsorship</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
                            {/* New AI Matching Fields */}
                            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                <h3 className="text-md font-medium mb-4"></h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name="preferredLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Location</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select preferred location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Berlin">Berlin</SelectItem>
                            <SelectItem value="Hamburg">Hamburg</SelectItem>
                            <SelectItem value="Munich">Munich</SelectItem>
                            <SelectItem value="Frankfurt">Frankfurt</SelectItem>
                            <SelectItem value="Cologne">Cologne</SelectItem>
                            <SelectItem value="Stuttgart">Stuttgart</SelectItem>
                            <SelectItem value="Düsseldorf">Düsseldorf</SelectItem>
                            <SelectItem value="Remote">Remote</SelectItem>
                            <SelectItem value="Flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="preferredJobType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Job Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="remote">Freelance</SelectItem>
                            <SelectItem value="hybrid">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="50" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Highest Education Level</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select education level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="High School">High School</SelectItem>
                            <SelectItem value="Associate">Associate Degree</SelectItem>
                            <SelectItem value="Bachelor">Bachelor's Degree</SelectItem>
                            <SelectItem value="Master">Master's Degree</SelectItem>
                            <SelectItem value="PhD">PhD or Doctorate</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name="canJoinImmediately"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Available to Join Immediately</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="noticePeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notice Period (if not joining immediately)</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={form.watch("canJoinImmediately")}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select notice period" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="2 weeks">2 Weeks</SelectItem>
                            <SelectItem value="1 month">1 Month</SelectItem>
                            <SelectItem value="2 months">2 Months</SelectItem>
                            <SelectItem value="3 months">3 Months</SelectItem>
                            <SelectItem value="more than 3 months">More than 3 Months</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Skills (comma-separated)</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={3} 
                          placeholder="e.g., Python, JavaScript, React, SQL, etc." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Resume/CV *</label>
        <FileInput
          accept=".pdf,.doc,.docx"
          description="PDF, DOC, DOCX up to 5MB"
          onFilesSelected={(files) => files && setResume(files[0])}
        />
        {!resume && <p className="mt-1 text-xs text-red-500">Resume is required</p>}
      </div>

      {/* AI Assistance Toggle */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm font-medium text-gray-900">AI Assistance For Formatting</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 5000); // Simulate loading for 2 seconds
            }} 
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 
              rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white 
              after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white 
              after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500">
          </div>
        </label>
      </div>

      {/* Loading Message */}
      {isLoading && <p className="mt-2 text-sm text-gray-600">Formatting...</p>}

      <FormField
        control={form.control}
        name="coverLetter"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cover Letter (Optional)</FormLabel>
            <FormControl>
              <Textarea 
                rows={4} 
                placeholder="Tell us why you're a good fit for this position..." 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-4 w-4 mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm text-gray-700">
                        I agree to the processing of my personal data according to the{" "}
                        <a href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
