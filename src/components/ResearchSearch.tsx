import { useState } from "react";
import { Search, Stethoscope, Heart, Shield, Brain, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ResearchPaperCard } from "./ResearchPaperCard";
import { researchApi, type ResearchPaper, type SearchResult } from "@/services/researchApi";

const quickSearchCategories = [
  { name: "Heart Attack", query: "heart attack", icon: Heart, color: "bg-red-100 text-red-700 hover:bg-red-200" },
  { name: "COVID-19", query: "covid-19", icon: Shield, color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
  { name: "Diabetes", query: "diabetes", icon: Activity, color: "bg-green-100 text-green-700 hover:bg-green-200" },
  { name: "Cancer", query: "cancer", icon: Stethoscope, color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
  { name: "Alzheimer's", query: "alzheimer", icon: Brain, color: "bg-orange-100 text-orange-700 hover:bg-orange-200" },
];

export const ResearchSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      toast({
        title: "Please enter a search term",
        description: "Enter a disease or medical condition to search for research papers.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setActiveCategory(query);
    
    try {
      const result = await researchApi.searchResearchPapers(query);
      setSearchResult(result);
      
      toast({
        title: "Search completed",
        description: `Found ${result.totalResults} research papers about ${query}`,
      });
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "Unable to fetch research papers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSearch = (category: string) => {
    setSearchQuery(category);
    handleSearch(category);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-medical">
              <Stethoscope className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-medical bg-clip-text text-transparent">
              Medical Research Hub
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the latest medical research papers and scientific publications. Search by disease, condition, or treatment to find evidence-based medical literature.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-card-medical">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Search Research Papers
            </CardTitle>
            <CardDescription>
              Enter a medical condition, disease, or treatment to find relevant research papers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
              <Input
                placeholder="e.g., heart attack, diabetes, COVID-19..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="search" disabled={isLoading} className="px-8">
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </form>

            {/* Quick Search Categories */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Quick Search Categories</h3>
              <div className="flex flex-wrap gap-2">
                {quickSearchCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.name}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSearch(category.query)}
                      disabled={isLoading}
                      className={`gap-2 hover:scale-105 transition-all ${
                        activeCategory === category.query ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {searchResult && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Research Results</h2>
                <p className="text-muted-foreground">
                  {searchResult.totalResults} papers found for "{activeCategory}"
                </p>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success">
                Top {searchResult.papers.length} Results
              </Badge>
            </div>

            <div className="grid gap-6">
              {searchResult.papers.map((paper, index) => (
                <ResearchPaperCard
                  key={paper.id}
                  paper={paper}
                  index={index}
                />
              ))}
            </div>

            {searchResult.papers.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No papers found</h3>
                  <p className="text-muted-foreground">
                    Try searching with different keywords or check the spelling of your search term.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Initial State */}
        {!searchResult && !isLoading && (
          <Card className="text-center py-12 bg-gradient-subtle border-medical-light/30">
            <CardContent>
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 rounded-full bg-medical-light">
                  <Search className="w-8 h-8 text-medical-blue" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Your Research</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Use the search bar above or click on one of the quick search categories to discover relevant medical research papers.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {quickSearchCategories.slice(0, 3).map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.name}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickSearch(category.query)}
                      className="gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      Try {category.name}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};