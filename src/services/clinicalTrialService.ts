import type { ClinicalTrial, PharmaceuticalAnalysis, EnhancedResearchPaper } from '@/types/pharmaceutical';

class ClinicalTrialService {
  
  async analyzePaperQuality(paper: EnhancedResearchPaper): Promise<number> {
    let score = 0;
    const text = paper.abstract + (paper.fullText || '');
    
    // Citation count contribution (0-30 points)
    if (paper.citationsCount) {
      score += Math.min(paper.citationsCount / 10, 30);
    }
    
    // Journal impact factor (simplified - 0-20 points)
    score += this.assessJournalQuality(paper.journal);
    
    // Clinical trial phase (0-25 points)
    const trials = paper.pharmaceuticalAnalysis?.clinicalTrials || [];
    const highestPhase = this.getHighestTrialPhase(trials);
    score += this.getPhaseScore(highestPhase);
    
    // Sample size (0-15 points)
    const maxSampleSize = Math.max(...trials.map(t => t.sampleSize || 0));
    if (maxSampleSize > 0) {
      score += Math.min(maxSampleSize / 100, 15);
    }
    
    // Real-world evidence (0-10 points)
    if (this.hasRealWorldEvidence(text)) {
      score += 10;
    }
    
    return Math.min(score, 100);
  }

  async scorePharmaceuticalRelevance(paper: EnhancedResearchPaper): Promise<number> {
    if (!paper.pharmaceuticalAnalysis) return 0;
    
    const analysis = paper.pharmaceuticalAnalysis;
    let score = 0;
    
    // Drug compound diversity (0-25 points)
    const uniqueCompounds = analysis.drugCompounds.length;
    score += Math.min(uniqueCompounds * 5, 25);
    
    // Clinical trial presence and quality (0-35 points)
    const trials = analysis.clinicalTrials;
    score += trials.length * 5; // Base points for having trials
    score += this.getPhaseScore(this.getHighestTrialPhase(trials));
    
    // Drug interaction insights (0-20 points)
    score += Math.min(analysis.drugInteractions.length * 10, 20);
    
    // Evidence quality (0-20 points)
    const evidenceScore = {
      'high': 20,
      'medium': 12,
      'low': 5
    };
    score += evidenceScore[analysis.evidenceQuality];
    
    return Math.min(score, 100);
  }

  generateRecommendationLevel(pharmaceuticalScore: number, qualityScore: number): PharmaceuticalAnalysis['recommendationLevel'] {
    const combinedScore = (pharmaceuticalScore + qualityScore) / 2;
    
    if (combinedScore >= 80) return 'highly_recommended';
    if (combinedScore >= 60) return 'recommended';
    if (combinedScore >= 40) return 'consider';
    return 'not_recommended';
  }

  private assessJournalQuality(journal: string): number {
    // Simplified journal ranking based on common high-impact journals
    const highImpactJournals = [
      'nature', 'science', 'cell', 'new england journal of medicine',
      'lancet', 'jama', 'nature medicine', 'nature biotechnology'
    ];
    
    const mediumImpactJournals = [
      'plos one', 'scientific reports', 'journal of medicinal chemistry',
      'drug discovery today', 'pharmaceutical research'
    ];
    
    const journalLower = journal.toLowerCase();
    
    if (highImpactJournals.some(j => journalLower.includes(j))) {
      return 20;
    }
    if (mediumImpactJournals.some(j => journalLower.includes(j))) {
      return 12;
    }
    return 5; // Default for other journals
  }

  private getHighestTrialPhase(trials: ClinicalTrial[]): ClinicalTrial['phase'] {
    const phaseOrder: ClinicalTrial['phase'][] = [
      'preclinical', 'phase_i', 'phase_ii', 'phase_iii', 'phase_iv'
    ];
    
    let highestPhase: ClinicalTrial['phase'] = 'unknown';
    let highestIndex = -1;
    
    trials.forEach(trial => {
      const index = phaseOrder.indexOf(trial.phase);
      if (index > highestIndex) {
        highestIndex = index;
        highestPhase = trial.phase;
      }
    });
    
    return highestPhase;
  }

  private getPhaseScore(phase: ClinicalTrial['phase']): number {
    const phaseScores = {
      'phase_iv': 25,
      'phase_iii': 20,
      'phase_ii': 15,
      'phase_i': 10,
      'preclinical': 5,
      'unknown': 0
    };
    
    return phaseScores[phase];
  }

  private hasRealWorldEvidence(text: string): boolean {
    const rweKeywords = [
      'real.world', 'real.life', 'retrospective', 'cohort',
      'registry', 'electronic health record', 'population.based',
      'post.marketing', 'pharmacovigilance'
    ];
    
    const textLower = text.toLowerCase();
    return rweKeywords.some(keyword => 
      new RegExp(keyword.replace('.', '\\s*'), 'i').test(textLower)
    );
  }

  assessEvidenceQuality(trials: ClinicalTrial[], hasRWE: boolean, citationCount?: number): PharmaceuticalAnalysis['evidenceQuality'] {
    let score = 0;
    
    // Clinical trial quality
    const hasPhaseIII = trials.some(t => t.phase === 'phase_iii');
    const hasPhaseIV = trials.some(t => t.phase === 'phase_iv');
    const hasLargeSample = trials.some(t => (t.sampleSize || 0) > 500);
    
    if (hasPhaseIV) score += 3;
    else if (hasPhaseIII) score += 2;
    else if (trials.length > 0) score += 1;
    
    if (hasLargeSample) score += 2;
    if (hasRWE) score += 2;
    
    // Citation impact
    if (citationCount && citationCount > 100) score += 2;
    else if (citationCount && citationCount > 50) score += 1;
    
    if (score >= 7) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  }
}

export const clinicalTrialService = new ClinicalTrialService();