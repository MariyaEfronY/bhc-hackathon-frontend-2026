// types/career.ts

// --- Generic API Wrapper ---
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// --- DualModeJobSearch Types ---
export interface JobListing {
  title: string;
  company: string;
  location: string;
  estimatedSalary: string;
  applyLink: string;
}

export interface CareerAnalysisData {
  bestCareer?: string;
  matchPercentage?: number;
  missingSkills?: string[];
  recommendedLearning?: string[];
  jobListings?: JobListing[];
}

// --- ResumeAnalysisPage Types ---
export interface DomainAlignment {
  evaluation?: string;
  keyGaps?: string[];
}

export interface ProjectInsights {
  detectedProjects?: string[];
  analysis?: string;
}

export interface ResumeAnalysisReport {
  score: number;
  domain?: string;
  summary?: string;
  presentSkills?: string[];
  missingSkills?: string[];
  softSkills?: string[];
  languages?: string[];
  certifications?: string[];
  projectInsights?: ProjectInsights;
  domainAlignment?: DomainAlignment;
  recommendations?: string[];
}
