import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ImageIcon, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Card className="p-8 bg-card/50 backdrop-blur-sm border-0 hover:shadow-elegant transition-all duration-300">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mr-3">
              <ImageIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">PhotoRename</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account to continue organizing your photos</p>
          </div>

          {/* Login Form */}
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email"
                className="transition-all duration-300 focus:shadow-glow"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password"
                className="transition-all duration-300 focus:shadow-glow"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <Link to="#" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button 
              variant="default" 
              size="lg" 
              className="w-full text-lg py-6"
              type="submit"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-4 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <Button variant="ghost" className="w-full" type="button">
              Continue with Google
            </Button>
            <Button variant="ghost" className="w-full" type="button">
              Continue with GitHub
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6 text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="#" className="text-primary hover:underline font-medium">
              Sign up for free
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;