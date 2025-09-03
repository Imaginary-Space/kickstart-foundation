import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import OnboardingStep from "./OnboardingStep";
import NameStep from "./NameStep";
import BirthdayStep from "./BirthdayStep";
import UseCaseStep from "./UseCaseStep";

export interface OnboardingData {
  full_name: string;
  birthday: string;
  use_cases: string[];
}

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    full_name: "",
    birthday: "",
    use_cases: [],
  });
  
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          onboarding_data: data as any,
          onboarding_completed: true,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to save onboarding data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Welcome!",
        description: "Your profile has been set up successfully.",
      });

      // Refresh profile data to trigger realtime update
      await refreshProfile();
      
      // The realtime subscription in AuthContext will handle navigation
      // via ProtectedRoute when onboarding_completed becomes true
    } catch (error) {
      console.error('Error in handleComplete:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <NameStep
            value={data.full_name}
            onChange={(value) => updateData('full_name', value)}
          />
        );
      case 2:
        return (
          <BirthdayStep
            value={data.birthday}
            onChange={(value) => updateData('birthday', value)}
          />
        );
      case 3:
        return (
          <UseCaseStep
            value={data.use_cases}
            onChange={(value) => updateData('use_cases', value)}
          />
        );
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return data.full_name.trim().length > 0;
      case 2:
        return data.birthday.length > 0;
      case 3:
        return data.use_cases.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-colors ${
                  step <= currentStep
                    ? 'bg-primary'
                    : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Step {currentStep} of 3
          </p>
        </div>

        <OnboardingStep
          currentStep={currentStep}
          totalSteps={3}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isValid={isStepValid()}
          isSubmitting={isSubmitting}
          isLastStep={currentStep === 3}
        >
          {getStepComponent()}
        </OnboardingStep>
      </div>
    </div>
  );
};

export default OnboardingFlow;