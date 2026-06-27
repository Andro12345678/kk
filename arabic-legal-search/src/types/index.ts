export interface LegalRow {
  id: string;
  question: string;
  keywords: string;
  legalAnswer: string;
}

export interface SearchResult {
  row: LegalRow;
  score: number;
}

export interface SearchResponse {
  success: boolean;
  result?: {
    legalAnswer: string;
    aiExplanation: string;
    matchedQuestion: string;
    score: number;
  };
  error?: string;
}

export interface EmbeddingCache {
  [key: string]: number[];
}
