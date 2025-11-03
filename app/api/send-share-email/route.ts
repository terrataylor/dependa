import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { to, calendarName, inviterName, calendarId } = await request.json();

    // Check if Nodemailer is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('SMTP configuration is not complete');
      return NextResponse.json({
        error: 'Email service not configured. Please add SMTP settings to your .env.local file.',
      }, { status: 500 });
    }

    // Initialize Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const emailContent = {
      from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      to,
      subject: `${inviterName} shared a calendar with you`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>You've been invited to view a calendar</h2>
          <p><strong>${inviterName}</strong> has shared the calendar <strong>"${calendarName}"</strong> with you.</p>
          <p>Click the link below to access the calendar:</p>
          <a href="${appUrl}/dashboard?calendar=${calendarId}" 
             style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            View Calendar
          </a>
          <p style="color: #666; font-size: 14px;">
            If you don't have an account yet, you'll be prompted to sign in with Google.
          </p>
        </div>
      `,
    };

    console.log('Sending email to:', to);

    const info = await transporter.sendMail(emailContent);

    console.log('Email sent successfully:', info.messageId);

    return NextResponse.json({
      success: true,
      message: 'Invitation email sent',
      emailId: info.messageId,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

