import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const HeyHarry = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-24 pb-12">
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="max-w-2xl w-full text-center">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Heart className="w-12 h-12 text-primary animate-pulse" />
                  <Sparkles className="w-6 h-6 text-primary-glow absolute -top-2 -right-2 animate-bounce" />
                </div>
              </div>
              <CardTitle className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Hey Harry! 👋
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <p className="text-xl text-muted-foreground">
                Welcome to your amazing app! Hope you're having a fantastic day.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to="/">
                    <Sparkles className="w-4 h-4" />
                    <div className="w-px h-4 bg-purple-300 mx-1"></div>
                    Go to Home
                  </Link>
                </Button>
                
                <Button variant="ghost" asChild>
                  <Link to="/styleguide">Check Styleguide</Link>
                </Button>
              </div>
              
              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  This page was created just for you! ✨
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HeyHarry;