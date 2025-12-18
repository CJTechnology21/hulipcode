# Data Models - Contract & Wallet Summary

## ✅ Completed Tasks

### 1. Contract Model Created
**File:** `backend/models/Contract.js`

**Fields Added:**
- ✅ `version_number` (Number, required, default: 1, min: 1)
- ✅ `terms_blob` (Mixed/JSON - stores contract terms)
- ✅ `pdf_url` (String - URL to PDF document)
- ✅ `signed_by_client` (Boolean, default: false)
- ✅ `signed_by_professional` (Boolean, default: false)

**Additional Features:**
- Relationship fields: `quoteId`, `projectId`
- Signature tracking: `clientSignature`, `professionalSignature`
- Leegality integration: `leegalityDocumentId`, `leegalitySigningLinks`
- Status management: `status` enum (draft, pending_signature, partially_signed, fully_signed, cancelled, expired)
- Contract metadata: `metadata` object
- Indexes for performance optimization
- Virtual: `isFullySigned`
- Methods: `markClientSigned()`, `markProfessionalSigned()`
- Pre-save hook for automatic status updates

### 2. Wallet Model Updated
**File:** `backend/models/Wallet.js`

**Field Added:**
- ✅ `reserved_amount` (Number, default: 0, min: 0)

**Additional Updates:**
- Updated `availableBalance` virtual to calculate: `balance - reserved_amount`
- Updated `addWithdrawal()` to check available balance (balance - reserved_amount)
- Added `reserveAmount()` method for reserving funds
- Added `releaseReserved()` method for releasing reserved funds
- ✅ `provider_wallet_id` field already exists as `providerWalletId` (camelCase)

### 3. Migrations Created
**Directory:** `backend/migrations/`

**Files:**
- ✅ `001_add_contract_model.js` - Creates Contract collection and indexes
- ✅ `002_add_wallet_reserved_amount.js` - Adds reserved_amount to existing wallets
- ✅ `migrate.js` - Migration runner for all migrations
- ✅ `README.md` - Migration documentation

**Usage:**
```bash
# Run all migrations
node backend/migrations/migrate.js

# Run individual migration
node backend/migrations/001_add_contract_model.js up
node backend/migrations/002_add_wallet_reserved_amount.js up
```

### 4. Tests Created
**File:** `backend/tests/dataModels.test.js`

**Test Coverage:**

#### Contract Model Tests:
- ✅ Schema validation (all required fields)
- ✅ `version_number` field
- ✅ `terms_blob` field
- ✅ `pdf_url` field
- ✅ `signed_by_client` field
- ✅ `signed_by_professional` field
- ✅ Status updates (fully_signed, partially_signed)
- ✅ `isFullySigned` virtual
- ✅ `markClientSigned()` method
- ✅ `markProfessionalSigned()` method
- ✅ `projectId` field
- ✅ `leegalityDocumentId` field
- ✅ `leegalitySigningLinks` array
- ✅ Version management (multiple versions)
- ✅ Relationships (populate quoteId, projectId)

#### Wallet Model Tests:
- ✅ `reserved_amount` field
- ✅ Default value (0)
- ✅ `availableBalance` calculation
- ✅ `reserveAmount()` method
- ✅ `releaseReserved()` method
- ✅ Withdrawal with reserved amount check
- ✅ `providerWalletId` field (already exists)
- ✅ Balance operations with reserved amount
- ✅ Relationships (populate projectId)

## Schema Details

### Contract Schema
```javascript
{
  quoteId: ObjectId (required, ref: 'Quote'),
  projectId: ObjectId (optional, ref: 'Project'),
  version_number: Number (required, default: 1, min: 1),
  terms_blob: Mixed (JSON),
  pdf_url: String,
  signed_by_client: Boolean (default: false),
  signed_by_professional: Boolean (default: false),
  status: String (enum: ['draft', 'pending_signature', 'partially_signed', 'fully_signed', 'cancelled', 'expired']),
  // ... additional fields
}
```

### Wallet Schema Updates
```javascript
{
  projectId: ObjectId (required, ref: 'Project'),
  balance: Number (default: 0, min: 0),
  reserved_amount: Number (default: 0, min: 0), // ✅ NEW
  providerWalletId: String, // ✅ Already exists
  // ... additional fields
}
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
node backend/tests/dataModels.test.js
```

## Next Steps

1. Run migrations in development environment
2. Verify tests pass
3. Update API endpoints to use Contract model
4. Integrate Contract model with existing contract signing workflow

