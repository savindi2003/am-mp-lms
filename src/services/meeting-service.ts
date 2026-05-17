import { google } from 'googleapis';
import { getGoogleAuthClient } from '@/lib/googleCalendar';

export interface MeetingData {
  meetingLink: string;
  googleEventId: string;
}

export async function createGoogleMeeting(title: string, expireDate: string): Promise<MeetingData> {
  try {
    
    const auth = getGoogleAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });

    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: {
        summary: title,
        description: 'LMS Class Session',
        start: { 
          dateTime: new Date().toISOString(), 
          timeZone: 'Asia/Colombo' 
        },
        end: { 
          dateTime: new Date(expireDate).toISOString(), 
          timeZone: 'Asia/Colombo' 
        },
        conferenceData: {
          createRequest: {
            requestId: `lms-class-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      },
    });

    const meetingLink = response.data.hangoutLink;
    const googleEventId = response.data.id;

    if (!meetingLink || !googleEventId) {
      throw new Error('Could not generate meeting link');
    }

    return { meetingLink, googleEventId };
  } catch (error) {
    console.error('Error in createGoogleMeeting:', error);
    throw error;
  }
}

export async function addStudentToClass(googleEventId: string, studentEmail: string) {
  try {
    const auth = getGoogleAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });

    
    // denata e event eke inna student list eka gnna
    const event = await calendar.events.get({
      calendarId: 'primary',
      eventId: googleEventId,
    });

    const currentAttendees = event.data.attendees || [];

    // 2. student already innavada balanna
    const isAlreadyAdded = currentAttendees.some(attendee => attendee.email === studentEmail);

    if (isAlreadyAdded) {
      return { success: true, message: 'Student already in guest list' };
    }

    // 3. add new student
    const updatedAttendees = [...currentAttendees, { email: studentEmail }];

    // 4. Google Calendar eka update karanna
    await calendar.events.patch({
      calendarId: 'primary',
      eventId: googleEventId,
      sendUpdates: 'all', // meken student ta email ekak yanava
      requestBody: {
        attendees: updatedAttendees,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error adding student to Google Event:', error);
    throw error;
  }
}

export async function removeStudentFromClass(
  googleEventId: string,
  studentEmail: string
) {
  try {
    const auth = getGoogleAuthClient();
    const calendar = google.calendar({ version: "v3", auth });

    const event = await calendar.events.get({
      calendarId: "primary",
      eventId: googleEventId,
    });

    const currentAttendees = event.data.attendees || [];

    const updatedAttendees = currentAttendees.filter(
      (a) => a.email !== studentEmail
    );

    await calendar.events.patch({
      calendarId: "primary",
      eventId: googleEventId,
      sendUpdates: "none",
      requestBody: {
        attendees: updatedAttendees,
      },
    });

    return { success: true };
  } catch (err) {
    console.error("Remove from Google Meet error:", err);
    throw err;
  }
}