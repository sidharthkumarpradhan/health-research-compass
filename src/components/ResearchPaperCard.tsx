import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Users, TrendingUp } from "lucide-react";
import { ResearchPaper } from "@/services/researchApi";

interface ResearchPaperCardProps {
  paper: ResearchPaper;
  index: number;
}

export const ResearchPaperCard = ({ paper, index }: ResearchPaperCardProps) => {
  const handleViewPaper = () => {
    if (paper.url && paper.url !== '#') {
      window.open(paper.url, '_blank', 'noopener,noreferrer');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="group hover:shadow-card-medical transition-all duration-300 transform hover:scale-[1.02] bg-gradient-subtle border-medical-light/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-medical-light text-medical-dark font-medium">
                #{index + 1}
              </Badge>
              {paper.citationsCount && (
                <Badge variant="outline" className="border-success/30 text-success">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {paper.citationsCount} citations
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
              {paper.title}
            </CardTitle>
          </div>
        </div>
        
        <CardDescription className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{paper.authors.slice(0, 3).join(", ")}</span>
            {paper.authors.length > 3 && <span className="text-muted-foreground">+{paper.authors.length - 3} more</span>}
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {paper.abstract}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="space-y-1">
            <p className="text-sm font-medium text-medical-blue">{paper.journal}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(paper.publishedDate)}</span>
              {paper.doi && (
                <>
                  <span className="mx-2">•</span>
                  <span>DOI: {paper.doi}</span>
                </>
              )}
            </div>
          </div>

          <Button 
            onClick={handleViewPaper}
            variant="medical"
            size="sm"
            className="gap-2"
            disabled={!paper.url || paper.url === '#'}
          >
            <ExternalLink className="w-4 h-4" />
            View Paper
          </Button>
        </div>

        {paper.keywords && paper.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2">
            {paper.keywords.slice(0, 4).map((keyword, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs bg-accent/50">
                {keyword}
              </Badge>
            ))}
            {paper.keywords.length > 4 && (
              <Badge variant="secondary" className="text-xs bg-muted">
                +{paper.keywords.length - 4} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};