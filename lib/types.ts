export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  googleAccessToken?: string;
  googleRefreshToken?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  googleEventId?: string;
  createdBy: string;
  calendarId: string;
  color?: string;
}

export interface ConditionalEvent {
  id: string;
  calendarId: string;
  conditionDate: Date;
  conditionDescription: string;
  triggered: boolean;
  todoItems: string[]; // Array of todo titles to create
  createdBy: string;
}

export interface TodoItem {
  id: string;
  calendarId: string;
  title: string;
  description?: string;
  completed: boolean;
  assignedTo?: string; // User ID
  assignedToEmail?: string;
  dueDate?: Date;
  completedAt?: Date;
  completedBy?: string;
  proofOfCompletionUrl?: string;
  proofOfCompletionName?: string;
  createdBy: string;
  createdAt: Date;
  conditionalEventId?: string; // Link to the conditional event that created this
}

export interface Calendar {
  id: string;
  name: string;
  ownerId: string;
  ownerEmail: string;
  sharedWith: CalendarShare[];
  createdAt: Date;
}

export interface CalendarShare {
  userId: string;
  email: string;
  canEdit: boolean;
}

