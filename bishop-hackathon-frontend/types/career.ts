export interface CareerRequest {
  name: string;
  course: string;
  skills: string[];
  interests: string[];
}

export interface CareerAnalysisData {
  bestCareer: string;
  matchPercentage: number;
  missingSkills: string[];
  recommendedLearning: string[];
  suitableOpportunities: string[];
}

export interface ApiResponse {
  success: boolean;
  data?: CareerAnalysisData;
  error?: string;
}
