import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Zap, Search, FileText } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Smart AI Recognition",
    description: "Never guess what's in your photos again - our AI identifies people, objects, and moments instantly.",
    benefit: "Find any photo in seconds"
  },
  {
    icon: Zap,
    title: "Instant Organization", 
    description: "From chaos to clarity in seconds - watch your photo library transform automatically.",
    benefit: "Save hours of manual work"
  },
  {
    icon: FileText,
    title: "Meaningful Names",
    description: "Say goodbye to IMG_1234.jpg - get descriptive names that actually make sense.",
    benefit: "Understand your photos at a glance"
  },
  {
    icon: Search,
    title: "Find Anything Fast",
    description: "Search your photos like a pro - find any image in seconds with intelligent naming.",
    benefit: "Never lose a photo again"
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Stop Wasting Hours Organizing Photos
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Transform your chaotic photo library into a perfectly organized system. 
            Our AI does the heavy lifting so you can focus on what matters.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span>Trusted by 10,000+ photographers</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-elegant transition-all duration-300 animate-slide-up border-0 bg-card/50 backdrop-blur-sm"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-muted-foreground mb-3">
                      {feature.description}
                    </CardDescription>
                    <div className="text-sm font-medium text-primary">
                      ✓ {feature.benefit}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="text-center animate-slide-up">
          <Button variant="hero" size="lg" className="text-lg px-8 py-6">
            See It In Action - Free Demo
          </Button>
        </div>
      </div>
    </section>
  );
};