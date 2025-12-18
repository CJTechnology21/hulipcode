# Quick Email Setup - Send Real Emails

## Problem
Currently, emails are only logged to console (mock mode). To send real emails to clients, you need to configure SMTP.

## Solution: Configure Gmail SMTP

### Step 1: Get Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with your Gmail account
3. Select **Mail** → **Other (Custom name)**
4. Enter: "Huelip Backend"
5. Click **Generate**
6. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

### Step 2: Add to Backend .env File

Open `backend/.env` and add these lines:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=userusage04@gmail.com
SMTP_PASS=your-16-character-app-password-here
SMTP_FROM=userusage04@gmail.com
```

**Important:** Replace `your-16-character-app-password-here` with the actual app password you copied in Step 1.

### Step 3: Restart Backend Server

Stop your backend server (Ctrl+C) and restart it:

```bash
cd backend
npm run dev
```

### Step 4: Test

1. Create a lead with an email address
2. Create a quote from that lead
3. Click "Send to Client" button
4. Check the backend console - you should see:
   ```
   ✅ [EMAIL ADAPTER] SMTP configured
   📧 [EMAIL ADAPTER] Sending real email via SMTP...
   ✅ [EMAIL ADAPTER] Email sent successfully!
   ```
5. Check the client's email inbox (and spam folder)

## Troubleshooting

### "Authentication failed" error
- Make sure you're using **App Password**, not your regular Gmail password
- Verify the app password is correct (no spaces, all 16 characters)

### "Connection timeout" error
- Check your internet connection
- Verify firewall isn't blocking port 587
- Try port 465 instead (update SMTP_PORT in .env)

### Emails not received
- Check spam/junk folder
- Verify email address is correct
- Check backend console for error messages

## Alternative: Use Different Email Provider

If you don't want to use Gmail, you can use any SMTP provider:

**Outlook:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
SMTP_FROM=your-email@outlook.com
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@yahoo.com
```

## Need Help?

Check `backend/EMAIL_SETUP.md` for detailed instructions and troubleshooting.

