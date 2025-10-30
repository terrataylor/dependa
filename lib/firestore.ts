import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { User, CalendarEvent, TodoItem, Calendar, ConditionalEvent } from './types';

// User operations
export const createOrUpdateUser = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    ...user,
    updatedAt: Timestamp.now(),
  }, { merge: true });
};

export const getUser = async (uid: string): Promise<User | null> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() as User : null;
};

// Calendar operations
export const createCalendar = async (calendar: Omit<Calendar, 'id'>): Promise<string> => {
  const calendarRef = await addDoc(collection(db, 'calendars'), {
    ...calendar,
    createdAt: Timestamp.fromDate(calendar.createdAt),
  });
  return calendarRef.id;
};

export const getUserCalendars = async (userId: string): Promise<Calendar[]> => {
  const q = query(
    collection(db, 'calendars'),
    where('ownerId', '==', userId)
  );
  const snapshot = await getDocs(q);
  
  const ownedCalendars = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
  } as Calendar));

  // Also get shared calendars
  const allCalendarsSnapshot = await getDocs(collection(db, 'calendars'));
    const sharedCalendars = allCalendarsSnapshot.docs
    .filter(doc => {
      const data = doc.data();
      return data.sharedWith?.some((share: { userId: string }) => share.userId === userId);
    })
    .map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    } as Calendar));

  return [...ownedCalendars, ...sharedCalendars];
};

export const shareCalendar = async (calendarId: string, email: string, userId: string, canEdit: boolean) => {
  const calendarRef = doc(db, 'calendars', calendarId);
  const calendarSnap = await getDoc(calendarRef);
  
  if (calendarSnap.exists()) {
    const calendar = calendarSnap.data();
    const sharedWith = calendar.sharedWith || [];
    
    // Check if already shared
    if (!sharedWith.some((share: { email: string }) => share.email === email)) {
      sharedWith.push({ userId, email, canEdit });
      await updateDoc(calendarRef, { sharedWith });
    }
  }
};

// Event operations
export const createEvent = async (event: Omit<CalendarEvent, 'id'>): Promise<string> => {
  // Filter out undefined values - Firestore doesn't accept them
  const eventData: any = {
    title: event.title,
    startDate: Timestamp.fromDate(event.startDate),
    endDate: Timestamp.fromDate(event.endDate),
    allDay: event.allDay,
    createdBy: event.createdBy,
    calendarId: event.calendarId,
  };
  
  // Only add optional fields if they're defined
  if (event.description !== undefined && event.description !== '') {
    eventData.description = event.description;
  }
  if (event.googleEventId !== undefined && event.googleEventId !== '') {
    eventData.googleEventId = event.googleEventId;
  }
  if (event.color !== undefined && event.color !== '') {
    eventData.color = event.color;
  }
  
  const eventRef = await addDoc(collection(db, 'events'), eventData);
  return eventRef.id;
};

export const getCalendarEvents = async (calendarId: string): Promise<CalendarEvent[]> => {
  const q = query(
    collection(db, 'events'),
    where('calendarId', '==', calendarId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    startDate: doc.data().startDate.toDate(),
    endDate: doc.data().endDate.toDate(),
  } as CalendarEvent));
};

export const updateEvent = async (eventId: string, updates: Partial<CalendarEvent>) => {
  const eventRef = doc(db, 'events', eventId);
  const updateData: Record<string, unknown> = { ...updates };
  
  if (updates.startDate) {
    updateData.startDate = Timestamp.fromDate(updates.startDate);
  }
  if (updates.endDate) {
    updateData.endDate = Timestamp.fromDate(updates.endDate);
  }
  
  await updateDoc(eventRef, updateData);
};

export const deleteEvent = async (eventId: string) => {
  await deleteDoc(doc(db, 'events', eventId));
};

// Todo operations
export const createTodo = async (todo: Omit<TodoItem, 'id'>): Promise<string> => {
  // Filter out undefined values - Firestore doesn't accept them
  const todoData: any = {
    calendarId: todo.calendarId,
    title: todo.title,
    completed: todo.completed,
    createdBy: todo.createdBy,
    createdAt: Timestamp.fromDate(todo.createdAt),
  };
  
  // Only add optional fields if they're defined
  if (todo.description !== undefined && todo.description !== '') {
    todoData.description = todo.description;
  }
  if (todo.assignedTo !== undefined && todo.assignedTo !== '') {
    todoData.assignedTo = todo.assignedTo;
  }
  if (todo.assignedToEmail !== undefined && todo.assignedToEmail !== '') {
    todoData.assignedToEmail = todo.assignedToEmail;
  }
  if (todo.dueDate) {
    todoData.dueDate = Timestamp.fromDate(todo.dueDate);
  }
  if (todo.completedAt) {
    todoData.completedAt = Timestamp.fromDate(todo.completedAt);
  }
  if (todo.completedBy !== undefined && todo.completedBy !== '') {
    todoData.completedBy = todo.completedBy;
  }
  if (todo.proofOfCompletionUrl !== undefined && todo.proofOfCompletionUrl !== '') {
    todoData.proofOfCompletionUrl = todo.proofOfCompletionUrl;
  }
  if (todo.proofOfCompletionName !== undefined && todo.proofOfCompletionName !== '') {
    todoData.proofOfCompletionName = todo.proofOfCompletionName;
  }
  if (todo.conditionalEventId !== undefined && todo.conditionalEventId !== '') {
    todoData.conditionalEventId = todo.conditionalEventId;
  }
  
  const todoRef = await addDoc(collection(db, 'todos'), todoData);
  return todoRef.id;
};

export const getCalendarTodos = async (calendarId: string): Promise<TodoItem[]> => {
  const q = query(
    collection(db, 'todos'),
    where('calendarId', '==', calendarId)
    // Note: orderBy removed temporarily - add index in Firebase Console for sorting
    // orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  const todos = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    dueDate: doc.data().dueDate?.toDate(),
    completedAt: doc.data().completedAt?.toDate(),
  } as TodoItem));
  
  // Sort in JavaScript instead (until index is created)
  return todos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const updateTodo = async (todoId: string, updates: Partial<TodoItem>) => {
  const todoRef = doc(db, 'todos', todoId);
  const updateData: Record<string, unknown> = {};
  
  // Only include defined values
  Object.keys(updates).forEach(key => {
    const value = (updates as any)[key];
    if (value !== undefined) {
      if (key === 'dueDate' && value) {
        updateData[key] = Timestamp.fromDate(value as Date);
      } else if (key === 'completedAt' && value) {
        updateData[key] = Timestamp.fromDate(value as Date);
      } else {
        updateData[key] = value;
      }
    }
  });
  
  await updateDoc(todoRef, updateData);
};

export const deleteTodo = async (todoId: string) => {
  await deleteDoc(doc(db, 'todos', todoId));
};

// Conditional event operations
export const createConditionalEvent = async (event: Omit<ConditionalEvent, 'id'>): Promise<string> => {
  const eventRef = await addDoc(collection(db, 'conditionalEvents'), {
    ...event,
    conditionDate: Timestamp.fromDate(event.conditionDate),
  });
  return eventRef.id;
};

export const getCalendarConditionalEvents = async (calendarId: string): Promise<ConditionalEvent[]> => {
  const q = query(
    collection(db, 'conditionalEvents'),
    where('calendarId', '==', calendarId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    conditionDate: doc.data().conditionDate.toDate(),
  } as ConditionalEvent));
};

export const updateConditionalEvent = async (eventId: string, updates: Partial<ConditionalEvent>) => {
  const eventRef = doc(db, 'conditionalEvents', eventId);
  const updateData: Record<string, unknown> = { ...updates };
  
  if (updates.conditionDate) {
    updateData.conditionDate = Timestamp.fromDate(updates.conditionDate);
  }
  
  await updateDoc(eventRef, updateData);
};

export const deleteConditionalEvent = async (eventId: string) => {
  await deleteDoc(doc(db, 'conditionalEvents', eventId));
};

