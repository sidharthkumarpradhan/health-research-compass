import { pipeline, env } from '@huggingface/transformers';
import type { DrugCompound, ClinicalTrial, DrugInteraction } from '@/types/pharmaceutical';

// Configure transformers for browser usage
env.allowLocalModels = false;
env.useBrowserCache = true;

class NERService {
  private nerPipeline: any = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    
    try {
      console.log('Initializing biomedical NER pipeline...');
      // Using a biomedical NER model optimized for drug and chemical entity recognition
      this.nerPipeline = await pipeline(
        'token-classification',
        'emilyalsentzer/Bio_ClinicalBERT',
        { device: 'webgpu' }
      );
      this.initialized = true;
      console.log('NER pipeline initialized successfully');
    } catch (error) {
      console.warn('Failed to initialize WebGPU, falling back to CPU:', error);
      try {
        this.nerPipeline = await pipeline(
          'token-classification',
          'emilyalsentzer/Bio_ClinicalBERT'
        );
        this.initialized = true;
        console.log('NER pipeline initialized on CPU');
      } catch (fallbackError) {
        console.error('Failed to initialize NER pipeline:', fallbackError);
        this.initialized = false;
      }
    }
  }

  async extractDrugCompounds(text: string): Promise<DrugCompound[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.nerPipeline) {
      return this.extractDrugCompoundsFallback(text);
    }

    try {
      const entities = await this.nerPipeline(text);
      const compounds: DrugCompound[] = [];
      
      // Process NER results and extract drug-related entities
      entities.forEach((entity: any) => {
        if (entity.entity_group === 'CHEMICAL' || entity.entity_group === 'DRUG') {
          const compound: DrugCompound = {
            name: entity.word,
            type: this.classifyCompoundType(entity.word),
            confidence: entity.score,
            mentions: this.countMentions(text, entity.word)
          };
          
          // Extract dosage information if present
          const dosageMatch = this.extractDosage(text, entity.word);
          if (dosageMatch) {
            compound.dosage = dosageMatch;
          }
          
          compounds.push(compound);
        }
      });

      return this.deduplicateCompounds(compounds);
    } catch (error) {
      console.error('Error in NER extraction:', error);
      return this.extractDrugCompoundsFallback(text);
    }
  }

  async extractClinicalTrials(text: string): Promise<ClinicalTrial[]> {
    const trials: ClinicalTrial[] = [];
    
    // Phase detection patterns
    const phasePatterns = {
      'phase_i': /phase\s*I\b|phase\s*1\b/gi,
      'phase_ii': /phase\s*II\b|phase\s*2\b/gi,
      'phase_iii': /phase\s*III\b|phase\s*3\b/gi,
      'phase_iv': /phase\s*IV\b|phase\s*4\b/gi,
      'preclinical': /preclinical|in\s*vitro|in\s*vivo/gi
    };

    // Sample size patterns
    const sampleSizePattern = /(\d+)\s*patients?|(\d+)\s*subjects?|n\s*=\s*(\d+)/gi;
    
    // Efficacy patterns
    const efficacyPattern = /efficacy|effective|response\s*rate|survival|improvement/gi;

    for (const [phase, pattern] of Object.entries(phasePatterns)) {
      const matches = text.match(pattern);
      if (matches) {
        const trial: ClinicalTrial = {
          phase: phase as ClinicalTrial['phase'],
          confidence: matches.length / 10, // Simple confidence based on mentions
        };

        // Extract sample size
        const sizeMatch = text.match(sampleSizePattern);
        if (sizeMatch) {
          const size = parseInt(sizeMatch[1] || sizeMatch[2] || sizeMatch[3]);
          if (!isNaN(size)) {
            trial.sampleSize = size;
          }
        }

        // Check for efficacy mentions
        const efficacyMatches = text.match(efficacyPattern);
        if (efficacyMatches) {
          trial.efficacy = 'mentioned';
        }

        trials.push(trial);
      }
    }

    return trials;
  }

  async extractDrugInteractions(text: string): Promise<DrugInteraction[]> {
    const interactions: DrugInteraction[] = [];
    
    // Interaction patterns
    const interactionPatterns = {
      synergistic: /synerg|potentiat|enhance|augment/gi,
      antagonistic: /antagoni|inhibit|block|reduce/gi,
      additive: /additive|cumulative|combined/gi,
      contraindicated: /contraindic|avoid|dangerous|toxic/gi
    };

    // Look for drug combination patterns
    const combinationPattern = /([\w\-]+)\s*(and|with|\+|plus)\s*([\w\-]+)/gi;
    const combinations = [...text.matchAll(combinationPattern)];

    combinations.forEach(match => {
      const drug1 = match[1];
      const drug2 = match[3];
      
      for (const [type, pattern] of Object.entries(interactionPatterns)) {
        if (pattern.test(text)) {
          interactions.push({
            compound1: drug1,
            compound2: drug2,
            interactionType: type as DrugInteraction['interactionType'],
            severity: this.assessSeverity(text, drug1, drug2),
            description: `${type} interaction between ${drug1} and ${drug2}`,
            confidence: 0.7
          });
        }
      }
    });

    return interactions;
  }

  private extractDrugCompoundsFallback(text: string): DrugCompound[] {
    // Fallback method using regex patterns for common drug names
    const drugPatterns = [
      /\b(aspirin|ibuprofen|acetaminophen|morphine|codeine|insulin|metformin|atorvastatin)\b/gi,
      /\b\w+cillin\b/gi, // Penicillin derivatives
      /\b\w+mycin\b/gi,  // Antibiotic names ending in mycin
      /\b\w+pril\b/gi,   // ACE inhibitors
      /\b\w+sartan\b/gi, // ARB medications
    ];

    const compounds: DrugCompound[] = [];
    
    drugPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        compounds.push({
          name: match[0],
          type: 'active_ingredient',
          confidence: 0.8,
          mentions: this.countMentions(text, match[0])
        });
      });
    });

    return this.deduplicateCompounds(compounds);
  }

  private classifyCompoundType(compound: string): DrugCompound['type'] {
    // Simple classification based on common patterns
    if (compound.includes('placebo') || compound.includes('excipient')) {
      return 'excipient';
    }
    if (compound.includes('metabolite')) {
      return 'metabolite';
    }
    if (compound.includes('/') || compound.includes('+')) {
      return 'combination';
    }
    return 'active_ingredient';
  }

  private extractDosage(text: string, drugName: string): string | undefined {
    const dosagePattern = new RegExp(`${drugName}\\s+(\\d+(?:\\.\\d+)?\\s*(?:mg|g|ml|μg|units?))`, 'gi');
    const match = text.match(dosagePattern);
    return match ? match[0].split(' ').slice(1).join(' ') : undefined;
  }

  private countMentions(text: string, term: string): number {
    const regex = new RegExp(term, 'gi');
    return (text.match(regex) || []).length;
  }

  private deduplicateCompounds(compounds: DrugCompound[]): DrugCompound[] {
    const seen = new Map<string, DrugCompound>();
    
    compounds.forEach(compound => {
      const key = compound.name.toLowerCase();
      if (seen.has(key)) {
        const existing = seen.get(key)!;
        existing.mentions += compound.mentions;
        existing.confidence = Math.max(existing.confidence, compound.confidence);
      } else {
        seen.set(key, compound);
      }
    });

    return Array.from(seen.values()).sort((a, b) => b.mentions - a.mentions);
  }

  private assessSeverity(text: string, drug1: string, drug2: string): DrugInteraction['severity'] {
    const severityKeywords = {
      severe: /severe|fatal|death|toxic|dangerous/gi,
      moderate: /moderate|caution|monitor/gi,
      mild: /mild|minor|slight/gi
    };

    for (const [severity, pattern] of Object.entries(severityKeywords)) {
      if (pattern.test(text)) {
        return severity as DrugInteraction['severity'];
      }
    }

    return 'unknown';
  }
}

export const nerService = new NERService();