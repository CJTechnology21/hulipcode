# Leegality API Setup Checklist

Based on Leegality Support's response, follow these steps to fix the 401 error:

## ✅ Step 1: Verify Your Auth Token

1. Go to **Leegality Sandbox Dashboard** (not Production)
2. Navigate to **Settings ⚙️ > API**
3. Copy your **Auth Token** (should start with `bh7z0W6vWdcYeuAW3gkjXsoU8rnCaFBA`)
4. Make sure you're using the **Sandbox** token (not Production)

## ✅ Step 2: Enable API (If Not Already Enabled)

1. Go to **Settings ⚙️ > API**
2. Click **Enable API** button
3. Verify API is enabled

## ✅ Step 3: Get Your Workflow Profile ID (REQUIRED!)

**Option 1: From Workflows List**
1. Go to **Workflows** in the left panel
2. Find your workflow
3. The **Workflow ID** is displayed there

**Option 2: Download API Payload (Recommended)**
1. Go to **Workflows** in the left panel
2. Find your workflow
3. Click the **three dots (⋮)** next to it
4. Select **Download API Payload**
5. Open the downloaded JSON file
6. Copy the `profileId` value

**If you don't have a workflow:**
1. Go to **Workflows > + Create**
2. Configure the signing journey, template, and signer details
3. **Publish** the workflow (status must be Published)
4. Then get the Profile ID using one of the methods above

## ✅ Step 4: Update Your Backend .env File

Add these to your `backend/.env` file:

```env
# Leegality API Configuration
LEEGALITY_API_BASE=https://sandbox.leegality.com/api/v3.0
LEEGALITY_AUTH_TOKEN=bh7z0W6vWdcYeuAW3gkjXsoU8rnCaFBA
LEEGALITY_PROFILE_ID=your-workflow-profile-id-here
```

**Important:**
- Replace `your-workflow-profile-id-here` with the actual Profile ID from Step 3
- Make sure the token is from **Sandbox** (not Production)
- The API base URL should be `https://sandbox.leegality.com/api/v3.0` for testing

## ✅ Step 5: IP Whitelisting (Optional but Recommended)

If IP whitelisting is enabled in your Leegality account:

1. Go to **Settings ⚙️ > API**
2. Find **IP Whitelisting** section
3. Enter your server's IPv4 address (format: x.x.x.x)
4. Click the **+** icon to add it

**To find your server IP:**
- If running locally: Use `localhost` or your public IP
- If deployed: Use your server's public IP address

## ✅ Step 6: Restart Your Backend Server

After updating `.env`, restart your backend server:

```bash
cd backend
npm start
# or
node server.js
```

## ✅ Step 7: Test the Integration

1. Try signing a contract from your frontend
2. Check the backend console logs for:
   - "Leegality Service initialized" - should show your config
   - "Sending contract to Leegality API v3.0" - should show profileId
   - Any error messages

## 🔍 Troubleshooting 401 Errors

If you still get a 401 error, check:

### ❌ Environment Mismatch (Most Common!)
- **Problem:** Your Auth Token is from Production but calling Sandbox (or vice versa)
- **Solution:** Verify your token is from **Sandbox Dashboard > Settings > API**
- **Check:** Make sure `LEEGALITY_API_BASE` matches your token's environment

### ❌ API Not Enabled
- **Problem:** API is not enabled in your Sandbox account
- **Solution:** Go to **Settings ⚙️ > API** and click **Enable API**

### ❌ Missing Profile ID
- **Problem:** `LEEGALITY_PROFILE_ID` is not set or incorrect
- **Solution:** Get your Workflow Profile ID from **Workflows > Download API Payload**
- **Check:** Make sure the workflow is **Published** (not Draft)

### ❌ IP Whitelisting
- **Problem:** IP whitelisting is enabled but your server IP is not whitelisted
- **Solution:** Add your server IP in **Settings ⚙️ > API > IP Whitelisting**

### ❌ Invalid/Expired Token
- **Problem:** Token was regenerated or expired
- **Solution:** Get a fresh token from **Settings ⚙️ > API**

## 📋 Quick Verification

Run this command to verify your backend can see the environment variables:

```bash
cd backend
node -e "require('dotenv').config(); console.log('API Base:', process.env.LEEGALITY_API_BASE); console.log('Has Token:', !!process.env.LEEGALITY_AUTH_TOKEN); console.log('Has Profile ID:', !!process.env.LEEGALITY_PROFILE_ID);"
```

Expected output:
```
API Base: https://sandbox.leegality.com/api/v3.0
Has Token: true
Has Profile ID: true
```

## 📞 Still Having Issues?

If you've checked all the above and still get errors:

1. Check the backend console logs for the exact error message
2. Verify the token and Profile ID are correct
3. Try the cURL example from Leegality support:
   ```bash
   curl -X POST https://sandbox.leegality.com/api/v3.0/sign/request \
     -H "X-Auth-Token: bh7z0W6vWdcYeuAW3gkjXsoU8rnCaFBA" \
     -H "Content-Type: application/json" \
     -d '{
       "profileId": "your-workflow-profile-id-here",
       "file": {
         "name": "Contract Document"
       }
     }'
   ```



