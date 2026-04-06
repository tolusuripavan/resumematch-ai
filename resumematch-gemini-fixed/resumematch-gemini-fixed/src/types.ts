export interface JobDescription {
  id: string;
  title: string;
  content: string;
  createdAt: number;
}

export interface CandidateResult {
  name: string;
  matchPercentage: number;
  matches: string[];
  gaps: string[];
  suitability: string;
  resumeText: string;
}
