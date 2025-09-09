import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { type ExampleType } from "@/hooks/useDocs";
import { 
  Upload, 
  Bot, 
  Image as ImageIcon, 
  CheckCircle,
  ArrowRight,
  RefreshCw
} from "lucide-react";

interface InteractiveExampleProps {
  example: ExampleType;
}

export function InteractiveExample({ example }: InteractiveExampleProps) {
  const [demoStep, setDemoStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const runDemo = () => {
    setIsAnimating(true);
    setDemoStep(0);
    
    const interval = setInterval(() => {
      setDemoStep(prev => {
        if (prev >= example.steps.length - 1) {
          clearInterval(interval);
          setIsAnimating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const resetDemo = () => {
    setDemoStep(0);
    setIsAnimating(false);
  };

  const renderPhotoUploadDemo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Upload Zone */}
        <Card className={`transition-all duration-500 ${demoStep >= 0 ? 'border-primary bg-primary/5' : ''}`}>
          <CardContent className="p-6 text-center">
            <Upload className={`h-8 w-8 mx-auto mb-2 ${demoStep >= 0 ? 'text-primary' : 'text-muted-foreground'}`} />
            <p className="text-sm font-medium">1. Upload Photos</p>
            {demoStep >= 0 && <Badge className="mt-2">3 files selected</Badge>}
          </CardContent>
        </Card>

        {/* Processing */}
        <Card className={`transition-all duration-500 ${demoStep >= 1 ? 'border-primary bg-primary/5' : ''}`}>
          <CardContent className="p-6 text-center">
            <Bot className={`h-8 w-8 mx-auto mb-2 ${demoStep >= 1 ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
            <p className="text-sm font-medium">2. AI Analysis</p>
            {demoStep >= 1 && (
              <div className="mt-2 space-y-2">
                <Progress value={demoStep >= 2 ? 100 : 60} className="h-2" />
                <Badge variant="secondary">Processing...</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Result */}
        <Card className={`transition-all duration-500 ${demoStep >= 2 ? 'border-green-500 bg-green-50' : ''}`}>
          <CardContent className="p-6 text-center">
            <CheckCircle className={`h-8 w-8 mx-auto mb-2 ${demoStep >= 2 ? 'text-green-600' : 'text-muted-foreground'}`} />
            <p className="text-sm font-medium">3. Renamed Files</p>
            {demoStep >= 2 && <Badge className="mt-2 bg-green-600">Complete!</Badge>}
          </CardContent>
        </Card>
      </div>

      {/* File Preview */}
      {demoStep >= 2 && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-sm">Renamed Files Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium">sunset_beach_golden_hour.jpg</div>
                <div className="text-xs text-muted-foreground">Originally: IMG_1234.jpg</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium">mountain_hiking_adventure.jpg</div>
                <div className="text-xs text-muted-foreground">Originally: DSC_5678.jpg</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium">family_picnic_park.jpg</div>
                <div className="text-xs text-muted-foreground">Originally: photo_001.jpg</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderPatternDemo = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Custom Naming Pattern</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Prefix</label>
              <Input value="vacation_" disabled className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Numbering</label>
              <Input value="Sequential (001, 002...)" disabled className="mt-1" />
            </div>
          </div>
          
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <div className="space-y-1 text-sm">
              <div>IMG_1234.jpg → vacation_001_beach_sunset.jpg</div>
              <div>IMG_1235.jpg → vacation_002_ocean_waves.jpg</div>
              <div>IMG_1236.jpg → vacation_003_palm_trees.jpg</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderExample = () => {
    switch (example.type) {
      case 'photo-upload':
        return renderPhotoUploadDemo();
      case 'renaming-pattern':
        return renderPatternDemo();
      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Interactive example coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{example.title}</h4>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={runDemo} 
            disabled={isAnimating}
            className="gap-2"
          >
            {isAnimating ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <ArrowRight className="h-3 w-3" />
            )}
            {isAnimating ? 'Running...' : 'Run Demo'}
          </Button>
          {demoStep > 0 && (
            <Button size="sm" variant="ghost" onClick={resetDemo}>
              Reset
            </Button>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{example.description}</p>

      {renderExample()}

      {/* Steps description */}
      <div className="grid gap-2 mt-4">
        {example.steps.map((step, index) => (
          <div 
            key={index}
            className={`flex items-center gap-3 p-2 rounded transition-all duration-300 ${
              demoStep >= index ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
              demoStep >= index ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {index + 1}
            </div>
            <span className="text-sm">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}