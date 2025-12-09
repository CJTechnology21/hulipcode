# Firebase Service Account Setup

This project uses Firebase Admin SDK for push notifications and authentication.

## Steps to Get serviceAccountKey.json

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Select or Create a Project**
   - If you don't have a project, click "Add project"
   - Follow the setup wizard

3. **Navigate to Service Accounts**
   - Click the gear icon (⚙️) next to "Project Overview"
   - Select "Project settings"
   - Go to the "Service accounts" tab

4. **Generate Private Key**
   - Click "Generate new private key"
   - A dialog will appear warning you about security
   - Click "Generate key"
   - A JSON file will be downloaded

5. **Save the File**
   - Rename the downloaded file to: `serviceAccountKey.json`
   - Move it to the `backend/` directory
   - **Important:** Never commit this file to Git (it's already in .gitignore)

## File Structure

The `serviceAccountKey.json` file should look like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

## Security Notes

⚠️ **IMPORTANT:**
- This file contains sensitive credentials
- Never share it publicly
- Never commit it to version control
- Keep it secure on your local machine only
- For production, use environment variables or secure secret management

## Verification

After placing the file, you can verify it works by starting the backend server:

```bash
cd backend
npm run dev
```

If there are no Firebase-related errors, the setup is correct!

## Troubleshooting

**Error: "Cannot find module './serviceAccountKey.json'"**
- Ensure the file is in the `backend/` directory
- Check the filename is exactly `serviceAccountKey.json` (case-sensitive)

**Error: "Invalid service account credentials"**
- Re-download the service account key from Firebase Console
- Ensure the file is valid JSON (not corrupted)

**Error: "Permission denied"**
- Check file permissions
- Ensure the file is readable by Node.js

