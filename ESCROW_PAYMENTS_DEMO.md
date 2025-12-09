# Escrow & Payments Module - Demo Instructions

This document provides step-by-step instructions to verify the Escrow & Payments implementation.

## Prerequisites

1. Backend server running on `http://localhost:5000`
2. Frontend application running on `http://localhost:3000`
3. MongoDB database connected
4. Test users created (architect, homeowner/client)
5. Postman or similar API testing tool

## Setup

### 1. Create Test Data

#### Create Test Users:
```bash
# Via API or direct database
POST /api/auth/signup
{
  "name": "Test Homeowner",
  "email": "homeowner@test.com",
  "phoneNumber": "9876543210",
  "password": "password123",
  "role": "client"
}

POST /api/auth/signup
{
  "name": "Test Architect",
  "email": "architect@test.com",
  "phoneNumber": "9876543211",
  "password": "password123",
  "role": "architect"
}
```

#### Create Test Lead:
```bash
POST /api/leads
{
  "name": "Test Project Lead",
  "budget": "500000",
  "contact": "9876543210",
  "status": "Assigned",
  "assigned": "<homeowner_user_id>",
  "category": "RESIDENTIAL"
}
```

#### Create Test Quote:
```bash
POST /api/quote
{
  "leadId": "<lead_id>",
  "quoteAmount": 500000,
  "assigned": ["<architect_user_id>"],
  "status": "Send"
}
```

## Demo Scenarios

### Scenario 1: Wallet Creation After Contract Signing

#### Step 1.1: Sign Contract (Create Project from Quote)
1. Login as homeowner or architect
2. Navigate to quotations page
3. Select a quote and click "Sign Contract" or navigate to contract page
4. Click "Sign Agreement" button
5. **Expected**: Project is created and wallet is automatically created

#### Step 1.2: Verify Wallet Creation
```bash
# Check wallet was created
GET /api/wallet/project/<project_id>

# Expected Response:
{
  "exists": true,
  "wallet": {
    "_id": "...",
    "projectId": "<project_id>",
    "quoteId": "<quote_id>",
    "balance": 0,
    "status": "pending",
    "currency": "INR",
    "metadata": {
      "totalDeposited": 0,
      "totalWithdrawn": 0,
      "depositCount": 0,
      "withdrawalCount": 0
    }
  }
}
```

### Scenario 2: Deposit Webhook Updates Balance

#### Step 2.1: Simulate Deposit Webhook
```bash
POST /api/wallet/webhook/deposit
Content-Type: application/json

{
  "projectId": "<project_id>",
  "amount": 100000,
  "transactionId": "test-txn-001",
  "status": "success",
  "currency": "INR",
  "metadata": {
    "paymentMethod": "UPI",
    "reference": "UPI123456"
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "data": {
    "success": true,
    "message": "Deposit processed successfully",
    "wallet": { ... },
    "amount": 100000,
    "transactionId": "test-txn-001"
  }
}
```

#### Step 2.2: Verify Balance Updated
```bash
GET /api/wallet/balance/<project_id>

# Expected Response:
{
  "balance": 100000,
  "currency": "INR",
  "status": "active",
  "exists": true,
  "metadata": {
    "totalDeposited": 100000,
    "totalWithdrawn": 0,
    "depositCount": 1,
    "lastDepositAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### Step 2.3: Multiple Deposits
```bash
# Second deposit
POST /api/wallet/webhook/deposit
{
  "projectId": "<project_id>",
  "amount": 150000,
  "transactionId": "test-txn-002",
  "status": "success"
}

# Verify total balance is now 250000
GET /api/wallet/balance/<project_id>
```

### Scenario 3: Balance Visible in Project Dashboard

#### Step 3.1: Navigate to Project Dashboard
1. Login as architect or homeowner
2. Navigate to Projects page
3. Click on a project that has a wallet
4. Go to "Dashboard" tab
5. **Expected**: "Escrow Balance" card is visible

#### Step 3.2: Verify Balance Display
- **Expected UI Elements:**
  - Wallet icon
  - Current balance displayed in currency format (₹100,000)
  - Status badge (Active/Pending/Frozen)
  - Total Deposited amount
  - Total Withdrawn amount
  - Project Value (from quote)

#### Step 3.3: Test Different Balance States
1. **Zero Balance**: Wallet with no deposits
   - Should show ₹0
   - Status: "PENDING"
   
2. **Active Balance**: Wallet with deposits
   - Should show current balance
   - Status: "ACTIVE"
   - Shows deposit/withdrawal totals

3. **No Wallet**: Project without wallet
   - Should show ₹0
   - Status: "NOT CREATED"
   - Message: "Wallet will be created automatically when contract is signed"

### Scenario 4: Manual Wallet Operations (Admin)

#### Step 4.1: Create Wallet Manually
```bash
POST /api/wallet
Authorization: Bearer <admin_token>

{
  "projectId": "<project_id>"
}
```

#### Step 4.2: Adjust Balance (Admin Only)
```bash
PATCH /api/wallet/<wallet_id>/adjust
Authorization: Bearer <admin_token>

{
  "amount": 50000,
  "reason": "Manual adjustment for testing"
}
```

#### Step 4.3: Get All Wallets
```bash
GET /api/wallet
Authorization: Bearer <admin_token>

# Returns list of all wallets
```

## Testing via Postman

### Collection Setup

1. **Environment Variables:**
   - `baseUrl`: `http://localhost:5000`
   - `projectId`: (set after creating project)
   - `walletId`: (set after creating wallet)
   - `quoteId`: (set after creating quote)

2. **Test Requests:**

#### Request 1: Create Project (triggers wallet creation)
```
POST {{baseUrl}}/api/quote/{{quoteId}}/create-project
Body: { "architectId": "<architect_id>" }
```

#### Request 2: Get Wallet Balance
```
GET {{baseUrl}}/api/wallet/balance/{{projectId}}
```

#### Request 3: Simulate Deposit Webhook
```
POST {{baseUrl}}/api/wallet/webhook/deposit
Body: {
  "projectId": "{{projectId}}",
  "amount": 100000,
  "status": "success",
  "transactionId": "test-001"
}
```

#### Request 4: Verify Balance Updated
```
GET {{baseUrl}}/api/wallet/balance/{{projectId}}
```

### Test Scripts (Postman Tests Tab)

```javascript
// Test 1: Wallet creation
pm.test("Wallet created successfully", function () {
    pm.response.to.have.status(201);
    var jsonData = pm.response.json();
    pm.expect(jsonData.wallet).to.have.property('balance');
    pm.expect(jsonData.wallet.balance).to.equal(0);
});

// Test 2: Balance retrieval
pm.test("Balance retrieved successfully", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('balance');
    pm.expect(jsonData.balance).to.be.a('number');
});

// Test 3: Deposit webhook
pm.test("Deposit webhook processed", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
});
```

## Frontend Testing

### Step 1: Create Project with Wallet
1. Login as architect
2. Navigate to Quotes
3. Select a quote and create project
4. Check browser console for: `✅ Wallet created for project: <wallet_id>`

### Step 2: View Escrow Balance
1. Navigate to Projects
2. Click on the project
3. Go to "Dashboard" tab
4. **Expected**: See "Escrow Balance" card showing ₹0

### Step 3: Simulate Deposit
1. Use Postman/API to send deposit webhook
2. Refresh project dashboard
3. **Expected**: Balance updates to show deposited amount

### Step 4: Test Auto-Refresh
1. Open project dashboard
2. Send deposit webhook via API
3. Wait 30 seconds (or refresh manually)
4. **Expected**: Balance updates automatically

## Verification Checklist

- [ ] Wallet is created automatically when project is created from quote
- [ ] Wallet has correct projectId and quoteId references
- [ ] Initial balance is 0
- [ ] Initial status is "pending"
- [ ] Deposit webhook updates balance correctly
- [ ] Multiple deposits accumulate correctly
- [ ] Failed deposit status does not update balance
- [ ] Balance is visible in project dashboard
- [ ] Balance displays in correct currency format
- [ ] Status badge shows correct state
- [ ] Metadata (total deposited/withdrawn) is displayed
- [ ] Projects without wallet show "Not Created" status
- [ ] Balance auto-refreshes every 30 seconds

## API Endpoints Summary

### Wallet Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|------------|---------------|
| POST | `/api/wallet` | Create wallet for project | Yes |
| GET | `/api/wallet` | Get all wallets (admin) | Yes |
| GET | `/api/wallet/balance/:projectId` | Get wallet balance | Yes |
| GET | `/api/wallet/project/:projectId` | Get wallet by project | Yes |
| POST | `/api/wallet/webhook/deposit` | Deposit webhook | No* |
| PATCH | `/api/wallet/:walletId/adjust` | Adjust balance (admin) | Yes |

*Webhook endpoint should verify signature in production

## Webhook Payload Format

### Deposit Webhook
```json
{
  "projectId": "507f1f77bcf86cd799439011",
  "walletId": "507f1f77bcf86cd799439012",
  "amount": 100000,
  "transactionId": "txn_123456789",
  "status": "success",
  "currency": "INR",
  "metadata": {
    "paymentMethod": "UPI",
    "reference": "UPI123456",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

### Status Values
- `success` - Deposit successful, balance updated
- `completed` - Deposit completed, balance updated
- `credited` - Amount credited, balance updated
- `failed` - Deposit failed, balance not updated
- `pending` - Deposit pending, balance not updated

## Integration with External Providers

### Castler Integration (Future)
```javascript
// In walletService.js
if (process.env.ESCROW_PROVIDER === 'castler') {
  // Verify webhook signature
  const isValid = verifyCastlerSignature(payload, headers);
  if (!isValid) throw new Error('Invalid webhook signature');
  
  // Update providerWalletId
  wallet.providerWalletId = payload.castler_wallet_id;
}
```

### Razorpay Integration (Future)
```javascript
// Similar structure for Razorpay
if (process.env.ESCROW_PROVIDER === 'razorpay') {
  // Verify Razorpay webhook
  // Update wallet accordingly
}
```

## Troubleshooting

### Issue: Wallet not created after project creation
**Solution**: Check backend logs for wallet creation errors. Wallet creation is non-blocking, so project creation succeeds even if wallet creation fails.

### Issue: Balance not updating after webhook
**Solution**: 
1. Check webhook payload format
2. Verify `status` field is "success", "completed", or "credited"
3. Check backend logs for webhook processing errors

### Issue: Balance not visible in dashboard
**Solution**:
1. Check browser console for API errors
2. Verify projectId is correct
3. Check network tab for `/api/wallet/balance` request
4. Verify user has access to project (ACL check)

### Issue: Webhook returns 401
**Solution**: Webhook endpoint should not require authentication. Check route configuration.

## Next Steps

1. **Integrate with Real Escrow Provider**:
   - Set up Castler or Razorpay account
   - Configure webhook URLs
   - Implement signature verification

2. **Add Withdrawal Functionality**:
   - Create withdrawal webhook handler
   - Add withdrawal UI
   - Implement approval workflow

3. **Add Balance Calculations**:
   - Calculate required balance (PROGRESS + 20%)
   - Calculate professional payable (PROGRESS - 15%)
   - Add top-up notifications

4. **Add Payment Release**:
   - Automatic payment on task approval
   - Milestone-based releases
   - Approval workflow

## Notes

- Wallet creation is automatic but non-blocking
- Webhook endpoint accepts any payload format (customize based on provider)
- Balance updates are real-time via API
- Frontend auto-refreshes every 30 seconds
- All wallet operations are logged for audit

