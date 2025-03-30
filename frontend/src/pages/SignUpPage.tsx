
import React from 'react';
import { Navigate } from 'react-router-dom';
import SignUpForm from '@/components/auth/SignUpForm';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';

const SignUpPage: React.FC = () => {
  const { authState } = useAuth();
  
  if (authState.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <SignUpForm />
      </main>
    </div>
  );
};

export default SignUpPage;
