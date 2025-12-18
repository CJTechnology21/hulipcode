# Leegality Profile ID Setup

## Your Profile ID from API Payload

Based on the API Payload you downloaded from Leegality Dashboard, your **Profile ID** is:

```
0l5Qk1j
```

## Setup Instructions

### 1. Update Backend `.env` File

Add or update the following in `backend/.env`:

```env
LEEGALITY_API_BASE=https://app1.leegality.com/api/v3.0
LEEGALITY_AUTH_TOKEN=your-auth-token-here
LEEGALITY_PROFILE_ID=0l5Qk1j
```

### 2. Verify Your Auth Token

1. Log in to https://app1.leegality.com
2. Go to **Settings > API**
3. Copy your **Auth Token**
4. Make sure it matches the token in your `.env` file

### 3. Restart Backend Server

After updating `.env`, restart your backend:

```bash
cd backend
npm start
```

## API Payload Structure

The code now matches the exact structure from your API Payload:

```json
{
  "profileId": "0l5Qk1j",
  "file": {
    "name": "Contract Document",
    "file": "base64-encoded-pdf-string"
  },
  "invitees": [
    {
      "name": "Signer Name",
      "email": "signer@example.com",
      "phone": "optional-phone-number"
    }
  ],
  "irn": "optional-internal-reference-number"
}
```

## Troubleshooting

If you still get 401 errors:

1. **Verify Profile ID**: Make sure `LEEGALITY_PROFILE_ID=0l5Qk1j` is in your `.env`
2. **Check Token**: Ensure your token is from Production (app1.leegality.com), not Sandbox
3. **IP Whitelisting**: Check if IP whitelisting is enabled in Settings > API
4. **API Enabled**: Ensure API access is enabled in Settings > API

## Testing

After setup, try signing a contract. Check the backend console for:
- `=== Leegality API Request Payload ===` - Shows the exact payload being sent
- `=== Leegality API Full Response ===` - Shows the response from Leegality


