# Live DB Deploy Order (Godowns + Multi-Tenant)

Run on **live DB** in this order. Take backup first.

## 1. tenant_migration.sql
Adds `tenant_id` to all tables (including godowns) and backfills existing data to `tenant_id = 1`.

## 2. system_customers.sql
Adds `customers.system_code` and marks tenant 1 system customers (5,6,7,8).

## 3. organization_print_section.sql
Adds `print_logo` and `refund_policy` to `organization`.

## 4. Upload code + compiled JS
Run locally: `npm run dev` (or `npm run prod`)
Upload `public/js/custom/` compiled files.

## 5. Browser (after login)
Open `/clear` once — cache + invoice_helper shim.

## 6. Organization page
- Save Print Section (logo + refund policy) if needed
- Click **Create System Accounts** (disabled if already done)

## 7. New tenant later
1. Create user with `users.tenant_id = X`
2. Login as that user → Organization → **Create System Accounts**
3. Add godowns for that tenant via Godowns menu

## Safe rollback note
Until `users.tenant_id` is set, app runs without tenant filter (same as before migration).
