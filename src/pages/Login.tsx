import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ImageIcon, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

const Login = () => {
  const { signIn, signInWithOAuth, user, loading } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    if (isSignUp) {
      const { signUp } = await import('@/contexts/AuthContext').then(m => ({ signUp: useAuth().signUp }));
      await signUp(email, password, fullName);
    } else {
      await signIn(email, password);
    }

    setFormLoading(false);
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    await signInWithOAuth(provider);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold mb-2">
              {isSignUp ? 'Crear Cuenta' : 'Bienvenido de Vuelta'}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp 
                ? 'Crea tu cuenta para comenzar a organizar tus fotos'
                : 'Inicia sesión en tu cuenta para continuar organizando tus fotos'
              }
            </p>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input 
                  id="fullName" 
                  type="text" 
                  placeholder="Ingresa tu nombre completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="transition-all duration-300 focus:shadow-glow"
                  required={isSignUp}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="transition-all duration-300 focus:shadow-glow"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="transition-all duration-300 focus:shadow-glow"
                required
                minLength={6}
              />
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  Recordarme
                </label>
                <Link to="#" className="text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            )}

            <Button 
              variant="default" 
              size="lg" 
              className="w-full text-lg py-6"
              type="submit"
              disabled={formLoading}
            >
              {formLoading 
                ? 'Cargando...' 
                : isSignUp 
                  ? 'Crear Cuenta' 
                  : 'Iniciar Sesión'
              }
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-4 text-muted-foreground">O continúa con</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <Button 
              variant="ghost" 
              className="w-full" 
              type="button"
              onClick={() => handleOAuthSignIn('google')}
            >
              Continuar con Google
            </Button>
            <Button 
              variant="ghost" 
              className="w-full" 
              type="button"
              onClick={() => handleOAuthSignIn('github')}
            >
              Continuar con GitHub
            </Button>
          </div>

          {/* Toggle Auth Mode */}
          <div className="text-center mt-6 text-sm">
            <span className="text-muted-foreground">
              {isSignUp ? '¿Ya tienes una cuenta? ' : '¿No tienes una cuenta? '}
            </span>
            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline font-medium"
            >
              {isSignUp ? 'Inicia sesión' : 'Regístrate gratis'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;