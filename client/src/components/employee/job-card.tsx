import React from "react";
import { MapPin, EuroIcon, Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Job } from "@shared/schema";

interface JobCardProps {
  job: Job;
  onApply: (jobId: number) => void;
}

export function JobCard({ job, onApply }: JobCardProps) {
  // Map job type to badge variant
  const getBadgeVariant = (jobType: string) => {
    switch (jobType.toLowerCase()) {
      case 'remote':
        return 'remote';
      case 'hybrid':
        return 'hybrid';
      case 'full-time':
      case 'part-time':
      case 'contract':
      default:
        return 'fulltime';
    }
  };

  // Extract requirements as an array from the requirements string
  const requirements = job.requirements?.split('\n').filter(Boolean) || [];

  // Calculate time since job was posted
  const getTimeSincePosted = (postedAt: Date) => {
    const now = new Date();
    const posted = new Date(postedAt);
    const diffInDays = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      const months = Math.floor(diffInDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
            <p className="text-primary mt-1 font-medium">Ahdus Technology</p>
          </div>
          <Badge variant={getBadgeVariant(job.jobType)}>
            {job.jobType}
          </Badge>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="mr-2 h-4 w-4 text-gray-400" />
            <span>{job.location}</span>
          </div>
          {job.salary && (
            <div className="flex items-center text-gray-600">
              <EuroIcon className="mr-2 h-4 w-4 text-gray-400" />
              <span>{job.salary}</span>
            </div>
          )}
          <div className="flex items-center text-gray-600">
            <Clock className="mr-2 h-4 w-4 text-gray-400" />
            <span>Posted {getTimeSincePosted(job.postedAt)}</span>
          </div>
        </div>
        
        <div className="mt-5">
          <h3 className="font-medium text-gray-900 mb-2">Requirements:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
            {requirements.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <div className="flex -space-x-2">
            {/* This would typically be populated from actual applications data */}
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-xs font-medium text-gray-500 border-2 border-white">
              {job.id % 7 + 2}
            </div>
          </div>
          <Button
            onClick={() => onApply(job.id)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Apply Now
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
