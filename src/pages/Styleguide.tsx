import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/Navbar";
import { 
  Palette, 
  Type, 
  Layout, 
  Layers, 
  Zap,
  Moon,
  Sun,
  Copy,
  Check
} from "lucide-react";
import { useState } from "react";

const colorTokens = [
  { name: "--background", value: "hsl(var(--background))", description: "Main background color" },
  { name: "--foreground", value: "hsl(var(--foreground))", description: "Main text color" },
  { name: "--primary", value: "hsl(var(--primary))", description: "Primary brand color" },
  { name: "--primary-foreground", value: "hsl(var(--primary-foreground))", description: "Text on primary" },
  { name: "--primary-glow", value: "hsl(var(--primary-glow))", description: "Primary accent glow" },
  { name: "--secondary", value: "hsl(var(--secondary))", description: "Secondary background" },
  { name: "--secondary-foreground", value: "hsl(var(--secondary-foreground))", description: "Secondary text" },
  { name: "--muted", value: "hsl(var(--muted))", description: "Muted background" },
  { name: "--muted-foreground", value: "hsl(var(--muted-foreground))", description: "Muted text" },
  { name: "--accent", value: "hsl(var(--accent))", description: "Accent color" },
  { name: "--accent-foreground", value: "hsl(var(--accent-foreground))", description: "Text on accent" },
  { name: "--destructive", value: "hsl(var(--destructive))", description: "Error/danger color" },
  { name: "--border", value: "hsl(var(--border))", description: "Border color" },
  { name: "--input", value: "hsl(var(--input))", description: "Input border color" },
  { name: "--ring", value: "hsl(var(--ring))", description: "Focus ring color" },
];

const gradients = [
  { name: "--gradient-primary", value: "var(--gradient-primary)", description: "Primary gradient" },
  { name: "--gradient-subtle", value: "var(--gradient-subtle)", description: "Subtle background gradient" },
];

const shadows = [
  { name: "--shadow-elegant", value: "var(--shadow-elegant)", description: "Elegant shadow" },
  { name: "--shadow-glow", value: "var(--shadow-glow)", description: "Glow effect shadow" },
];

const animations = [
  { name: "animate-fade-in", description: "Fade in with slide up" },
  { name: "animate-slide-up", description: "Slide up animation" },
  { name: "animate-glow", description: "Glow pulsing animation" },
  { name: "animate-pulse", description: "Default pulse animation" },
  { name: "animate-spin", description: "Rotation animation" },
];

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={copyToClipboard}
      className="ml-2 h-6 w-6 p-0"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </Button>
  );
};

const ColorSwatch = ({ token }: { token: typeof colorTokens[0] }) => (
  <div className="flex items-center space-x-3 p-3 rounded-lg border bg-card">
    <div 
      className="w-12 h-12 rounded-md border shadow-sm"
      style={{ backgroundColor: token.value }}
    />
    <div className="flex-1">
      <div className="flex items-center">
        <code className="text-sm font-mono">{token.name}</code>
        <CopyButton text={token.name} />
      </div>
      <p className="text-sm text-muted-foreground">{token.description}</p>
      <code className="text-xs text-muted-foreground">{token.value}</code>
    </div>
  </div>
);

export default function Styleguide() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Palette className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Design System Styleguide
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive guide to our design tokens, components, and patterns
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Sun className="h-4 w-4" />
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            <Moon className="h-4 w-4" />
          </div>
        </header>

        <div className="space-y-16">
          {/* Color System */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Palette className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">Color System</h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {colorTokens.map((token) => (
                <ColorSwatch key={token.name} token={token} />
              ))}
            </div>
          </section>

          {/* Gradients */}
          <section>
            <h3 className="text-2xl font-bold mb-6">Gradients</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {gradients.map((gradient) => (
                <div key={gradient.name} className="p-4 rounded-lg border bg-card">
                  <div 
                    className="w-full h-20 rounded-md mb-3"
                    style={{ background: gradient.value }}
                  />
                  <div className="flex items-center">
                    <code className="text-sm font-mono">{gradient.name}</code>
                    <CopyButton text={gradient.name} />
                  </div>
                  <p className="text-sm text-muted-foreground">{gradient.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Type className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">Typography</h2>
            </div>
            
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Heading 1</h1>
                  <code className="text-sm text-muted-foreground">text-4xl font-bold</code>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">Heading 2</h2>
                  <code className="text-sm text-muted-foreground">text-3xl font-bold</code>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Heading 3</h3>
                  <code className="text-sm text-muted-foreground">text-2xl font-bold</code>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Heading 4</h4>
                  <code className="text-sm text-muted-foreground">text-xl font-semibold</code>
                </div>
                <div>
                  <p className="text-base mb-2">Body text - The quick brown fox jumps over the lazy dog</p>
                  <code className="text-sm text-muted-foreground">text-base</code>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Small text - Perfect for captions and secondary information</p>
                  <code className="text-sm text-muted-foreground">text-sm text-muted-foreground</code>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Components */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Layout className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">Components</h2>
            </div>

            {/* Buttons */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Buttons</h3>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-4">
                    <div className="space-y-2">
                      <Button>Default</Button>
                      <code className="block text-xs">variant="default"</code>
                    </div>
                    <div className="space-y-2">
                      <Button variant="secondary">Secondary</Button>
                      <code className="block text-xs">variant="secondary"</code>
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline">Outline</Button>
                      <code className="block text-xs">variant="outline"</code>
                    </div>
                    <div className="space-y-2">
                      <Button variant="ghost">Ghost</Button>
                      <code className="block text-xs">variant="ghost"</code>
                    </div>
                    <div className="space-y-2">
                      <Button variant="destructive">Destructive</Button>
                      <code className="block text-xs">variant="destructive"</code>
                    </div>
                    <div className="space-y-2">
                      <Button variant="hero">Hero</Button>
                      <code className="block text-xs">variant="hero"</code>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="space-y-2">
                      <Button size="sm">Small</Button>
                      <code className="block text-xs">size="sm"</code>
                    </div>
                    <div className="space-y-2">
                      <Button size="default">Default</Button>
                      <code className="block text-xs">size="default"</code>
                    </div>
                    <div className="space-y-2">
                      <Button size="lg">Large</Button>
                      <code className="block text-xs">size="lg"</code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form Elements */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Form Elements</h3>
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Input Field</label>
                    <Input placeholder="Enter text here..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Textarea</label>
                    <Textarea placeholder="Enter longer text here..." />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="checkbox" />
                    <label htmlFor="checkbox" className="text-sm">Checkbox</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="switch" />
                    <label htmlFor="switch" className="text-sm">Switch</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Slider</label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Progress</label>
                    <Progress value={75} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Badges */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Badges</h3>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Shadows & Effects */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Layers className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">Shadows & Effects</h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {shadows.map((shadow) => (
                <Card key={shadow.name}>
                  <CardContent className="p-6">
                    <div 
                      className="w-full h-20 rounded-md bg-card border mb-4"
                      style={{ boxShadow: shadow.value }}
                    />
                    <div className="flex items-center">
                      <code className="text-sm font-mono">{shadow.name}</code>
                      <CopyButton text={shadow.name} />
                    </div>
                    <p className="text-sm text-muted-foreground">{shadow.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Animations */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Zap className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">Animations</h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {animations.map((animation) => (
                <Card key={animation.name}>
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-md bg-primary mx-auto mb-4 ${animation.name}`} />
                    <div className="flex items-center justify-center">
                      <code className="text-sm font-mono">{animation.name}</code>
                      <CopyButton text={animation.name} />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">{animation.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Usage Guidelines */}
          <section>
            <h2 className="text-3xl font-bold mb-8">Usage Guidelines</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">✅ Do's</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Use semantic color tokens (hsl(var(--primary)))</li>
                    <li>• Follow the established hierarchy with typography</li>
                    <li>• Use consistent spacing with Tailwind utilities</li>
                    <li>• Apply animations thoughtfully for better UX</li>
                    <li>• Test in both light and dark modes</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">❌ Don'ts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Don't use hardcoded colors (text-white, bg-black)</li>
                    <li>• Don't create custom styles outside the system</li>
                    <li>• Don't mix different design patterns</li>
                    <li>• Don't overuse animations or effects</li>
                    <li>• Don't ignore accessibility guidelines</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}