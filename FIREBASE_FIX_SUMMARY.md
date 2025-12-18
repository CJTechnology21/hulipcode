# Firebase Configuration Fix

## Issue

The application was crashing on startup with error:
```
Error: Cannot find module './serviceAccountKey.json'
```

This occurred because `sendFCM.js` was trying to require `serviceAccountKey.json` at module load time, even when the file didn't exist.

## Solution

Made Firebase initialization **optional and lazy**:

1. **Lazy Initialization**: Firebase only initializes when actually needed (when sending FCM)
2. **File Existence Check**: Checks if `serviceAccountKey.json` exists before requiring it
3. **Graceful Degradation**: Application continues to run without Firebase, with warnings
4. **Multiple Path Support**: Checks both `backend/utils/` and `backend/` for the file

## Changes Made

### 1. `backend/utils/sendFCM.js`
- ✅ Changed from immediate initialization to lazy initialization
- ✅ Added file existence check before requiring `serviceAccountKey.json`
- ✅ Returns `null` if Firebase is not available (instead of crashing)
- ✅ Checks both `backend/utils/` and `backend/` directories

### 2. `backend/utils/firebase.js`
- ✅ Changed from immediate initialization to lazy initialization
- ✅ Added file existence check
- ✅ Checks both `backend/utils/` and `backend/` directories

### 3. `backend/services/adapters/pushAdapter.js`
- ✅ Handles `null` return from `sendFCM()` gracefully
- ✅ Returns mock response when Firebase is not available
- ✅ Doesn't throw errors, allowing other notification channels to work

## Behavior

### Without `serviceAccountKey.json`
- ✅ Application starts successfully
- ⚠️ Warning message: "Firebase serviceAccountKey.json not found. Push notifications will be disabled."
- ✅ All other features work normally
- ✅ Push notifications are skipped (not sent)

### With `serviceAccountKey.json`
- ✅ Application starts successfully
- ✅ Firebase initializes automatically
- ✅ Push notifications work normally
- ✅ No warnings

## File Locations

The code checks for `serviceAccountKey.json` in:
1. `backend/utils/serviceAccountKey.json` (first)
2. `backend/serviceAccountKey.json` (fallback)

## How to Enable Firebase

1. **Get Service Account Key:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file

2. **Place the File:**
   ```bash
   # Option 1: In backend root
   cp ~/Downloads/your-service-account-key.json backend/serviceAccountKey.json
   
   # Option 2: In backend/utils
   cp ~/Downloads/your-service-account-key.json backend/utils/serviceAccountKey.json
   ```

3. **Restart Server:**
   ```bash
   npm run dev
   ```

4. **Verify:**
   - Look for: "✅ Firebase initialized successfully"
   - No warnings about missing file

## Testing

The application should now:
- ✅ Start without `serviceAccountKey.json`
- ✅ Show warning but continue running
- ✅ Initialize Firebase when file is added
- ✅ Send push notifications when Firebase is available

## Notes

- The file `serviceAccountKey.json` is already in `.gitignore`
- Never commit this file to version control
- For production, consider using environment variables instead
- Push notifications will be skipped if Firebase is not configured (non-blocking)

