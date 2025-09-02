import { Button } from "@/components/ui/button";

export const CTA = () => {
  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Take this beautiful starter template and make it your own. 
            The possibilities are endless.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button variant="default" size="lg" className="text-lg px-8 py-6">
              Start Building
            </Button>
            <Button variant="ghost" size="lg" className="text-lg px-8 py-6">
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};