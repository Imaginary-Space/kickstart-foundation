import { Navbar } from "@/components/Navbar";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

const TestimonialsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24">
        <Testimonials />
      </main>
      
      <Footer />
    </div>
  );
};

export default TestimonialsPage;