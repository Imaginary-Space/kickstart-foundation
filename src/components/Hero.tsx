import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { P5Background } from "@/components/P5Background";
import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-image.jpg";
export const Hero = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError("");

    try {
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert([{ email }]);

      if (insertError) {
        if (insertError.code === '23505') { // Unique constraint violation
          setError("This email is already on our waitlist!");
        } else {
          setError("Something went wrong. Please try again.");
        }
        console.error('Error adding to waitlist:', insertError);
      } else {
        setIsSubmitted(true);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-subtle">
      {/* P5.js Interactive Background */}
      <P5Background />
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Modern abstract background with flowing gradients" className="w-full h-full object-cover opacity-10" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent px-0 md:text-7xl">
            AI-Powered Photo Organization
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Be the first to transform messy photo filenames into organized, descriptive names using AI. 
            Join our early access list and get notified when we launch.
          </p>
          
          {!isSubmitted ? (
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto animate-slide-up">
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 text-base"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="h-12 px-6 flex items-center gap-2"
                >
                  {isSubmitting ? "Joining..." : "Join Waitlist"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              {error && (
                <p className="text-red-600 text-sm mb-2">{error}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Get early access + exclusive launch discount
              </p>
            </form>
          ) : (
            <div className="max-w-md mx-auto animate-fade-in">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                <h3 className="text-green-800 font-semibold mb-2">Welcome to the waitlist!</h3>
                <p className="text-green-700">
                  We'll notify you as soon as we launch. Thanks for your interest!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background/80 z-5" />
    </section>
  );
};