import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { AuthState, LoginData, SignUpData, User } from '@/types/auth';
import { authApi, handleApiError } from '@/services/api';

// Initial auth state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null
};

// Auth action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAIL'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
        error: null
      };
    case 'AUTH_FAIL':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Create auth context
interface AuthContextProps {
  authState: AuthState;
  signUp: (data: SignUpData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);
  const { toast } = useToast();

  // Check for token and user on initial load
  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (user) {
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    }
  }, []);

  // Sign up function
  const signUp = async (data: SignUpData): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      await authApi.signup(data);
      
      toast({
        title: 'Registration Successful',
        description: 'Please check your email to verify your account',
        variant: 'default'
      });
      
      // Clear the state after successful registration
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      const message = handleApiError(error);
      
      dispatch({
        type: 'AUTH_FAIL',
        payload: message
      });
      
      toast({
        title: 'Registration Failed',
        description: message,
        variant: 'destructive'
      });
    }
  };

  // Login function
  const login = async (data: LoginData): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const result = await authApi.login(data);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: result.user
      });
      
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
        variant: 'default'
      });
    } catch (error) {
      const message = handleApiError(error);
      
      dispatch({
        type: 'AUTH_FAIL',
        payload: message
      });
      
      toast({
        title: 'Login Failed',
        description: message,
        variant: 'destructive'
      });
    }
  };

  // Logout function
  const logout = () => {
    authApi.logout();
    dispatch({ type: 'LOGOUT' });
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully',
      variant: 'default'
    });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{
      authState,
      signUp,
      login,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Auth context hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
