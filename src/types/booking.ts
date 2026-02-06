// Database types
export interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  slot_id: string;
  user_name: string;
  user_email: string;
  timezone: string | null;
  notes: string | null;
  created_at: string;
}

export interface BookingWithSlot extends Booking {
  time_slots: TimeSlot;
}

// API request/response types
export interface CreateBookingRequest {
  slotId: string;
  userName: string;
  userEmail: string;
  timezone: string;
  notes?: string;
}

export interface CreateBookingResponse {
  success: boolean;
  message: string;
  booking?: {
    id: string;
    slotId: string;
    userName: string;
    userEmail: string;
    timezone: string | null;
    notes: string | null;
    startTime: string;
    endTime: string;
    createdAt: string;
  };
  error?: string;
}

export interface GetSlotsResponse {
  success: boolean;
  date: string;
  slots: TimeSlot[];
  count: number;
  error?: string;
}

export interface GetBookingsResponse {
  success: boolean;
  bookings: BookingWithSlot[];
  count: number;
  error?: string;
}

// Email types
export interface BookingEmailData {
  userName: string;
  userEmail: string;
  timezone: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

// Realtime subscription payload types
export interface RealtimeBookingPayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: Booking;
  old: Booking | null;
  schema: string;
  table: string;
}

export interface RealtimeTimeSlotPayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: TimeSlot;
  old: TimeSlot | null;
  schema: string;
  table: string;
}
