import { NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import nodemailer from 'nodemailer';

export async function POST() {
  try {
    // This endpoint should be called by a cron job (e.g., Vercel Cron, GitHub Actions)
    // or Firebase Functions scheduled function at 9am daily

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
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

    // Get all calendars
    const calendarsSnapshot = await getDocs(collection(db, 'calendars'));
    let emailsSent = 0;
    
    for (const calendarDoc of calendarsSnapshot.docs) {
      const calendar = calendarDoc.data();
      
      // Get todos for this calendar that are assigned
      const todosQuery = query(
        collection(db, 'todos'),
        where('calendarId', '==', calendarDoc.id),
        where('completed', '==', false)
      );
      
      const todosSnapshot = await getDocs(todosQuery);
      const todos = todosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Array<{
        id: string;
        assignedTo?: string;
        assignedToEmail?: string;
        title: string;
        description?: string;
        dueDate?: { seconds: number };
      }>;
      
      // Group todos by assigned user
      const todosByUser = new Map<string, { email: string; todos: typeof todos }>();
      
      for (const todo of todos) {
        if (todo.assignedTo && todo.assignedToEmail) {
          if (!todosByUser.has(todo.assignedTo)) {
            todosByUser.set(todo.assignedTo, {
              email: todo.assignedToEmail,
              todos: [],
            });
          }
          const userTodos = todosByUser.get(todo.assignedTo);
          if (userTodos) {
            userTodos.todos.push(todo);
          }
        }
      }
      
      // Send emails to each user
      for (const [, userData] of todosByUser) {
        const emailContent = {
          from: fromEmail,
          to: userData.email,
          subject: `Your daily tasks for ${calendar.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Good morning! Here are your tasks for today:</h2>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 16px 0;">
                <h3 style="margin-top: 0;">${calendar.name}</h3>
                <ul style="list-style: none; padding: 0;">
                  ${userData.todos.map((todo) => `
                    <li style="padding: 12px; background-color: white; margin-bottom: 8px; border-radius: 6px; border-left: 4px solid #3b82f6;">
                      <strong>${todo.title}</strong>
                      ${todo.description ? `<br/><span style="color: #666; font-size: 14px;">${todo.description}</span>` : ''}
                      ${todo.dueDate ? `<br/><span style="color: #ef4444; font-size: 12px;">Due: ${new Date(todo.dueDate.seconds * 1000).toLocaleDateString()}</span>` : ''}
                    </li>
                  `).join('')}
                </ul>
              </div>
              <a href="${appUrl}/dashboard" 
                 style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                View Full Calendar
              </a>
            </div>
          `,
        };
        
        console.log('Sending daily reminder to:', userData.email);
        
        try {
          const info = await transporter.sendMail(emailContent);
          console.log('Email sent successfully to', userData.email, ':', info.messageId);
          emailsSent++;
        } catch (emailError) {
          console.error('Failed to send email to', userData.email, ':', emailError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Daily reminders sent',
      emailsSent,
    });
  } catch (error) {
    console.error('Error sending daily reminders:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

