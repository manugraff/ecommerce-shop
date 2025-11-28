import type { User, Session } from '@supabase/supabase-js';
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { customerService } from '../cases/customers/services/customer.service';
import type { CustomerDTO } from '../cases/customers/dtos';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  customerData: CustomerDTO | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshCustomerData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [customerData, setCustomerData] = useState<CustomerDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCustomerData = async (userId: string) => {
    try {
      const customer = await customerService.getBySupabaseId(userId);
      setCustomerData(customer);
    } catch (error) {
      console.error('Failed to load customer data:', error);
      setCustomerData(null);
    }
  };

  useEffect(() => {

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await loadCustomerData(session.user.id);
      }

      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await loadCustomerData(session.user.id);
      } else {
        setCustomerData(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      await loadCustomerData(data.user.id);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    setUser(null);
    setSession(null);
    setCustomerData(null);
  };

  const refreshCustomerData = async () => {
    if (user) {
      await loadCustomerData(user.id);
    }
  };

  const value: AuthContextValue = {
    user,
    session,
    customerData,
    loading,
    signIn,
    signOut,
    refreshCustomerData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}