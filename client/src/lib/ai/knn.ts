import * as tf from '@tensorflow/tfjs';
import { Application, Job } from '@shared/schema';
import { ApplicationWithMatch } from './tf-idf';

// Convert application to feature vector
const applicationToFeatureVector = (application: Application, featureKeys: string[]): number[] => {
  const features: number[] = [];

  // Language Proficiency conversion (A1=1, A2=2, B1=3, B2=4, C1=5, C2=6)
  const languageLevelMap: Record<string, number> = {
    'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6
  };

  // Visa Status conversion
  const visaStatusMap: Record<string, number> = {
    'EU Citizen': 3,           // No visa required
    'Have Work Permit': 2,      // Already has visa
    'Need Sponsorship': 1       // Needs visa sponsorship
  };

  featureKeys.forEach(key => {
    switch(key) {
      case 'germanProficiency':
        features.push(languageLevelMap[application.germanProficiency] || 0);
        break;
      case 'visaStatus':
        features.push(visaStatusMap[application.visaStatus] || 0);
        break;
      case 'experience':
        // Use a deterministic value based on application ID for consistency
        const experienceValue = application.id % 10; // Value between 0-9 years based on ID
        features.push(experienceValue);
        break;
      default:
        features.push(0);
    }
  });

  return features;
};

// Convert job to feature vector (for comparison with applications)
const jobToFeatureVector = (job: Job, featureKeys: string[]): number[] => {
  const features: number[] = [];

  // Extract information from job requirements field
  const requirementsText = job.requirements || '';

  // Extract language level requirement (e.g., "Language: B2")
  const languageMatch = requirementsText.match(/Language:\s*([A-C][1-2])/i);
  const languageLevel = languageMatch ? languageMatch[1] : 'B1'; // Default to B1 if not specified

  // Language Proficiency mapping
  const languageLevelMap: Record<string, number> = {
    'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6
  };

  // Extract visa requirement
  const visaMatch = requirementsText.match(/Visa Required:\s*(Yes|No)/i);
  const visaRequired = visaMatch ? visaMatch[1].toLowerCase() === 'yes' : false;

  featureKeys.forEach(key => {
    switch(key) {
      case 'germanProficiency':
        features.push(languageLevelMap[languageLevel] || 3); // Default to B1 (3)
        break;
      case 'visaStatus':
        features.push(visaRequired ? 1 : 3); // 1 if visa is required, 3 if not
        break;
      case 'experience':
        // Extract from job description or requirements in a real implementation
        features.push(3); // Placeholder: assume 3 years required
        break;
      default:
        features.push(0);
    }
  });

  return features;
};

// Normalize features to 0-1 range
const normalizeFeatures = (features: number[][]): number[][] => {
  const featureTensors = tf.tensor2d(features);
  const min = featureTensors.min(0);
  const max = featureTensors.max(0);
  const range = max.sub(min);

  // Avoid division by zero
  const rangeWithMinValue = range.maximum(tf.scalar(1e-6));

  const normalizedFeatures = featureTensors.sub(min).div(rangeWithMinValue);

  return normalizedFeatures.arraySync() as number[][];
};

// Calculate Euclidean distance between two vectors
const calculateDistance = (vector1: number[], vector2: number[]): number => {
  if (vector1.length !== vector2.length) {
    throw new Error('Vectors must have the same dimensions');
  }

  return Math.sqrt(
    vector1.reduce((sum, value, index) => {
      const diff = value - vector2[index];
      return sum + diff * diff;
    }, 0)
  );
};

// Find k nearest neighbors
const findKNearestNeighbors = (
  jobVector: number[],
  applicationVectors: number[][],
  applications: Application[],
  k: number
): { application: Application; distance: number }[] => {
  // Calculate distances
  const distances = applicationVectors.map((appVector, index) => ({
    application: applications[index],
    distance: calculateDistance(jobVector, appVector)
  }));

  // Sort by distance (ascending)
  distances.sort((a, b) => a.distance - b.distance);

  // Return k nearest neighbors
  return distances.slice(0, k);
};

// Convert distance to score (0-100)
const distanceToScore = (distance: number, maxDistance: number): number => {
  // Convert distance to similarity score (inverse relationship)
  const normalizedDistance = distance / maxDistance;
  // Use sigmoid-like function for smoother scoring
  const score = 100 / (1 + Math.exp(5 * normalizedDistance - 2.5));
  return Math.round(score);
};

// Rank candidates using KNN algorithm
export const rankCandidatesWithKNN = (
  job: Job, 
  applications: Application[], 
  k: number = 5
): ApplicationWithMatch[] => {
  if (applications.length === 0) return [];

  // Define feature keys for consistent vector creation
  const featureKeys = ['germanProficiency', 'visaStatus', 'experience'];

  // Feature weights and mappings
  const features = {
    germanProficiency: { weight: 0.3, levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
    visaStatus: { weight: 0.3, values: ['EU Citizen', 'Have Work Permit', 'Need Sponsorship'] },
    experience: { weight: 0.2, max: 10 },
    skills: { weight: 0.2 }
  };

  // Convert applications to weighted feature vectors
  const applicationFeatures = applications.map(app => {
    const vector = [];
    // German proficiency
    const langIndex = features.germanProficiency.levels.indexOf(app.germanProficiency);
    vector.push((langIndex + 1) * features.germanProficiency.weight);
    
    // Visa status
    const visaIndex = features.visaStatus.values.indexOf(app.visaStatus);
    vector.push((visaIndex + 1) * features.visaStatus.weight);
    
    // Experience (normalized)
    const expNorm = Math.min((app.experience || 0) / features.experience.max, 1);
    vector.push(expNorm * features.experience.weight);
    
    return vector;
  });

  // Convert job to feature vector
  const jobFeatures = jobToFeatureVector(job, featureKeys);

  // Combine all vectors for normalization
  const allFeatures = [jobFeatures, ...applicationFeatures];

  // Normalize features
  const normalizedFeatures = normalizeFeatures(allFeatures);

  // Get the normalized job features and application features
  const normalizedJobFeatures = normalizedFeatures[0];
  const normalizedApplicationFeatures = normalizedFeatures.slice(1);

  // Find k nearest neighbors
  const neighbors = findKNearestNeighbors(
    normalizedJobFeatures,
    normalizedApplicationFeatures,
    applications,
    k
  );

  // Calculate maximum possible distance in normalized space
  const maxDistance = Math.sqrt(featureKeys.length); // Max distance in a normalized space

  // Convert neighbors to scored applications
  const scoredApplications = applications.map(app => {
    const neighbor = neighbors.find(n => n.application.id === app.id);
    const score = neighbor 
      ? distanceToScore(neighbor.distance, maxDistance)
      : 0;

    return {
      ...app,
      matchScore: score
    };
  });

  // Sort by score (descending)
  scoredApplications.sort((a, b) => 
    (b.matchScore || 0) - (a.matchScore || 0)
  );

  return scoredApplications;
};