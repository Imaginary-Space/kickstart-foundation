import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LazyP5Background } from "@/components/LazyP5Background";
import { useState, useCallback } from "react";
import { Mail, ArrowRight, Upload, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import heroImage from "@/assets/hero-image.jpg";
export const Hero = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Redirect to login when files are dropped
    navigate('/login');
  }, [navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'image/*': []
    }
  });

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
      {/* Lazy P5.js Interactive Background */}
      <LazyP5Background />
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Modern abstract background with flowing gradients" 
          className="w-full h-full object-cover opacity-10" 
          decoding="async"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-7xl mx-auto animate-fade-in">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent lg:text-6xl xl:text-7xl leading-tight">
                Organize 10,000+ Photos in Minutes
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
                Drop your photos to get started with AI-powered organization. 
                Smart rename, tag, and sort your entire collection instantly.
              </p>
            </div>

            {/* Right Column - Dropzone */}
            <div className="flex justify-center lg:justify-end">
              {!isSubmitted ? (
                !showEmailForm ? (
                  <div className="w-full max-w-md animate-slide-up space-y-4">
                    {/* Hero Dropzone */}
                    <div
                      {...getRootProps()}
                      className={`
                        relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
                        bg-background/10 backdrop-blur-sm
                        ${isDragActive 
                          ? 'border-primary bg-primary/20 scale-[1.02] shadow-glow' 
                          : 'border-muted-foreground/30 hover:border-primary hover:bg-primary/10 hover:shadow-elegant'
                        }
                      `}
                    >
                      <input {...getInputProps()} />
                      
                      <div className="space-y-4">
                        <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-2 text-foreground">
                            {isDragActive ? 'Drop photos here!' : 'Try it now - Upload Photos'}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            Drag photos here or click to select • Free to try
                          </p>
                        </div>

                        <Button 
                          type="button"
                          size="lg"
                          className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold px-8"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Photos
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-border"></div>
                      <span className="text-xs text-muted-foreground px-2">or</span>
                      <div className="flex-1 h-px bg-border"></div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowEmailForm(true)}
                      className="w-full text-muted-foreground hover:text-foreground"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Join waitlist for updates
                    </Button>
                  </div>
                ) : (
                  <div className="w-full max-w-md">
                    <form onSubmit={handleEmailSubmit} className="animate-slide-up">
                      <div className="flex flex-col gap-3 mb-4">
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-11 h-12 text-base bg-background/50 backdrop-blur-sm border-muted-foreground/30"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          size="lg"
                          disabled={isSubmitting}
                          className="h-12 px-6 flex items-center gap-2 w-full"
                        >
                          {isSubmitting ? "Joining..." : "Join Waitlist"}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                      {error && (
                        <p className="text-red-600 text-sm mb-2">{error}</p>
                      )}
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-3">
                          Get early access + exclusive launch discount
                        </p>
                      </div>
                      <Button 
                        type="button"
                        variant="ghost" 
                        onClick={() => setShowEmailForm(false)}
                        className="w-full text-xs text-muted-foreground hover:text-foreground"
                      >
                        ← Back to photo upload
                      </Button>
                    </form>
                  </div>
                )
              ) : (
                <div className="w-full max-w-md animate-fade-in">
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
        </div>
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background/80 z-5" />
    </section>
  );
};