# Dependa - Conditional Calendar Application

A Next.js-based conditional calendar application designed for overthinkers, featuring Google Calendar sync, conditional events, and collaborative task management.

## Features

### 🔐 Authentication
- Google Sign-In with Firebase Authentication
- User profile management
- Secure session handling

### 📅 Calendar Management
- Monthly calendar view with interactive day cells
- Add, view, and manage events
- Google Calendar synchronization (bidirectional)
- Visual event indicators with custom colors
- Navigate between months

### ✅ Todo List
- Create and manage tasks
- Checkbox completion tracking
- Assign tasks to team members
- Due date management
- File upload for proof of completion
- Filter by active/completed tasks

### ⚡ Conditional Events
- Set up "if-then" event triggers
- Example: "If house sells on Nov 15, then add these tasks"
- Automatic todo creation when conditions are met
- Multiple todos per conditional event

### 🤝 Collaboration
- Share calendars via email invitations
- Permission management (view/edit)
- Multi-user task assignment
- Daily email reminders for assigned tasks

### 📊 Completed Items View
- View all completed tasks
- See proof of completion documents
- Download attached files
- Filter and search completed items

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Storage**: Firebase Storage
- **Calendar Integration**: Google Calendar API
- **Date Utilities**: date-fns
- **Icons**: Lucide React

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dependa
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:
- Google OAuth Client ID and Secret
- Email service API key (optional, for production)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firebase Configuration

The Firebase configuration is already included in the code:
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyCizlYqpNkHhXIBG_B-LK-QGFdhzsGoKyA",
  authDomain: "dependa-60c3f.firebaseapp.com",
  projectId: "dependa-60c3f",
  storageBucket: "dependa-60c3f.firebasestorage.app",
  messagingSenderId: "341154002973",
  appId: "1:341154002973:web:9b9dbbddbf25af4eb86ef4",
  measurementId: "G-H24H881P23"
};
```

### Firestore Collections Structure

#### `users`
```typescript
{
  uid: string
  email: string
  displayName: string
  photoURL?: string
  googleAccessToken?: string
  googleRefreshToken?: string
}
```

#### `calendars`
```typescript
{
  id: string
  name: string
  ownerId: string
  ownerEmail: string
  sharedWith: Array<{
    userId: string
    email: string
    canEdit: boolean
  }>
  createdAt: Timestamp
}
```

#### `events`
```typescript
{
  id: string
  title: string
  description?: string
  startDate: Timestamp
  endDate: Timestamp
  allDay: boolean
  googleEventId?: string
  createdBy: string
  calendarId: string
  color?: string
}
```

#### `todos`
```typescript
{
  id: string
  calendarId: string
  title: string
  description?: string
  completed: boolean
  assignedTo?: string
  assignedToEmail?: string
  dueDate?: Timestamp
  completedAt?: Timestamp
  completedBy?: string
  proofOfCompletionUrl?: string
  proofOfCompletionName?: string
  createdBy: string
  createdAt: Timestamp
  conditionalEventId?: string
}
```

#### `conditionalEvents`
```typescript
{
  id: string
  calendarId: string
  conditionDate: Timestamp
  conditionDescription: string
  triggered: boolean
  todoItems: string[]
  createdBy: string
}
```

## Google Calendar Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy Client ID and Client Secret to `.env.local`

## Email Setup (Production)

For email functionality (invitations and daily reminders), integrate with an email service:

### Option 1: SendGrid
```bash
npm install @sendgrid/mail
```

### Option 2: Resend
```bash
npm install resend
```

Update the email API routes in:
- `app/api/send-share-email/route.ts`
- `app/api/send-daily-reminders/route.ts`

## Daily Reminders Setup

### Vercel Deployment
The project includes a `vercel.json` file with a cron job configuration that runs daily at 9am UTC:

```json
{
  "crons": [
    {
      "path": "/api/send-daily-reminders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### Alternative: Firebase Functions
If you prefer Firebase Functions for scheduled tasks:

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Initialize Firebase Functions:
```bash
firebase init functions
```

3. Create a scheduled function in `functions/src/index.ts`:
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const sendDailyReminders = functions.pubsub
  .schedule('0 9 * * *')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    // Call your API endpoint or implement logic here
    const response = await fetch('https://yourdomain.com/api/send-daily-reminders', {
      method: 'POST',
    });
    console.log('Daily reminders sent');
  });
```

4. Deploy:
```bash
firebase deploy --only functions
```

## Project Structure

```
dependa/
├── app/
│   ├── api/                    # API routes
│   │   ├── google-calendar/    # Google Calendar integration
│   │   ├── send-share-email/   # Email invitations
│   │   └── send-daily-reminders/ # Daily email reminders
│   ├── dashboard/              # Main dashboard page
│   ├── completed/              # Completed tasks view
│   ├── login/                  # Login page
│   └── page.tsx                # Home page (redirects)
├── components/
│   ├── Calendar.tsx            # Calendar component
│   ├── TodoList.tsx            # Todo list component
│   └── modals/                 # Modal components
│       ├── AddEventModal.tsx
│       ├── AddTodoModal.tsx
│       ├── AddConditionalEventModal.tsx
│       ├── ShareCalendarModal.tsx
│       └── UploadProofModal.tsx
├── contexts/
│   └── AuthContext.tsx         # Authentication context
├── lib/
│   ├── firebase.ts             # Firebase configuration
│   ├── firestore.ts            # Firestore helper functions
│   └── types.ts                # TypeScript types
└── public/                     # Static assets
```

## Usage Guide

### Creating Conditional Events

1. Click the "Conditional Event" button in the dashboard header
2. Set a condition date (e.g., November 15, 2025)
3. Add a condition description (e.g., "If the house sells")
4. Add multiple todo items that should be created
5. When the condition date arrives, todos are automatically created

### Sharing Calendars

1. Click the "Share" button in the dashboard header
2. Enter the email address of the person you want to share with
3. Choose their permission level (view or edit)
4. They will receive an email invitation

### Uploading Proof of Completion

1. Complete a task by checking its checkbox
2. Click "Upload Proof" button that appears
3. Drag and drop a file or click to browse
4. Supported formats: images, PDFs, documents
5. View proof in the "Completed" page

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Self-hosted with Docker

## Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Recurring events
- [ ] Calendar views (week, day, agenda)
- [ ] Event reminders/notifications
- [ ] Team/organization support
- [ ] Time tracking
- [ ] Calendar templates
- [ ] Integration with other calendar services (Outlook, iCal)
- [ ] Advanced search and filtering
- [ ] Export/import functionality

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
