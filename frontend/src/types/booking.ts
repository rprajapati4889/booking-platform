export type BookingType = 'Full Day' | 'Half Day' | 'Custom';
export type BookingSlot = 'First Half' | 'Second Half';

export interface BookingApiResponse {
  id: number;
  user_id: number;
  customer_name: string;
  customer_email: string;
  booking_date: string;
  booking_type: BookingType;
  booking_slot: BookingSlot | null;
  booking_time: string | null;
  created_at: string;
}

export interface Booking {
  id: number;
  customerName: string;
  customerEmail: string;
  bookingDate: Date;
  bookingType: BookingType;
  bookingSlot: BookingSlot | null;
  bookingTime: string | null;
  userId: number;
  createdAt: Date;
}

export interface BookingFormData {
  customerName: string;
  customerEmail: string;
  bookingDate: Date;
  bookingType: BookingType;
  bookingSlot?: BookingSlot;
  bookingTime?: string;
}
