
import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { authState } = useAuth();
  
  if (authState.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <LoginForm />
      </main>
    </div>
  );
};

export default LoginPage;
