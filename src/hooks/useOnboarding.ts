import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OnboardingData {
  fullName: string;
  jobTitle: string;
  company: string;
  useCase: string;
  photoSources: string[];
  notifications: boolean;
  avatarUrl: string;
}

export const useOnboarding = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const saveOnboardingData = async (data: OnboardingData) => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          avatar_url: data.avatarUrl,
          onboarding_data: {
            jobTitle: data.jobTitle,
            company: data.company,
            useCase: data.useCase,
            photoSources: data.photoSources,
            notifications: data.notifications,
            completedAt: new Date().toISOString()
          }
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success('Profile information saved');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      toast.error('Failed to save profile information');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success('Welcome to PhotoRenamer! 🎉');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete setup');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveOnboardingData,
    completeOnboarding,
    isLoading
  };
};