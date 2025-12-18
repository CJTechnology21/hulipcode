# Webhooks Documentation

## Overview

The Huelip Platform provides webhook endpoints for receiving notifications from external services:
- **Escrow Deposit Webhooks**: Payment provider notifications (Castler, Razorpay, etc.)
- **E-Signature Callbacks**: Leegality signing event notifications

## Base URL

```
Development: http://localhost:5000/webhooks
Production: https://api.huelip.com/webhooks
```

## Authentication

Webhooks use **signature validation** instead of traditional authentication. Each provider has its own signature verification method.

### Development Mode

In development, you can bypass signature validation by including the header:
```
x-bypass-signature: true
```

⚠️ **Warning**: Never use this in production!

## Endpoints

### 1. Health Check

**GET** `/webhooks/health`

Check if webhook endpoints are operational.

**Response:**
```json
{
  "success": true,
  "message": "Webhook endpoints are operational",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "endpoints": {
    "escrowDeposit": "/webhooks/escrow/deposit",
    "esignCallback": "/webhooks/esign/callback"
  }
}
```

---

### 2. Escrow Deposit Webhook

**POST** `/webhooks/escrow/deposit`

Handle deposit notifications from escrow payment providers.

#### Request Headers

| Header | Description | Required |
|--------|-------------|----------|
| `x-castler-signature` | Castler webhook signature | Yes (if Castler) |
| `x-razorpay-signature` | Razorpay webhook signature | Yes (if Razorpay) |
| `x-bypass-signature` | Bypass validation (dev only) | No |

#### Request Body

```json
{
  "projectId": "507f1f77bcf86cd799439011",
  "walletId": "507f1f77bcf86cd799439012",
  "amount": 100000,
  "transactionId": "castler_txn_123456789",
  "status": "success",
  "currency": "INR",
  "metadata": {
    "paymentMethod": "UPI",
    "reference": "UPI123456",
    "depositedBy": "507f1f77bcf86cd799439013"
  }
}
```

#### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `projectId` | string (ObjectId) | Yes* | Project ID |
| `walletId` | string (ObjectId) | Yes* | Wallet ID (if projectId not provided) |
| `amount` | number | Yes | Deposit amount (must be > 0) |
| `transactionId` | string | Yes | Unique transaction ID from provider |
| `status` | string | Yes | Transaction status (see below) |
| `currency` | string | No | Currency code (default: INR) |
| `metadata` | object | No | Additional metadata |

**Status Values:**
- `success` - Deposit successful, balance updated
- `completed` - Deposit completed, balance updated
- `credited` - Amount credited, balance updated
- `failed` - Deposit failed, balance not updated
- `pending` - Deposit pending, balance not updated

#### Response

**Success (200):**
```json
{
  "success": true,
  "message": "Deposit webhook processed successfully",
  "data": {
    "walletId": "507f1f77bcf86cd799439012",
    "projectId": "507f1f77bcf86cd799439011",
    "amount": 100000,
    "transactionId": "castler_txn_123456789",
    "balance": 100000,
    "status": "active"
  }
}
```

**Error (400/401):**
```json
{
  "success": false,
  "error": "Invalid webhook signature",
  "message": "Webhook signature verification failed"
}
```

#### Example: cURL

```bash
curl -X POST http://localhost:5000/webhooks/escrow/deposit \
  -H "Content-Type: application/json" \
  -H "x-bypass-signature: true" \
  -d '{
    "projectId": "507f1f77bcf86cd799439011",
    "amount": 100000,
    "transactionId": "test_txn_001",
    "status": "success",
    "currency": "INR"
  }'
```

---

### 3. E-Signature Callback Webhook

**POST** `/webhooks/esign/callback`

Handle signing event notifications from Leegality.

#### Request Headers

| Header | Description | Required |
|--------|-------------|----------|
| `x-leegality-signature` | Leegality webhook signature | Yes (if enabled) |
| `x-bypass-signature` | Bypass validation (dev only) | No |

#### Request Body

**Invitee Signed Event:**
```json
{
  "documentId": "leegality_doc_123456",
  "event": "invitee.signed",
  "invitee": {
    "email": "client@example.com",
    "name": "John Doe",
    "status": "signed"
  },
  "timestamp": "2024-01-01T12:00:00Z",
  "metadata": {}
}
```

**Document Completed Event:**
```json
{
  "documentId": "leegality_doc_123456",
  "event": "document.completed",
  "timestamp": "2024-01-01T12:30:00Z"
}
```

**Document Rejected Event:**
```json
{
  "documentId": "leegality_doc_123456",
  "event": "document.rejected",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `documentId` | string | Yes | Leegality document ID |
| `event` | string | Yes | Event type (see below) |
| `invitee` | object | No | Signer info (for invitee.signed) |
| `timestamp` | string (ISO 8601) | No | Event timestamp |
| `metadata` | object | No | Additional metadata |

**Event Types:**
- `invitee.signed` - Individual signer completed signing
- `document.signed` - Document signed (alias for invitee.signed)
- `document.completed` - All signers have signed
- `document.rejected` - Document was rejected

#### Response

**Success (200):**
```json
{
  "success": true,
  "message": "E-signature callback processed successfully",
  "data": {
    "documentId": "leegality_doc_123456",
    "event": "invitee.signed",
    "contractId": "507f1f77bcf86cd799439014",
    "status": "partially_signed",
    "signed_by_client": true,
    "signed_by_professional": false
  }
}
```

**Error (400/401):**
```json
{
  "success": false,
  "error": "Missing documentId",
  "message": "documentId is required"
}
```

#### Example: cURL

```bash
curl -X POST http://localhost:5000/webhooks/esign/callback \
  -H "Content-Type: application/json" \
  -H "x-bypass-signature: true" \
  -d '{
    "documentId": "leegality_doc_123456",
    "event": "invitee.signed",
    "invitee": {
      "email": "client@example.com",
      "name": "John Doe",
      "status": "signed"
    },
    "timestamp": "2024-01-01T12:00:00Z"
  }'
```

---

## Signature Validation

### Mock Validation (Development)

In development mode, signature validation is mocked and always returns `true` when:
- `NODE_ENV=development` AND header `x-bypass-signature: true` is present

### Production Validation

In production, implement actual signature verification:

#### Castler

```javascript
const crypto = require('crypto');
const secret = process.env.CASTLER_WEBHOOK_SECRET;
const signature = headers['x-castler-signature'];
const expectedSignature = crypto
  .createHmac('sha256', secret)
  .update(JSON.stringify(payload))
  .digest('hex');
const isValid = signature === expectedSignature;
```

#### Razorpay

```javascript
const crypto = require('crypto');
const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
const signature = headers['x-razorpay-signature'];
const expectedSignature = crypto
  .createHmac('sha256', secret)
  .update(JSON.stringify(payload))
  .digest('hex');
const isValid = signature === expectedSignature;
```

#### Leegality

```javascript
const crypto = require('crypto');
const secret = process.env.LEEGALITY_WEBHOOK_SECRET || process.env.LEEGALITY_PRIVATE_SALT;
const signature = headers['x-leegality-signature'];
const expectedSignature = crypto
  .createHmac('sha256', secret)
  .update(JSON.stringify(payload))
  .digest('hex');
const isValid = signature === expectedSignature;
```

## Environment Variables

```bash
# Escrow Provider
ESCROW_PROVIDER=castler  # or 'razorpay', 'internal', 'mock'

# Webhook Secrets
CASTLER_WEBHOOK_SECRET=your_castler_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_secret
LEEGALITY_WEBHOOK_SECRET=your_leegality_secret
LEEGALITY_PRIVATE_SALT=your_leegality_salt

# Development
NODE_ENV=development
LEEGALITY_SKIP_SIGNATURE=true  # Skip Leegality signature validation
```

## Testing

### Manual Testing

1. **Test Escrow Deposit:**
```bash
curl -X POST http://localhost:5000/webhooks/escrow/deposit \
  -H "Content-Type: application/json" \
  -H "x-bypass-signature: true" \
  -d '{
    "projectId": "YOUR_PROJECT_ID",
    "amount": 100000,
    "transactionId": "test_001",
    "status": "success"
  }'
```

2. **Test E-Signature Callback:**
```bash
curl -X POST http://localhost:5000/webhooks/esign/callback \
  -H "Content-Type: application/json" \
  -H "x-bypass-signature: true" \
  -d '{
    "documentId": "YOUR_DOCUMENT_ID",
    "event": "invitee.signed",
    "invitee": {
      "email": "test@example.com",
      "name": "Test User",
      "status": "signed"
    }
  }'
```

### Automated Testing

Run the test suite:
```bash
npm test -- webhooks.test.js
```

## Error Handling

Webhooks return HTTP 200 even on errors to prevent retries. Check the `success` field in the response:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Security Best Practices

1. ✅ Always validate webhook signatures in production
2. ✅ Use HTTPS for webhook endpoints
3. ✅ Implement rate limiting
4. ✅ Log all webhook attempts
5. ✅ Monitor for suspicious activity
6. ✅ Keep webhook secrets secure (use environment variables)
7. ✅ Never expose webhook secrets in code or logs

## Troubleshooting

### Webhook Not Processing

1. Check signature validation logs
2. Verify payload format matches expected schema
3. Check database connection
4. Review application logs for errors

### Signature Validation Failing

1. Verify webhook secret is correct
2. Check signature header name matches provider
3. Ensure payload is not modified before validation
4. Test with `x-bypass-signature: true` in development

### Contract Not Found

1. Verify `leegalityDocumentId` matches contract record
2. Check if contract was created before webhook
3. Review contract creation logs

## Support

For issues or questions, contact:
- Email: support@huelip.com
- Documentation: `/docs/openapi.yaml`

