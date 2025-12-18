# How to Fix the ReferenceError

## The Issue
The error `ReferenceError: LEEGALITY_PROFILE_ID is not defined` is likely from a cached version of the file.

## Solution

### Step 1: Stop the Server Completely
1. Press `Ctrl+C` in the terminal where the server is running
2. Wait until it fully stops (you should see the prompt again)

### Step 2: Clear Node Cache (Optional but Recommended)
```bash
# In the backend directory
cd backend
# Clear npm cache
npm cache clean --force
```

### Step 3: Restart the Server
```bash
# Make sure you're in the backend directory
cd backend
npm start
# or if using nodemon
nodemon server.js
```

### Step 4: Verify the .env File Exists
Make sure you have a `backend/.env` file with:
```env
LEEGALITY_API_BASE=https://app1.leegality.com/api/v3.0
LEEGALITY_AUTH_TOKEN=bh7z0W6vWdcYeuAW3gkjXsoU8rnCaFBA
LEEGALITY_PROFILE_ID=your-workflow-profile-id-here
```

## If Error Persists

1. **Check if the file was saved correctly:**
   - Open `backend/services/leegalityService.js`
   - Go to line 27
   - It should say: `hasProfileId: !!LEGALITY_PROFILE_ID,` (single E in LEGALITY)
   - NOT: `hasProfileId: !!LEEGALITY_PROFILE_ID,` (double E)

2. **Verify line 21:**
   - Should say: `const LEGALITY_PROFILE_ID = process.env.LEEGALITY_PROFILE_ID || "";`

3. **If the file looks wrong, the fix has been applied. Just restart the server.**

## Alternative: Manual Fix

If restarting doesn't work, manually check line 27 in `backend/services/leegalityService.js`:

**WRONG (causes error):**
```javascript
hasProfileId: !!LEEGALITY_PROFILE_ID,  // Double E - WRONG!
```

**CORRECT:**
```javascript
hasProfileId: !!LEGALITY_PROFILE_ID,  // Single E - CORRECT!
```

The variable is defined as `LEGALITY_PROFILE_ID` (single E), so it must be referenced the same way.



