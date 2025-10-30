# Dependa - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Setup (Already Configured)
The Firebase configuration is already included in the code. No additional setup needed for Firebase!

### 3. Google Calendar API Setup (Optional but Recommended)

To enable Google Calendar synchronization:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project**
   - Click "Select a project" → "New Project"
   - Name it "Dependa" or similar
   - Click "Create"

3. **Enable Google Calendar API**
   - In the left sidebar, go to "APIs & Services" → "Library"
   - Search for "Google Calendar API"
   - Click on it and press "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure the OAuth consent screen:
     - User Type: External
     - App name: Dependa
     - User support email: your email
     - Developer contact: your email
   - Application type: Web application
   - Name: Dependa Web Client
   - Authorized redirect URIs:
     - Add: `http://localhost:3000/api/auth/callback/google`
     - Add: `https://yourdomain.com/api/auth/callback/google` (for production)
   - Click "Create"

5. **Copy Credentials**
   - Copy the Client ID and Client Secret
   - Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### 4. Run the Application
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## First Time Usage

1. **Sign In**
   - Click "Sign in with Google"
   - Authorize the application

2. **Your Calendar is Created**
   - A default calendar is automatically created for you

3. **Add Your First Event**
   - Click the "Add Event" button
   - Fill in event details
   - Click "Save Event"

4. **Create a Todo**
   - Click "Add Task" in the todo list panel
   - Enter task details
   - Optionally set a due date
   - Click "Add Task"

5. **Try Conditional Events**
   - Click "Conditional Event" in the header
   - Set a future date
   - Add a condition description (e.g., "If project is approved")
   - Add multiple todos that should be created
   - Click "Create Conditional Event"
   - When the date arrives, todos will be automatically created!

## Email Setup (For Production)

The application includes email functionality for:
- Calendar sharing invitations
- Daily task reminders

To enable emails in production:

### Option 1: SendGrid

```bash
npm install @sendgrid/mail
```

Get API key from: https://sendgrid.com/

Add to `.env.local`:
```
SENDGRID_API_KEY=your_api_key_here
```

### Option 2: Resend (Recommended for ease of use)

```bash
npm install resend
```

Get API key from: https://resend.com/

Add to `.env.local`:
```
RESEND_API_KEY=your_api_key_here
```

Then update the email routes:
- `app/api/send-share-email/route.ts`
- `app/api/send-daily-reminders/route.ts`

## Firebase Rules Setup

To secure your Firestore database, add these security rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Calendar rules
    match /calendars/{calendarId} {
      allow read: if request.auth != null && (
        resource.data.ownerId == request.auth.uid ||
        request.auth.uid in resource.data.sharedWith[].userId
      );
      allow create: if request.auth != null && request.resource.data.ownerId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.ownerId == request.auth.uid;
    }
    
    // Events rules
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.createdBy == request.auth.uid;
    }
    
    // Todos rules
    match /todos/{todoId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    // Conditional events rules
    match /conditionalEvents/{eventId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.createdBy == request.auth.uid;
    }
  }
}
```

Firebase Storage rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /proofs/{todoId}/{filename} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     request.resource.size < 10 * 1024 * 1024 && // Max 10MB
                     request.resource.contentType.matches('image/.*') ||
                     request.resource.contentType == 'application/pdf' ||
                     request.resource.contentType.matches('application/(msword|vnd.openxmlformats-officedocument.wordprocessingml.document)');
    }
  }
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to https://vercel.com and import your repository
3. Add environment variables in the Vercel dashboard
4. Deploy!

The `vercel.json` file is already configured for daily email reminders.

### Firebase Hosting

```bash
npm run build
firebase init hosting
firebase deploy
```

## Troubleshooting

### "Firebase: Error (auth/popup-blocked)"
- Enable popups in your browser for localhost
- Or use redirect sign-in instead of popup

### Google Calendar Sync Not Working
- Make sure you've added the Google Calendar API credentials
- Check that the redirect URI matches exactly
- Verify the API is enabled in Google Cloud Console

### Emails Not Sending
- Email functionality requires additional setup (SendGrid/Resend)
- For development, emails are logged to the console
- For production, configure an email service

### "Permission denied" errors in Firestore
- Set up Firestore security rules as shown above
- Make sure you're signed in

## Need Help?

- Check the main README.md for detailed documentation
- Review the code comments for implementation details
- Open an issue on GitHub for bugs or questions

