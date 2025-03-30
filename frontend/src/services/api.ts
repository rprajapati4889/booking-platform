import axios from "axios";
import { Booking, BookingFormData, BookingApiResponse } from "@/types/booking";

const BASE_URL = "http://localhost:5001/api";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  signup: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    const response = await api.post("/auth/signup", data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post("/auth/login", data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};

// Booking API
export const bookingApi = {
  createBooking: async (data: BookingFormData): Promise<Booking> => {
    const response = await api.post("/bookings", data);
    const booking = response.data.booking;
    return {
      ...booking,
      bookingDate: new Date(booking.bookingDate),
      createdAt: new Date(booking.createdAt),
    };
  },

  getBookings: async (): Promise<Booking[]> => {
    console.log('API: Fetching bookings...');
    const response = await api.get("/bookings");
    console.log('API: Raw response:', response.data);
    
    // Check if response.data is an array directly
    const bookingsData = Array.isArray(response.data) ? response.data : response.data.bookings;
    
    if (!Array.isArray(bookingsData)) {
      console.error('API: Invalid response format:', response.data);
      return [];
    }

    const bookings = bookingsData.map((booking: BookingApiResponse) => ({
      id: booking.id,
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      bookingDate: new Date(booking.booking_date),
      bookingType: booking.booking_type,
      bookingSlot: booking.booking_slot,
      bookingTime: booking.booking_time,
      userId: booking.user_id,
      createdAt: new Date(booking.created_at)
    }));
    console.log('API: Transformed bookings:', bookings);
    return bookings;
  },

  deleteBooking: async (id: string): Promise<void> => {
    console.log('API: Deleting booking with ID:', id);
    try {
      const response = await api.delete(`/bookings/${id}`);
      console.log('API: Delete response:', response);
    } catch (error) {
      console.error('API: Delete booking error:', error);
      throw error;
    }
  },
};

// Error handler
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data.error || "An error occurred";
    if (error.response.status === 401) {
      // Unauthorized - clear local storage
      authApi.logout();
    }
    return message;
  } else if (error.request) {
    // Request made but no response
    return "No response from server";
  } else {
    // Other errors
    return error.message || "An error occurred";
  }
};
