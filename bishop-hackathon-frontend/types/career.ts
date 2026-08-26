// // export interface JobListing {
// //   title: string
// //   company: string
// //   location: string
// //   estimatedSalary: string
// //   applyLink: string
// // }

// // export interface CareerAnalysisData {
// //   bestCareer: string
// //   matchPercentage: number
// //   missingSkills: string[]
// //   recommendedLearning: string[]
// //   jobListings: JobListing[]
// // }

// // export interface ApiResponse {
// //   success: boolean
// //   data?: CareerAnalysisData
// //   error?: string
// // }

// export interface JobListing {
//   title: string;
//   company: string;
//   location: string;
//   estimatedSalary: string;
//   applyLink: string;
// }

// export interface CareerAnalysisData {
//   bestCareer: string;
//   matchPercentage: number;
//   missingSkills?: string[];
//   recommendedLearning?: string[];
//   jobListings?: JobListing[];
// }

// export interface ResumeAnalysisReport {
//   score?: number;
//   summary?: string;
//   presentSkills?: string[];
//   missingSkills?: string[];
//   recommendations?: string[];
// }

// export interface ApiResponse<T = CareerAnalysisData> {
//   success: boolean;
//   data?: T;
//   error?: string;
// }

// types/career.ts

// export interface DomainAlignment {
//   evaluation?: string;
//   keyGaps?: string[];
// }

// export interface ProjectInsights {
//   detectedProjects?: string[];
//   analysis?: string;
// }

// export interface ResumeAnalysisReport {
//   score: number;
//   domain?: string;
//   summary?: string;
//   presentSkills?: string[];
//   missingSkills?: string[];
//   softSkills?: string[];
//   languages?: string[];
//   certifications?: string[];
//   projectInsights?: ProjectInsights;
//   domainAlignment?: DomainAlignment;
//   recommendations?: string[];
// }

// types/career.ts

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

// ⬇️ ADD THIS MISSING EXPORT
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
