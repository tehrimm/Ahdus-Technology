import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Application, Job } from "@shared/schema";
import { findBestMatches, ApplicationWithMatch } from "@/lib/ai/tf-idf";
import { Sparkles, ChevronDown, Brain,  User, FilterX } from "lucide-react";

// Define filter schema with enhanced filter options
const filterSchema = z.object({
  germanProficiency: z.string().default("any"),
  visaStatus: z.string().default("any"),
  minExperience: z.number().min(0).max(20).optional(),
  maxExperience: z.number().min(0).max(30).optional(),
  education: z.string().default("any"),
  skillKeywords: z.string().optional(),
  immediateJoining: z.boolean().default(false),
  location: z.string().default("any"),
  jobType: z.string().default("any"),
  maxNoticePeriod: z.string().default("any")
});

type FilterValues = z.infer<typeof filterSchema>;

// Match score badge color based on score
const getScoreBadgeColor = (score: number) => {
  if (score >= 85) return "bg-green-100 text-green-800 border-green-200";
  if (score >= 70) return "bg-blue-100 text-blue-800 border-blue-200";
  if (score >= 55) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (score >= 40) return "bg-orange-100 text-orange-800 border-orange-200";
  return "bg-gray-100 text-gray-600 border-gray-200";
};

interface AiMatchmakingProps {
  job: Job | null;
  applications: Application[];
  onSelectCandidate: (application: Application) => void;
}

export function AiMatchmaking({ job, applications, onSelectCandidate }: AiMatchmakingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [matchmakingMethod, setMatchmakingMethod] = useState<"tf-idf">("tf-idf");
  const [matchedCandidates, setMatchedCandidates] = useState<ApplicationWithMatch[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      germanProficiency: "any",
      visaStatus: "any",
      education: "any",
      skillKeywords: "",
      immediateJoining: false,
      location: "any",
      jobType: "any",
      maxNoticePeriod: "any"
    },
  });

  useEffect(() => {
    setMatchedCandidates([]);
  }, [job]);

  const handleAnalyze = (values: FilterValues) => {
    if (!job) return;

    setIsAnalyzing(true);
    setProgressValue(0);

    // Filter applications for current job
    const jobApplications = applications.filter(app => app.jobId === job.id);

    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 20;
      if (currentProgress >= 95) {
        clearInterval(progressInterval);
        setProgressValue(95);
      } else {
        setProgressValue(currentProgress);
      }
    }, 100);

    const enhancedFilters = {
      ...values,
      skillKeywords: values.skillKeywords ?
        values.skillKeywords.toLowerCase().split(',').map(s => s.trim()) :
        [],
      location: values.location,
      jobType: values.jobType,
      maxNoticePeriod: values.maxNoticePeriod
    };

    setTimeout(() => {
      const jobApplications = applications.filter(app => app.jobId === job.id);
      let scoredApplications: ApplicationWithMatch[] = [];

      if (jobApplications.length > 0) {
        // Set a default match score for testing
        scoredApplications = jobApplications.map(app => ({
          ...app,
          matchScore: Math.floor(Math.random() * (95 - 60) + 60) // Random score between 60-95 for testing
        }));

        // Use actual matching algorithms when implemented
        scoredApplications = findBestMatches(job, jobApplications, enhancedFilters);
      }

      let filteredCandidates = scoredApplications.filter(app => {
        if (enhancedFilters.germanProficiency !== 'any' &&
            app.germanProficiency !== enhancedFilters.germanProficiency) {
          return false;
        }

        if (enhancedFilters.visaStatus !== 'any' &&
            app.visaStatus !== enhancedFilters.visaStatus) {
          return false;
        }

        if (enhancedFilters.education !== 'any' &&
            app.education !== enhancedFilters.education) {
          return false;
        }

        if (enhancedFilters.maxNoticePeriod !== 'any' && app.noticePeriod) {
          if (enhancedFilters.maxNoticePeriod === '2 weeks' && app.noticePeriod !== '2 weeks') {
            return false;
          }
          if (enhancedFilters.maxNoticePeriod === '1 month' &&
              app.noticePeriod === '2 months') {
            return false;
          }
        }

        if (enhancedFilters.immediateJoining && !app.canJoinImmediately) {
          return false;
        }

        if (enhancedFilters.location !== 'any' && app.preferredLocation) {
          if (!app.preferredLocation.includes(enhancedFilters.location)) {
            return false;
          }
        }

        if (enhancedFilters.jobType !== 'any' && app.preferredJobType !== enhancedFilters.jobType) {
          return false;
        }

        if (enhancedFilters.skillKeywords.length > 0 && app.skills) {
          const appSkills = app.skills.toLowerCase();
          const hasAnySkill = enhancedFilters.skillKeywords.some(keyword =>
            appSkills.includes(keyword)
          );

          if (!hasAnySkill) {
            return false;
          }
        }

        return true;
      });

      filteredCandidates.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

      setMatchedCandidates(filteredCandidates);
      setSearchPerformed(true);
      setProgressValue(100);

      setTimeout(() => {
        setIsAnalyzing(false);
      }, 300);

      clearInterval(progressInterval);
    }, 1000);
  };

  const onSubmit = (values: FilterValues) => {
    handleAnalyze(values);
  };

  const toggleDialog = () => {
    if (!isOpen) {
      form.reset();
      setMatchedCandidates([]);
      setShowFilters(false);
      setSearchPerformed(false);
    }
    setIsOpen(!isOpen);
  };

  if (!job) return null;

  return (
    <>
      <Button
        onClick={toggleDialog}
        className="flex items-center gap-2"
        variant="outline"
      >
        <Sparkles className="h-4 w-4" />
        <span>AI Match</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI Candidate Matchmaking</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <h3 className="text-lg font-medium mb-2">Job: {job.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{job.location} • {job.jobType}</p>

            <Tabs
              value={matchmakingMethod}
              onValueChange={(value) => setMatchmakingMethod(value as "tf-idf")}
              className="mb-6"
            >
              <TabsList className="w-full">
                <TabsTrigger value="tf-idf" className="flex items-center gap-2 w-full">
                  <Brain className="h-4 w-4" />
                  <span>TF-IDF Method</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tf-idf" className="mt-2">
                <p className="text-sm text-gray-500">
                  Uses TF-IDF algorithm to match candidates based on text similarity between job requirements and candidate applications.
                </p>
              </TabsContent>
            </Tabs>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                {/* <Button
                  type="button"
                  variant="ghost"
                  className="p-0 h-auto text-sm flex items-center"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <span>Filters</span>
                  <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button> */}

                {/* <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => form.reset()}
                  disabled={isAnalyzing}
                >
                  Reset
                </Button> */}
              </div>

              {showFilters && (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Language & Visa Requirements</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="germanProficiency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>German Proficiency</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Any level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="any">Any level</SelectItem>
                                  <SelectItem value="A1">A1 (Beginner)</SelectItem>
                                  <SelectItem value="A2">A2 (Elementary)</SelectItem>
                                  <SelectItem value="B1">B1 (Intermediate)</SelectItem>
                                  <SelectItem value="B2">B2 (Upper Intermediate)</SelectItem>
                                  <SelectItem value="C1">C1 (Advanced)</SelectItem>
                                  <SelectItem value="C2">C2 (Proficient)</SelectItem>
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
                              <FormLabel>Visa Status</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Any status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="any">Any status</SelectItem>
                                  <SelectItem value="EU Citizen">EU Citizen</SelectItem>
                                  <SelectItem value="Have Work Permit">Have Work Permit</SelectItem>
                                  <SelectItem value="Need Sponsorship">Need Sponsorship</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Specific Requirements</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="education"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Education Level</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Any level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="any">Any level</SelectItem>
                                  <SelectItem value="High School">High School</SelectItem>
                                  <SelectItem value="Bachelor's">Bachelor's</SelectItem>
                                  <SelectItem value="Master's">Master's</SelectItem>
                                  <SelectItem value="PhD">PhD</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="skillKeywords"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Key Skills (comma-separated)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Java, React, Python" {...field} />
                              </FormControl>
                              <FormDescription className="text-xs">
                                Skills that will be given higher priority
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Location & Job Type</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Location</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Any location" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="any">Any location</SelectItem>
                                  <SelectItem value="Berlin">Berlin</SelectItem>
                                  <SelectItem value="Hamburg">Hamburg</SelectItem>
                                  <SelectItem value="Munich">Munich</SelectItem>
                                  <SelectItem value="Frankfurt">Frankfurt</SelectItem>
                                  <SelectItem value="Cologne">Cologne</SelectItem>
                                  <SelectItem value="Remote">Remote</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="jobType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Any type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="any">Any type</SelectItem>
                                  <SelectItem value="full-time">Full-time</SelectItem>
                                  <SelectItem value="part-time">Part-time</SelectItem>
                                  <SelectItem value="contract">Contract</SelectItem>
                                  <SelectItem value="remote">Remote</SelectItem>
                                  <SelectItem value="hybrid">Hybrid</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Availability</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="maxNoticePeriod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Notice Period</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Any period" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="any">Any period</SelectItem>
                                  <SelectItem value="2 weeks">2 Weeks or less</SelectItem>
                                  <SelectItem value="1 month">1 Month or less</SelectItem>
                                  <SelectItem value="2 months">2 Months or less</SelectItem>
                                  <SelectItem value="3 months">3 Months or less</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="immediateJoining"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Prefer immediate joining</FormLabel>
                            <FormDescription className="text-xs">
                              Prioritize candidates who can start immediately
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isAnalyzing}>
                      {isAnalyzing ? "Analyzing..." : "Analyze Candidates"}
                    </Button>
                  </form>
                </Form>
              )}

              {!showFilters && (
                <Button
                  className="w-full"
                  onClick={() => handleAnalyze(form.getValues())}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Candidates"}
                </Button>
              )}

              {isAnalyzing && (
                <div className="mt-4">
                  <Progress value={progressValue} className="h-2" />
                  <p className="text-xs text-center mt-1 text-gray-500">
                    {progressValue < 100 ? "Processing..." : "Analysis complete!"}
                  </p>
                </div>
              )}
            </div>

            {searchPerformed && matchedCandidates.length === 0 ? (
              <div className="text-center p-6 mt-4 border border-dashed rounded-lg">
                <FilterX className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No Matching Candidates</h3>
                <p className="text-gray-500 text-sm">
                  No candidates match your current filter criteria. Try adjusting your filters or try a different matching method.
                </p>
              </div>
            ) : matchedCandidates.length > 0 ? (
              <div className="space-y-4 mt-4">
                <h3 className="text-sm font-medium">Top Matching Candidates</h3>
                {matchedCandidates.slice(0, 5).map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => onSelectCandidate(candidate)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary bg-opacity-10 p-2 rounded-full">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{candidate.name}</h4>
                        <p className="text-sm text-gray-500">{candidate.germanProficiency} • {candidate.visaStatus}</p>
                      </div>
                    </div>
                    <Badge
                      className={`${getScoreBadgeColor(candidate.matchScore || 0)} ml-2`}
                      variant="outline"
                    >
                      {Math.round(candidate.matchScore ?? 0)}% Match
                    </Badge>
                  </div>
                ))}
              </div>
            ) : !isAnalyzing && (
              <div className="text-center py-6">
                <Brain className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No candidates analyzed yet</p>
                <p className="text-sm text-gray-400">Click "Analyze Candidates" to find the best matches</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={toggleDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}