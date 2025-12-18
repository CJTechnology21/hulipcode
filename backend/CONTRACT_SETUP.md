# Contract Signing System Setup Guide

## Overview

This system provides a complete backend solution for:
1. Converting HTML contracts to PDF
2. Uploading PDFs to Leegality API
3. Creating signing workflows and generating signing links

## Installation

### 1. Install Required Dependencies

```bash
cd backend
npm install axios puppeteer
```

### 2. Environment Variables

Add these to your `.env` file in the `backend` directory:

```env
# Leegality API Configuration
LEEGALITY_API_BASE=https://sandbox.leegality.com/api/v3.0
# For production: https://app1.leegality.com/api/v3.0

LEEGALITY_AUTH_TOKEN=your-auth-token-here
LEEGALITY_PROFILE_ID=your-workflow-profile-id-here

# Optional: Private Salt for webhook verification
LEEGALITY_PRIVATE_SALT=your-private-salt-here
```

### 3. Get Your Credentials

1. **Auth Token:**
   - Go to [Leegality Dashboard](https://sandbox.leegality.com)
   - Navigate to **API Settings**
   - Copy your **Auth Token**

2. **Workflow Profile ID:**
   - Go to **Workflows** in your Leegality Dashboard
   - Create a new Workflow or select an existing one
   - Copy the **Workflow ID** (Profile ID)
   - Make sure the workflow is in **Published** state

## API Endpoints

### 1. Send HTML Contract for Signing

**POST** `/api/contracts/html-to-sign`

**Request Body:**
```json
{
  "html": "<html>...</html>",
  "fileName": "Contract_2024.pdf",
  "signers": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+91XXXXXXXXXX"
    }
  ],
  "profileId": "workflow-id-123", // Optional, uses env var if not provided
  "irn": "Q015", // Optional: Internal Reference Number
  "pdfOptions": { // Optional PDF generation options
    "format": "A4",
    "printBackground": true,
    "margin": {
      "top": "10mm",
      "right": "10mm",
      "bottom": "10mm",
      "left": "10mm"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "documentId": "doc-12345",
  "irn": "Q015",
  "invitees": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "signingUrl": "https://sign.leegality.com/...",
      "status": "SENT"
    }
  ],
  "message": "Contract sent to Leegality successfully. Signing links generated."
}
```

### 2. Get Contract Status

**GET** `/api/contracts/status/:documentId`

**Response:**
```json
{
  "success": true,
  "document": {
    "documentId": "doc-12345",
    "status": "COMPLETED",
    "files": [...],
    "auditTrail": "...",
    "signers": [...]
  }
}
```

## Usage Example (Frontend)

```javascript
// In your frontend code
const sendContractForSigning = async (htmlContent, signers) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/contracts/html-to-sign',
      {
        html: htmlContent,
        fileName: `Contract_${quoteId}.pdf`,
        signers: signers,
        irn: quoteId,
      }
    );

    if (response.data.success) {
      // Get signing URLs
      const signingUrls = response.data.invitees.map(inv => inv.signingUrl);
      console.log('Signing URLs:', signingUrls);
      
      // Redirect user to signing URL or send via email
      window.open(signingUrls[0], '_blank');
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};
```

## File Structure

```
backend/
├── utils/
│   └── htmlToPdf.js          # HTML to PDF conversion utility
├── services/
│   └── leegalityService.js   # Leegality API integration
├── controllers/
│   └── contractController.js # Contract handling logic
└── routes/
    └── contractRoutes.js     # API routes
```

## Troubleshooting

### Puppeteer Installation Issues

If you encounter issues installing Puppeteer:

```bash
# On Linux/Ubuntu
sudo apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  wget \
  xdg-utils

# On macOS (if needed)
brew install --cask chromium
```

### Memory Issues

If you encounter memory issues with Puppeteer, you can:

1. Increase Node.js memory limit:
```bash
node --max-old-space-size=4096 server.js
```

2. Or set in package.json:
```json
"scripts": {
  "start": "node --max-old-space-size=4096 server.js"
}
```

### Leegality API Errors

- Check that your Auth Token is correct
- Verify your Workflow Profile ID is correct and the workflow is Published
- Ensure you're using the correct API base URL (sandbox vs production)
- Check Leegality API documentation for latest changes

## Testing

Test the endpoint using curl:

```bash
curl -X POST http://localhost:5000/api/contracts/html-to-sign \
  -H "Content-Type: application/json" \
  -d '{
    "html": "<html><body><h1>Test Contract</h1></body></html>",
    "signers": [{"name": "Test User", "email": "test@example.com"}]
  }'
```

## Production Considerations

1. **Error Handling:** Add proper logging and monitoring
2. **Rate Limiting:** Implement rate limiting for API endpoints
3. **Authentication:** Add authentication middleware to protect endpoints
4. **Validation:** Add input validation middleware
5. **Caching:** Consider caching PDFs for frequently accessed contracts
6. **Queue System:** For high volume, consider using a queue system (Bull, RabbitMQ)

## Support

- Leegality Documentation: https://docs.leegality.com/v3
- Leegality Support: support@leegality.com



