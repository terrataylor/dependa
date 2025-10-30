# 🔧 Troubleshooting Guide - Dependa

## Common Issues and Solutions

---

## 🚨 Issue: "Sign in with Google" Popup Closes Immediately

This is the most common issue! Here are the solutions:

### Solution 1: Enable Authorized Domain in Firebase Console ⭐ (MOST COMMON)

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `dependa-60c3f`
3. **Navigate**: Authentication → Settings (tab) → Authorized domains
4. **Ensure these domains are listed**:
   - `localhost` 
   - `dependa-60c3f.firebaseapp.com`
5. **If missing**, click "Add domain" and add `localhost`
6. **Save** and try signing in again

### Solution 2: Use Redirect Instead of Popup

I've added a checkbox on the login page:

1. Reload your login page (http://localhost:3000/login)
2. **Check the box** that says "Use redirect instead of popup"
3. Click "Sign in with Google" again
4. You'll be redirected to Google, then back to the app

### Solution 3: Check Browser Console

1. **Open Developer Tools**:
   - Chrome/Edge: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - Firefox: Press `F12` or `Ctrl+Shift+K`
2. **Go to Console tab**
3. Click "Sign in with Google"
4. **Look for error messages** - they'll tell you exactly what's wrong

Common errors you might see:
- `auth/unauthorized-domain` → Add domain in Firebase Console (Solution 1)
- `auth/popup-blocked` → Allow popups in browser settings
- `auth/popup-closed-by-user` → User closed popup (not an error)

### Solution 4: Allow Popups in Browser

**Chrome:**
1. Click the icon in the address bar (right side) that shows blocked popups
2. Select "Always allow popups from localhost"
3. Refresh the page and try again

**Firefox:**
1. Click the Options menu → Preferences
2. Privacy & Security → Permissions → Popups
3. Allow popups for `http://localhost:3000`

**Edge:**
1. Settings → Cookies and site permissions → Pop-ups and redirects
2. Allow popups for `http://localhost:3000`

### Solution 5: Clear Browser Cache & Cookies

Sometimes old auth data causes issues:

1. Open Developer Tools (F12)
2. Right-click on the refresh button
3. Select "Empty Cache and Hard Reload"
4. Or: Settings → Privacy → Clear browsing data → Cookies and cached files

### Solution 6: Try a Different Browser

Sometimes browser extensions interfere with authentication:
- Try Chrome Incognito mode (`Ctrl+Shift+N`)
- Try Firefox Private Window
- Try a different browser entirely

### Solution 7: Check Firebase Project Settings

Ensure your Firebase project is properly configured:

1. Go to: https://console.firebase.google.com/project/dependa-60c3f/settings/general
2. Under "Your apps" section, verify you have a Web app configured
3. If not, click "Add app" → Web → Register app

---

## 🔥 Issue: "Failed to load data" or "Firestore Error"

### Solution: Set up Firestore Security Rules

1. Go to Firebase Console → Firestore Database
2. Click "Rules" tab
3. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /calendars/{calendarId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    match /todos/{todoId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    match /conditionalEvents/{eventId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
  }
}
```

4. Click "Publish"

---

## 📁 Issue: File Upload Fails

### Solution: Configure Storage Security Rules

1. Go to Firebase Console → Storage
2. Click "Rules" tab
3. Replace with these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /proofs/{todoId}/{filename} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     request.resource.size < 10 * 1024 * 1024 &&
                     (request.resource.contentType.matches('image/.*') ||
                      request.resource.contentType == 'application/pdf' ||
                      request.resource.contentType.matches('application/(msword|vnd.openxmlformats-officedocument.wordprocessingml.document)'));
    }
  }
}
```

4. Click "Publish"

---

## 🌐 Issue: Google Calendar Sync Not Working

This feature requires additional setup:

### Solution: Configure Google OAuth

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create or select project**
3. **Enable Google Calendar API**:
   - APIs & Services → Library
   - Search "Google Calendar API"
   - Click "Enable"
4. **Create OAuth Credentials**:
   - APIs & Services → Credentials
   - Create Credentials → OAuth client ID
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. **Copy credentials** and add to `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

6. **Restart the dev server**:
```bash
npm run dev
```

---

## 📧 Issue: Email Invitations/Reminders Not Sending

Email functionality requires a third-party service setup:

### Solution: Configure Email Service

This is optional and only needed for production. In development, emails are logged to the console.

**For Production**: Choose SendGrid or Resend

**SendGrid:**
```bash
npm install @sendgrid/mail
```

**Resend:**
```bash
npm install resend
```

Update the email API routes with your API key (see SETUP.md for details).

---

## 🐛 Issue: Build Errors

### Solution 1: Clean Install

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Solution 2: Clear Next.js Cache

```bash
# Delete .next folder
rm -rf .next
npm run dev
```

### Solution 3: Check Node Version

```bash
node --version
# Should be v18 or higher
```

If too old:
```bash
nvm install 18
nvm use 18
```

---

## 🔄 Issue: Changes Not Showing

### Solution: Hard Refresh

1. **Clear Next.js cache**: Delete `.next` folder
2. **Hard refresh browser**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. **Restart dev server**:
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## 🎯 Issue: "Network Error" or "CORS Error"

### Solution: Check Your Dev Server

1. Ensure dev server is running: `npm run dev`
2. Check it's on the right port: http://localhost:3000
3. Check firewall isn't blocking port 3000
4. Try a different port:
```bash
# In package.json, change dev script to:
"dev": "next dev -p 3001"
```

---

## 📱 Issue: App Looks Broken on Mobile

### Solution: Viewport Meta Tag

The layout.tsx already includes this, but verify:

1. Check `app/layout.tsx` has proper meta tags
2. Clear mobile browser cache
3. Try landscape and portrait orientations

---

## 🔐 Issue: "Permission Denied" in Firestore

### Solution: Check Authentication

1. Make sure you're signed in (check console: `auth.currentUser`)
2. Verify Firestore security rules (see above)
3. Check user UID matches document ownership

---

## ⚡ Issue: Slow Performance

### Solutions:

1. **Use production build**:
```bash
npm run build
npm start
```

2. **Check Firestore indexes** (Firebase Console will prompt if needed)

3. **Limit data queries**: Pagination not yet implemented but can be added

---

## 🆘 Still Having Issues?

### Debug Checklist:

1. ✅ Check browser console for errors (F12)
2. ✅ Check terminal/command prompt for server errors
3. ✅ Verify Firebase project ID matches
4. ✅ Check Firebase Console for quota limits
5. ✅ Ensure internet connection is stable
6. ✅ Try incognito/private browsing mode
7. ✅ Restart dev server and browser

### Get More Help:

1. **Check Firebase Console**:
   - Authentication → Users (see if you're registered)
   - Firestore → Data (check if data is being saved)
   - Usage (check for quota issues)

2. **Browser Console Errors**:
   - Copy the full error message
   - Search for it online
   - Check Stack Overflow

3. **Common Error Codes**:
   - `auth/unauthorized-domain` → Add domain in Firebase Console
   - `auth/popup-closed-by-user` → User cancelled (not an error)
   - `auth/network-request-failed` → Check internet connection
   - `permission-denied` → Fix Firestore security rules
   - `quota-exceeded` → Check Firebase usage limits

---

## 📞 Quick Reference

### Firebase Console URLs:
- **Project Overview**: https://console.firebase.google.com/project/dependa-60c3f/overview
- **Authentication**: https://console.firebase.google.com/project/dependa-60c3f/authentication/users
- **Firestore**: https://console.firebase.google.com/project/dependa-60c3f/firestore
- **Storage**: https://console.firebase.google.com/project/dependa-60c3f/storage

### Useful Commands:
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Check for errors
npm run lint

# Clear cache
rm -rf .next node_modules
npm install
```

### Environment Files:
- `.env.local` - Your local environment variables (not committed to git)
- Create if doesn't exist and add Google OAuth credentials

---

## ✅ Verification Steps

After fixing issues, verify everything works:

1. ✅ Sign in with Google (popup or redirect)
2. ✅ See dashboard with calendar and todos
3. ✅ Add an event
4. ✅ Add a todo
5. ✅ Complete a todo
6. ✅ Upload a file
7. ✅ View completed tasks
8. ✅ Create a conditional event

If all these work, you're good to go! 🎉

---

## 🎓 Understanding Error Messages

### "auth/unauthorized-domain"
**Meaning**: The domain you're using isn't authorized in Firebase
**Fix**: Add `localhost` to Firebase Console → Authentication → Settings → Authorized domains

### "auth/popup-blocked"
**Meaning**: Browser blocked the Google sign-in popup
**Fix**: Allow popups for localhost OR use the redirect option

### "permission-denied"
**Meaning**: Firestore security rules are blocking your request
**Fix**: Update Firestore security rules (see above)

### "Network request failed"
**Meaning**: Can't connect to Firebase servers
**Fix**: Check internet connection, check Firebase is not down

### "Quota exceeded"
**Meaning**: You've hit Firebase free tier limits
**Fix**: Check Firebase Console → Usage, upgrade plan if needed

---

Got it working? Great! If not, check the browser console and terminal for specific error messages.

