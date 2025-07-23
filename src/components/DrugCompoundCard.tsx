import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, Target, Zap, AlertTriangle } from "lucide-react";
import type { DrugCompound } from "@/types/pharmaceutical";

interface DrugCompoundCardProps {
  compound: DrugCompound;
}

export const DrugCompoundCard = ({ compound }: DrugCompoundCardProps) => {
  const getTypeIcon = (type: DrugCompound['type']) => {
    switch (type) {
      case 'active_ingredient':
        return <Target className="w-4 h-4" />;
      case 'combination':
        return <Zap className="w-4 h-4" />;
      case 'metabolite':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Pill className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: DrugCompound['type']) => {
    switch (type) {
      case 'active_ingredient':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'combination':
        return 'bg-success/10 text-success border-success/20';
      case 'metabolite':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-success/10 text-success';
    if (confidence >= 0.6) return 'bg-warning/10 text-warning';
    return 'bg-destructive/10 text-destructive';
  };

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-medical-light/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            {getTypeIcon(compound.type)}
            <CardTitle className="text-base font-medium">{compound.name}</CardTitle>
          </div>
          <Badge variant="outline" className={getConfidenceColor(compound.confidence)}>
            {Math.round(compound.confidence * 100)}% confidence
          </Badge>
        </div>
        {compound.chemicalFormula && (
          <CardDescription className="font-mono text-sm">
            {compound.chemicalFormula}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={getTypeColor(compound.type)}>
            {compound.type.replace('_', ' ')}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {compound.mentions} mention{compound.mentions !== 1 ? 's' : ''}
          </span>
        </div>

        {compound.dosage && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-medical-blue">Dosage:</span>
            <span className="bg-medical-light/50 px-2 py-1 rounded text-medical-dark">
              {compound.dosage}
            </span>
          </div>
        )}

        <div className="w-full bg-secondary/20 rounded-full h-2">
          <div 
            className="h-2 bg-gradient-medical rounded-full transition-all duration-300"
            style={{ width: `${compound.confidence * 100}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};