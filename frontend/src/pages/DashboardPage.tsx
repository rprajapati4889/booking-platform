
import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { BookingProvider } from '@/contexts/BookingContext';

import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import BookingList from '@/components/booking/BookingList';


const DashboardPage: React.FC = () => {
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
            <header className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Welcome, {authState.user?.firstName}!</h1>
                <p className="text-gray-600">Manage your reservations and create new bookings.</p>
              </div>
              <Button asChild className="flex items-center gap-2">
                <Link to="/booking">
                  <Calendar className="h-4 w-4" />
                  <span>New Booking</span>
                </Link>
              </Button>
            </header>
            
            <Tabs defaultValue="bookings" className="space-y-6">
              <TabsList>
                <TabsTrigger value="bookings">Your Bookings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="bookings">
                <BookingList />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </BookingProvider>
  );
};

export default DashboardPage;
