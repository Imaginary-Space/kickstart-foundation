import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserCog, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useImpersonation } from '@/contexts/ImpersonationContext';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from 'sonner';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
}

export const UserImpersonationDropdown = () => {
  const { isAdmin } = useUserRole();
  const { startImpersonation, stopImpersonation, isImpersonating, impersonatedUser } = useImpersonation();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const fetchProfiles = useCallback(async () => {
    if (loading || hasLoadedOnce) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .order('email');

      if (error) {
        console.error('Error fetching profiles:', error);
        toast.error('Failed to load users');
        return;
      }

      setProfiles(data || []);
      setHasLoadedOnce(true);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [loading, hasLoadedOnce]);

  useEffect(() => {
    if (isAdmin() && !hasLoadedOnce && !loading) {
      fetchProfiles();
    }
  }, [isAdmin, fetchProfiles, hasLoadedOnce, loading]);

  const handleImpersonate = (profile: Profile) => {
    console.log('Starting impersonation for:', profile.email);
    
    try {
      // Create a minimal user object that matches Supabase User interface
      const mockUser = {
        id: profile.id,
        email: profile.email || '',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: new Date().toISOString(),
        email_confirmed_at: '2024-01-01T00:00:00.000Z',
        last_sign_in_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: { full_name: profile.full_name },
        aud: 'authenticated' as const,
        confirmation_sent_at: null,
        recovery_sent_at: null,
        email_change_sent_at: null,
        new_email: null,
        invited_at: null,
        action_link: null,
        email_change: null,
        email_change_confirm_status: 0,
        banned_until: null,
        identities: [],
        factors: [],
        role: 'authenticated' as const,
        phone: null,
        phone_confirmed_at: null,
        phone_change: null,
        phone_change_token: null,
        phone_change_sent_at: null,
        confirmed_at: '2024-01-01T00:00:00.000Z',
        email_change_token_new: null,
        email_change_token_current: null,
        is_anonymous: false
      };
      
      console.log('Created mock user:', mockUser);
      startImpersonation(mockUser);
      toast.success(`Now impersonating ${profile.email}`);
    } catch (error) {
      console.error('Error during impersonation:', error);
      toast.error('Failed to start impersonation');
    }
  };

  const handleStopImpersonation = () => {
    console.log('Stopping impersonation');
    try {
      stopImpersonation();
      toast.success('Stopped impersonation');
    } catch (error) {
      console.error('Error stopping impersonation:', error);
      toast.error('Failed to stop impersonation');
    }
  };

  if (!isAdmin()) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={isImpersonating ? "destructive" : "default"} 
          size="sm" 
          className="gap-2"
        >
          {isImpersonating ? <UserCog className="w-4 h-4" /> : <Users className="w-4 h-4" />}
          {isImpersonating ? 'Impersonating' : 'Impersonate'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-background border border-border">
        <DropdownMenuLabel>User Impersonation</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isImpersonating && (
          <>
            <DropdownMenuItem 
              onClick={handleStopImpersonation}
              className="text-destructive"
            >
              Stop Impersonating {impersonatedUser?.email}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        {loading ? (
          <DropdownMenuItem disabled>Loading users...</DropdownMenuItem>
        ) : (
          profiles.map((profile) => (
            <DropdownMenuItem
              key={profile.id}
              onClick={() => handleImpersonate(profile)}
              className="flex flex-col items-start gap-1"
            >
              <span className="font-medium">{profile.email}</span>
              {profile.full_name && (
                <span className="text-xs text-muted-foreground">{profile.full_name}</span>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};