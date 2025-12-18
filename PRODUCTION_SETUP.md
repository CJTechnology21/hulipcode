# Leegality Production Setup

## ✅ Your Account is Production

Since you can only log in to `https://app1.leegality.com`, your account is **Production**, not Sandbox.

## 📝 Update Your Backend .env File

Create or update `backend/.env` with these settings:

```env
# Leegality API Configuration (PRODUCTION)
LEEGALITY_API_BASE=https://app1.leegality.com/api/v3.0
LEEGALITY_AUTH_TOKEN=bh7z0W6vWdcYeuAW3gkjXsoU8rnCaFBA
LEEGALITY_PROFILE_ID=your-workflow-profile-id-here
```

## 🔑 Get Your Workflow Profile ID

1. **Log in** to `https://app1.leegality.com`
2. Go to **Workflows** in the left panel
3. Find your workflow (or create one if you don't have it)
4. Click the **three dots (⋮)** next to it
5. Select **Download API Payload**
6. Open the downloaded JSON file
7. Copy the `profileId` value
8. Paste it in your `.env` file as `LEEGALITY_PROFILE_ID`

## ⚙️ Enable API (If Not Already Enabled)

1. In your Leegality dashboard, go to **Settings ⚙️ > API**
2. Click **Enable API** if it's not already enabled
3. Copy your Auth Token from there (should match: `bh7z0W6vWdcYeuAW3gkjXsoU8rnCaFBA`)

## 🔒 IP Whitelisting (Optional but Recommended)

If IP whitelisting is enabled in your account:

1. Go to **Settings ⚙️ > API**
2. Find **IP Whitelisting** section
3. Add your server's IP address
4. Click the **+** icon

## 🚀 Restart Your Backend Server

After updating `.env`, restart your backend:

```bash
cd backend
# Stop the server (Ctrl+C if running)
# Then restart:
npm start
# or
node server.js
```

## ✅ Verify Configuration

When your backend starts, you should see in the console:

```
Leegality Service initialized: {
  baseUrl: 'https://app1.leegality.com/api/v3.0',
  hasToken: true,
  tokenPreview: 'bh7z0W6vWdc...',
  hasProfileId: true,
  profileId: 'your-profile-id'
}
```

## 🧪 Test the Integration

1. Try signing a contract from your frontend
2. Check the backend console logs
3. You should see successful API calls to `app1.leegality.com`

## ❌ If You Still Get 401 Errors

1. **Verify Profile ID**: Make sure `LEEGALITY_PROFILE_ID` is set correctly
2. **Check API Status**: Ensure API is enabled in Settings > API
3. **Verify Token**: Make sure the token in `.env` matches the one in Dashboard > Settings > API
4. **IP Whitelisting**: If enabled, make sure your server IP is whitelisted
5. **Workflow Status**: Make sure your workflow is **Published** (not Draft)

## 📞 Need Help?

If you still have issues:
- Check the backend console logs for detailed error messages
- Verify all settings in your Leegality Production dashboard
- Make sure your workflow is published and has the correct signer roles



