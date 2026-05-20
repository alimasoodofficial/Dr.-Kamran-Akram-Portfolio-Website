// googleapis is dynamically imported inside createGoogleMeet to prevent compile-time bottleneck

/**
 * This utility handles meeting link generation for Zoom and Google Meet.
 */

// Google OAuth2 Client Setup
const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI && process.env.GOOGLE_REDIRECT_URI !== 'your_google_redirect_uri'
    ? process.env.GOOGLE_REDIRECT_URI
    : 'http://localhost:3000';

/**
 * Gets a Zoom Access Token using Server-to-Server OAuth
 */
async function getZoomAccessToken() {
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;

  if (!accountId || !clientId || !clientSecret) {
    throw new Error('Zoom credentials missing');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Zoom Token Error: ${data.reason || data.message || 'Unknown error'}`);
  }

  return data.access_token;
}

/**
 * Creates a Zoom Meeting
 */
async function createZoomMeeting(details: { topic: string; startTime: string; duration: number }) {
  const token = await getZoomAccessToken();

  const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic: details.topic,
      type: 2, // Scheduled meeting
      start_time: details.startTime, // Should be ISO 8601 format
      duration: details.duration,
      timezone: 'UTC',
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: true,
        mute_upon_entry: true,
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Zoom Meeting Creation Error: ${data.message || 'Unknown error'}`);
  }

  return data.join_url;
}

/**
 * Creates a Google Meet via Google Calendar API
 */
async function createGoogleMeet(details: { topic: string; startTime: string; duration: number; userEmail?: string }) {
  console.log('Creating Google Meet with details:', details);

  // 1. Validate environment
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.error('Missing Google Environment Variables:', {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      hasRefreshToken: !!refreshToken
    });
    throw new Error('Google environment variables are missing');
  }

  // 2. Setup Auth & Service inside function to ensure fresh environment
  console.log('Using Redirect URI:', GOOGLE_REDIRECT_URI);
  const { google } = await import('googleapis');
  const oauth2 = new google.auth.OAuth2(clientId, clientSecret, GOOGLE_REDIRECT_URI);
  oauth2.setCredentials({ refresh_token: refreshToken });
  const googleCalendar = google.calendar({ version: 'v3', auth: oauth2 });

  // 3. Verify Authentication
  try {
    console.log('Verifying Google Authentication with Client ID:', clientId.substring(0, 10) + '...');
    const { token } = await oauth2.getAccessToken();
    if (!token) {
      throw new Error('Failed to obtain Google Access Token. Refresh token might be invalid.');
    }
  } catch (authError: any) {
    console.error('Google Auth Error:', authError.message);
    throw new Error(`Google Authentication Failed: ${authError.message}`);
  }

  // 4. Prepare Dates
  const start = new Date(details.startTime);
  if (isNaN(start.getTime())) {
    throw new Error(`Invalid start time provided: ${details.startTime}`);
  }
  const end = new Date(start.getTime() + details.duration * 60000);

  // 5. Construct Event
  const event: any = {
    summary: details.topic,
    description: 'Consultation -',
    start: {
      dateTime: start.toISOString(),
      timeZone: 'UTC',
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: 'UTC',
    },
    conferenceData: {
      createRequest: {
        requestId: Math.random().toString(36).substring(2, 15),
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  };

  if (details.userEmail) {
    event.attendees = [{ email: details.userEmail }];
  }

  try {
    console.log('Inserting Google Calendar event...');
    const res = await googleCalendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
    });

    // Extract Google Meet link
    let meetLink = res.data.hangoutLink;

    if (!meetLink && res.data.conferenceData?.entryPoints) {
      const videoEntryPoint = res.data.conferenceData.entryPoints.find(
        (ep: any) => ep.entryPointType === 'video'
      );
      meetLink = videoEntryPoint?.uri;
    }

    if (!meetLink) {
      console.warn('Google Meet link (hangoutLink) not found in response');
      // If we still don't have a meet link, but we have an htmlLink, use that as last resort
    }

    const link = meetLink || res.data.htmlLink || '';
    console.log('Google Meet link generated:', link);
    return link;
  } catch (error: any) {
    console.error('Detailed Google Meet API Error:', {
      message: error.message,
      data: error.response?.data
    });
    throw new Error(`Google Meet API Error: ${error.message}`);
  }
}

export async function generateMeetingLink(
  platform: 'Zoom' | 'Google Meet' | 'Meeting',
  details: {
    topic: string;
    startTime: string;
    duration: number;
    userEmail?: string;
  }
) {
  console.log(`Generating meeting link for ${platform}...`);

  try {
    if (platform === 'Zoom') {
      return await createZoomMeeting(details);
    } else if (platform === 'Google Meet') {
      return await createGoogleMeet(details);
    }
  } catch (error) {
    console.error(`Failed to generate ${platform} link:`, error);
    // Fallback to a default link if API fails, so the booking isn't completely broken
    return "https://veltolabs.com/meeting-fallback";
  }

  return 'https://veltolabs.com/meeting';
}
