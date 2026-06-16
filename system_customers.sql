ALTER TABLE `customers`
  ADD COLUMN `system_code` VARCHAR(50) NULL AFTER `customer_type`,
  ADD INDEX `customers_system_code_index` (`system_code`);

UPDATE `customers` SET `system_code` = 'EXPENSE'              WHERE `id` = 5 AND `tenant_id` = 1;
UPDATE `customers` SET `system_code` = 'NET_PURCHASE_RETURN'  WHERE `id` = 6 AND `tenant_id` = 1;
UPDATE `customers` SET `system_code` = 'NET_PURCHASE'         WHERE `id` = 7 AND `tenant_id` = 1;
UPDATE `customers` SET `system_code` = 'COUNTER_SALE'         WHERE `id` = 8 AND `tenant_id` = 1;
