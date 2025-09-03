import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface NameStepProps {
  value: string;
  onChange: (value: string) => void;
}

const NameStep = ({ value, onChange }: NameStepProps) => {
  return (
    <div className="text-center space-y-6">
      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
        <User className="w-6 h-6 text-primary-foreground" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-2">What's your name?</h2>
        <p className="text-muted-foreground">
          Help us personalize your experience
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Enter your full name"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-center"
          autoFocus
        />
      </div>
    </div>
  );
};

export default NameStep;