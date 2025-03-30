
import React from 'react';
import EmailVerification from '@/components/auth/EmailVerification';
import Navbar from '@/components/layout/Navbar';

const VerifyEmailPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <EmailVerification />
      </main>
    </div>
  );
};

export default VerifyEmailPage;
