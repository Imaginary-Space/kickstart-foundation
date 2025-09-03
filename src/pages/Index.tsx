import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      {/* Navigation bar with logo and menu items */}
      <Navbar />
      
      {/* Hero section with main headline and CTA buttons */}
      <Hero />
      
      {/* Features showcase section */}
      <Features />
      
      {/* Customer testimonials and reviews */}
      <Testimonials />
      
      {/* Pricing plans and packages */}
      <Pricing />
      
      {/* Footer with links and company info */}
      <Footer />
    </main>
  );
};

export default Index;
