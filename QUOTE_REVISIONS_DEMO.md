# Quotations & Revisions Module - Demo Checklist

## Overview
This document provides a step-by-step checklist to verify the Quotations & Revisions module implementation. The module handles quote revisions, top-up requirements, and under-payment scenarios.

## Features
1. **parent_quote_id field**: Links revisions to original quotes
2. **Revision Creation API**: Create new revisions of existing quotes
3. **Top-Up Required Logic**: Blocks contract signing if revised total > original
4. **Under-Payment Logic**: Marks admin review if revised total < previous payouts
5. **Contract Signing Block**: Prevents signing when top-up or admin review is required

---

## Prerequisites
- [ ] Backend server running on `http://localhost:5000`
- [ ] Frontend running on `http://localhost:3000`
- [ ] Valid user account (architect, admin, or client)
- [ ] MongoDB connection established
- [ ] At least one lead and quote created

---

## Demo Checklist

### ✅ Step 1: Verify Quote Model Fields

**Objective:** Verify that `parent_quote_id` and revision fields are present.

- [ ] Check Quote model has `parent_quote_id` field
- [ ] Check Quote model has `isRevision` field (default: false)
- [ ] Check Quote model has `revisionNumber` field (default: 0)
- [ ] Check Quote model has `requiresTopUp` field (default: false)
- [ ] Check Quote model has `requiresAdminReview` field (default: false)
- [ ] Verify indexes are created for `parent_quote_id`

**Expected Result:**
- All fields are present in the Quote schema
- Original quotes have `parent_quote_id = null`
- Original quotes have `isRevision = false`

---

### ✅ Step 2: Create Original Quote

**Objective:** Create an original quote to use for revisions.

1. **Login** as an architect
2. Navigate to **Leads** or **Quotes** page
3. Create a new quote:
   - **Lead**: Select a lead
   - **Quote Amount**: ₹500,000
   - **Summary**: Add at least 2 sections with amounts
   - **Status**: Set to "Approved"
4. **Save** the quote
5. **Note** the quote ID for later use

**Expected Result:**
- Quote is created successfully
- Quote has `parent_quote_id = null`
- Quote has `isRevision = false`
- Quote has `revisionNumber = 0`

---

### ✅ Step 3: Create Quote Revision (API)

**Objective:** Create a revision of the original quote.

#### 3.1: Create Revision via API
```bash
POST http://localhost:5000/api/quote/{originalQuoteId}/revision
Headers: Authorization: Bearer {token}
Body: {
  "assigned": ["{architectId}"],
  "summary": [
    {
      "space": "Living Room",
      "amount": 220000,
      "tax": 39600,
      "items": 12,
      "workPackages": 2
    },
    {
      "space": "Kitchen",
      "amount": 300000,
      "tax": 54000,
      "items": 15,
      "workPackages": 3
    }
  ]
}
```

**Expected Response:**
```json
{
  "message": "Quote revision created successfully",
  "revision": {
    "_id": "...",
    "qid": "Q002",
    "parent_quote_id": "{originalQuoteId}",
    "isRevision": true,
    "revisionNumber": 1,
    "requiresTopUp": false,
    "requiresAdminReview": false,
    "quoteAmount": 599600
  },
  "originalQuote": { ... },
  "topUpCheck": {
    "requiresTopUp": false,
    "originalTotal": 590000,
    "revisedTotal": 599600,
    "topUpAmount": 0
  },
  "underPaymentCheck": {
    "requiresAdminReview": false,
    "revisedTotal": 599600,
    "totalPaid": 0,
    "shortfallAmount": 0
  },
  "canSignContract": true
}
```

**Expected Result:**
- [ ] Revision is created successfully
- [ ] Revision has `parent_quote_id` pointing to original
- [ ] Revision has `isRevision = true`
- [ ] Revision has `revisionNumber = 1`
- [ ] Revision status is "Send"

---

### ✅ Step 4: Test Top-Up Required Logic

**Objective:** Verify that contract signing is blocked when revised total > original.

#### 4.1: Create Revision with Increased Amount
```bash
POST http://localhost:5000/api/quote/{originalQuoteId}/revision
Body: {
  "summary": [
    {
      "space": "Living Room",
      "amount": 300000,  // Increased from 200000
      "tax": 54000
    },
    {
      "space": "Kitchen",
      "amount": 350000,  // Increased from 300000
      "tax": 63000
    }
  ]
}
```

**Expected Response:**
```json
{
  "revision": {
    "requiresTopUp": true,
    "quoteAmount": 767000
  },
  "topUpCheck": {
    "requiresTopUp": true,
    "originalTotal": 590000,
    "revisedTotal": 767000,
    "topUpAmount": 177000
  },
  "canSignContract": false
}
```

#### 4.2: Check Contract Signing Block
```bash
GET http://localhost:5000/api/quote/{revisionId}/check-contract-block
Headers: Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "blocked": true,
  "reason": "TOP_UP_REQUIRED",
  "canSign": false,
  "message": "Revision requires top-up of ₹177,000. Original: ₹590,000, Revised: ₹767,000",
  "topUpAmount": 177000,
  "originalTotal": 590000,
  "revisedTotal": 767000
}
```

#### 4.3: Attempt Contract Signing (Should Fail)
```bash
POST http://localhost:5000/api/quote/{revisionId}/create-project
Headers: Authorization: Bearer {token}
Body: {
  "architectId": "{architectId}"
}
```

**Expected Response:**
```json
{
  "message": "Contract signing is blocked",
  "blocked": true,
  "reason": "TOP_UP_REQUIRED",
  "details": {
    "blocked": true,
    "reason": "TOP_UP_REQUIRED",
    "canSign": false,
    "topUpAmount": 177000
  }
}
```

**Expected Result:**
- [ ] Revision is created with `requiresTopUp = true`
- [ ] Contract signing check returns `blocked = true`
- [ ] Contract signing API returns 400 error
- [ ] Error message clearly explains top-up requirement

---

### ✅ Step 5: Test Under-Payment Logic

**Objective:** Verify that admin review is required when revised total < previous payouts.

#### 5.1: Create Project and Approve Tasks (Generate Payouts)
1. Create project from original quote
2. Create tasks with values totaling ₹400,000
3. Approve tasks to generate payouts
4. Verify ledger entries show ₹400,000 paid

#### 5.2: Create Revision with Decreased Amount
```bash
POST http://localhost:5000/api/quote/{originalQuoteId}/revision
Body: {
  "summary": [
    {
      "space": "Living Room",
      "amount": 150000,  // Much less than payouts
      "tax": 27000
    }
  ]
}
```

**Expected Response:**
```json
{
  "revision": {
    "requiresAdminReview": true,
    "quoteAmount": 177000
  },
  "underPaymentCheck": {
    "requiresAdminReview": true,
    "revisedTotal": 177000,
    "totalPaid": 400000,
    "shortfallAmount": 223000
  },
  "canSignContract": false
}
```

#### 5.3: Check Contract Signing Block
```bash
GET http://localhost:5000/api/quote/{revisionId}/check-contract-block
```

**Expected Response:**
```json
{
  "blocked": true,
  "reason": "ADMIN_REVIEW_REQUIRED",
  "canSign": false,
  "message": "Revision requires admin review. Revised total (₹177,000) is less than previous payouts (₹400,000)",
  "shortfallAmount": 223000,
  "revisedTotal": 177000,
  "totalPaid": 400000
}
```

**Expected Result:**
- [ ] Revision is created with `requiresAdminReview = true`
- [ ] Contract signing check returns `blocked = true`
- [ ] Contract signing API returns 400 error
- [ ] Error message clearly explains admin review requirement

---

### ✅ Step 6: Test Multiple Revisions

**Objective:** Verify that multiple revisions can be created and numbered correctly.

1. Create first revision (revisionNumber = 1)
2. Create second revision (revisionNumber = 2)
3. Create third revision (revisionNumber = 3)

**Expected Result:**
- [ ] Each revision has correct `revisionNumber`
- [ ] All revisions point to same `parent_quote_id`
- [ ] Revisions are ordered correctly

---

### ✅ Step 7: Get Quote Revisions

**Objective:** Verify that all revisions can be retrieved.

```bash
GET http://localhost:5000/api/quote/{quoteId}/revisions
Headers: Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "originalQuote": {
    "_id": "...",
    "qid": "Q001",
    "isRevision": false
  },
  "revisions": [
    {
      "_id": "...",
      "qid": "Q002",
      "revisionNumber": 1,
      "isRevision": true
    },
    {
      "_id": "...",
      "qid": "Q003",
      "revisionNumber": 2,
      "isRevision": true
    }
  ],
  "count": 2
}
```

**Expected Result:**
- [ ] Original quote is returned
- [ ] All revisions are returned
- [ ] Revisions are sorted by revisionNumber
- [ ] Count matches number of revisions

---

### ✅ Step 8: Test Valid Revision (No Blocks)

**Objective:** Verify that valid revisions allow contract signing.

#### 8.1: Create Valid Revision
- Original quote: ₹500,000
- Revision: ₹550,000 (increased but no payouts yet)
- No previous payouts

**Expected Result:**
- [ ] Revision created successfully
- [ ] `requiresTopUp = false` (or true if increased)
- [ ] `requiresAdminReview = false`
- [ ] `canSignContract = true` (if no top-up required)
- [ ] Contract signing check returns `blocked = false`

#### 8.2: Attempt Contract Signing (Should Succeed)
```bash
POST http://localhost:5000/api/quote/{revisionId}/create-project
```

**Expected Result:**
- [ ] Project is created successfully
- [ ] No blocking errors

---

### ✅ Step 9: Test Edge Cases

#### 9.1: Revision Equal to Original
- [ ] Create revision with same total as original
- [ ] Verify `requiresTopUp = false`
- [ ] Verify contract signing allowed

#### 9.2: Revision Less Than Original (No Payouts)
- [ ] Create revision with decreased amount
- [ ] No previous payouts exist
- [ ] Verify `requiresAdminReview = false`
- [ ] Verify contract signing allowed

#### 9.3: Revision Greater Than Original (With Payouts)
- [ ] Create payouts first
- [ ] Create revision with increased amount
- [ ] Verify both `requiresTopUp` and `requiresAdminReview` are checked
- [ ] Verify contract signing blocked if either condition is true

---

## Summary Checklist

- [ ] Quote model has `parent_quote_id` field
- [ ] Quote model has revision tracking fields (`isRevision`, `revisionNumber`, etc.)
- [ ] Revision creation API works correctly
- [ ] Top-up required logic works (revised > original)
- [ ] Under-payment logic works (revised < payouts)
- [ ] Contract signing is blocked when top-up required
- [ ] Contract signing is blocked when admin review required
- [ ] Multiple revisions can be created
- [ ] Revision numbers increment correctly
- [ ] Get revisions API returns all revisions
- [ ] Valid revisions allow contract signing
- [ ] Edge cases are handled correctly

---

## API Reference

### Create Quote Revision
```
POST /api/quote/:id/revision
Authorization: Bearer {token}
Body: {
  assigned: ObjectId[],
  summary: SummaryItem[],
  spaces?: StandaloneSpace[]
}
Response: {
  message: string,
  revision: Quote,
  originalQuote: Quote,
  topUpCheck: Object,
  underPaymentCheck: Object,
  canSignContract: boolean
}
```

### Get Quote Revisions
```
GET /api/quote/:id/revisions
Authorization: Bearer {token}
Response: {
  originalQuote: Quote,
  revisions: Quote[],
  count: number
}
```

### Check Contract Signing Block
```
GET /api/quote/:id/check-contract-block
Authorization: Bearer {token}
Response: {
  blocked: boolean,
  reason: string | null,
  canSign: boolean,
  message?: string,
  topUpAmount?: number,
  shortfallAmount?: number
}
```

---

## Troubleshooting

### Issue: Revision creation fails
**Solution:**
- Verify original quote exists
- Check that `parent_quote_id` is set correctly
- Ensure summary data is valid
- Check user has access to quote (ACL)

### Issue: Top-up check not working
**Solution:**
- Verify quote totals are calculated correctly
- Check `calculateQuoteTotal` function
- Ensure summary amounts are included in calculation

### Issue: Under-payment check not working
**Solution:**
- Verify project exists for quote
- Check ledger entries exist for project
- Ensure `getTotalPaid` function works correctly
- Verify project-quote relationship

### Issue: Contract signing not blocked
**Solution:**
- Check `checkContractSigningBlock` is called in `createProjectFromQuote`
- Verify revision flags (`requiresTopUp`, `requiresAdminReview`) are set
- Check error handling in contract signing endpoint

---

## Notes

- Original quotes have `parent_quote_id = null`
- Revisions have `parent_quote_id` pointing to original
- Revision numbers start at 1 and increment
- Top-up is required when revised total > original total
- Admin review is required when revised total < previous payouts
- Contract signing is blocked if either top-up or admin review is required
- All revisions maintain link to original quote
- Revision status starts as "Send" (can be updated later)

