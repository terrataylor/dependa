'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Calendar from '@/components/Calendar';
import TodoList from '@/components/TodoList';
import AddEventModal from '@/components/modals/AddEventModal';
import AddTodoModal from '@/components/modals/AddTodoModal';
import AddConditionalEventModal from '@/components/modals/AddConditionalEventModal';
import ShareCalendarModal from '@/components/modals/ShareCalendarModal';
import UploadProofModal from '@/components/modals/UploadProofModal';
import EventDetailsModal from '@/components/modals/EventDetailsModal';
import { LogOut, Share2, CheckSquare, Calendar as CalendarIcon, Sparkles, Info } from 'lucide-react';
import Link from 'next/link';
import {
  getUserCalendars,
  createCalendar,
  getCalendarEvents,
  createEvent,
  getCalendarTodos,
  createTodo,
  updateTodo,
  shareCalendar,
  createConditionalEvent,
  getCalendarConditionalEvents,
  updateConditionalEvent,
  getUser,
  deleteEvent,
} from '@/lib/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import type { CalendarEvent, TodoItem, Calendar as CalendarType, User, ConditionalEvent } from '@/lib/types';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  
  const [calendar, setCalendar] = useState<CalendarType | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [sharedUsers, setSharedUsers] = useState<User[]>([]);
  
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showAddTodoModal, setShowAddTodoModal] = useState(false);
  const [showAddConditionalModal, setShowAddConditionalModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showUploadProofModal, setShowUploadProofModal] = useState(false);
  const [selectedTodoForProof, setSelectedTodoForProof] = useState<TodoItem | null>(null);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  const [dataLoading, setDataLoading] = useState(true);
  const [syncingCalendar, setSyncingCalendar] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadData();
      
      // Check for OAuth callback parameters
      const params = new URLSearchParams(window.location.search);
      const googleToken = params.get('google_token');
      const syncSuccess = params.get('sync_success');
      
      if (googleToken && syncSuccess) {
        // Store token in localStorage for now (in production, store in Firestore)
        localStorage.setItem('google_calendar_token', googleToken);
        
        // Store token to sync after calendar is loaded
        sessionStorage.setItem('pending_sync_token', googleToken);
        
        // Clean up URL
        window.history.replaceState({}, '', '/dashboard');
      }
      
      const error = params.get('error');
      if (error) {
        alert(`Google Calendar sync error: ${error}`);
        window.history.replaceState({}, '', '/dashboard');
      }
    }
  }, [user]);
  
  // Sync after calendar is loaded
  useEffect(() => {
    const pendingToken = sessionStorage.getItem('pending_sync_token');
    if (calendar && pendingToken) {
      console.log('✅ Calendar loaded, starting sync...');
      sessionStorage.removeItem('pending_sync_token');
      syncGoogleCalendarEvents(pendingToken);
    }
  }, [calendar]);
  
  const syncGoogleCalendarEvents = async (token: string) => {
    if (!calendar) {
      console.error('No calendar found');
      return;
    }
    
    try {
      setSyncingCalendar(true);
      setSyncProgress(10);
      console.log('🔄 Starting Google Calendar sync...');
      
      // Call our API to sync events
      setSyncProgress(20);
      const response = await fetch('/api/google-calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: token }),
      });
      
      setSyncProgress(40);
      const data = await response.json();
      console.log('📥 Received data from Google:', data);
      
      if (data.success && data.events) {
        console.log(`📅 Found ${data.events.length} events from Google Calendar`);
        
        // Import Google Calendar events into our app
        let imported = 0;
        let skipped = 0;
        const errors: string[] = [];
        const totalEvents = data.events.length;
        
        for (let i = 0; i < data.events.length; i++) {
          const gEvent = data.events[i];
          
          // Update progress (40% to 90% during import)
          const importProgress = 40 + (i / totalEvents) * 50;
          setSyncProgress(Math.round(importProgress));
          
          try {
            // Check if event already exists (avoid duplicates)
            const existingEvents = await getCalendarEvents(calendar.id);
            const alreadyExists = existingEvents.some(e => e.googleEventId === gEvent.id);
            
            if (alreadyExists) {
              console.log(`⏭️ Skipping duplicate event: ${gEvent.title}`);
              skipped++;
              continue;
            }
            
            console.log(`➕ Importing event: ${gEvent.title}`, {
              startDate: gEvent.startDate,
              endDate: gEvent.endDate,
              allDay: gEvent.allDay,
            });
            
            await createEvent({
              title: gEvent.title || 'Untitled Event',
              description: gEvent.description || '',
              startDate: new Date(gEvent.startDate),
              endDate: new Date(gEvent.endDate),
              allDay: gEvent.allDay,
              googleEventId: gEvent.id,
              createdBy: user?.uid || '',
              calendarId: calendar.id,
            });
            imported++;
          } catch (error) {
            console.error('❌ Error importing event:', gEvent.title, error);
            errors.push(`${gEvent.title}: ${error}`);
          }
        }
        
        console.log(`✅ Sync complete: ${imported} imported, ${skipped} skipped`);
        
        setSyncProgress(95);
        
        // Reload calendar data
        await loadData();
        
        setSyncProgress(100);
        
        let message = `✅ Successfully synced Google Calendar!\n\n`;
        message += `📅 Date range: Today + 1 year forward\n`;
        message += `Imported: ${imported} new events\n`;
        if (skipped > 0) message += `Skipped: ${skipped} duplicates\n`;
        if (errors.length > 0) message += `Errors: ${errors.length}\n`;
        
        alert(message);
      } else {
        console.error('❌ Sync failed:', data);
        alert('Failed to sync Google Calendar events. Check console for details.');
      }
    } catch (error) {
      console.error('❌ Error syncing calendar:', error);
      alert('Error syncing Google Calendar. Check console for details.');
    } finally {
      setSyncingCalendar(false);
      setSyncProgress(0);
    }
  };

  const loadData = async () => {
    if (!user) return;
    
    try {
      setDataLoading(true);
      setError(null);
      
      // Get or create user's calendar
      let calendars = await getUserCalendars(user.uid);
      
      if (calendars.length === 0) {
        // Create a default calendar
        const calendarId = await createCalendar({
          name: 'My Calendar',
          ownerId: user.uid,
          ownerEmail: user.email || '',
          sharedWith: [],
          createdAt: new Date(),
        });
        
        calendars = await getUserCalendars(user.uid);
      }
      
      const userCalendar = calendars[0];
      setCalendar(userCalendar);
      
      // Load events, todos, and conditional events
      const [calendarEvents, calendarTodos, calendarConditionalEvents] = await Promise.all([
        getCalendarEvents(userCalendar.id),
        getCalendarTodos(userCalendar.id),
        getCalendarConditionalEvents(userCalendar.id),
      ]);
      
      setEvents(calendarEvents);
      setTodos(calendarTodos);
      
      // Load shared users (including the calendar owner)
      const allUsers: User[] = [];
      
      // Add the current user (owner) to the list
      if (user) {
        allUsers.push({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email || 'You',
          photoURL: user.photoURL || undefined,
        });
      }
      
      // Add shared users
      if (userCalendar.sharedWith.length > 0) {
        for (const share of userCalendar.sharedWith) {
          // If we have a userId, try to get the full user profile
          if (share.userId) {
            const sharedUser = await getUser(share.userId);
            if (sharedUser) {
              allUsers.push(sharedUser);
              continue;
            }
          }
          
          // Otherwise, create a temporary user object from the email
          // This handles users who haven't logged in yet
          allUsers.push({
            uid: share.email, // Use email as temporary uid
            email: share.email,
            displayName: share.email.split('@')[0], // Use email prefix as display name
            photoURL: undefined,
          });
        }
      }
      
      setSharedUsers(allUsers);
      
      // Check for conditional events that should be triggered
      checkConditionalEvents(calendarConditionalEvents, userCalendar.id);
      
    } catch (error: any) {
      console.error('Error loading data:', error);
      
      // Provide helpful error messages
      if (error.code === 'permission-denied') {
        setError('Firestore permission denied. Please check your Firestore security rules in the Firebase Console.');
      } else if (error.code === 'unavailable') {
        setError('Cannot connect to Firestore. Make sure Firestore is enabled in your Firebase Console.');
      } else if (error.message?.includes('PERMISSION_DENIED')) {
        setError('Firestore database not initialized or rules not set. Please enable Firestore in Firebase Console.');
      } else {
        setError(`Error loading data: ${error.message || 'Unknown error'}. Check browser console for details.`);
      }
    } finally {
      setDataLoading(false);
    }
  };

  const checkConditionalEvents = async (conditionals: ConditionalEvent[], calendarId: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const conditional of conditionals) {
      if (!conditional.triggered) {
        const conditionDate = new Date(conditional.conditionDate);
        conditionDate.setHours(0, 0, 0, 0);
        
        // Check if condition date has passed
        if (conditionDate <= today) {
          // Create todos from this conditional event
          for (const todoTitle of conditional.todoItems) {
            await createTodo({
              calendarId,
              title: todoTitle,
              description: `Auto-created from: ${conditional.conditionDescription}`,
              completed: false,
              createdBy: user?.uid || '',
              createdAt: new Date(),
              conditionalEventId: conditional.id,
            });
          }
          
          // Mark as triggered
          await updateConditionalEvent(conditional.id, { triggered: true });
        }
      }
    }
  };

  const handleAddEvent = async (eventData: {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    allDay: boolean;
  }) => {
    if (!calendar || !user) return;
    
    try {
      await createEvent({
        ...eventData,
        calendarId: calendar.id,
        createdBy: user.uid,
      });
      
      await loadData();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleAddTodo = async (todoData: {
    title: string;
    description: string;
    assignedTo?: string;
    assignedToEmail?: string;
    dueDate?: Date;
  }) => {
    if (!calendar || !user) return;
    
    try {
      await createTodo({
        ...todoData,
        calendarId: calendar.id,
        completed: false,
        createdBy: user.uid,
        createdAt: new Date(),
      });
      
      await loadData();
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleAddConditionalEvent = async (conditionalData: {
    conditionDate: Date;
    conditionDescription: string;
    todoItems: string[];
  }) => {
    if (!calendar || !user) return;
    
    try {
      const eventId = await createConditionalEvent({
        ...conditionalData,
        calendarId: calendar.id,
        triggered: false,
        createdBy: user.uid,
      });
      console.log('Created conditional event:', eventId);
      
      await loadData();
    } catch (error) {
      console.error('Error creating conditional event:', error);
    }
  };

  const handleToggleTodo = async (todoId: string, completed: boolean) => {
    try {
      await updateTodo(todoId, {
        completed,
        completedAt: completed ? new Date() : undefined,
        completedBy: completed ? user?.uid : undefined,
      });
      
      await loadData();
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleUploadProof = (todoId: string) => {
    const todo = todos.find(t => t.id === todoId);
    if (todo) {
      setSelectedTodoForProof(todo);
      setShowUploadProofModal(true);
    }
  };

  const handleProofUpload = async (file: File) => {
    if (!selectedTodoForProof) return;
    
    try {
      // Upload file to Firebase Storage
      const storageRef = ref(storage, `proofs/${selectedTodoForProof.id}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update todo with proof URL
      await updateTodo(selectedTodoForProof.id, {
        proofOfCompletionUrl: downloadURL,
        proofOfCompletionName: file.name,
      });
      
      await loadData();
    } catch (error) {
      console.error('Error uploading proof:', error);
    }
  };

  const handleAssignUser = async (todoId: string, userId: string) => {
    try {
      const assignedUser = sharedUsers.find(u => u.uid === userId);
      await updateTodo(todoId, {
        assignedTo: userId || undefined,
        assignedToEmail: assignedUser?.email || undefined,
      });
      
      await loadData();
    } catch (error) {
      console.error('Error assigning user:', error);
    }
  };

  const handleShareCalendar = async (email: string, canEdit: boolean) => {
    if (!calendar || !user) return;
    
    try {
      // In a real app, you'd look up the user by email first
      // For now, we'll create a placeholder
      await shareCalendar(calendar.id, email, '', canEdit);
      
      // Send invitation email
      try {
        const response = await fetch('/api/send-share-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: email,
            calendarName: calendar.name,
            inviterName: user.displayName || user.email || 'A user',
            calendarId: calendar.id,
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          alert(`Calendar shared with ${email}. Invitation email sent!`);
        } else {
          console.error('Failed to send email:', data.error);
          alert(`Calendar shared with ${email}, but failed to send invitation email. They can still access it.`);
        }
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        alert(`Calendar shared with ${email}, but failed to send invitation email. They can still access it.`);
      }
      
      await loadData();
    } catch (error) {
      console.error('Error sharing calendar:', error);
      alert('Failed to share calendar. Please try again.');
    }
  };

  const handleSyncGoogleCalendar = async () => {
    // Check if Google OAuth is configured
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Debug: Log what we're seeing
    console.log('🔍 Debug Info:');
    console.log('Client ID:', clientId ? `${clientId.substring(0, 20)}...` : 'NOT SET');
    console.log('App URL:', appUrl);
    
    if (!clientId || clientId === 'your_google_client_id_here') {
      alert(
        '⚠️ Google Calendar sync requires setup!\n\n' +
        'Debug Info:\n' +
        `Client ID: ${clientId || 'NOT SET'}\n\n` +
        'Steps to fix:\n' +
        '1. Create .env.local file in project root (same folder as package.json)\n' +
        '2. Add: NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id\n' +
        '3. Add: GOOGLE_CLIENT_SECRET=your_secret\n' +
        '4. Add: NEXT_PUBLIC_APP_URL=http://localhost:3000\n' +
        '5. Restart dev server (stop with Ctrl+C, then: npm run dev)\n\n' +
        'See GOOGLE_CALENDAR_SETUP.md for detailed instructions.'
      );
      return;
    }
    
    try {
      // Start OAuth flow
      const scopes = [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events',
      ].join(' ');
      
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', clientId);
      authUrl.searchParams.set('redirect_uri', `${appUrl}/api/auth/google-calendar`);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', scopes);
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');
      
      // Redirect to Google OAuth
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error('Error starting OAuth flow:', error);
      alert('Failed to start Google Calendar sync. Check console for details.');
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetailsModal(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      await loadData();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md text-center">
          {error ? (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Data</h2>
              <p className="text-red-700 mb-4">{error}</p>
              <div className="space-y-2 text-sm text-left bg-white p-4 rounded border border-red-200">
                <p className="font-semibold text-red-900">Quick Fix:</p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Go to <a href="https://console.firebase.google.com/project/dependa-60c3f/firestore" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Firebase Console</a></li>
                  <li>Click &quot;Create database&quot; (if needed)</li>
                  <li>Choose &quot;Start in test mode&quot;</li>
                  <li>Select a location and Enable</li>
                  <li>Refresh this page</li>
                </ol>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : (
            <div>
              <div className="text-xl text-gray-700 mb-4">Loading...</div>
              <div className="text-sm text-gray-500">Setting up your calendar...</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!user || !calendar) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Dependa</h1>
                <p className="text-sm text-gray-600">{calendar.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAddConditionalModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Conditional Event</span>
              </button>
              
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              
              <button
                onClick={() => router.push('/completed')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <CheckSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Completed</span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  <img
                    src={user.photoURL || 'https://via.placeholder.com/40'}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-blue-500"
                  />
                  <div className="text-sm">
                    <div className="font-medium text-gray-800">{user.displayName}</div>
                    <div className="text-gray-500 text-xs">{user.email}</div>
                  </div>
                </div>
                <img
                  src={user.photoURL || 'https://via.placeholder.com/40'}
                  alt="Profile"
                  className="sm:hidden w-10 h-10 rounded-full border-2 border-blue-500"
                />
                <Link
                  href="/about"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
                  title="About Dependa"
                >
                  <Info className="w-4 h-4" />
                  <span className="hidden sm:inline">About</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6" style={{ height: 'calc(100vh - 180px)', minHeight: '600px' }}>
          {/* Calendar - 70% */}
          <div className="w-full lg:w-[70%] h-[500px] lg:h-full flex-shrink-0">
            <Calendar
              events={events}
              onAddEvent={() => setShowAddEventModal(true)}
              onEventClick={handleEventClick}
              onSyncGoogleCalendar={handleSyncGoogleCalendar}
              syncingCalendar={syncingCalendar}
              syncProgress={syncProgress}
            />
          </div>
          
          {/* Todo List - 30% */}
          <div className="w-full lg:w-[30%] h-[400px] lg:h-full flex-shrink-0">
            <TodoList
              todos={todos}
              currentUser={{
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || '',
                photoURL: user.photoURL || undefined,
              }}
              sharedUsers={sharedUsers}
              onAddTodo={() => setShowAddTodoModal(true)}
              onToggleTodo={handleToggleTodo}
              onUploadProof={handleUploadProof}
              onAssignUser={handleAssignUser}
              onTodoClick={(todo) => console.log('Todo clicked:', todo)}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <AddEventModal
        isOpen={showAddEventModal}
        onClose={() => setShowAddEventModal(false)}
        onSave={handleAddEvent}
      />
      
      <AddTodoModal
        isOpen={showAddTodoModal}
        onClose={() => setShowAddTodoModal(false)}
        onSave={handleAddTodo}
        sharedUsers={sharedUsers}
      />
      
      <AddConditionalEventModal
        isOpen={showAddConditionalModal}
        onClose={() => setShowAddConditionalModal(false)}
        onSave={handleAddConditionalEvent}
      />
      
      <ShareCalendarModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShare={handleShareCalendar}
      />
      
      {selectedTodoForProof && (
        <UploadProofModal
          isOpen={showUploadProofModal}
          onClose={() => {
            setShowUploadProofModal(false);
            setSelectedTodoForProof(null);
          }}
          onUpload={handleProofUpload}
          todoTitle={selectedTodoForProof.title}
        />
      )}
      
      <EventDetailsModal
        isOpen={showEventDetailsModal}
        onClose={() => {
          setShowEventDetailsModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}

