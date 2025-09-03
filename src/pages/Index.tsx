import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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
      <Features />
      
      {/* Social proof section with customer testimonials, ratings, and success stories */}
      <Testimonials />
      
      {/* Pricing section displaying different subscription plans and feature comparisons */}
      <Pricing />
      
      {/* Site footer with additional links, contact information, and secondary CTAs */}
      <Footer />
    </main>
  );
};

export default Index;
