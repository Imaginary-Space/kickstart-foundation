import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface OnboardingStepProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isValid: boolean;
  isSubmitting: boolean;
  isLastStep: boolean;
}

const OnboardingStep = ({
  children,
  currentStep,
  onNext,
  onPrevious,
  isValid,
  isSubmitting,
  isLastStep,
}: OnboardingStepProps) => {
  return (
    <Card className="border-0 shadow-elegant">
      <CardContent className="p-8">
        <div className="space-y-6">
          {children}
          
          <div className="flex justify-between pt-4">
            <Button
              variant="ghost"
              onClick={onPrevious}
              disabled={currentStep === 1 || isSubmitting}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <Button
              onClick={onNext}
              disabled={!isValid || isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                "Saving..."
              ) : isLastStep ? (
                "Complete"
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingStep;