# Batch Stock & Average Cost (Weighted Avg)

This document explains the batch-wise stock / average cost work: what changed, how to migrate an **old production DB**, and how new invoices stay correct going forward.

---

## Sale qty validation bug (string compare)

**Symptom:** Stock shows e.g. `15`, but typing qty `2` shows `Qty should be less than 15`.

**Cause:** In `sale.js`, qty was compared as strings. In JavaScript `"2" > "15"` is `true`.

**Fix:** Compare with `parseFloat` in `resources/js/custom/sale.js`, then rebuild:
```bash
npm run dev
# or npm run production
```
Deploy updated `public/js/custom/sale.js` (mix output) to live.

---

## What we built

### Goal
- Track stock in **open batches** (`stock_batches_items`) with real **unit cost** and **expiry**.
- Compute **weighted average cost** from open batches and store it on the latest `vendor_stock_managment` row (`ttl_avg_cost` / `ttl_cost`).
- Show / verify that average on **Stock Value Report → By Average**, with a bottom AVG console (black/green, resizable).

### Average formula
```
Avg Rate = Σ (batch_unit_cost × batch_qty) / Σ (batch_qty)
Stock Value = Avg Rate × current stock balance
```

**Only batches with `batch_wise_balance >= 1` are used.**  
Leftover fractional qty (`0 < qty < 1`) is treated as dust and scrubbed so it cannot distort the average.

### Runtime behaviour (`BatchWiseStockManagment` in `app/helpers.php`)
| Direction | Rule |
|-----------|------|
| **IN** (purchase / sale return / etc.) | Merge only when **same expiry + same unit cost**. Different rates on the same expiry = separate layers. |
| **OUT** (sale / purchase return / etc.) | **FEFO**: real expiry first, then `0000-00-00` / no-expiry; within that, oldest row first. |
| After OUT | If leftover on a batch is **&lt; 1**, scrap that dust (delete batch row + reduce product + VSM balance). |
| After every IN/OUT | `refreshVendorStockAvgCost()` recalculates `ttl_avg_cost` from open batches with qty **≥ 1** only. Does **not** rewrite stock balances (except dust scrap). |

### Stock Value Report
- Route: `POST /fetch-stock-value-report` → `ReportsController@fetchStockValueReport`
- UI: `resources/views/reports/stock-value-report.blade.php` + `public/js/custom/stock-value-report.js`
- Filters: company only → all products of that company; **balance &gt; 0** only; By Average uses live batch formula
- Console: toggleable AVG panel — batch table + bold **Avg Rate** badge; drag top border to resize

### Artisan commands
| Command | Purpose |
|---------|---------|
| `php artisan stock:rebuild-batches` | Rebuild all open batches from purchase/sale/return history (FEFO), align to `products.stock_balance`, dump weighted avg into VSM |
| `php artisan stock:rebuild-batches --dry-run` | Simulate only |
| `php artisan stock:rebuild-batches --product=114` | Single product |
| `php artisan stock:rebuild-batches --skip-avg` | Rebuild batches but do not write VSM averages |
| `php artisan stock:scrub-fractional-batches` | Delete open batches with `0 < qty < 1`, subtract dust from product/VSM, refresh avg |
| `php artisan stock:scrub-fractional-batches --dry-run` | Preview only |
| `php artisan stock:test-batch-flows` | Isolated unit-style batch tests |
| `php artisan stock:live-invoice-flow` | Full invoice helper chain test (`--keep` to retain rows) |

---

## Process for an OLD database (make averages smooth)

Do this on a **copy / staging DB first**, then production. Always take a full backup before live runs.

### Step 0 — Backup
```bash
# Full DB dump (mysqldump / panel / existing backup tool)
# Keep a restore point before any rebuild/scrub
```

### Step 1 — Deploy code
Deploy at least:
- `app/helpers.php` (`BatchWiseStockManagment`, `refreshVendorStockAvgCost`, `batch_scrap_dust_qty`)
- `app/Console/Commands/RebuildBatchStockCommand.php`
- `app/Console/Commands/ScrubFractionalBatchesCommand.php`
- Stock Value Report controller + blade + JS (if you want the console)
- Any related call-site fixes (e.g. replacement `trx_type`)

Then on the server:
```bash
php artisan config:clear
php artisan cache:clear
```

### Step 2 — Rebuild batches from history
This is the main “old data → smooth avg” step.

```bash
php artisan stock:rebuild-batches --dry-run
# Review output, then:
php artisan stock:rebuild-batches
```

What it does:
1. Snapshots / backs up current `stock_batches_items` into a `*_rebuild_bak_*` table
2. Replays purchases / sales / returns / replacements by **document `created_at`** (not batch `created_at`, which can be `ON UPDATE`)
3. Builds expiry-aware FEFO layers with correct `unit_cost_price`
4. Aligns ending open qty to `products.stock_balance`
5. Writes weighted average into latest `vendor_stock_managment.ttl_avg_cost` / `ttl_cost` (**balances are not overwritten**)

### Step 3 — Scrub fractional leftovers (&lt; 1 qty)
Per-kg / dal / rice style leftovers used to leave tiny open batches (`0.0178`, etc.) that polluted averages.

```bash
php artisan stock:scrub-fractional-batches --dry-run
php artisan stock:scrub-fractional-batches
```

What it does:
1. Backs up fractional rows into `stock_batches_frac_bak_*`
2. Deletes open batches with `0 < batch_wise_balance < 1`
3. Subtracts that dust from `products.stock_balance` and latest VSM `balance`
4. Refreshes avg from remaining batches (`qty >= 1`)

### Step 4 — Verify
```sql
-- No fractional open batches
SELECT COUNT(*) FROM stock_batches_items
WHERE batch_wise_balance > 0 AND batch_wise_balance < 1;
-- expect 0

-- Open batches vs products with stock
SELECT
  (SELECT COUNT(DISTINCT product_id) FROM stock_batches_items WHERE batch_wise_balance >= 1) AS with_batches,
  (SELECT COUNT(*) FROM products WHERE stock_balance > 0) AS with_stock;

-- Spot-check one product
SELECT id, expiry_date, batch_wise_balance, unit_cost_price
FROM stock_batches_items
WHERE product_id = 114 AND batch_wise_balance > 0
ORDER BY expiry_date, id;
```

UI check:
1. Open **Stock Value Report**
2. Pick a company/product → **By Average** → Search
3. Confirm Total Value, Batch Count, and AVG console formula match the table

Smoke invoice check:
1. Purchase same product twice with **different rates / expiries**
2. Sale 1 unit → FEFO should reduce the earliest/real-expiry batch
3. Re-check report avg = `Σ(cost×qty)/Σ(qty)`

### Step 5 — Optional cleanup after success
Drop old backup tables when you no longer need them (they can be large):
- `stock_batches_items_rebuild_bak_*`
- `stock_batches_items_zero_bak_*`
- `stock_batches_frac_bak_*`

Do **not** drop these until you are sure production is stable.

---

## Keeping future entries smooth

No manual rebuild is required for normal day-to-day use if code is deployed.

1. **Every purchase / sale / return / replacement** that calls `BatchWiseStockManagment` will:
   - maintain correct cost layers
   - consume stock FEFO
   - refresh `ttl_avg_cost`
2. **Fractional leftovers &lt; 1** after OUT are auto-scrapped (batch + stock).
3. **Average / report** only see batches with qty **≥ 1**.
4. **Cost source of truth for a batch** is the purchase layer’s `unit_cost_price` (from `products_purchases.purchase_price` at IN time). Product “latest price” fields are not used to overwrite older layers.

### Do / Don’t
| Do | Don’t |
|----|--------|
| Deploy helpers + commands before rebuild on old DB | Manually edit `ttl_avg_cost` without fixing batches |
| Backup before `stock:rebuild-batches` | Expect avg to include qty &lt; 1 dust |
| Use Stock Value Report console to audit suspicious products | Re-run full rebuild on live during peak hours without a dry-run |
| Keep FEFO / same-expiry+same-cost merge logic intact | Merge different purchase rates into one batch row |

### If averages look wrong later
1. Check open batches for that `product_id` (qty ≥ 1, rates, expiry)
2. Compare live avg vs VSM `ttl_avg_cost`
3. For one product: `php artisan stock:rebuild-batches --product=ID`
4. If fractional noise returns somehow: `php artisan stock:scrub-fractional-batches`

---

## Pushing local DB to live (if replacing DB wholesale)

If you import the already-rebuilt local DB onto live:

1. **Full live backup first**
2. Exclude or later drop `*_bak_*` / rebuild backup tables from the dump
3. Keep live `.env` (`APP_URL`, `DB_*`, `APP_DEBUG=false`) — do not overwrite with local
4. After import: `php artisan config:clear && php artisan cache:clear`
5. Confirm: fractional open batches = 0; spot-check Stock Value Report
6. Remember: a full DB replace wipes any live-only invoices/tenants not present in the local dump

If live is multi-tenant and only one shop was rebuilt locally, **do not** replace the entire live DB — migrate that tenant’s stock tables / run rebuild on live for that tenant only.

---

## Key files

| File | Role |
|------|------|
| `app/helpers.php` | Batch IN/OUT, dust scrap, avg refresh |
| `app/Console/Commands/RebuildBatchStockCommand.php` | Old-data rebuild |
| `app/Console/Commands/ScrubFractionalBatchesCommand.php` | Fractional cleanup |
| `app/Http/Controllers/ReportsController.php` | Stock value + batch formula payload |
| `resources/views/reports/stock-value-report.blade.php` | Report UI + AVG console |
| `public/js/custom/stock-value-report.js` | Report table + console HTML |

---

## Quick checklist (old DB → production)

- [ ] Full DB backup
- [ ] Deploy code
- [ ] `php artisan stock:rebuild-batches --dry-run`
- [ ] `php artisan stock:rebuild-batches`
- [ ] `php artisan stock:scrub-fractional-batches --dry-run`
- [ ] `php artisan stock:scrub-fractional-batches`
- [ ] SQL verify: no open batches with `0 < qty < 1`
- [ ] Stock Value Report (By Average) + one purchase/sale smoke test
- [ ] Drop bak tables only after confidence window
