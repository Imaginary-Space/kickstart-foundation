import { Button } from "@/components/ui/button";
import { ImageIcon, Menu, LogOut, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">PhotoRename</span>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors ${location.pathname === '/' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Home
            </Link>
            {user && (
              <Link 
                to="/dashboard" 
                className={`transition-colors ${location.pathname === '/dashboard' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Dashboard
              </Link>
            )}
            <Link 
              to="/docs" 
              className={`transition-colors ${location.pathname === '/docs' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Docs
            </Link>
            <Link 
              to="/testimonials" 
              className={`transition-colors ${location.pathname === '/testimonials' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Testimonials
            </Link>
            {location.pathname === '/' && (
              <a 
                href="#pricing" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Pricing
              </a>
            )}
          </div>
          
          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Hola, {user.user_metadata?.full_name || user.email}
                </span>
                <Button variant="ghost" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link to="/login">Prueba Gratis</Link>
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <div className="px-6 py-4 space-y-4">
              <Link 
                to="/" 
                className={`block transition-colors ${location.pathname === '/' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              {user && (
                <Link 
                  to="/dashboard" 
                  className={`block transition-colors ${location.pathname === '/dashboard' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <Link 
                to="/docs" 
                className={`block transition-colors ${location.pathname === '/docs' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Docs
              </Link>
              <Link 
                to="/testimonials" 
                className={`block transition-colors ${location.pathname === '/testimonials' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              {location.pathname === '/' && (
                <a 
                  href="#pricing" 
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                >
                  Pricing
                </a>
              )}
              
              {/* Mobile CTA Buttons */}
              <div className="pt-4 space-y-2">
                {user ? (
                  <Button 
                    variant="ghost" 
                    onClick={signOut}
                    className="w-full justify-start"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" asChild className="w-full">
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button variant="default" asChild className="w-full">
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        Try Free
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};