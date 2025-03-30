
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    if (authState.isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col">
        <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-sky-100">
          <div className="container grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Simplified Reservations for Everyone
              </h1>
              <p className="text-lg text-gray-600 max-w-md">
                Easily manage your bookings with our intuitive reservation system.
                Perfect for small businesses and individuals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={handleGetStarted}>
                  Get Started
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
                  {authState.isAuthenticated ? 'Dashboard' : 'Log In'}
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-4">
                  <div className="h-8 w-40 bg-primary/10 rounded-md"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                    <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-12 bg-blue-50 rounded"></div>
                    <div className="h-12 bg-blue-50 rounded"></div>
                  </div>
                  <div className="h-12 w-full bg-primary/80 rounded-md"></div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 h-40 w-40 bg-secondary/20 rounded-full -z-10"></div>
              <div className="absolute -top-6 -right-6 h-24 w-24 bg-primary/20 rounded-full -z-10"></div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-6 rounded-xl">
                <div className="bg-primary/20 h-12 w-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Create an Account</h3>
                <p className="text-gray-600">Sign up and verify your email to get started with Booking Platform.</p>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-xl">
                <div className="bg-primary/20 h-12 w-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Make Reservations</h3>
                <p className="text-gray-600">Create full day, half day, or custom bookings with ease.</p>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-xl">
                <div className="bg-primary/20 h-12 w-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Manage Your Bookings</h3>
                <p className="text-gray-600">View all your reservations in one place, organized and accessible.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-100 py-8">
        <div className="container text-center">
          <p className="text-gray-600">© 2023 Booking Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
