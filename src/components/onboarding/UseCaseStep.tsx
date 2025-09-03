import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";

interface UseCaseStepProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const useCaseOptions = [
  {
    id: "organizing_photos",
    label: "Organizing personal photos",
    description: "Sort and rename your personal photo collection"
  },
  {
    id: "professional_workflow",
    label: "Professional photography workflow",
    description: "Streamline your professional photo management"
  },
  {
    id: "event_management",
    label: "Event photo management",
    description: "Organize photos from weddings, parties, and events"
  },
  {
    id: "social_media",
    label: "Social media content",
    description: "Prepare photos for social media platforms"
  },
  {
    id: "archive_digitization",
    label: "Archive digitization",
    description: "Organize and rename scanned or old photos"
  }
];

const UseCaseStep = ({ value, onChange }: UseCaseStepProps) => {
  const handleToggle = (optionId: string) => {
    const newValue = value.includes(optionId)
      ? value.filter(id => id !== optionId)
      : [...value, optionId];
    onChange(newValue);
  };

  return (
    <div className="text-center space-y-6">
      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
        <Camera className="w-6 h-6 text-primary-foreground" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-2">What will you use this for?</h2>
        <p className="text-muted-foreground">
          Select all that apply to help us customize your experience
        </p>
      </div>
      
      <div className="space-y-4 text-left">
        {useCaseOptions.map((option) => (
          <div 
            key={option.id}
            className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => handleToggle(option.id)}
          >
            <Checkbox
              id={option.id}
              checked={value.includes(option.id)}
              onChange={() => handleToggle(option.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label 
                htmlFor={option.id} 
                className="font-medium cursor-pointer"
              >
                {option.label}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {option.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UseCaseStep;