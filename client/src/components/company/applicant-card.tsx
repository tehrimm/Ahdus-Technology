import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Application, Job } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface ApplicantCardProps {
  application: Application;
  job?: Job;
  onViewDetails: (application: Application) => void;
}

export function ApplicantCard({ application, job, onViewDetails }: ApplicantCardProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'new';
      case 'reviewing':
        return 'reviewing';
      case 'accepted':
        return 'accepted';
      case 'rejected':
        return 'rejected';
      default:
        return 'new';
    }
  };

  const getTimeAgo = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <div className="p-6 flex items-center border-b border-gray-200">
      <div className="flex-shrink-0">
        <img
          className="h-10 w-10 rounded-full object-cover"
          src={application.photoUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(application.name)}
          alt={application.name}
        />
      </div>
      <div className="ml-4 flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">{application.name}</h4>
          <Badge variant={getStatusBadgeVariant(application.status)}>
            {application.status === 'pending' ? 'New' : application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </Badge>
        </div>
        <div className="mt-1 flex items-center">
          <p className="text-sm text-gray-500">
            Applied for <span className="font-medium text-gray-900">{job?.title || "Unknown Position"}</span>
          </p>
          <span className="ml-auto text-xs text-gray-500">{getTimeAgo(application.appliedAt)}</span>
        </div>
        <div className="mt-2 flex items-center">
          <div className="text-xs text-gray-500 flex space-x-2">
            <span>German: {formatGermanLevel(application.germanProficiency)}</span>
            <span>•</span>
            <span>{formatVisaStatus(application.visaStatus)}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-primary hover:text-primary-dark"
            onClick={() => onViewDetails(application)}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
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
    native: "Native"
  };
  
  return levels[level] || level;
}

function formatVisaStatus(status: string): string {
  const statuses: Record<string, string> = {
    "eu-citizen": "EU Citizen",
    "work-permit": "Work Permit",
    "blue-card": "Blue Card",
    "need-sponsorship": "Needs Sponsorship"
  };
  
  return statuses[status] || status;
}
