# Email Setup Guide

## Overview
The email adapter supports real email sending via SMTP (using Nodemailer). By default, it runs in mock mode (logs to console) until SMTP is configured.

## Quick Setup (Gmail)

### Step 1: Enable App Password for Gmail

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already enabled)
3. Go to **App passwords**: https://myaccount.google.com/apppasswords
4. Select **Mail** and **Other (Custom name)**
5. Enter "Huelip Backend" as the name
6. Click **Generate**
7. Copy the 16-character app password (you'll need this)

### Step 2: Add SMTP Configuration to .env

Add these lines to your `backend/.env` file:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM=your-email@gmail.com
```

**Example:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=userusage04@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
SMTP_FROM=userusage04@gmail.com
```

### Step 3: Restart Backend Server

After adding SMTP configuration, restart your backend server:

```bash
cd backend
npm run dev
```

## Alternative Email Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
SMTP_FROM=your-email@outlook.com
```

### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@yahoo.com
```

### Custom SMTP Server
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
SMTP_FROM=noreply@yourdomain.com
```

## Testing Email Configuration

After setup, when you send a quote to a client, check the backend console:

**If SMTP is configured correctly:**
```
✅ [EMAIL ADAPTER] SMTP configured: { host: 'smtp.gmail.com', port: '587', user: 'your-email@gmail.com' }
📧 [EMAIL ADAPTER] Sending real email via SMTP...
✅ [EMAIL ADAPTER] Email sent successfully!
   Message ID: <...>
```

**If SMTP is not configured (Mock Mode):**
```
⚠️ [EMAIL ADAPTER] SMTP not configured. Running in MOCK mode...
📧 [EMAIL ADAPTER] MOCK MODE - Email would be sent:
```

## Troubleshooting

### Gmail "Less secure app access" error
- Use App Password instead of regular password (see Step 1 above)
- Make sure 2-Step Verification is enabled

### Connection timeout
- Check firewall settings
- Verify SMTP_HOST and SMTP_PORT are correct
- Try port 465 with `secure: true` (update code if needed)

### Authentication failed
- Double-check SMTP_USER and SMTP_PASS
- For Gmail, ensure you're using App Password, not regular password
- Verify email address is correct

### Emails going to spam
- Add SPF and DKIM records to your domain (for custom domains)
- Use a professional email address
- Include proper email headers

## Security Notes

1. **Never commit .env file** - It contains sensitive credentials
2. **Use App Passwords** - Don't use your main account password
3. **Environment Variables** - In production, use secure environment variable management
4. **Rate Limiting** - Consider implementing rate limiting for email sending

## Production Recommendations

For production, consider using:
- **SendGrid** - Professional email service with better deliverability
- **AWS SES** - Cost-effective for high volume
- **Mailgun** - Developer-friendly API
- **Postmark** - Transactional email specialist

These services provide:
- Better deliverability rates
- Email analytics
- Bounce handling
- Unsubscribe management

