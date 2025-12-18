# Admin Tools Module - Demo Steps

## Overview

The Admin Tools module provides administrators with essential management capabilities:
1. **KYC Approval** - Review and approve/reject user KYC documents
2. **Dispute Management** - View and resolve disputes between clients and professionals
3. **Wallet Adjustments** - Manually adjust wallet balances for projects

## Prerequisites

1. **Admin Account**: User with `role: 'admin'` or `isSuperAdmin: true`
2. **Backend Running**: API server running on `http://localhost:5000`
3. **Frontend Running**: React app running on `http://localhost:3000`

## Setup

### 1. Create Admin User

```bash
# Via API or MongoDB
POST /api/auth/register
{
  "name": "Admin User",
  "email": "admin@huelip.com",
  "password": "admin123",
  "role": "admin"
}

# Or update existing user in MongoDB
db.users.updateOne(
  { email: "admin@huelip.com" },
  { $set: { role: "admin", isSuperAdmin: true } }
)
```

### 2. Create Test Data

#### Create User with KYC Documents
```bash
POST /api/user
{
  "name": "Test User",
  "email": "test@example.com",
  "phoneNumber": "1234567890",
  "role": "client",
  "aadhaarFile": "aadhaar.pdf",
  "panFile": "pan.pdf"
}
```

#### Create Dispute (via API or directly)
```bash
POST /api/disputes  # If endpoint exists
# Or create directly in MongoDB/through application
```

## Demo Steps

### Scenario 1: KYC Approval

#### Step 1.1: Access Admin Tools
1. Login as admin user
2. Navigate to `/admin-tools` (or add link in sidebar)
3. Click on **"KYC Approval"** tab

#### Step 1.2: View Pending KYC
**Expected:**
- List of users with pending KYC documents
- Each user shows:
  - Name and email
  - Role
  - Document badges (Aadhaar, PAN)
  - Approve/Reject buttons

#### Step 1.3: Approve KYC
1. Click **"Approve"** button for a user
2. **Verify:**
   - Success message: "KYC approved successfully"
   - User disappears from pending list
   - User's `kycStatus` changes to `APPROVED`
   - `kycApprovedAt` and `kycApprovedBy` are set

#### Step 1.4: Reject KYC
1. Click **"Reject"** button for a user
2. Enter rejection reason: "Documents are not clear"
3. Click **"OK"**
4. **Verify:**
   - Success message: "KYC rejected"
   - User disappears from pending list
   - User's `kycStatus` changes to `REJECTED`
   - `kycRejectedReason` is saved

#### Step 1.5: Verify Audit Log
```bash
GET /api/admin/audit-logs?eventType=ADMIN_ACTION
# Should show KYC approval/rejection entries
```

**Expected Result:**
- KYC approvals and rejections are logged
- Audit entries include admin user, target user, and action details

---

### Scenario 2: Dispute Management

#### Step 2.1: View Disputes
1. Navigate to **"Disputes"** tab in Admin Tools
2. **Verify:**
   - List of all disputes
   - Each dispute shows:
     - Title
     - Project name
     - Raised by (user name)
     - Status badge (OPEN, RESOLVED, etc.)

#### Step 2.2: View Dispute Details
1. Click on a dispute card
2. **Verify:**
   - Modal opens with full dispute details:
     - Title and description
     - Status and category
     - Raised by and against users
     - Project information
     - Resolution buttons

#### Step 2.3: Resolve Dispute (Client Favor)
1. Click **"Resolve for Client"** button
2. **Verify:**
   - Success message: "Dispute resolved successfully"
   - Dispute status changes to `RESOLVED`
   - `resolvedBy` is set to admin user
   - `resolutionAction` is `APPROVED_FOR_CLIENT`
   - Modal closes
   - Dispute disappears from OPEN list

#### Step 2.4: Resolve Dispute (Professional Favor)
1. Click on another dispute
2. Click **"Resolve for Professional"** button
3. **Verify:**
   - Success message appears
   - Dispute status changes to `RESOLVED`
   - `resolutionAction` is `APPROVED_FOR_PROFESSIONAL`

#### Step 2.5: Filter Disputes
```bash
GET /api/admin/disputes?status=OPEN
GET /api/admin/disputes?category=TASK_QUALITY
GET /api/admin/disputes?priority=URGENT
```

**Expected Result:**
- Disputes can be filtered by status, category, priority
- Pagination works correctly

---

### Scenario 3: Wallet Adjustments

#### Step 3.1: View Wallets
1. Navigate to **"Wallet Adjustments"** tab
2. **Verify:**
   - List of all project wallets
   - Each wallet shows:
     - Project name
     - Current balance
     - Status
     - "Adjust" button

#### Step 3.2: Adjust Wallet Balance (Add)
1. Click **"Adjust"** button for a wallet
2. **Verify:**
   - Modal opens with:
     - Project name
     - Current balance
     - Amount input field
     - Reason textarea
3. Enter:
   - Amount: `5000` (positive to add)
   - Reason: "Manual adjustment for refund"
4. Click **"Apply Adjustment"**
5. **Verify:**
   - Success message: "Wallet balance adjusted successfully"
   - Wallet balance increases by 5000
   - Modal closes
   - Updated balance is reflected in list

#### Step 3.3: Adjust Wallet Balance (Subtract)
1. Click **"Adjust"** for another wallet
2. Enter:
   - Amount: `-2000` (negative to subtract)
   - Reason: "Correction for overpayment"
3. Click **"Apply Adjustment"**
4. **Verify:**
   - Wallet balance decreases by 2000
   - Success message appears

#### Step 3.4: Validation Tests
1. Try to adjust without amount:
   - **Expected:** Error: "Amount and reason are required"
2. Try to adjust without reason:
   - **Expected:** Error: "Amount and reason are required"
3. Try to subtract more than balance:
   - **Expected:** Error: "Insufficient balance" (from wallet service)

#### Step 3.5: Verify Audit Log
```bash
GET /api/admin/audit-logs?eventType=ADMIN_ACTION&targetType=WALLET
```

**Expected Result:**
- Wallet adjustments are logged
- Audit entries include:
  - Admin user
  - Wallet ID
  - Amount (positive or negative)
  - Reason
  - Balance before and after

---

## API Endpoints Reference

### KYC Management
```bash
# Get pending KYC
GET /api/admin/kyc/pending?page=1&limit=20&role=client

# Approve KYC
POST /api/admin/kyc/:userId/approve
Body: { "notes": "Optional notes" }

# Reject KYC
POST /api/admin/kyc/:userId/reject
Body: { "reason": "Rejection reason" }
```

### Dispute Management
```bash
# Get disputes
GET /api/admin/disputes?page=1&limit=20&status=OPEN&category=TASK_QUALITY

# Get dispute details
GET /api/admin/disputes/:disputeId

# Resolve dispute
POST /api/admin/disputes/:disputeId/resolve
Body: {
  "resolution": "Resolution description",
  "resolutionAction": "APPROVED_FOR_CLIENT" | "APPROVED_FOR_PROFESSIONAL" | ...
}
```

### Wallet Management
```bash
# Get wallets
GET /api/admin/wallets?page=1&limit=20&projectId=xxx&status=active

# Adjust wallet balance
PATCH /api/admin/wallets/:walletId/adjust
Body: {
  "amount": 5000,  // Positive to add, negative to subtract
  "reason": "Reason for adjustment"
}
```

## Testing Admin Permissions

### Test 1: Non-Admin Access Denied
```bash
# Login as regular user (not admin)
POST /api/auth/login
{ "email": "regular@example.com", "password": "password123" }

# Try to access admin endpoint
GET /api/admin/kyc/pending
# Expected: 403 Forbidden - "Admin access required"
```

### Test 2: Admin Access Allowed
```bash
# Login as admin user
POST /api/auth/login
{ "email": "admin@huelip.com", "password": "admin123" }

# Access admin endpoint
GET /api/admin/kyc/pending
# Expected: 200 OK with pending KYC list
```

## Checklist

### KYC Approval
- [ ] Admin can view pending KYC users
- [ ] Admin can approve KYC
- [ ] Admin can reject KYC with reason
- [ ] KYC status updates correctly
- [ ] Audit logs are created
- [ ] Non-admin users cannot access

### Dispute Management
- [ ] Admin can view disputes list
- [ ] Admin can view dispute details
- [ ] Admin can resolve disputes
- [ ] Dispute status updates correctly
- [ ] Resolution actions are saved
- [ ] Audit logs are created
- [ ] Non-admin users cannot access

### Wallet Adjustments
- [ ] Admin can view wallets list
- [ ] Admin can adjust wallet balance (add)
- [ ] Admin can adjust wallet balance (subtract)
- [ ] Validation works (amount and reason required)
- [ ] Balance updates correctly
- [ ] Audit logs are created
- [ ] Non-admin users cannot access

## Troubleshooting

### Issue: 403 Forbidden on Admin Endpoints
**Solution:**
- Verify user has `role: 'admin'` or `isSuperAdmin: true`
- Check authentication token is valid
- Ensure `requireAdmin` middleware is applied

### Issue: KYC Users Not Showing
**Solution:**
- Verify users have `aadhaarFile` or `panFile` set
- Check `kycStatus` is not `APPROVED`
- Verify pagination parameters

### Issue: Wallet Adjustment Fails
**Solution:**
- Check wallet exists
- Verify amount is not zero
- Ensure reason is provided
- Check wallet has sufficient balance for negative adjustments

## Notes

- All admin actions are logged in audit logs
- Admin middleware checks both `role === 'admin'` and `isSuperAdmin === true`
- Wallet adjustments require both amount and reason
- Dispute resolution requires resolution description and action type
- KYC rejection requires a reason

