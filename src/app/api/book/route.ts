import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendUserConfirmation, sendAdminNotification } from '@/lib/email';

import { CreateBookingRequest, CreateBookingResponse, GetBookingsResponse } from '@/types/booking';

export async function POST(request: NextRequest) {
  try {
    const body: CreateBookingRequest = await request.json();
    const { slotId, userName, userEmail, notes, timezone } = body;

    // Validate required fields
    if (!slotId || !userName || !userEmail || !timezone) {
      return NextResponse.json(
        { error: 'Missing required fields: slotId, userName, userEmail, timezone' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(userEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Step 1: Check if the slot exists and is not already booked
    const { data: slot, error: slotError } = await supabaseAdmin
      .from('time_slots')
      .select('*')
      .eq('id', slotId)
      .single();

    if (slotError || !slot) {
      return NextResponse.json(
        { error: 'Time slot not found' },
        { status: 404 }
      );
    }

    if (slot.is_booked) {
      return NextResponse.json(
        { error: 'This time slot is already booked. Please select another slot.' },
        { status: 409 }
      );
    }

    // Step 2: Update the time_slots table to mark as booked
    const { error: updateError } = await supabaseAdmin
      .from('time_slots')
      .update({ is_booked: true })
      .eq('id', slotId)
      .eq('is_booked', false); // Double-check it's still not booked (race condition prevention)

    if (updateError) {
      console.error('Error updating time slot:', updateError);
      return NextResponse.json(
        { error: 'Failed to update time slot. Please try again.' },
        { status: 500 }
      );
    }

    // Step 3: Insert booking into the bookings table
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        slot_id: slotId,
        user_name: userName,
        user_email: userEmail,
        timezone: timezone,
        notes: notes || null,
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      
      // Rollback: Mark the slot as available again
      await supabaseAdmin
        .from('time_slots')
        .update({ is_booked: false })
        .eq('id', slotId);

      return NextResponse.json(
        { error: 'Failed to create booking. Please try again.' },
        { status: 500 }
      );
    }

    // Step 4: Send emails (don't block the response on email sending)
    const emailData = {
      userName,
      userEmail,
      timezone,
      startTime: slot.start_time,
      endTime: slot.end_time,
      notes,
    };

    // Send emails asynchronously (fire and forget)
    Promise.all([
      sendUserConfirmation(emailData).catch(err => 
        console.error('Failed to send user confirmation email:', err)
      ),
      sendAdminNotification(emailData).catch(err => 
        console.error('Failed to send admin notification email:', err)
      ),
    ]);

    // Return success response immediately
    return NextResponse.json(
      {
        success: true,
        message: 'Booking created successfully',
        booking: {
          id: booking.id,
          slotId: booking.slot_id,
          userName: booking.user_name,
          userEmail: booking.user_email,
          timezone: booking.timezone,
          notes: booking.notes,
          startTime: slot.start_time,
          endTime: slot.end_time,
          createdAt: booking.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error in booking API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to fetch bookings (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        time_slots (
          start_time,
          end_time
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      bookings,
      count: bookings.length,
    });
  } catch (error) {
    console.error('Unexpected error in GET bookings:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
