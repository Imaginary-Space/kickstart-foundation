import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, Mail, Twitter, Instagram, Linkedin, Shield, FileText } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-6">
        {/* Newsletter Section */}
        <div className="py-16 border-b border-border">
          <div className="max-w-2xl mx-auto text-center animate-fade-in">
            <h3 className="text-3xl font-bold mb-4">
              Get Pro Tips + Early Access to New Features
            </h3>
            <p className="text-muted-foreground mb-6">
              Join 15,000+ photographers getting weekly organization tips and exclusive updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button variant="hero" className="whitespace-nowrap">
                Get Free Guide
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Free "Ultimate Photo Organization Guide" included. No spam, unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">PhotoRename</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Transform chaos into perfect photo organization with AI. 
              Trusted by 10,000+ users worldwide.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">API Access</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Integrations</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Customer Stories</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact Support</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">System Status</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Tutorials</a></li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Press Kit</a></li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>© 2024 PhotoRename. All rights reserved.</span>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>SSL Secured</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Contact
            </Button>
            <Button variant="hero" size="sm">
              Try Free
            </Button>
          </div>
        </div>
      </div>

      {/* Sticky CTA for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 md:hidden z-50">
        <Button variant="hero" size="lg" className="w-full">
          Start Free Trial - No Credit Card Required
        </Button>
      </div>
    </footer>
  );
};