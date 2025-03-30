import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Booking, BookingFormData, BookingApiResponse } from '@/types/booking';
import { useAuth } from './AuthContext';
import { bookingApi, handleApiError } from '@/services/api';

// API URL
const API_URL = 'http://localhost:5001/api';

// Transform API response to Booking type
const transformBookingData = (data: BookingApiResponse): Booking => ({
  id: data.id || 0,
  customerName: data.customer_name || 'Unknown Customer',
  customerEmail: data.customer_email || 'No email provided',
  bookingDate: data.booking_date ? new Date(data.booking_date) : new Date(),
  bookingType: data.booking_type || 'Custom',
  bookingSlot: data.booking_slot || null,
  bookingTime: data.booking_time || '',
  userId: data.user_id || 0,
  createdAt: data.created_at ? new Date(data.created_at) : new Date()
});

// Booking state interface
interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
}

// Initial booking state
const initialState: BookingState = {
  bookings: [],
  isLoading: false,
  error: null,
  initialized: false
};

// Booking action types
type BookingAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Booking[] }
  | { type: 'FETCH_FAIL'; payload: string }
  | { type: 'ADD_SUCCESS'; payload: Booking }
  | { type: 'DELETE_SUCCESS'; payload: number }
  | { type: 'SET_INITIALIZED' }
  | { type: 'CLEAR_ERROR' };

// Booking reducer
const bookingReducer = (state: BookingState, action: BookingAction): BookingState => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        bookings: action.payload,
        isLoading: false,
        error: null
      };
    case 'FETCH_FAIL':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case 'ADD_SUCCESS':
      return {
        ...state,
        bookings: [action.payload, ...state.bookings],
        isLoading: false,
        error: null
      };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        bookings: state.bookings.filter(booking => booking.id !== action.payload),
        isLoading: false,
        error: null
      };
    case 'SET_INITIALIZED':
      return {
        ...state,
        initialized: true
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

// Create booking context
interface BookingContextProps {
  bookingState: BookingState;
  fetchBookings: () => Promise<void>;
  addBooking: (data: BookingFormData) => Promise<void>;
  deleteBooking: (id: number) => Promise<void>;
  clearError: () => void;
}

const BookingContext = createContext<BookingContextProps | undefined>(undefined);

// Booking provider component
interface BookingProviderProps {
  children: React.ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookingState, dispatch] = useReducer(bookingReducer, initialState);
  const { authState } = useAuth();
  const { toast } = useToast();

  // Fetch bookings
  const fetchBookings = useCallback(async (): Promise<void> => {
    if (!authState.isAuthenticated) return;
    
    console.log('Fetching bookings...');
    dispatch({ type: 'FETCH_START' });
    
    try {
      const response = await bookingApi.getBookings();
      console.log('API Response:', response);
      
      if (!Array.isArray(response)) {
        throw new Error('Invalid response format from API');
      }
      
      dispatch({
        type: 'FETCH_SUCCESS',
        payload: response
      });
      console.log('State updated with bookings:', response);
    } catch (error) {
      console.error('Fetch bookings error:', error);
      const message = handleApiError(error);
      dispatch({
        type: 'FETCH_FAIL',
        payload: message
      });
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
    } finally {
      if (!bookingState.initialized) {
        dispatch({ type: 'SET_INITIALIZED' });
      }
    }
  }, [authState.isAuthenticated, bookingState.initialized, toast]);

  // Add effect to log state changes
  useEffect(() => {
    console.log('BookingState changed:', bookingState);
  }, [bookingState]);

  // Initial fetch when authenticated
  useEffect(() => {
    if (authState.isAuthenticated && !bookingState.initialized) {
      fetchBookings();
    }
  }, [authState.isAuthenticated, bookingState.initialized, fetchBookings]);

  // Add booking
  const addBooking = useCallback(async (data: BookingFormData): Promise<void> => {
    if (!authState.isAuthenticated) return;
    
    dispatch({ type: 'FETCH_START' });
    
    try {
      const response = await bookingApi.createBooking(data);
      dispatch({
        type: 'ADD_SUCCESS',
        payload: response
      });
      toast({
        title: 'Success',
        description: 'Booking created successfully',
        variant: 'default'
      });
    } catch (error) {
      const message = handleApiError(error);
      dispatch({
        type: 'FETCH_FAIL',
        payload: message
      });
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
    }
  }, [authState.isAuthenticated, toast]);

  // Delete booking
  const deleteBooking = useCallback(async (id: number): Promise<void> => {
    if (!authState.isAuthenticated) return;
    
    console.log('Delete booking called with ID:', id);
    dispatch({ type: 'FETCH_START' });
    
    try {
      console.log('Calling API with ID:', id.toString());
      await bookingApi.deleteBooking(id.toString());
      console.log('API call successful');
      dispatch({
        type: 'DELETE_SUCCESS',
        payload: id
      });
      toast({
        title: 'Success',
        description: 'Booking deleted successfully',
        variant: 'default'
      });
    } catch (error) {
      console.error('Delete booking error:', error);
      const message = handleApiError(error);
      dispatch({
        type: 'FETCH_FAIL',
        payload: message
      });
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
    }
  }, [authState.isAuthenticated, toast]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return (
    <BookingContext.Provider value={{
      bookingState,
      fetchBookings,
      addBooking,
      deleteBooking,
      clearError
    }}>
      {children}
    </BookingContext.Provider>
  );
};

// Booking context hook
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
