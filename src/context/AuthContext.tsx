
import { createContext, useState, useEffect, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  userRole: 'parent' | 'professional' | 'admin' | null;
  userProfile: any | null;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  isProfileLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  userRole: null,
  userProfile: null,
  signOut: async () => {},
  signInWithGoogle: async () => {},
  updateProfile: async () => {},
  isProfileLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'parent' | 'professional' | 'admin' | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // Fetch user profile data from profiles table
  const fetchUserProfile = async (userId: string) => {
    try {
      setIsProfileLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      if (data) {
        setUserProfile(data);
        setUserRole(data.user_role || 'parent');
        console.log("Fetched user profile:", data);
      }
    } catch (error) {
      console.error("Error fetching user profile", error);
    } finally {
      setIsProfileLoading(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change:", event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // If user is authenticated, fetch their profile
        if (session?.user) {
          // Use setTimeout to avoid blocking the onAuthStateChange callback
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUserProfile(null);
          setUserRole(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // If user is authenticated, fetch their profile
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserProfile(null);
    setUserRole(null);
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
  };

  // Update user profile - fixed return type
  const updateProfile = async (data: any): Promise<void> => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Refetch profile to get latest data
      await fetchUserProfile(user.id);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      userRole,
      userProfile,
      signOut, 
      signInWithGoogle,
      updateProfile,
      isProfileLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
