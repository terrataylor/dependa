# 🗓️ Google Calendar Sync Setup

## ⚠️ Required for Calendar Sync Feature

To enable Google Calendar synchronization, you need to set up OAuth credentials from Google Cloud Console.

---

## 📋 Step-by-Step Setup (10 minutes)

### **Step 1: Go to Google Cloud Console**

**Open:** https://console.cloud.google.com/

### **Step 2: Create or Select Project**

1. Click the project dropdown at the top
2. Either:
   - Select existing project, OR
   - Click **"New Project"**
   - Name: `Dependa Calendar`
   - Click **"Create"**

### **Step 3: Enable Google Calendar API**

1. Go to **"APIs & Services"** → **"Library"**
   - Or use this link: https://console.cloud.google.com/apis/library
2. Search for **"Google Calendar API"**
3. Click on it
4. Click **"Enable"**
5. Wait for it to enable (1-2 minutes)

### **Step 4: Configure OAuth Consent Screen**

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
   - Or: https://console.cloud.google.com/apis/credentials/consent
2. Choose **"External"** (unless you have Google Workspace)
3. Click **"Create"**

**Fill in the form:**
- **App name**: `Dependa`
- **User support email**: Your email
- **App logo**: (Optional - skip for now)
- **App domain**: (Optional - skip for now)
- **Developer contact email**: Your email
- Click **"Save and Continue"**

**Scopes (Step 2):**
- Click **"Add or Remove Scopes"**
- Filter for "calendar"
- Check these boxes:
  - ✅ `https://www.googleapis.com/auth/calendar.readonly`
  - ✅ `https://www.googleapis.com/auth/calendar.events`
- Click **"Update"**
- Click **"Save and Continue"**

**Test users (Step 3):**
- Click **"Add Users"**
- Enter your email address (the one you'll use to test)
- Click **"Add"**
- Click **"Save and Continue"**

**Summary (Step 4):**
- Review everything
- Click **"Back to Dashboard"**

### **Step 5: Create OAuth Credentials**

1. Go to **"APIs & Services"** → **"Credentials"**
   - Or: https://console.cloud.google.com/apis/credentials
2. Click **"+ Create Credentials"** → **"OAuth client ID"**

**Configure OAuth:**
- **Application type**: `Web application`
- **Name**: `Dependa Web Client`

**Authorized JavaScript origins:**
- Click **"+ Add URI"**
- Add: `http://localhost:3000`
- (For production, also add your production URL)

**Authorized redirect URIs:**
- Click **"+ Add URI"**
- Add: `http://localhost:3000/api/auth/google-calendar`
- (For production, also add: `https://yourdomain.com/api/auth/google-calendar`)

3. Click **"Create"**

### **Step 6: Copy Your Credentials**

You'll see a popup with:
- **Client ID**: `xxxxx.apps.googleusercontent.com`
- **Client Secret**: `xxxxx`

**Important:** Copy both of these!

### **Step 7: Add to Your .env.local File**

1. In your project root, create/edit `.env.local`
2. Add these lines:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Replace:**
- `your_client_id_here` with your actual Client ID
- `your_client_secret_here` with your actual Client Secret

### **Step 8: Restart Your Dev Server**

```bash
# Stop the server (Ctrl+C)
# Then start it again:
npm run dev
```

---

## ✅ Test the Sync

1. **Go to your dashboard**: http://localhost:3000/dashboard
2. **Click** "Sync Google Calendar" button
3. **Sign in** with Google (if prompted)
4. **Grant permissions** when asked
5. **Wait** for redirect back to your app
6. ✅ **Success!** Events should sync from Google Calendar

---

## 🎯 What Gets Synced

### **From Google Calendar → Dependa:**
- ✅ Event titles
- ✅ Event descriptions
- ✅ Start/end dates and times
- ✅ All-day events

### **From Dependa → Google Calendar:**
- ✅ Events you create in Dependa
- ✅ Can be configured to auto-sync
- ✅ Updates reflected in Google Calendar

---

## 🔒 Security & Privacy

### **Permissions Requested:**
- **calendar.readonly**: Read your Google Calendar events
- **calendar.events**: Create/edit events in Google Calendar

### **Data Storage:**
- OAuth token stored locally in browser
- No passwords stored
- You can revoke access anytime at: https://myaccount.google.com/permissions

### **Revoke Access:**
1. Go to: https://myaccount.google.com/permissions
2. Find "Dependa"
3. Click "Remove access"

---

## 🐛 Troubleshooting

### **Error: "Access blocked: This app's request is invalid"**

**Solution:**
1. Check OAuth consent screen is configured
2. Add yourself as a test user
3. Make sure Calendar API is enabled

### **Error: "redirect_uri_mismatch"**

**Solution:**
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Check redirect URI is exactly: `http://localhost:3000/api/auth/google-calendar`
4. No trailing slash!

### **Error: "invalid_client"**

**Solution:**
1. Check Client ID and Secret are correct in `.env.local`
2. Make sure you copied them correctly (no extra spaces)
3. Restart dev server after changing `.env.local`

### **Sync button does nothing**

**Solution:**
1. Open browser console (F12)
2. Look for error messages
3. Check `.env.local` file exists and has correct values
4. Verify you restarted dev server

### **Events not showing up**

**Solution:**
1. Check browser console for errors
2. Look in Firebase Console → Firestore → events collection
3. Make sure you granted calendar permissions
4. Try syncing again

---

## 📱 Production Deployment

When deploying to production:

1. **Add production URLs** to Google Cloud Console:
   - Authorized JavaScript origins: `https://yourdomain.com`
   - Authorized redirect URIs: `https://yourdomain.com/api/auth/google-calendar`

2. **Update .env variables** in your hosting platform (Vercel, etc.):
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

3. **Verify OAuth consent screen**:
   - Update app domains with your production domain
   - Consider publishing the app (not required for personal use)

---

## 💡 Advanced Features

### **Auto-sync on Interval**

To automatically sync every hour, add this to your dashboard:

```typescript
useEffect(() => {
  const token = localStorage.getItem('google_calendar_token');
  if (token) {
    // Sync every hour
    const interval = setInterval(() => {
      syncGoogleCalendarEvents(token);
    }, 60 * 60 * 1000); // 1 hour
    
    return () => clearInterval(interval);
  }
}, []);
```

### **Two-way Sync**

Current implementation syncs FROM Google Calendar TO Dependa.

To sync Dependa events TO Google Calendar:
- Use the `/api/google-calendar/add-event` endpoint
- Called automatically when creating events in Dependa

---

## 🔗 Useful Links

- **Google Cloud Console**: https://console.cloud.google.com/
- **OAuth Consent Screen**: https://console.cloud.google.com/apis/credentials/consent
- **Credentials**: https://console.cloud.google.com/apis/credentials
- **API Library**: https://console.cloud.google.com/apis/library
- **Manage App Permissions**: https://myaccount.google.com/permissions
- **Google Calendar API Docs**: https://developers.google.com/calendar/api/guides/overview

---

## ✨ Quick Reference

### Environment Variables Needed:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Redirect URI:
```
http://localhost:3000/api/auth/google-calendar
```

### Scopes Required:
```
https://www.googleapis.com/auth/calendar.readonly
https://www.googleapis.com/auth/calendar.events
```

---

## 🎉 That's It!

Once set up, clicking "Sync Google Calendar" will:
1. Redirect you to Google for authorization
2. Import all your Google Calendar events
3. Keep events in sync
4. Work seamlessly!

**Questions?** Check the troubleshooting section above or review the Google Calendar API documentation.

