import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: Request) {
  try {
    const { title, expireDate } = await req.json();

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: {
        summary: title,
        start: { dateTime: new Date().toISOString(), timeZone: 'Asia/Colombo' },
        end: { dateTime: new Date(expireDate).toISOString(), timeZone: 'Asia/Colombo' },
        conferenceData: {
          createRequest: {
            requestId: `lms-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      },
    });

    return NextResponse.json({
      meetingLink: response.data.hangoutLink,
      googleEventId: response.data.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Meet Creation Failed" }, { status: 500 });
  }
}