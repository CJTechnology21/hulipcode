# Financials Module - Demo Steps

## Overview
This document provides step-by-step instructions to verify the Financials module implementation in the portal. The Financials module handles payout calculations, platform fees, withheld amounts, penalties, and ledger tracking.

## Features
1. **LedgerEntry Model**: Tracks all financial transactions (credits and debits)
2. **Payout Calculation**: Computes payable amounts based on progress and previous payments
3. **Platform Fee**: 4% deduction from gross payout
4. **Withheld Amount**: 15% withheld from net amount after platform fee
5. **Penalty Logic**: Configurable penalty percentage (placeholder implementation)
6. **Ledger Tracking**: Complete audit trail of all financial transactions

## Prerequisites
1. Backend server running on `http://localhost:5000`
2. Frontend running on `http://localhost:3000`
3. Valid user account (architect, admin, or client)
4. MongoDB connection established
5. At least one project created with tasks

---

## Demo Steps

### Step 1: Verify LedgerEntry Model

**Objective:** Verify that ledger entries can be created and tracked.

#### 1.1: Check Database Schema
1. Connect to MongoDB database
2. Verify `LedgerEntry` collection exists
3. Check schema fields:
   - `projectId` (required)
   - `taskId` (optional)
   - `entryType` (CREDIT/DEBIT)
   - `category` (TASK_PAYOUT, PLATFORM_FEE, WITHHELD, PENALTY, etc.)
   - `amount` (required, min: 0)
   - `description` (required)
   - `metadata` (optional object)
   - `status` (PENDING/PROCESSED/CANCELLED)

**Expected Result:**
- LedgerEntry model is properly defined
- All required fields are present
- Indexes are created for performance

---

### Step 2: Create Task and Approve It

**Objective:** Verify that approving a task creates ledger entries automatically.

1. **Login** to the portal as an architect or admin
2. Navigate to **Projects** page (`/projects`)
3. Select a project or create a new one
4. Navigate to **Tasks** section
5. Create a new task with:
   - **Name**: "Install Windows"
   - **Value**: `100000` (₹100,000)
   - **Weight %**: `20` (20% of project)
   - **Start Date**: Select a date
6. Add proofs (3 photos OR 1 video OR complete checklist)
7. **Submit** the task for review
8. **Approve** the task

**Expected Result:**
- Task is approved successfully
- Response includes `ledgerEntries` array
- Multiple ledger entries are created:
  - 1 CREDIT entry for task payout (₹100,000)
  - 1 DEBIT entry for platform fee (₹4,000)
  - 1 DEBIT entry for withheld amount (₹14,400)

---

### Step 3: Verify Payout Calculation

**Objective:** Verify that payout calculation includes fees, withheld, and penalties.

#### 3.1: Check Payout Breakdown
1. After approving a task, check the API response
2. Look for `payout.financials` object
3. **Verify** the breakdown:
   ```json
   {
     "grossAmount": 100000,
     "platformFee": {
       "percent": 4,
       "amount": 4000
     },
     "withheld": {
       "percent": 15,
       "amount": 14400
     },
     "penalty": {
       "percent": 0,
       "amount": 0,
       "reason": ""
     },
     "totalDeductions": 18400,
     "finalPayable": 81600
   }
   ```

**Expected Result:**
- Gross amount = ₹100,000
- Platform fee (4%) = ₹4,000
- Net after fee = ₹96,000
- Withheld (15%) = ₹14,400
- Final payable = ₹81,600

#### 3.2: Verify Calculation Formula
- **Platform Fee**: 4% of gross amount
  - Example: ₹100,000 × 4% = ₹4,000
- **Net After Fee**: Gross - Platform Fee
  - Example: ₹100,000 - ₹4,000 = ₹96,000
- **Withheld**: 15% of net after fee
  - Example: ₹96,000 × 15% = ₹14,400
- **Final Payable**: Net after fee - Withheld - Penalty
  - Example: ₹96,000 - ₹14,400 - ₹0 = ₹81,600

---

### Step 4: Test Platform Fee Deduction (4%)

**Objective:** Verify that platform fee is correctly deducted.

1. Create a task with value = ₹50,000
2. Approve the task
3. **Verify** ledger entries:
   - Credit entry: ₹50,000
   - Debit entry (PLATFORM_FEE): ₹2,000 (4% of ₹50,000)

**Expected Result:**
- Platform fee is exactly 4% of gross amount
- Fee is rounded to 2 decimal places
- Ledger entry is created with correct category

---

### Step 5: Test Withheld Logic (15%)

**Objective:** Verify that withheld amount is correctly calculated.

1. Create a task with value = ₹100,000
2. Approve the task
3. **Verify** withheld calculation:
   - Gross: ₹100,000
   - Platform fee (4%): ₹4,000
   - Net after fee: ₹96,000
   - Withheld (15%): ₹14,400 (15% of ₹96,000)

**Expected Result:**
- Withheld is calculated on net amount after platform fee
- Withheld is exactly 15% of net after fee
- Ledger entry is created with category 'WITHHELD'

---

### Step 6: Test Penalty Logic

**Objective:** Verify that penalties can be applied (placeholder implementation).

#### 6.1: Approve Task with Penalty
1. Use API to approve a task with penalty:
   ```bash
   POST http://localhost:5000/api/tasks/{taskId}/approve
   Headers: Authorization: Bearer {token}
   Body: {
     "penaltyPercent": 5,
     "penaltyReason": "Late delivery"
   }
   ```
   **Note:** This requires updating the approve endpoint to accept penalty parameters.

2. **Verify** penalty calculation:
   - Base amount (after withheld): ₹81,600
   - Penalty (5%): ₹4,080
   - Final payable: ₹77,520

**Expected Result:**
- Penalty is calculated correctly
- Penalty reason is stored in metadata
- Ledger entry is created with category 'PENALTY'

#### 6.2: Test Zero Penalty
1. Approve a task without penalty
2. **Verify** penalty amount is 0
3. **Verify** final payable excludes penalty

---

### Step 7: Test Ledger Entries

**Objective:** Verify that ledger entries are created and can be retrieved.

#### 7.1: View Ledger Entries via API
```bash
GET http://localhost:5000/api/ledger/project/{projectId}
Headers: Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "entries": [
    {
      "id": "...",
      "entryType": "CREDIT",
      "category": "TASK_PAYOUT",
      "amount": 100000,
      "description": "Task payout: Install Windows",
      "createdAt": "2024-01-02T10:00:00Z"
    },
    {
      "id": "...",
      "entryType": "DEBIT",
      "category": "PLATFORM_FEE",
      "amount": 4000,
      "description": "Platform fee (4%) for task: Install Windows",
      "createdAt": "2024-01-02T10:00:01Z"
    },
    {
      "id": "...",
      "entryType": "DEBIT",
      "category": "WITHHELD",
      "amount": 14400,
      "description": "Withheld amount (15%) for task: Install Windows",
      "createdAt": "2024-01-02T10:00:02Z"
    }
  ]
}
```

#### 7.2: Filter Ledger Entries
```bash
GET http://localhost:5000/api/ledger/project/{projectId}?category=PLATFORM_FEE
```

**Expected Result:**
- Only platform fee entries are returned
- Entries are sorted by creation date (newest first)

---

### Step 8: Test Compute Payable Function

**Objective:** Verify that payable amount is calculated based on progress and previous payments.

#### 8.1: Test Payable Calculation
1. Create a project with total value = ₹500,000
2. Create tasks totaling ₹500,000
3. Approve tasks worth ₹200,000 (40% progress)
4. **Verify** payable calculation:
   - Progress: 40%
   - Project total: ₹500,000
   - Earned amount: ₹200,000 (40% of ₹500,000)
   - Previous paid: ₹0
   - Payable amount: ₹200,000

#### 8.2: Test Partial Payment
1. After approving tasks worth ₹200,000, approve more tasks worth ₹100,000
2. **Verify** payable calculation:
   - Progress: 60% (now)
   - Earned amount: ₹300,000 (60% of ₹500,000)
   - Previous paid: ₹200,000
   - Payable amount: ₹100,000 (new earned - previous paid)

**Expected Result:**
- Payable = (Progress × ProjectTotal) - PreviousPaid
- Payable cannot be negative (returns 0 if previousPaid exceeds earned)

---

### Step 9: Test Multiple Task Approvals

**Objective:** Verify that multiple task approvals create correct ledger entries.

1. Create 3 tasks:
   - Task 1: Value = ₹50,000, Weight = 10%
   - Task 2: Value = ₹75,000, Weight = 15%
   - Task 3: Value = ₹100,000, Weight = 20%
2. Submit all tasks with proofs
3. Approve Task 1
4. **Verify**:
   - Ledger entries created for Task 1
   - Total paid = ₹50,000 (before deductions)
5. Approve Task 2
6. **Verify**:
   - Ledger entries created for Task 2
   - Total paid = ₹125,000 (₹50,000 + ₹75,000)
7. Approve Task 3
8. **Verify**:
   - Ledger entries created for Task 3
   - Total paid = ₹225,000 (₹50,000 + ₹75,000 + ₹100,000)
   - Progress = 45% (10% + 15% + 20%)

**Expected Result:**
- Each task approval creates separate ledger entries
- Total paid accumulates correctly
- Progress updates correctly

---

### Step 10: Test API Endpoints

**Objective:** Verify API endpoints work correctly.

#### 10.1: Approve Task API (with Financial Breakdown)
```bash
POST http://localhost:5000/api/tasks/{taskId}/approve
Headers: Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "message": "Task approved successfully",
  "task": { ... },
  "progress": {
    "progress": 20,
    "completedTasks": 1,
    "totalTasks": 5
  },
  "payout": {
    "grossPayout": 100000,
    "financials": {
      "grossAmount": 100000,
      "platformFee": {
        "percent": 4,
        "amount": 4000
      },
      "withheld": {
        "percent": 15,
        "amount": 14400
      },
      "penalty": {
        "percent": 0,
        "amount": 0,
        "reason": ""
      },
      "totalDeductions": 18400,
      "finalPayable": 81600
    }
  },
  "ledgerEntries": [
    {
      "id": "...",
      "entryType": "CREDIT",
      "category": "TASK_PAYOUT",
      "amount": 100000,
      "description": "Task payout: Install Windows"
    },
    {
      "id": "...",
      "entryType": "DEBIT",
      "category": "PLATFORM_FEE",
      "amount": 4000,
      "description": "Platform fee (4%) for task: Install Windows"
    },
    {
      "id": "...",
      "entryType": "DEBIT",
      "category": "WITHHELD",
      "amount": 14400,
      "description": "Withheld amount (15%) for task: Install Windows"
    }
  ]
}
```

#### 10.2: Get Ledger Entries API
```bash
GET http://localhost:5000/api/ledger/project/{projectId}
Headers: Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "entries": [
    {
      "id": "...",
      "projectId": "...",
      "taskId": "...",
      "entryType": "CREDIT",
      "category": "TASK_PAYOUT",
      "amount": 100000,
      "description": "Task payout: Install Windows",
      "status": "PROCESSED",
      "createdAt": "2024-01-02T10:00:00Z"
    }
  ]
}
```

**Expected Result:**
- All API endpoints work correctly
- Financial calculations are accurate
- Ledger entries are created and retrievable

---

## Summary Checklist

- [ ] LedgerEntry model is created and working
- [ ] Platform fee (4%) is deducted correctly
- [ ] Withheld amount (15%) is calculated correctly
- [ ] Penalty logic is implemented (placeholder)
- [ ] Ledger entries are created on task approval
- [ ] Payout calculation includes all deductions
- [ ] Compute payable function works correctly
- [ ] Multiple task approvals accumulate correctly
- [ ] API endpoints return financial breakdown
- [ ] Ledger entries can be retrieved and filtered

---

## Troubleshooting

### Issue: Platform fee is not deducted
**Solution:** 
- Check that `calculatePlatformFee` is called in `calculatePayoutBreakdown`
- Verify platform fee percent is set to 4%
- Check ledger entries are created with category 'PLATFORM_FEE'

### Issue: Withheld amount is incorrect
**Solution:**
- Verify withheld is calculated on net amount after platform fee
- Check withheld percent is set to 15%
- Ensure `calculateWithheld` receives the correct net amount

### Issue: Ledger entries are not created
**Solution:**
- Check that `approveTask` calls ledger service functions
- Verify task has a value > 0
- Check database connection and LedgerEntry model
- Review error logs for creation failures

### Issue: Payout calculation is incorrect
**Solution:**
- Verify task values are set correctly
- Check that only DONE tasks are included
- Ensure `computePayable` receives correct progress and previousPaid
- Verify project total is calculated correctly

### Issue: API returns 500 error
**Solution:**
- Check backend logs for errors
- Verify all required fields are provided
- Ensure database connection is active
- Check that user has proper permissions

---

## API Reference

### Approve Task (with Financial Breakdown)
```
POST /api/tasks/:id/approve
Authorization: Bearer {token}
Response: {
  message: string,
  task: Task,
  progress: Object,
  payout: {
    grossPayout: number,
    financials: {
      grossAmount: number,
      platformFee: { percent: number, amount: number },
      withheld: { percent: number, amount: number },
      penalty: { percent: number, amount: number, reason: string },
      totalDeductions: number,
      finalPayable: number
    }
  },
  ledgerEntries: LedgerEntry[]
}
```

### Get Ledger Entries
```
GET /api/ledger/project/:projectId
Authorization: Bearer {token}
Query Params: ?category={category}&entryType={CREDIT|DEBIT}
Response: {
  entries: LedgerEntry[]
}
```

---

## Notes

- Platform fee is 4% of gross payout amount
- Withheld amount is 15% of net amount after platform fee
- Penalty is configurable (default: 0%)
- All amounts are rounded to 2 decimal places
- Ledger entries are created automatically on task approval
- Previous paid amount is calculated from ledger entries
- Payable amount = (Progress × ProjectTotal) - PreviousPaid
- Final payable = Gross - Platform Fee - Withheld - Penalty
- All financial transactions are tracked in ledger for audit purposes

---

## Example Calculation Flow

**Scenario:** Task value = ₹100,000

1. **Gross Amount**: ₹100,000
2. **Platform Fee (4%)**: ₹100,000 × 4% = ₹4,000
3. **Net After Fee**: ₹100,000 - ₹4,000 = ₹96,000
4. **Withheld (15%)**: ₹96,000 × 15% = ₹14,400
5. **Payable After Withheld**: ₹96,000 - ₹14,400 = ₹81,600
6. **Penalty (0%)**: ₹0
7. **Final Payable**: ₹81,600 - ₹0 = ₹81,600

**Ledger Entries Created:**
- CREDIT: ₹100,000 (TASK_PAYOUT)
- DEBIT: ₹4,000 (PLATFORM_FEE)
- DEBIT: ₹14,400 (WITHHELD)

