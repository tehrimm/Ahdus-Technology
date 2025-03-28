import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Job, Department, Application, InsertJob, InsertApplication } from "@shared/schema";
import { useAuth } from "./auth-context";

interface DataContextType {
  users: User[];
  jobs: Job[];
  departments: Department[];
  applications: Application[];
  addJob: (job: InsertJob) => Promise<Job>;
  addApplication: (application: InsertApplication) => Promise<Application>;
  updateApplicationStatus: (id: number, status: string) => Promise<Application>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Storage keys in localStorage
const JOBS_STORAGE_KEY = "ahdus_jobs";
const DEPARTMENTS_STORAGE_KEY = "ahdus_departments";
const APPLICATIONS_STORAGE_KEY = "ahdus_applications";
const USERS_STORAGE_KEY = "ahdus_users";

// Initial sample data for the app
const sampleJobs: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    companyId: 1,
    description: "We are looking for a Senior Frontend Developer to join our team. The ideal candidate has experience with modern JavaScript frameworks and is passionate about creating great user experiences.",
    location: "Berlin, Germany (On-site)",
    salary: "€65,000 - €85,000 per year",
    jobType: "full-time",
    requirements: "5+ years experience with modern JavaScript frameworks\nStrong understanding of React and its ecosystem\nExperience with responsive design and CSS frameworks\nFluent in English, German B1 or higher",
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: 2,
    title: "UX/UI Designer",
    companyId: 1,
    description: "We're seeking a talented UX/UI Designer to create amazing user experiences for our products. You'll work closely with product managers and engineers to bring designs from concept to implementation.",
    location: "Remote (EU Time Zone)",
    salary: "€50,000 - €70,000 per year",
    jobType: "remote",
    requirements: "3+ years experience in UX/UI design\nProficiency with Figma and Adobe Creative Suite\nPortfolio showcasing user-centered design projects\nExperience with design systems and component libraries",
    postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
  },
  {
    id: 3,
    title: "DevOps Engineer",
    companyId: 1,
    description: "Join our infrastructure team to help build and maintain our cloud infrastructure. You'll be responsible for developing CI/CD pipelines, managing cloud resources, and ensuring system reliability.",
    location: "Munich, Germany (Hybrid)",
    salary: "€70,000 - €90,000 per year",
    jobType: "hybrid",
    requirements: "4+ years experience with cloud infrastructure (AWS/Azure/GCP)\nStrong knowledge of CI/CD pipelines and automation tools\nExperience with containerization (Docker, Kubernetes)\nUnderstanding of security best practices",
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: 4,
    title: "Backend Developer (Node.js)",
    companyId: 1,
    description: "We're looking for a Backend Developer with Node.js expertise to help build scalable and robust APIs. You'll work on designing, implementing, and maintaining server-side applications.",
    location: "Hamburg, Germany (On-site)",
    salary: "€60,000 - €80,000 per year",
    jobType: "full-time",
    requirements: "4+ years experience with Node.js and Express\nStrong knowledge of database systems (SQL and NoSQL)\nExperience with API design and development\nUnderstanding of security best practices",
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  }
];

const sampleDepartments: Department[] = [
  {
    id: 1,
    name: "Engineering",
    companyId: 1,
    description: "Software development and technical operations"
  },
  {
    id: 2,
    name: "Design",
    companyId: 1,
    description: "User experience and interface design"
  },
  {
    id: 3,
    name: "Marketing",
    companyId: 1,
    description: "Brand management and promotion"
  },
  {
    id: 4,
    name: "Operations",
    companyId: 1,
    description: "Business operations and administrative support"
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  // State for storing data
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    // Initialize or load jobs
    let storedJobs = localStorage.getItem(JOBS_STORAGE_KEY);
    if (!storedJobs) {
      localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(sampleJobs));
      setJobs(sampleJobs);
    } else {
      try {
        const parsedJobs = JSON.parse(storedJobs);
        // Convert string dates back to Date objects
        const jobsWithDates = parsedJobs.map((job: any) => ({
          ...job,
          postedAt: new Date(job.postedAt)
        }));
        setJobs(jobsWithDates);
      } catch (e) {
        console.error("Failed to parse stored jobs:", e);
        localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(sampleJobs));
        setJobs(sampleJobs);
      }
    }

    // Initialize or load departments
    let storedDepartments = localStorage.getItem(DEPARTMENTS_STORAGE_KEY);
    if (!storedDepartments) {
      localStorage.setItem(DEPARTMENTS_STORAGE_KEY, JSON.stringify(sampleDepartments));
      setDepartments(sampleDepartments);
    } else {
      try {
        setDepartments(JSON.parse(storedDepartments));
      } catch (e) {
        console.error("Failed to parse stored departments:", e);
        localStorage.setItem(DEPARTMENTS_STORAGE_KEY, JSON.stringify(sampleDepartments));
        setDepartments(sampleDepartments);
      }
    }

    // Load applications
    let storedApplications = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    if (storedApplications) {
      try {
        const parsedApplications = JSON.parse(storedApplications);
        // Convert string dates back to Date objects
        const applicationsWithDates = parsedApplications.map((app: any) => ({
          ...app,
          appliedAt: new Date(app.appliedAt)
        }));
        setApplications(applicationsWithDates);
      } catch (e) {
        console.error("Failed to parse stored applications:", e);
        localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify([]));
        setApplications([]);
      }
    } else {
      localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify([]));
      setApplications([]);
    }

    // Load users
    let storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        // Convert string dates back to Date objects
        const usersWithDates = parsedUsers.map((u: any) => ({
          ...u,
          createdAt: new Date(u.createdAt)
        }));
        setUsers(usersWithDates);
      } catch (e) {
        console.error("Failed to parse stored users:", e);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
        setUsers([]);
      }
    } else {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
      setUsers([]);
    }
  }, []);

  // Filter applications for the current user (if employee)
  // Don't filter applications since we're using a demo system with mock data
  // In a real app, we would filter based on the current user's ID
  const filteredApplications = applications;

  // Add a new job
  const addJob = async (jobData: InsertJob): Promise<Job> => {
    console.log("In DataContext addJob with data:", jobData);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newJob: Job = {
      ...jobData,
      id: jobs.length > 0 ? Math.max(...jobs.map(j => j.id)) + 1 : 1,
      postedAt: new Date(),
      salary: jobData.salary || null,
      requirements: jobData.requirements || null,
    };
    
    console.log("Created new job object:", newJob);
    
    const updatedJobs = [...jobs, newJob];
    console.log("Updated jobs array:", updatedJobs);
    
    try {
      setJobs(updatedJobs);
      console.log("Jobs state updated");
      
      localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(updatedJobs));
      console.log("Jobs saved to localStorage");
      
      return newJob;
    } catch (error) {
      console.error("Error in addJob:", error);
      throw error;
    }
  };

  // Add a new application
  const addApplication = async (applicationData: InsertApplication): Promise<Application> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newApplication: Application = {
      ...applicationData,
      id: applications.length > 0 ? Math.max(...applications.map(a => a.id)) + 1 : 1,
      status: "pending",
      appliedAt: new Date(),
      photoUrl: applicationData.photoUrl || null,
      coverLetter: applicationData.coverLetter || null,
      linkedinUrl: applicationData.linkedinUrl || null,
      // New AI matching fields
      preferredLocation: applicationData.preferredLocation || null,
      preferredJobType: applicationData.preferredJobType || null,
      canJoinImmediately: applicationData.canJoinImmediately || false,
      noticePeriod: applicationData.noticePeriod || null,
      experience: applicationData.experience || null,
      education: applicationData.education || null,
      skills: applicationData.skills || null,
    };
    
    const updatedApplications = [...applications, newApplication];
    setApplications(updatedApplications);
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(updatedApplications));
    
    return newApplication;
  };

  // Update application status
  const updateApplicationStatus = async (id: number, status: string): Promise<Application> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedApplications = applications.map(app => 
      app.id === id ? { ...app, status } : app
    );
    
    setApplications(updatedApplications);
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(updatedApplications));
    
    const updatedApplication = updatedApplications.find(app => app.id === id);
    if (!updatedApplication) {
      throw new Error("Application not found");
    }
    
    return updatedApplication;
  };

  const value = {
    users,
    jobs,
    departments,
    applications: filteredApplications,
    addJob,
    addApplication,
    updateApplicationStatus,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
