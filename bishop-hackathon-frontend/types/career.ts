// export interface JobListing {
//   title: string
//   company: string
//   location: string
//   estimatedSalary: string
//   applyLink: string
// }

// export interface CareerAnalysisData {
//   bestCareer: string
//   matchPercentage: number
//   missingSkills: string[]
//   recommendedLearning: string[]
//   jobListings: JobListing[]
// }

// export interface ApiResponse {
//   success: boolean
//   data?: CareerAnalysisData
//   error?: string
// }

export interface JobListing {
  title: string;
  company: string;
  location: string;
  estimatedSalary: string;
  applyLink: string;
}

export interface CareerAnalysisData {
  bestCareer: string;
  matchPercentage: number;
  missingSkills?: string[];
  recommendedLearning?: string[];
  jobListings?: JobListing[];
}

export interface ResumeAnalysisReport {
  score?: number;
  summary?: string;
  presentSkills?: string[];
  missingSkills?: string[];
  recommendations?: string[];
}

export interface ApiResponse<T = CareerAnalysisData> {
  success: boolean;
  data?: T;
  error?: string;
}
