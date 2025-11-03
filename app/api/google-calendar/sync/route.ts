import { NextRequest, NextResponse } from 'next/server';
import { google, calendar_v3 } from 'googleapis';

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();

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

    // Get events from Google Calendar (today + future 1 year)
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today
    const futureDate = new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 year from now
    
    console.log('📅 Fetching events from Google Calendar...');
    console.log('Date range:', now.toISOString(), 'to', futureDate.toISOString());
    
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: futureDate.toISOString(),
      maxResults: 500, // Increased for 1 year of data
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    console.log(`✅ Found ${events.length} events from Google Calendar`);

    return NextResponse.json({
      success: true,
      events: events.map((event: calendar_v3.Schema$Event) => ({
        id: event.id,
        title: event.summary,
        description: event.description,
        startDate: event.start?.dateTime || event.start?.date,
        endDate: event.end?.dateTime || event.end?.date,
        allDay: !event.start?.dateTime,
      })),
    });
  } catch (error) {
    console.error('Error syncing Google Calendar:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

