# Email Setup Guide - Nodemailer

This guide will help you set up email functionality for your Dependa calendar application.

## Overview

The app uses [Nodemailer](https://nodemailer.com) to send emails for:
- 📧 Calendar sharing invitations
- 📅 Daily todo reminders at 9 AM

Nodemailer supports various email services including Gmail, Outlook, SendGrid, and any SMTP server.

## Quick Setup Options

Choose the email service that works best for you:

### Option 1: Gmail (Recommended for Development)
### Option 2: Outlook/Office 365
### Option 3: Other SMTP Service (SendGrid, Mailgun, etc.)

---

## Option 1: Gmail Setup

### Step 1: Enable 2-Factor Authentication

1. Go to your [Google Account Security](https://myaccount.google.com/security)
2. Click on **2-Step Verification**
3. Follow the steps to enable it (if not already enabled)

### Step 2: Generate App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** as the app
3. Select **Other (Custom name)** as the device
4. Enter "Dependa Calendar" as the name
5. Click **Generate**
6. **Copy the 16-character password** (remove spaces if any)

### Step 3: Add to Environment Variables

Add these lines to your `.env.local` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-character-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
```

**Replace:**
- `your-email@gmail.com` with your actual Gmail address
- `your-16-character-app-password` with the app password you generated

---

## Option 2: Outlook/Office 365 Setup

### Step 1: Get Your Credentials

Use your Outlook/Office 365 email and password.

### Step 2: Add to Environment Variables

Add these lines to your `.env.local` file:

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-outlook-password
SMTP_FROM_EMAIL=your-email@outlook.com
```

**Replace:**
- `your-email@outlook.com` with your actual Outlook/Office 365 address
- `your-outlook-password` with your account password

**Note:** If you have 2FA enabled, you may need to generate an app password.

---

## Option 3: Other SMTP Services

### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM_EMAIL=noreply@yourdomain.com
```

### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@yourdomain.com
SMTP_PASSWORD=your-mailgun-password
SMTP_FROM_EMAIL=noreply@yourdomain.com
```

### Custom SMTP Server

```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASSWORD=your-password
SMTP_FROM_EMAIL=noreply@yourdomain.com
```

**Note:** Use `SMTP_PORT=465` and `SMTP_SECURE=true` if your server uses SSL/TLS.

---

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `SMTP_HOST` | Mail server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | Mail server port (587 for TLS, 465 for SSL) | `587` |
| `SMTP_SECURE` | Use SSL (true for port 465, false for port 587) | `false` |
| `SMTP_USER` | Your email username/address | `myemail@gmail.com` |
| `SMTP_PASSWORD` | Your email password or app password | `abc123...` |
| `SMTP_FROM_EMAIL` | Email address to send from (optional) | `myemail@gmail.com` |

---

## Step 4: Install Dependencies

Run this command to install Nodemailer:

```bash
npm install
```

This will install `nodemailer` and `@types/nodemailer` as specified in `package.json`.

---

## Step 5: Restart Your Dev Server

After adding environment variables, restart your development server:

```bash
# Stop the server (Ctrl+C), then restart:
npm run dev
```

---

## Step 6: Test Email Sending

### Test Calendar Sharing:
1. Go to your dashboard
2. Click **Share Calendar**
3. Enter an email address (use your own email for testing)
4. Check your inbox!

### Test Daily Reminders:
You can manually trigger the reminder endpoint using curl:

```bash
curl -X POST http://localhost:3000/api/send-daily-reminders
```

Or use PowerShell on Windows:

```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/send-daily-reminders -Method POST
```

---

## Troubleshooting

### Emails not sending?

1. **Check console for errors**
   - Look in your terminal where `npm run dev` is running
   - Look in browser console (F12 → Console tab)

2. **Verify environment variables**
   - Make sure there are no extra spaces
   - Make sure all required variables are set
   - Restart the dev server after changing `.env.local`

3. **Check spam folder**
   - Emails from personal accounts may land in spam

4. **Gmail-specific issues**
   - Make sure 2-Factor Authentication is enabled
   - Use an App Password, not your regular password
   - Check for security alerts from Google

### Common Errors

**"Email service not configured"**
- Your SMTP settings are missing from `.env.local`
- Solution: Add all required SMTP variables and restart the server

**"Invalid login"**
- Wrong username or password
- For Gmail: Make sure you're using an App Password, not your regular password
- Solution: Double-check credentials and regenerate if needed

**"Connection timeout"**
- Wrong SMTP host or port
- Firewall blocking the connection
- Solution: Verify SMTP settings for your email provider

**"Self-signed certificate" error**
- The SMTP server uses a self-signed SSL certificate
- Solution: For development only, you can add `tls: { rejectUnauthorized: false }` to the transporter config

---

## Email Limits

### Gmail:
- ✅ 500 emails per day (free account)
- ✅ 2,000 emails per day (Google Workspace)
- ⚠️ May be limited further if flagged as spam

### Outlook:
- ✅ 300 emails per day (personal)
- ✅ 10,000 emails per day (Office 365)

### SendGrid:
- ✅ 100 emails per day (free tier)
- 💰 Paid plans for higher volumes

### Mailgun:
- ✅ 5,000 emails per month (free tier)
- 💰 Paid plans for higher volumes

---

## Production Deployment (Vercel)

When deploying to Vercel:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add all SMTP variables:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_SECURE`
   - `SMTP_USER`
   - `SMTP_PASSWORD`
   - `SMTP_FROM_EMAIL` (optional)
4. Redeploy your application

**Security Note:** Never commit your `.env.local` file to Git. It's already in `.gitignore`.

---

## Advanced Configuration

### Using SSL (Port 465)

If your SMTP server requires SSL instead of TLS:

```env
SMTP_PORT=465
SMTP_SECURE=true
```

### Custom Transporter Options

For advanced users, you can modify the transporter configuration in:
- `app/api/send-daily-reminders/route.ts`
- `app/api/send-share-email/route.ts`

Example options:
```typescript
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  // Optional: For self-signed certificates (dev only!)
  tls: {
    rejectUnauthorized: false
  },
  // Optional: Connection timeout
  connectionTimeout: 10000,
});
```

---

## Support

- Nodemailer Documentation: [https://nodemailer.com/about/](https://nodemailer.com/about/)
- Gmail App Passwords: [https://support.google.com/accounts/answer/185833](https://support.google.com/accounts/answer/185833)
- Outlook SMTP Settings: [https://support.microsoft.com/en-us/office/pop-imap-and-smtp-settings-8361e398-8af4-4e97-b147-6c6c4ac95353](https://support.microsoft.com/en-us/office/pop-imap-and-smtp-settings-8361e398-8af4-4e97-b147-6c6c4ac95353)

---

## What's Already Set Up

✅ Nodemailer package installed
✅ Email routes updated to use Nodemailer
✅ Error handling for missing SMTP configuration
✅ Console logging for debugging
✅ Support for multiple SMTP providers

## You Just Need To:

1. Choose your email service (Gmail, Outlook, etc.)
2. Get your SMTP credentials (app password for Gmail)
3. Add SMTP settings to `.env.local`
4. Restart dev server
5. Test! 🎉

