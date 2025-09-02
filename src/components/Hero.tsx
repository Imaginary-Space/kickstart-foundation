import { Button } from "@/components/ui/button";
import { P5Background } from "@/components/P5Background";
import heroImage from "@/assets/hero-image.jpg";
export const Hero = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-subtle">
      {/* P5.js Interactive Background */}
      <P5Background />
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Modern abstract background with flowing gradients" className="w-full h-full object-cover opacity-10" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">Transform Chaos Into Perfect Photo Organization</h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Transform messy photo filenames into organized, descriptive names using AI. 
            Sort thousands of photos in minutes, not hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button variant="hero" size="lg" className="text-lg px-8 py-6">
              Start Renaming
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              See Demo
            </Button>
          </div>
        </div>
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background/80 z-5" />
    </section>;
};