
import React from 'react';
import { Navigate } from 'react-router-dom';
import { BookingProvider } from '@/contexts/BookingContext';
import BookingForm from '@/components/booking/BookingForm';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';

const BookingPage: React.FC = () => {
  const { authState } = useAuth();
  
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <BookingProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 py-8">
          <div className="container">
            <header className="mb-8">
              <h1 className="text-3xl font-bold">Book a Reservation</h1>
              <p className="text-gray-600">Fill in the details to make a new reservation.</p>
            </header>
            
            <BookingForm />
          </div>
        </main>
      </div>
    </BookingProvider>
  );
};

export default BookingPage;
