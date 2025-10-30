import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
  try {
    const { accessToken, event } = await request.json();

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token required' }, { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Create event in Google Calendar
    const googleEvent = {
      summary: event.title,
      description: event.description,
      start: event.allDay
        ? { date: event.startDate }
        : { dateTime: event.startDate, timeZone: 'UTC' },
      end: event.allDay
        ? { date: event.endDate }
        : { dateTime: event.endDate, timeZone: 'UTC' },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: googleEvent,
    });

    return NextResponse.json({
      success: true,
      eventId: response.data.id,
    });
  } catch (error) {
    console.error('Error adding event to Google Calendar:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

