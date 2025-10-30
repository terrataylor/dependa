import { NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST() {
  try {
    // This endpoint should be called by a cron job (e.g., Vercel Cron, GitHub Actions)
    // or Firebase Functions scheduled function at 9am daily

    // Get all calendars
    const calendarsSnapshot = await getDocs(collection(db, 'calendars'));
    
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
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
                 style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                View Full Calendar
              </a>
            </div>
          `,
        };
        
        console.log('Daily reminder email would be sent:', emailContent);
        
        // TODO: Integrate with actual email service
        // await sgMail.send(emailContent);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Daily reminders sent',
    });
  } catch (error) {
    console.error('Error sending daily reminders:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

