export interface DrugCompound {
  name: string;
  chemicalFormula?: string;
  type: 'active_ingredient' | 'excipient' | 'metabolite' | 'combination';
  dosage?: string;
  confidence: number;
  mentions: number;
}

export interface ClinicalTrial {
  phase: 'preclinical' | 'phase_i' | 'phase_ii' | 'phase_iii' | 'phase_iv' | 'unknown';
  sampleSize?: number;
  duration?: string;
  efficacy?: string;
  adverseEvents?: string[];
  primaryEndpoint?: string;
  secondaryEndpoints?: string[];
  confidence: number;
}

export interface DrugInteraction {
  compound1: string;
  compound2: string;
  interactionType: 'synergistic' | 'antagonistic' | 'additive' | 'contraindicated';
  severity: 'mild' | 'moderate' | 'severe' | 'unknown';
  description: string;
  confidence: number;
}

export interface PharmaceuticalAnalysis {
  drugCompounds: DrugCompound[];
  clinicalTrials: ClinicalTrial[];
  drugInteractions: DrugInteraction[];
  realWorldEvidence: boolean;
  evidenceQuality: 'high' | 'medium' | 'low';
  pharmaceuticalScore: number;
  recommendationLevel: 'highly_recommended' | 'recommended' | 'consider' | 'not_recommended';
}

export interface EnhancedResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  fullText?: string;
  journal: string;
  publishedDate: string;
  doi?: string;
  pmid?: string;
  url: string;
  citationsCount?: number;
  keywords?: string[];
  pharmaceuticalAnalysis?: PharmaceuticalAnalysis;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface DrugSearchResult {
  papers: EnhancedResearchPaper[];
  totalResults: number;
  hasMore: boolean;
  topCompounds: DrugCompound[];
  recommendedCombinations: DrugInteraction[];
}