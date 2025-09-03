import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      {/* Barra de navegación con logo y elementos del menú */}
      <Navbar />
      
      {/* Sección hero con título principal y botones de llamada a la acción */}
      <Hero />
      
      {/* Sección de características principales */}
      <Features />
      
      {/* Testimonios y reseñas de clientes */}
      <Testimonials />
      
      {/* Planes de precios y paquetes */}
      <Pricing />
      
      {/* Pie de página con enlaces e información de la empresa */}
      <Footer />
    </main>
  );
};

export default Index;
