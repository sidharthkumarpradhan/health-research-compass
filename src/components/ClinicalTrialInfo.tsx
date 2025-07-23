import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TestTube, Users, Clock, TrendingUp, Award } from "lucide-react";
import type { ClinicalTrial } from "@/types/pharmaceutical";

interface ClinicalTrialInfoProps {
  trial: ClinicalTrial;
}

export const ClinicalTrialInfo = ({ trial }: ClinicalTrialInfoProps) => {
  const getPhaseInfo = (phase: ClinicalTrial['phase']) => {
    switch (phase) {
      case 'preclinical':
        return { label: 'Preclinical', color: 'bg-gray-100 text-gray-700', progress: 10 };
      case 'phase_i':
        return { label: 'Phase I', color: 'bg-blue-100 text-blue-700', progress: 25 };
      case 'phase_ii':
        return { label: 'Phase II', color: 'bg-yellow-100 text-yellow-700', progress: 50 };
      case 'phase_iii':
        return { label: 'Phase III', color: 'bg-orange-100 text-orange-700', progress: 75 };
      case 'phase_iv':
        return { label: 'Phase IV', color: 'bg-green-100 text-green-700', progress: 100 };
      default:
        return { label: 'Unknown', color: 'bg-gray-100 text-gray-500', progress: 0 };
    }
  };

  const phaseInfo = getPhaseInfo(trial.phase);

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-medical-light/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TestTube className="w-5 h-5 text-medical-blue" />
            <CardTitle className="text-lg">Clinical Trial Analysis</CardTitle>
          </div>
          <Badge className={phaseInfo.color}>
            {phaseInfo.label}
          </Badge>
        </div>
        <CardDescription>
          Trial phase identification and quality assessment
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Phase Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Trial Progress</span>
            <span className="text-muted-foreground">{phaseInfo.progress}%</span>
          </div>
          <Progress value={phaseInfo.progress} className="h-2" />
        </div>

        {/* Sample Size */}
        {trial.sampleSize && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-medical-blue" />
            <span className="text-sm font-medium">Sample Size:</span>
            <Badge variant="secondary" className="bg-medical-light text-medical-dark">
              {trial.sampleSize.toLocaleString()} participants
            </Badge>
          </div>
        )}

        {/* Duration */}
        {trial.duration && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-medical-blue" />
            <span className="text-sm font-medium">Duration:</span>
            <span className="text-sm text-muted-foreground">{trial.duration}</span>
          </div>
        )}

        {/* Efficacy */}
        {trial.efficacy && (
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm font-medium">Efficacy:</span>
            <span className="text-sm text-success">{trial.efficacy}</span>
          </div>
        )}

        {/* Primary Endpoint */}
        {trial.primaryEndpoint && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-medical-blue" />
              <span className="text-sm font-medium">Primary Endpoint:</span>
            </div>
            <p className="text-sm text-muted-foreground pl-6">{trial.primaryEndpoint}</p>
          </div>
        )}

        {/* Secondary Endpoints */}
        {trial.secondaryEndpoints && trial.secondaryEndpoints.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Secondary Endpoints:</span>
            <div className="flex flex-wrap gap-1">
              {trial.secondaryEndpoints.slice(0, 3).map((endpoint, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {endpoint}
                </Badge>
              ))}
              {trial.secondaryEndpoints.length > 3 && (
                <Badge variant="outline" className="text-xs bg-muted">
                  +{trial.secondaryEndpoints.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Adverse Events */}
        {trial.adverseEvents && trial.adverseEvents.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-warning">Adverse Events:</span>
            <div className="flex flex-wrap gap-1">
              {trial.adverseEvents.slice(0, 2).map((event, idx) => (
                <Badge key={idx} variant="outline" className="text-xs border-warning/30 text-warning">
                  {event}
                </Badge>
              ))}
              {trial.adverseEvents.length > 2 && (
                <Badge variant="outline" className="text-xs bg-warning/10 text-warning">
                  +{trial.adverseEvents.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Confidence Score */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Analysis Confidence</span>
            <span className="text-muted-foreground">
              {Math.round(trial.confidence * 100)}%
            </span>
          </div>
          <div className="w-full bg-secondary/20 rounded-full h-2 mt-1">
            <div 
              className="h-2 bg-gradient-medical rounded-full transition-all duration-300"
              style={{ width: `${trial.confidence * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};