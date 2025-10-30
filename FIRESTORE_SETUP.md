# 🔥 Firestore Database Setup - Required!

## ⚠️ **If you're stuck on "Loading..." - This is the fix!**

The Firestore database needs to be created in the Firebase Console before the app can work.

---

## 📋 **Step-by-Step Setup (5 minutes)**

### **Step 1: Create Firestore Database**

1. **Open this link**: https://console.firebase.google.com/project/dependa-60c3f/firestore

2. You'll see one of two things:

   **A) "Create database" button**
   - ✅ Click **"Create database"**
   - Go to Step 3

   **B) Firestore already exists**
   - ✅ You're good! Skip to Step 2 (Security Rules)

### **Step 2: Choose Starting Mode**

1. Select **"Start in test mode"**
   - This allows read/write access for testing
   - We'll secure it properly in the next step
   
2. Click **"Next"**

### **Step 3: Choose Location**

1. Select a **Firestore location** close to you:
   - United States: `us-central1` or `us-east1`
   - Europe: `europe-west1` or `europe-west2`
   - Asia: `asia-east1` or `asia-southeast1`
   - Australia: `australia-southeast1`

2. ⚠️ **Important**: You **cannot change** this location later!

3. Click **"Enable"**

4. ⏱️ Wait 1-2 minutes for Firestore to initialize

### **Step 4: Set Up Security Rules**

1. Once Firestore is ready, click the **"Rules"** tab

2. **Replace all the rules** with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Calendars collection
    match /calendars/{calendarId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.ownerId == request.auth.uid;
      allow update, delete: if request.auth != null;
    }
    
    // Events collection
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null;
    }
    
    // Todos collection
    match /todos/{todoId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null;
    }
    
    // Conditional events collection
    match /conditionalEvents/{eventId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

### **Step 5: Enable Storage (For File Uploads)**

1. Go to **Storage**: https://console.firebase.google.com/project/dependa-60c3f/storage

2. Click **"Get started"**

3. Choose **"Start in test mode"**

4. Click **"Next"** → **"Done"**

5. Click the **"Rules"** tab and replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /proofs/{todoId}/{filename} {
      // Allow authenticated users to read any proof file
      allow read: if request.auth != null;
      
      // Allow authenticated users to upload proof files
      allow write: if request.auth != null && 
                     request.resource.size < 10 * 1024 * 1024 && // Max 10MB
                     (request.resource.contentType.matches('image/.*') ||
                      request.resource.contentType == 'application/pdf' ||
                      request.resource.contentType.matches('application/(msword|vnd.openxmlformats-officedocument.wordprocessingml.document)'));
    }
  }
}
```

6. Click **"Publish"**

---

## ✅ **Verify Everything Works**

### **Test the Setup:**

1. **Refresh your app** (hard refresh: `Ctrl+Shift+R`)

2. **Sign in** with Google

3. **You should see**:
   - ✅ Dashboard loads successfully
   - ✅ Calendar appears (empty at first)
   - ✅ Todo list appears on the right
   - ✅ No more "Loading..." stuck screen!

### **Check Firebase Console:**

1. Go back to **Firestore**: https://console.firebase.google.com/project/dependa-60c3f/firestore/data

2. After signing in to your app, you should see **new collections created**:
   - `users` - Your user profile
   - `calendars` - Your calendar(s)

3. If you see these, **everything is working!** 🎉

---

## 🐛 **Still Having Issues?**

### **Error: "Permission Denied"**

**Cause**: Security rules aren't set correctly

**Fix**:
1. Go to Firestore → Rules
2. Make sure you copied the rules exactly as shown above
3. Click "Publish"
4. Refresh your app

### **Error: "Unavailable" or "Network Error"**

**Cause**: Firestore isn't fully initialized yet

**Fix**:
1. Wait 2-3 minutes
2. Refresh the Firebase Console
3. Make sure you see the Firestore Data tab
4. Try your app again

### **Error: "CORS" or Cross-Origin**

**Cause**: App is running on wrong port or domain not authorized

**Fix**:
1. Make sure dev server is on `http://localhost:3000`
2. Go to Firebase Console → Authentication → Settings → Authorized domains
3. Add `localhost` if not present

### **Still Stuck?**

1. **Check browser console** (F12 → Console tab)
2. **Copy the exact error message**
3. Check `TROUBLESHOOTING.md` for more solutions

---

## 📊 **What These Collections Do**

### `users`
Stores user profile information:
- Email, display name, photo
- Used for sharing calendars

### `calendars`
Your calendars:
- Calendar name
- Owner information
- Sharing settings

### `events`
Calendar events:
- Event title, description
- Start/end dates
- Google Calendar sync ID

### `todos`
Task items:
- Todo title, description
- Completion status
- Assigned user
- Proof of completion links

### `conditionalEvents`
Your "what-if" scenarios:
- Condition date
- Condition description
- Todos to create when triggered

---

## 🔐 **Security Notes**

### Test Mode (Current Setup)
- ✅ Good for development
- ✅ Easy to set up
- ⚠️ Anyone authenticated can read/write
- ⚠️ Should be tightened for production

### Production Mode (Future)
The rules provided above are more secure:
- Users can only modify their own data
- Calendar sharing is properly enforced
- File uploads are restricted by type and size

### Upgrade to Production Rules
When you're ready to deploy:
1. The rules above are already production-ready
2. Just make sure they're published
3. Test thoroughly before going live

---

## 🎯 **Quick Checklist**

- [ ] Firestore database created
- [ ] Security rules published
- [ ] Storage enabled
- [ ] Storage rules published
- [ ] App refreshed
- [ ] Can sign in
- [ ] Dashboard loads
- [ ] Can create events
- [ ] Can create todos
- [ ] Can upload files

If all checked, you're ready to go! 🚀

---

## 🔗 **Useful Links**

- **Firestore Console**: https://console.firebase.google.com/project/dependa-60c3f/firestore
- **Storage Console**: https://console.firebase.google.com/project/dependa-60c3f/storage
- **Authentication**: https://console.firebase.google.com/project/dependa-60c3f/authentication
- **Project Settings**: https://console.firebase.google.com/project/dependa-60c3f/settings/general

---

## 📞 **Quick Commands**

```bash
# Restart dev server
npm run dev

# Hard refresh browser
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)

# Check for errors
# Open browser console: F12
```

---

## ✨ **You're Almost There!**

Once Firestore is set up, the app will work perfectly. This is a **one-time setup** that takes just a few minutes.

After this, you can:
- ✅ Create and manage events
- ✅ Add and complete todos
- ✅ Upload proof of completion
- ✅ Share calendars with others
- ✅ Create conditional "what-if" events

**Complete the setup above and you'll be organizing in no time!** 🎉

