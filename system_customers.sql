-- =====================================================================
--  SYSTEM CUSTOMERS (multi-tenant safe)
--  -------------------------------------------------------------------
--  Counter Sale / Expense / Net Purchase jaise "system" customers ko
--  code se pehchanne ke liye `customers.system_code` column. Code me
--  numeric id (8, 5, ...) hardcode karne ke bajaye sys_customer_id('CODE')
--  use hota hai, taake har tenant apna apna system-customer use kare.
--
--  IMPORTANT: Yeh SQL app deploy karne se PEHLE chalayein, warna
--  sale-return store par "Unknown column system_code" error aa sakta hai.
-- =====================================================================

-- STEP 1: column add karein
ALTER TABLE `customers`
  ADD COLUMN `system_code` VARCHAR(50) NULL AFTER `customer_type`,
  ADD INDEX `customers_system_code_index` (`system_code`);

-- STEP 2: tenant 1 (mojooda dukaan) ke system customers backfill
UPDATE `customers` SET `system_code` = 'EXPENSE'              WHERE `id` = 5 AND `tenant_id` = 1;
UPDATE `customers` SET `system_code` = 'NET_PURCHASE_RETURN'  WHERE `id` = 6 AND `tenant_id` = 1;
UPDATE `customers` SET `system_code` = 'NET_PURCHASE'         WHERE `id` = 7 AND `tenant_id` = 1;
UPDATE `customers` SET `system_code` = 'COUNTER_SALE'         WHERE `id` = 8 AND `tenant_id` = 1;

-- =====================================================================
--  NAYE TENANT ke liye PROVISIONING (copy-paste template)
--  -------------------------------------------------------------------
--  Har naye tenant ke apne 4 system customers banane ke liye. Niche
--  @t (tenant_id) aur @u (admin user id) set karein, phir chalayein.
--  IDs jo bhi next auto-increment hongi wahi banengi -- farq nahi parta,
--  code (system_code) se resolve hota hai.
--
--  customer_type: 1 = Vendor side, 2 = Customer side
--    EXPENSE -> 2, COUNTER_SALE -> 2, NET_PURCHASE -> 1, NET_PURCHASE_RETURN -> 1
--    (apne tenant 1 ke setup se match rakhein agar mukhtalif ho)
-- =====================================================================
--
-- SET @t := 2;   -- naye tenant ka id
-- SET @u := 1;   -- us tenant ka admin user id
--
-- INSERT INTO `customers` (`tenant_id`, `customer_name`, `customer_type`, `system_code`, `created_by`, `created_at`, `updated_at`) VALUES
--   (@t, 'EXPENSE',             2, 'EXPENSE',             @u, NOW(), NOW()),
--   (@t, 'Counter Sale',        2, 'COUNTER_SALE',        @u, NOW(), NOW()),
--   (@t, 'NET PURCHASE',        1, 'NET_PURCHASE',        @u, NOW(), NOW()),
--   (@t, 'NET PURCHASE RETURN', 1, 'NET_PURCHASE_RETURN', @u, NOW(), NOW());
--
--  Ya browser se (login ke baad):  /seed-system-customers
--  Route login user ki tenant_id se khud check/create karega.
-- =====================================================================
