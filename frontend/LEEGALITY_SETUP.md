# Leegality API Setup Guide

## Quick Setup

### Step 1: Create `.env` file

Create a file named `.env` in the `frontend` directory with the following content:

```env
# Leegality API Configuration
REACT_APP_LEEGALITY_API_BASE=https://sandbox.leegality.com/api/v3.0
REACT_APP_LEEGALITY_AUTH_TOKEN=your-auth-token-here
REACT_APP_LEEGALITY_PROFILE_ID=your-workflow-id-here
REACT_APP_LEEGALITY_PRIVATE_SALT=your-private-salt-here
REACT_APP_LEEGALITY_ENV=sandbox
```

### Step 2: Get Your Credentials

1. **Auth Token:**
   - Go to [Leegality Dashboard](https://sandbox.leegality.com) (or app1.leegality.com for production)
   - Navigate to **API Settings**
   - Copy your **Auth Token**

2. **Workflow Profile ID:**
   - Go to **Workflows** in your Leegality Dashboard
   - Create a new Workflow or select an existing one
   - Copy the **Workflow ID** (also called Profile ID)
   - Make sure the workflow is in **Published** state

3. **Private Salt (Optional):**
   - Found in **API Settings** > **Private Salt**
   - Used for webhook verification

### Step 3: Update `.env` File

Replace the placeholder values with your actual credentials:

```env
REACT_APP_LEEGALITY_API_BASE=https://sandbox.leegality.com/api/v3.0
REACT_APP_LEEGALITY_AUTH_TOKEN=abc123xyz789  # Your actual token
REACT_APP_LEEGALITY_PROFILE_ID=workflow-12345  # Your actual workflow ID
REACT_APP_LEEGALITY_PRIVATE_SALT=your-actual-salt  # Optional
REACT_APP_LEEGALITY_ENV=sandbox
```

### Step 4: Restart Development Server

After updating `.env`, **restart your development server** for changes to take effect:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm start
```

## Alternative: Quick Fix (Temporary)

If you want to test quickly without setting up `.env`, you can pass `profileId` directly in the code:

1. Open `frontend/src/Admin/components/Quote/SignContract.jsx`
2. Find the `contractData` object (around line 125)
3. Uncomment and set the `profileId`:

```javascript
const contractData = {
  profileId: "your-workflow-id-here", // Add your workflow ID here
  // ... rest of the code
};
```

**Note:** This is a temporary solution. For production, always use `.env` file.

## Workflow Types

### Template Workflow (Recommended)

1. Create a Template in Leegality Dashboard
2. Add fillable fields to your template
3. Download Form Fields to get field names
4. Use `prepareTemplateFields()` function to map your data

### PDF Workflow

1. Create a PDF Workflow in Leegality Dashboard
2. Provide PDF file in base64 format
3. Currently, HTML documents need to be converted to PDF

## Troubleshooting

### Error: "Profile ID is required"
- Make sure `REACT_APP_LEEGALITY_PROFILE_ID` is set in `.env`
- Or pass `profileId` directly in `contractData`
- Restart your dev server after updating `.env`

### Error: "Auth Token is required"
- Get your Auth Token from Dashboard > API Settings
- Add it to `.env` as `REACT_APP_LEEGALITY_AUTH_TOKEN`
- Restart your dev server

### SSL Certificate Error
- Make sure you're using the correct API base URL
- Sandbox: `https://sandbox.leegality.com/api/v3.0`
- Production: `https://app1.leegality.com/api/v3.0`

## Production Setup

When moving to production:

1. Update `.env`:
   ```env
   REACT_APP_LEEGALITY_API_BASE=https://app1.leegality.com/api/v3.0
   REACT_APP_LEEGALITY_ENV=production
   ```

2. Use production credentials from your Leegality production account

3. Make sure your production workflow is published

## Support

- Leegality Documentation: https://docs.leegality.com/v3
- Leegality Support: support@leegality.com



