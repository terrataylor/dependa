import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { to, calendarName, inviterName, calendarId } = await request.json();

    // In a production app, you would use a service like SendGrid, AWS SES, or Resend
    // For now, we'll just log the email details
    const emailContent = {
      to,
      subject: `${inviterName} shared a calendar with you`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>You've been invited to view a calendar</h2>
          <p><strong>${inviterName}</strong> has shared the calendar <strong>"${calendarName}"</strong> with you.</p>
          <p>Click the link below to access the calendar:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard?calendar=${calendarId}" 
             style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            View Calendar
          </a>
          <p style="color: #666; font-size: 14px;">
            If you don't have an account yet, you'll be prompted to sign in with Google.
          </p>
        </div>
      `,
    };

    console.log('Email would be sent:', emailContent);

    // TODO: Integrate with actual email service
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send(emailContent);

    return NextResponse.json({
      success: true,
      message: 'Invitation email sent',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

