import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { LazyFeatures } from "@/components/lazy/LazyFeatures";
import { LazyTestimonials } from "@/components/lazy/LazyTestimonials";
import { LazyPricing } from "@/components/lazy/LazyPricing";
import { LazyFooter } from "@/components/lazy/LazyFooter";
import { useAnalytics } from "@/hooks/useAnalytics";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Initialize analytics after page load
  useAnalytics();

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);
  
  return (
    <main className="min-h-screen">
      {/* Fixed navigation bar with company logo and main navigation links */}
      <Navbar />
      
      {/* Hero section featuring main value proposition, headline, and primary CTA buttons */}
      <Hero />
      
      {/* Product features section showcasing AI-powered photo organization capabilities */}
      <LazyFeatures />
      
      {/* Social proof section with customer testimonials, ratings, and success stories */}
      <LazyTestimonials />
      
      {/* Pricing section displaying different subscription plans and feature comparisons */}
      <LazyPricing />
      
      {/* Site footer with additional links, contact information, and secondary CTAs */}
      <LazyFooter />
    </main>
  );
};

export default Index;
