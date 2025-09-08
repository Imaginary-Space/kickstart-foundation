import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, RefreshCw, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const NameGenerator = () => {
  const [nameType, setNameType] = useState<string>('business');
  const [keywords, setKeywords] = useState<string>('');
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [demoName, setDemoName] = useState<string>('');
  const [demoSource, setDemoSource] = useState<'db' | 'redis' | ''>('');
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const { toast } = useToast();

  const nameTypes = [
    { value: 'business', label: 'Business Names' },
    { value: 'project', label: 'Project Names' },
    { value: 'character', label: 'Character Names' },
    { value: 'brand', label: 'Brand Names' },
    { value: 'startup', label: 'Startup Names' },
    { value: 'app', label: 'App Names' },
  ];

  const generateNames = async () => {
    if (!keywords.trim()) {
      toast({
        title: "Keywords required",
        description: "Please enter some keywords to generate names",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate name generation - replace with actual AI service call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const sampleNames = [
      `${keywords}Hub`, `${keywords}Craft`, `${keywords}Flow`, `${keywords}Sphere`,
      `${keywords}Wave`, `${keywords}Core`, `${keywords}Lab`, `${keywords}Studio`,
      `Smart${keywords}`, `${keywords}Pro`, `${keywords}Gen`, `${keywords}Sync`,
    ].slice(0, 8);

    setGeneratedNames(sampleNames);
    setIsGenerating(false);
  };

  const copyToClipboard = (name: string) => {
    navigator.clipboard.writeText(name);
    toast({
      title: "Copied!",
      description: `"${name}" copied to clipboard`,
    });
  };

  const fetchRandomName = async () => {
    setIsDemoLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('random-name');
      
      if (error) throw error;
      
      const result = await data;
      setDemoName(result.name);
      setDemoSource(result.source);
      
      toast({
        title: "Random name fetched!",
        description: `Source: ${result.source === 'redis' ? 'Cache' : 'Database'}`,
      });
    } catch (error) {
      console.error('Error fetching random name:', error);
      toast({
        title: "Error",
        description: "Failed to fetch random name",
        variant: "destructive",
      });
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Name Generator</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Generate creative and unique names for your business, project, or brand using AI-powered suggestions
            </p>
          </div>

          {/* API Demo Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                API Demo
              </CardTitle>
              <CardDescription>
                Test our random name API with Redis caching. Names are cached for 10 seconds.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button 
                  onClick={fetchRandomName}
                  disabled={isDemoLoading}
                  variant="ghost"
                >
                  {isDemoLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Fetching...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Get Random Name
                    </>
                  )}
                </Button>
                
                {demoName && (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="text-lg px-4 py-2 cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => copyToClipboard(demoName)}
                    >
                      {demoName}
                    </Badge>
                    <Badge variant={demoSource === 'redis' ? 'default' : 'outline'}>
                      {demoSource === 'redis' ? 'Cache Hit' : 'Database'}
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground">
                <code>GET /api/random-name</code> • Returns: <code>{`{ name: string, source: "db" | "redis" }`}</code>
              </div>
            </CardContent>
          </Card>

          {/* Generator Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Generate Names</CardTitle>
              <CardDescription>
                Choose a category and provide keywords to generate relevant names
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameType">Name Type</Label>
                  <Select value={nameType} onValueChange={setNameType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select name type" />
                    </SelectTrigger>
                    <SelectContent>
                      {nameTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    placeholder="Enter keywords (e.g., tech, creative, fast)"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && generateNames()}
                  />
                </div>
              </div>

              <Button 
                onClick={generateNames} 
                disabled={isGenerating}
                className="w-full md:w-auto"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Names
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Names */}
          {generatedNames.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Names</CardTitle>
                <CardDescription>
                  Click any name to copy it to your clipboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {generatedNames.map((name, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="justify-between p-3 cursor-pointer hover:bg-accent transition-colors group"
                      onClick={() => copyToClipboard(name)}
                    >
                      <span className="font-medium">{name}</span>
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Badge>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Button variant="ghost" onClick={generateNames} disabled={isGenerating}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate More
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default NameGenerator;