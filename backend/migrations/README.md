# Database Migrations

This directory contains database migration scripts for schema changes.

## Available Migrations

1. **001_add_contract_model.js** - Creates Contract model and indexes
2. **002_add_wallet_reserved_amount.js** - Adds `reserved_amount` field to Wallet model

## Running Migrations

### Run Individual Migration

```bash
# Run migration up
node backend/migrations/001_add_contract_model.js up

# Run migration down (rollback)
node backend/migrations/001_add_contract_model.js down
```

### Run All Migrations

```bash
node backend/migrations/migrate.js
```

## Migration Structure

Each migration file exports two functions:
- `up()` - Applies the migration
- `down()` - Rolls back the migration

## Environment Variables

Migrations use the `MONGO_URI` environment variable. If not set, defaults to:
```
mongodb://localhost:27017/huelip
```

## Notes

- Migrations are idempotent - safe to run multiple times
- Always backup your database before running migrations in production
- Test migrations in a development environment first

