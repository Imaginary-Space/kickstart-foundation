import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { useAuth } from './AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

interface ImpersonationContextType {
  isImpersonating: boolean;
  impersonatedUser: User | null;
  realAdminUser: User | null;
  startImpersonation: (user: User) => void;
  stopImpersonation: () => void;
  getEffectiveUser: () => User | null;
  getEffectiveUserId: () => string | null;
}

const ImpersonationContext = createContext<ImpersonationContextType | undefined>(undefined);

export const useImpersonation = () => {
  const context = useContext(ImpersonationContext);
  if (!context) {
    throw new Error('useImpersonation must be used within an ImpersonationProvider');
  }
  return context;
};

interface ImpersonationProviderProps {
  children: ReactNode;
}

export const ImpersonationProvider = ({ children }: ImpersonationProviderProps) => {
  const { user: authUser } = useAuth();
  const { isAdmin } = useUserRole();
  const [impersonatedUser, setImpersonatedUser] = useState<User | null>(null);
  const [realAdminUser, setRealAdminUser] = useState<User | null>(null);

  const startImpersonation = (user: User) => {
    if (!isAdmin() || !authUser) {
      console.error('Only admins can impersonate users');
      return;
    }
    
    setRealAdminUser(authUser);
    setImpersonatedUser(user);
  };

  const stopImpersonation = () => {
    setImpersonatedUser(null);
    setRealAdminUser(null);
  };

  const getEffectiveUser = (): User | null => {
    return impersonatedUser || authUser;
  };

  const getEffectiveUserId = (): string | null => {
    return getEffectiveUser()?.id || null;
  };

  const isImpersonating = !!impersonatedUser && !!realAdminUser;

  return (
    <ImpersonationContext.Provider
      value={{
        isImpersonating,
        impersonatedUser,
        realAdminUser,
        startImpersonation,
        stopImpersonation,
        getEffectiveUser,
        getEffectiveUserId,
      }}
    >
      {children}
    </ImpersonationContext.Provider>
  );
};