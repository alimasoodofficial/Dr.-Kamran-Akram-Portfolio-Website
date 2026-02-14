import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAESTDayRange } from '@/lib/timezone';

import { TimeSlot } from '@/types/booking';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required (format: YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Calculate start and end of the day in Australian Eastern Time
    const { start, end } = getAESTDayRange(date);

    // Fetch available time slots for the specified date
    const { data: slots, error } = await supabase
      .from('time_slots')
      .select('*')
      .gte('start_time', start)
      .lte('start_time', end)
      .eq('is_booked', false)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching time slots:', error);
      return NextResponse.json(
        { error: 'Failed to fetch time slots' },
        { status: 500 }
      );
    }

    // Filter out past slots (only show future slots)
    const now = new Date();
    const availableSlots = (slots as TimeSlot[]).filter(slot => new Date(slot.start_time) > now);

    return NextResponse.json({
      success: true,
      date,
      slots: availableSlots,
      count: availableSlots.length,
    });
  } catch (error) {
    console.error('Unexpected error in slots API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
