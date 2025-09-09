import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Camera, Zap, Shield, Users } from "lucide-react";

interface CompletionStepProps {
  formData: {
    fullName: string;
    jobTitle: string;
    company: string;
    useCase: string;
    photoSources: string[];
    notifications: boolean;
  };
  onComplete: () => void;
  isCompleting: boolean;
}

const features = [
  {
    icon: Camera,
    title: "AI-Powered Renaming",
    description: "Automatically rename photos based on content analysis"
  },
  {
    icon: Zap,
    title: "Batch Processing",
    description: "Process hundreds of photos at once"
  },
  {
    icon: Shield,
    title: "Secure Storage",
    description: "Your photos are encrypted and protected"
  },
  {
    icon: Users,
    title: "Collaboration Tools",
    description: "Share and organize with your team"
  }
];

export default function CompletionStep({ formData, onComplete, isCompleting }: CompletionStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">You're all set, {formData.fullName}! 🎉</h2>
        <p className="text-muted-foreground">
          Welcome to PhotoRenamer. Here's what you can do now:
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="border-border/50">
              <CardContent className="p-4 flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">Your setup summary:</h3>
          <div className="space-y-2 text-sm">
            {formData.useCase && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Primary use case:</span>
                <Badge variant="secondary">{formData.useCase}</Badge>
              </div>
            )}
            {formData.photoSources.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Photo sources:</span>
                <span className="text-xs">{formData.photoSources.length} selected</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Notifications:</span>
              <Badge variant={formData.notifications ? "default" : "secondary"}>
                {formData.notifications ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complete Button */}
      <div className="text-center">
        <Button 
          size="lg" 
          onClick={onComplete}
          disabled={isCompleting}
          className="w-full md:w-auto px-8"
        >
          {isCompleting ? "Setting up your account..." : "Start using PhotoRenamer"}
        </Button>
      </div>
    </div>
  );
}