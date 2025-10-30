# 🚀 Dependa - Quick Start Guide

Get your conditional calendar app running in 5 minutes!

---

## ⚡ Super Quick Start (No Configuration)

The app works immediately with just Firebase (already configured):

```bash
# 1. Install dependencies
npm install

# 2. Run the app
npm run dev

# 3. Open browser
# http://localhost:3000
```

That's it! You can now:
- ✅ Sign in with Google
- ✅ Create events
- ✅ Add todos
- ✅ Create conditional events
- ✅ Share calendars
- ✅ Upload files

---

## 🎯 First Steps After Starting

### 1. Sign In
- Click "Sign in with Google"
- Choose your Google account
- Authorize the app

### 2. Your Dashboard Appears
- **Left side (70%)**: Your calendar for this month
- **Right side (30%)**: Your todo list

### 3. Try Creating an Event
- Click "Add Event" button
- Fill in: "Team Meeting"
- Set date: Tomorrow
- Click "Save Event"
- ✅ Event appears on calendar!

### 4. Try Creating a Todo
- Click "Add Task" button in todo panel
- Fill in: "Review project proposal"
- Click "Add Task"
- ✅ Todo appears in list!

### 5. Try a Conditional Event (The Cool Part!)
- Click "Conditional Event" in header (purple button)
- Set condition date: Next week
- Description: "If project approved"
- Add todos:
  - "Schedule kickoff meeting"
  - "Assign team members"
  - "Create project timeline"
- Click "Create Conditional Event"
- ✅ When the date arrives, these todos will automatically appear!

### 6. Complete a Todo
- Click the circle next to any todo
- ✅ It becomes a checkmark!
- Click "Upload Proof" to add a file (optional)

### 7. Share Your Calendar
- Click "Share" button in header
- Enter a friend's email
- ✅ They get an invitation email!

### 8. View Completed Tasks
- Click "Completed" button in header
- See all finished tasks
- View uploaded proof files

---

## 🎨 What You'll See

### Dashboard Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Dependa    [Conditional Event] [Share] [Completed] [👤▼]  │
├─────────────────────────────────────────────────────────────┤
│                                              │               │
│  Calendar (70%)                              │  Todo (30%)   │
│                                              │               │
│  ┌─────────────────────────────────┐       │  ☐ Task 1     │
│  │  November 2024        [< >]      │       │  ☐ Task 2     │
│  │  [Sync] [Add Event]              │       │  ☑ Task 3     │
│  ├─────────────────────────────────┤       │  ☐ Task 4     │
│  │ Sun Mon Tue Wed Thu Fri Sat     │       │               │
│  │                                   │       │  [Add Task]   │
│  │  1   2   3   4   5   6   7      │       │               │
│  │      •Meeting                    │       │               │
│  │  8   9   10  11  12  13  14     │       │               │
│  │          •Lunch                  │       │               │
│  └─────────────────────────────────┘       │               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔥 Cool Features to Try

### 1. Conditional Events
**Scenario**: Planning for a house sale

1. Click "Conditional Event"
2. Date: December 15, 2024
3. Condition: "If house sells"
4. Add todos:
   - "Plan estate sale"
   - "Hire movers"
   - "Update address"
   - "Cancel utilities"
5. Save it

**Result**: On Dec 15, all 4 todos automatically appear in your list!

### 2. Team Collaboration
**Scenario**: Sharing with your team

1. Click "Share"
2. Enter: teammate@email.com
3. Check "Allow editing"
4. Send invite

**Result**: They can now add events and todos to your calendar!

### 3. Task Assignment
**Scenario**: Assigning work to team members

1. Add a todo: "Write project proposal"
2. In the dropdown, select a team member
3. Save it

**Result**: At 9am daily, they get an email with their assigned tasks!

### 4. Proof of Completion
**Scenario**: Document completion

1. Complete a task (check the box)
2. Click "Upload Proof"
3. Drag & drop a screenshot or PDF
4. Upload

**Result**: Proof is permanently attached and viewable!

---

## 🎯 Example Use Cases

### For Overthinkers
```
Condition: "If I get the job offer on Nov 20"
Todos:
  → Research neighborhoods near office
  → Calculate commute times
  → Plan resignation from current job
  → Draft acceptance email
  → Update LinkedIn profile
```

### For Event Planning
```
Condition: "If venue books for June 15"
Todos:
  → Send save-the-dates
  → Book caterer
  → Hire photographer
  → Order invitations
  → Create guest list spreadsheet
```

### For Project Managers
```
Condition: "If client approves budget on Dec 1"
Todos:
  → Schedule kickoff meeting
  → Assign team members
  → Create Gantt chart
  → Set up project tracking
  → Draft contract amendments
```

---

## 🔧 Optional: Enable Google Calendar Sync

Want to sync with your actual Google Calendar?

### Quick Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project
3. Enable "Google Calendar API"
4. Create OAuth 2.0 credentials
5. Copy the credentials
6. Create `.env.local`:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
7. Restart the app

Now the "Sync Google Calendar" button works!

---

## 📱 Mobile Friendly

The app works great on phones and tablets:
- Responsive design
- Touch-friendly buttons
- Swipe to navigate months
- Mobile-optimized modals

---

## 🎓 Learn More

### Read These Files:
- **README.md** - Full documentation
- **SETUP.md** - Detailed setup instructions
- **PROJECT_SUMMARY.md** - Complete feature list

### Key Technologies:
- Next.js (React framework)
- Firebase (Database & Auth)
- Tailwind CSS (Styling)
- TypeScript (Type safety)

---

## ❓ Troubleshooting

### "Firebase error" when signing in?
→ This shouldn't happen - Firebase is pre-configured!

### Can't see my events?
→ Make sure you're signed in
→ Check you're on the right month

### Upload not working?
→ Check file size (max 10MB)
→ Use supported formats: jpg, png, pdf, doc

### Share button not working?
→ Email sending is set up for production
→ In development, invites are logged to console

---

## 🚀 Deploy to Production

### Vercel (Easiest):
```bash
# 1. Push to GitHub
git add .
git commit -m "Initial commit"
git push

# 2. Go to vercel.com
# 3. Import your GitHub repo
# 4. Add environment variables (if using Google Calendar)
# 5. Deploy!
```

The app includes `vercel.json` for automatic daily email reminders!

---

## 🎉 You're All Set!

Start using Dependa to organize your overthinking into action!

**Pro Tips:**
- Use conditional events for "what-if" scenarios
- Share calendars with people you trust
- Upload proof for important completed tasks
- Check the "Completed" page to see your progress

**Have questions?**
- Check the README.md
- Review the code (it's well-commented!)
- Open an issue on GitHub

Happy organizing! 🎊

