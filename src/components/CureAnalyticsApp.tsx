import { useState } from "react";
import { Search, Menu, X, Atom, Dna, TestTube, Microscope, Beaker, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResearchSearch } from "@/components/ResearchSearch";

const CureAnalyticsApp = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "Home", icon: null },
    { id: "research", label: "Research Hub", icon: TestTube },
    { id: "about", label: "About Us", icon: null },
    { id: "login", label: "Login", icon: null }
  ];

  const FloatingMolecule = ({ className, children, delay = 0 }: { className?: string; children: React.ReactNode; delay?: number }) => (
    <div 
      className={`absolute opacity-20 text-primary molecular-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );

  const HeroSection = () => (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Background Molecules */}
      <FloatingMolecule className="top-20 left-20" delay={0}>
        <Atom size={40} />
      </FloatingMolecule>
      <FloatingMolecule className="top-40 right-32" delay={1}>
        <Dna size={50} />
      </FloatingMolecule>
      <FloatingMolecule className="bottom-32 left-40" delay={2}>
        <Microscope size={35} />
      </FloatingMolecule>
      <FloatingMolecule className="bottom-20 right-20" delay={3}>
        <FlaskConical size={45} />
      </FloatingMolecule>
      <FloatingMolecule className="top-1/2 left-10" delay={4}>
        <Beaker size={30} />
      </FloatingMolecule>
      <FloatingMolecule className="top-1/3 right-10" delay={5}>
        <TestTube size={38} />
      </FloatingMolecule>

      <div className="text-center z-10 max-w-6xl">
        <div className="mb-8">
          <img 
            src="/lovable-uploads/737e4b4c-70d8-403d-886c-a1b54092299d.png" 
            alt="Cure Analytics" 
            className="mx-auto mb-6 h-20 w-auto"
          />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-crystalline leading-tight">
          ADVANCING
          <br />
          PHARMACEUTICAL
          <br />
          INTELLIGENCE
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
          Accelerating drug discovery through intelligent research synthesis. 
          Get the best drug combinations for pharmaceutical manufacturing with 
          AI-powered analysis of clinical trials and research publications.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="btn-biotech text-lg px-8 py-4 h-auto"
            onClick={() => setActiveSection("research")}
          >
            <TestTube className="mr-2" size={20} />
            Start Research
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-8 py-4 h-auto border-primary/50 hover:bg-primary/10"
            onClick={() => setActiveSection("about")}
          >
            Learn More
          </Button>
        </div>
      </div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/80 pointer-events-none" />
    </section>
  );

  const FeaturesSection = () => (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-crystalline">
          Intelligence-Driven Discovery
        </h2>
        <p className="text-xl text-muted-foreground text-center mb-16 max-w-3xl mx-auto">
          Our platform combines advanced NER models with clinical trial analysis to provide 
          pharmaceutical companies with the most comprehensive research intelligence.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Atom size={40} />,
              title: "Compound Analysis",
              description: "Advanced NER extraction of drug compounds, dosages, and chemical entities from research papers."
            },
            {
              icon: <TestTube size={40} />,
              title: "Clinical Trial Intelligence",
              description: "Smart classification of trial phases, sample sizes, and efficacy metrics for evidence-based decisions."
            },
            {
              icon: <Dna size={40} />,
              title: "Drug Interaction Mapping",
              description: "Comprehensive analysis of drug combinations, synergies, and contraindications from published research."
            }
          ].map((feature, index) => (
            <Card key={index} className="card-glow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 text-primary">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );

  const AboutSection = () => (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-crystalline">
          Revolutionizing Pharmaceutical Research
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Cure Analytics is an in-house think tank that helps pharmaceutical companies 
              identify the best drug combinations for disease-related drug manufacturing. 
              Instead of struggling to gather all available research from major health publications, 
              companies can rely on our intelligent platform for evidence-based recommendations.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our advanced NER models analyze abstracts, conclusions, and real-world testing data 
              to rank research papers by clinical trial phases, sample sizes, and efficacy metrics, 
              providing pharmaceutical companies with the most relevant and reliable research intelligence.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Biomedical NER", "Clinical Trial Analysis", "Drug Discovery", "Research Intelligence"].map((tag) => (
                <Badge key={tag} variant="secondary" className="px-3 py-1">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="relative">
            <Card className="card-glow p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                  <div className="text-sm text-muted-foreground">Research Papers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                  <div className="text-sm text-muted-foreground">Drug Compounds</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">95%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Analysis</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );

  const LoginSection = () => (
    <section className="py-20 px-6">
      <div className="max-w-md mx-auto">
        <Card className="card-glow">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-crystalline">Access Research Hub</CardTitle>
            <CardDescription>Sign in to unlock advanced pharmaceutical intelligence</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input type="email" placeholder="research@pharma.com" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button className="w-full btn-biotech">
              <Microscope className="mr-2" size={16} />
              Access Platform
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );

  const Footer = () => (
    <footer className="border-t border-border/50 py-12 px-6 bg-gradient-to-t from-background/50 to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-4">
            <img src="/lovable-uploads/737e4b4c-70d8-403d-886c-a1b54092299d.png" alt="Cure Analytics" className="h-10 w-auto" />
            <span className="text-lg font-semibold">Cure Analytics</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              About Us
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Terms & Conditions
            </a>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2025 Cure Analytics. All rights reserved. Made with ❤️
          </p>
        </div>
      </div>
    </footer>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "research":
        return <ResearchSearch />;
      case "about":
        return <AboutSection />;
      case "login":
        return <LoginSection />;
      default:
        return (
          <>
            <HeroSection />
            <FeaturesSection />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => setActiveSection("home")}
            >
              <img src="/lovable-uploads/737e4b4c-70d8-403d-886c-a1b54092299d.png" alt="Cure Analytics" className="h-8 w-auto" />
              <span className="text-xl font-bold">Cure Analytics</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border/50">
              <div className="flex flex-col space-y-4 pt-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left text-sm font-medium transition-colors ${
                      activeSection === item.id
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {renderContent()}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CureAnalyticsApp;