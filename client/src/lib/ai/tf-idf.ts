import { Application, Job } from '@shared/schema';

// Extended Application type with match score
export interface ApplicationWithMatch extends Application {
  matchScore?: number;
}

// Simple word tokenizer function
const tokenize = (text: string): string[] => {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')  // Replace punctuation with spaces
    .split(/\s+/)               // Split on whitespace
    .filter(word => word.length > 2);  // Filter out short words
};

// Term Frequency (TF) calculation
const calculateTF = (terms: string[], document: string): Record<string, number> => {
  const tf: Record<string, number> = {};
  const documentTerms = tokenize(document);
  const docLength = documentTerms.length || 1;  // Avoid division by zero

  terms.forEach(term => {
    const termCount = documentTerms.filter(word => word === term.toLowerCase()).length;
    tf[term] = termCount / docLength;
  });

  return tf;
};

// Inverse Document Frequency (IDF) calculation
const calculateIDF = (terms: string[], documents: string[]): Record<string, number> => {
  const idf: Record<string, number> = {};

  terms.forEach(term => {
    const docsWithTerm = documents.filter(doc => {
      const docTerms = tokenize(doc);
      return docTerms.includes(term.toLowerCase());
    });
    idf[term] = Math.log(documents.length / (docsWithTerm.length || 1));
  });

  return idf;
};

// TF-IDF calculation
const calculateTFIDF = (tf: Record<string, number>, idf: Record<string, number>): Record<string, number> => {
  const tfidf: Record<string, number> = {};

  Object.keys(tf).forEach(term => {
    tfidf[term] = tf[term] * (idf[term] || 0);
  });

  return tfidf;
};

// Extract all terms from documents
const extractTerms = (documents: string[]): string[] => {
  const terms = new Set<string>();

  documents.forEach(doc => {
    const docTerms = tokenize(doc);
    docTerms.forEach((term: string) => terms.add(term));
  });

  return Array.from(terms);
};

// Calculate cosine similarity between two vectors
export const calculateCosineSimilarity = (vector1: Record<string, number>, vector2: Record<string, number>): number => {
  const terms = new Set([...Object.keys(vector1), ...Object.keys(vector2)]);

  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  terms.forEach(term => {
    const v1 = vector1[term] || 0;
    const v2 = vector2[term] || 0;

    dotProduct += v1 * v2;
    magnitude1 += v1 * v1;
    magnitude2 += v2 * v2;
  });

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  return dotProduct / (magnitude1 * magnitude2);
};

// Prepare document from job requirements with weighted important fields
const prepareJobDocument = (job: Job): string => {
  // Weight important fields higher by repeating them
  const title = job.title.repeat(4); // Quadruple weight for job title
  const requirements = (job.requirements || '').repeat(3); // Triple weight for requirements
  const jobType = job.jobType.repeat(3); // Triple weight for job type
  const location = job.location.repeat(2); // Double weight for location

  // Use only available fields from job schema with better spacing for tokenization
  return `${title} | ${requirements} | ${location} | ${jobType} | ${job.description} | ${job.salary || ''}`.toLowerCase();
};

// Prepare document from candidate application with weighted important fields
const prepareApplicationDocument = (application: Application): string => {
  // Weight important fields higher by repeating them
  const skills = (application.coverLetter || '').repeat(2); // Double weight for skills/cover letter
  const germanLevel = (application.germanProficiency || '').repeat(3); // Triple weight for language proficiency
  const visa = (application.visaStatus || '').repeat(3); // Triple weight for visa status

  // Use the new fields from the Application schema
  const preferredLocation = (application.preferredLocation || '').repeat(2); // Double weight for preferred location
  const preferredJobType = (application.preferredJobType || '').repeat(2); // Double weight for job type

  // Experience and education info
  const experienceInfo = application.experience ? `${application.experience} years experience`.repeat(2) : '';
  const educationInfo = application.education ? application.education.repeat(2) : '';

  // Skills from the dedicated skills field (new)
  const skillsFromField = (application.skills || '').repeat(3); // Triple weight for skills list

  // Availability info
  const availabilityInfo = application.canJoinImmediately ? 
    'available immediately available now ready to start'.repeat(2) : 
    (application.noticePeriod || '');

  return `${germanLevel} ${visa} ${skills} ${preferredLocation} ${preferredJobType} ${experienceInfo} ${educationInfo} ${skillsFromField} ${availabilityInfo} ${application.name || ''} ${application.phone || ''} ${application.resumeUrl || ''}`.toLowerCase();
};

// Calculate match score between job and candidate using TF-IDF
export const calculateMatchScore = (job: Job, application: Application): number => {
  let score = 0;
  const maxScore = 100;
  
  // Match based on job type (20 points)
  if (job.jobType === application.preferredJobType) {
    score += 20;
  }
  
  // Match based on location (20 points)
  if (application.preferredLocation?.includes(job.location)) {
    score += 20;
  }
  
  // Match based on requirements (30 points)
  if (job.requirements && application.skills) {
    const jobSkills = job.requirements.toLowerCase().split(/[\s,]+/);
    const candidateSkills = application.skills.toLowerCase().split(/[\s,]+/);
    const matchingSkills = jobSkills.filter(skill => candidateSkills.includes(skill));
    score += Math.min(30, (matchingSkills.length / jobSkills.length) * 30);
  }
  
  // Match based on German proficiency (15 points)
  const langLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const jobLangLevel = job.requirements?.match(/Language:\s*(A[12]|B[12]|C[12])/)?.[1] || 'A1';
  const appLangLevel = application.germanProficiency;
  if (langLevels.indexOf(appLangLevel) >= langLevels.indexOf(jobLangLevel)) {
    score += 15;
  }
  
  // Match based on visa status (15 points)
  const visaRequired = job.requirements?.toLowerCase().includes('visa required');
  if (!visaRequired || application.visaStatus === 'EU Citizen' || application.visaStatus === 'Have Work Permit') {
    score += 15;
  }

  return Math.round(Math.min(maxScore, score));
};

// Apply filters for candidate matching with enhanced options
export const applyFilters = (
  applications: Application[],
  filters: {
    germanProficiency?: string;
    visaStatus?: string;
    education?: string;
    skillKeywords?: string[] | string;
    matchingThreshold?: number;
    immediateJoining?: boolean;
    minExperience?: number;
    maxExperience?: number;
    location?: string;
    joiningDate?: { from?: Date; to?: Date };
    jobType?: string;
    maxNoticePeriod?: string;
    visaRequirement?: 'No Visa Required' | 'Sponsored Visa' | 'Visa Required';
  }
): Application[] => {
  // Process skill keywords if it's a string
  const keywords = typeof filters.skillKeywords === 'string' 
    ? filters.skillKeywords.toLowerCase().split(',').map(s => s.trim())
    : (Array.isArray(filters.skillKeywords) ? filters.skillKeywords : []);

  return applications.filter(app => {
    // Filter by language proficiency (germanProficiency)
    if (filters.germanProficiency && filters.germanProficiency !== 'any' && app.germanProficiency !== filters.germanProficiency) {
      return false;
    }

    // Filter by visa status
    if (filters.visaStatus && filters.visaStatus !== 'any') {
      if (app.visaStatus !== filters.visaStatus) {
        return false;
      }
    }

    // Filter by education level
    if (filters.education && filters.education !== 'any' && app.education) {
      if (app.education !== filters.education) {
        return false;
      }
    }

    // Filter by experience range if specified
    if (typeof filters.minExperience === 'number' && app.experience !== null && app.experience !== undefined) {
      if (app.experience < filters.minExperience) {
        return false;
      }
    }

    if (typeof filters.maxExperience === 'number' && app.experience !== null && app.experience !== undefined) {
      if (app.experience > filters.maxExperience) {
        return false;
      }
    }

    // Filter by location
    if (filters.location && filters.location !== 'any' && app.preferredLocation) {
      if (app.preferredLocation !== filters.location) {
        return false;
      }
    }

    // Filter by job type
    if (filters.jobType && filters.jobType !== 'any' && app.preferredJobType) {
      if (app.preferredJobType !== filters.jobType) {
        return false;
      }
    }

    // Filter by notice period
    if (filters.maxNoticePeriod && filters.maxNoticePeriod !== 'any' && !app.canJoinImmediately && app.noticePeriod) {
      // Convert notice periods to approximate days for comparison
      const noticePeriodDays: Record<string, number> = {
        '2 weeks': 14,
        '1 month': 30,
        '2 months': 60,
        '3 months': 90,
        'more than 3 months': 100
      };

      const maxDays = noticePeriodDays[filters.maxNoticePeriod] || 1000;
      const appDays = noticePeriodDays[app.noticePeriod] || 1000;

      if (appDays > maxDays) {
        return false;
      }
    }

    // Check for skill keywords in cover letter, skills field, or resume
    if (keywords.length > 0) {
      const coverLetter = (app.coverLetter || '').toLowerCase();
      const skills = (app.skills || '').toLowerCase();

      // Check both coverLetter and skills field
      let hasAnySkill = false;
      for (const keyword of keywords) {
        if (coverLetter.includes(keyword) || skills.includes(keyword)) {
          hasAnySkill = true;
          break;
        }
      }

      // If we have keywords but none match, filter out this application
      if (!hasAnySkill) {
        return false;
      }
    }

    // Legacy visa requirement filtering
    if (filters.visaRequirement) {
      if (filters.visaRequirement === 'No Visa Required' && app.visaStatus !== 'EU Citizen') {
        return false;
      }
      if (filters.visaRequirement === 'Sponsored Visa' && app.visaStatus !== 'Need Sponsorship') {
        return false;
      }
      if (filters.visaRequirement === 'Visa Required' && app.visaStatus !== 'Have Work Permit') {
        return false;
      }
    }

    // Filter by immediate joining if specified
    if (filters.immediateJoining && app.canJoinImmediately !== undefined) {
      if (!app.canJoinImmediately) {
        return false;
      }
    }

    return true;
  });
};

// Find best match candidates for a job
export const findBestMatches = (job: Job, applications: Application[], filters: any = {}): ApplicationWithMatch[] => {
  // First apply filters
  const filteredApplications = applyFilters(applications, filters);

  // Calculate match scores
  const scoredApplications = filteredApplications.map(app => {
    const score = calculateMatchScore(job, app);
    return {
      ...app,
      matchScore: score
    };
  });

  // Sort by score (descending)
  return scoredApplications.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
};