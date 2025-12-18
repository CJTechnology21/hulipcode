# How to Verify Your Leegality Token is from Sandbox

## Method 1: Check the Dashboard URL (Easiest)

1. **Open your browser** and go to your Leegality dashboard
2. **Look at the URL** in your address bar:
   - ✅ **Sandbox**: `https://sandbox.leegality.com` or `https://app.sandbox.leegality.com`
   - ✅ **Production**: `https://app1.leegality.com` or `https://app.leegality.com`
3. **If the URL contains "sandbox"** → Your token is from Sandbox
4. **If the URL does NOT contain "sandbox"** → Your token is from Production

---

## Method 2: Check API Settings Page

1. **Log in** to your Leegality dashboard
2. Go to **Settings ⚙️** (usually in the top right or sidebar)
3. Click on **API** or **API Settings**
4. **Look at the page header or title**:
   - ✅ **Sandbox**: Page will show "Sandbox", "Test Environment", or "Development"
   - ✅ **Production**: Page will show "Production", "Live Environment", or nothing special
5. **The token shown on this page** is from the environment you're currently logged into

---

## Method 3: Visual Check in Dashboard

**Sandbox Dashboard:**
- Usually has a banner or indicator saying "Sandbox" or "Test Environment"
- May have different colors (often orange/yellow for testing)
- URL contains "sandbox"

**Production Dashboard:**
- No special indicators
- Usually looks more "professional" or "live"
- URL does NOT contain "sandbox"

---

## Method 4: Test with cURL (Advanced)

Open your terminal/command prompt and run:

### Test Sandbox:
```bash
curl -X POST https://sandbox.leegality.com/api/v3.0/sign/request \
  -H "X-Auth-Token: bh7z0W6vWdcYeuAW3gkjXsoU8rnCaFBA" \
  -H "Content-Type: application/json" \
  -d '{"profileId":"test","file":{"name":"test.pdf"}}'
```

**Result:**
- ✅ **400 Bad Request** = Token is from Sandbox! (Auth passed, but invalid data)
- ❌ **401 Unauthorized** = Token is NOT from Sandbox

### Test Production:
```bash
curl -X POST https://app1.leegality.com/api/v3.0/sign/request \
  -H "X-Auth-Token: bh7z0W6vWdcYeuAW3gkjXsoU8rnCaFBA" \
  -H "Content-Type: application/json" \
  -d '{"profileId":"test","file":{"name":"test.pdf"}}'
```

**Result:**
- ✅ **400 Bad Request** = Token is from Production! (Auth passed, but invalid data)
- ❌ **401 Unauthorized** = Token is NOT from Production

---

## Quick Decision Guide

**If you see "sandbox" in the URL when logged in:**
- ✅ Your token is from **Sandbox**
- ✅ Use: `LEEGALITY_API_BASE=https://sandbox.leegality.com/api/v3.0`

**If you DON'T see "sandbox" in the URL:**
- ✅ Your token is from **Production**
- ✅ Use: `LEEGALITY_API_BASE=https://app1.leegality.com/api/v3.0`

---

## Common Mistake (Causes 401 Error)

❌ **Wrong**: Using Sandbox token with Production endpoint
```env
LEEGALITY_API_BASE=https://app1.leegality.com/api/v3.0  # Production
LEEGALITY_AUTH_TOKEN=bh7z0W6vWdcYeuAW3gkjXsoU8rnCaFBA  # But this is Sandbox token!
```

✅ **Correct**: Match token and endpoint
```env
# If token is from Sandbox:
LEEGALITY_API_BASE=https://sandbox.leegality.com/api/v3.0
LEEGALITY_AUTH_TOKEN=bh7z0W6vWdcYeuAW3gkjXsoU8rnCaFBA

# OR if token is from Production:
LEEGALITY_API_BASE=https://app1.leegality.com/api/v3.0
LEEGALITY_AUTH_TOKEN=your-production-token-here
```

---

## Still Not Sure?

1. **Log out** of Leegality
2. **Log back in** and note the URL
3. **Go to Settings > API** and copy the token from there
4. **That token matches the environment** you're logged into

---

## Your Current Setup

Based on your token `bh7z0W6vWdcYeuAW3gkjXsoU8rnCaFBA`:

1. **Check where you got this token from:**
   - Did you log into `sandbox.leegality.com`? → It's Sandbox
   - Did you log into `app1.leegality.com`? → It's Production

2. **Update your `backend/.env` accordingly:**
   ```env
   # If Sandbox:
   LEEGALITY_API_BASE=https://sandbox.leegality.com/api/v3.0
   
   # If Production:
   LEEGALITY_API_BASE=https://app1.leegality.com/api/v3.0
   ```

3. **Restart your backend server** after updating `.env`



