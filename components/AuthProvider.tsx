import React, { createContext, useContext, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface AuthContextType {
  user: any;
  isGuest: boolean;
  isAuthenticated: boolean;
  canSaveFavorites: boolean;
  canCreateLists: boolean;
  canGetRecommendations: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isGuest: true,
  isAuthenticated: false,
  canSaveFavorites: false,
  canCreateLists: false,
  canGetRecommendations: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();

  const isAuthenticated = !!session;
  const isGuest = !session;
  
  // المزايا المتاحة للمستخدمين المسجلين فقط
  const canSaveFavorites = isAuthenticated;
  const canCreateLists = isAuthenticated;
  const canGetRecommendations = isAuthenticated;

  const value: AuthContextType = {
    user: session?.user || null,
    isGuest,
    isAuthenticated,
    canSaveFavorites,
    canCreateLists,
    canGetRecommendations,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;