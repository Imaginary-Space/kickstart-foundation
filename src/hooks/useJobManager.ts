import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export interface Job {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalItems: number;
  processedItems: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  errorMessage?: string;
  inputData: any;
  outputData: any;
  duration?: number;
  estimatedTimeRemaining?: number;
}

export const useJobManager = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  // Fetch all jobs for the user
  const jobsQuery = useQuery({
    queryKey: ['jobs', user?.id],
    queryFn: async () => {
      if (!user || !session) return [];

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!(user && session),
    refetchInterval: 2000 // Refresh every 2 seconds to catch job updates
  });

  // Get specific job status
  const getJobStatus = useCallback(async (jobId: string): Promise<Job | null> => {
    if (!session?.access_token) return null;

    try {
      const { data, error } = await supabase.functions.invoke('get-job-status', {
        body: {},
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      return data.job;
    } catch (error) {
      console.error('Error fetching job status:', error);
      return null;
    }
  }, [session?.access_token]);

  // Start batch analysis job
  const startBatchAnalysis = useMutation({
    mutationFn: async ({ 
      photoIds, 
      analysisOptions 
    }: { 
      photoIds: string[], 
      analysisOptions?: any 
    }) => {
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('start-batch-job', {
        body: { photoIds, analysisOptions },
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis Started",
        description: `Batch analysis started for your photos. Job ID: ${data.jobId}`,
      });
      setActiveJobId(data.jobId);
      queryClient.invalidateQueries({ queryKey: ['jobs', user?.id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to start batch analysis: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Real-time job updates via Supabase realtime
  useEffect(() => {
    if (!user) return;

    console.log('Setting up realtime subscription for jobs');
    
    const channel = supabase
      .channel('job-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobs',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Job update received:', payload);
          
          // Invalidate and refetch jobs
          queryClient.invalidateQueries({ queryKey: ['jobs', user.id] });
          
          // Show completion notifications
          if (payload.eventType === 'UPDATE' && payload.new) {
            const job = payload.new as any;
            
            if (job.status === 'completed') {
              toast({
                title: "Analysis Complete",
                description: `Batch analysis completed successfully! Processed ${job.processed_items} photos.`,
              });
              setActiveJobId(null);
            } else if (job.status === 'failed') {
              toast({
                title: "Analysis Failed",
                description: job.error_message || "Batch analysis failed. Please try again.",
                variant: "destructive",
              });
              setActiveJobId(null);
            }
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [user, queryClient, toast]);

  // Helper functions
  const getActiveJob = useCallback(() => {
    return jobsQuery.data?.find(job => 
      job.status === 'pending' || job.status === 'processing'
    );
  }, [jobsQuery.data]);

  const getCompletedJobs = useCallback(() => {
    return jobsQuery.data?.filter(job => 
      job.status === 'completed'
    ) || [];
  }, [jobsQuery.data]);

  const getFailedJobs = useCallback(() => {
    return jobsQuery.data?.filter(job => 
      job.status === 'failed'
    ) || [];
  }, [jobsQuery.data]);

  const hasActiveJob = useCallback(() => {
    return !!getActiveJob();
  }, [getActiveJob]);

  return {
    // Data
    jobs: jobsQuery.data || [],
    activeJob: getActiveJob(),
    activeJobId,
    completedJobs: getCompletedJobs(),
    failedJobs: getFailedJobs(),
    
    // States
    isLoading: jobsQuery.isLoading,
    isStartingJob: startBatchAnalysis.isPending,
    hasActiveJob: hasActiveJob(),
    
    // Actions
    startBatchAnalysis: startBatchAnalysis.mutate,
    getJobStatus,
    
    // Helpers
    refetchJobs: () => queryClient.invalidateQueries({ queryKey: ['jobs', user?.id] })
  };
};