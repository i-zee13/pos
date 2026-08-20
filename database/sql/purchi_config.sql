-- =====================================================================

--  PURCHI DYNAMIC CONFIG (organization table)

--  -------------------------------------------------------------------

--  Revert:  UPDATE organization SET purchi_use_dynamic = 0;

--  Enable:   UPDATE organization SET purchi_use_dynamic = 1;

--  Default: purchi_use_dynamic = 0  → purana static purchi (no change)

-- =====================================================================



ALTER TABLE `organization`

    ADD COLUMN IF NOT EXISTS `purchi_use_dynamic` TINYINT(1) NOT NULL DEFAULT 0 AFTER `refund_policy`,

    ADD COLUMN IF NOT EXISTS `purchi_config` JSON NULL AFTER `purchi_use_dynamic`;



-- MySQL < 8.0.12: remove IF NOT EXISTS and run once only.



-- Optional: copy default config JSON into organization (tenant 1)

-- Run in project root after migration:

--

--   php artisan tinker --execute="

--     \$org = App\Models\Organization::first();

--     if (\$org) {

--         \$org->purchi_config = config('admin_close_purchi');

--         \$org->purchi_use_dynamic = 0;

--         \$org->save();

--         echo 'purchi_config saved (dynamic OFF)';

--     }

--   "

--

-- Test dynamic mode:

--   UPDATE organization SET purchi_use_dynamic = 1 WHERE tenant_id = 1;

