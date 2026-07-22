-- ============================================================
-- Medical products import from TEAM A.pdf + TEAM B.pdf
-- 1) Insert companies (with tenant_id)
-- 2) Insert products (size required, linked by company_name)
-- barcode = P-Code | sale_price = list price
-- SET @tenant_id and @created_by before run
-- ============================================================

SET NAMES utf8mb4;
SET @tenant_id := 1;  -- <<< change to your real tenant_id
SET @created_by := 1; -- <<< change to your user id
SET @now := NOW();

START TRANSACTION;

-- -------------------- COMPANIES --------------------
INSERT INTO `companies` (`company_name`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT 'PHARMEVO (PVT) LIMITED', @tenant_id, @now, @created_by, @now
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `companies`
  WHERE `company_name` = 'PHARMEVO (PVT) LIMITED'
    AND (`tenant_id` = @tenant_id OR `tenant_id` IS NULL)
  LIMIT 1
);
INSERT INTO `companies` (`company_name`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT 'SANOFI AVENTIS PAK LTD (SELSUN)', @tenant_id, @now, @created_by, @now
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `companies`
  WHERE `company_name` = 'SANOFI AVENTIS PAK LTD (SELSUN)'
    AND (`tenant_id` = @tenant_id OR `tenant_id` IS NULL)
  LIMIT 1
);
INSERT INTO `companies` (`company_name`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT 'HELIX PHARMA PVT LTD', @tenant_id, @now, @created_by, @now
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `companies`
  WHERE `company_name` = 'HELIX PHARMA PVT LTD'
    AND (`tenant_id` = @tenant_id OR `tenant_id` IS NULL)
  LIMIT 1
);
INSERT INTO `companies` (`company_name`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT 'FEROZSONS LABORATORIES LIMITED', @tenant_id, @now, @created_by, @now
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `companies`
  WHERE `company_name` = 'FEROZSONS LABORATORIES LIMITED'
    AND (`tenant_id` = @tenant_id OR `tenant_id` IS NULL)
  LIMIT 1
);
INSERT INTO `companies` (`company_name`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT 'CHIESI PHARMACEUTICALS (PRIVATE) LIMITED', @tenant_id, @now, @created_by, @now
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `companies`
  WHERE `company_name` = 'CHIESI PHARMACEUTICALS (PRIVATE) LIMITED'
    AND (`tenant_id` = @tenant_id OR `tenant_id` IS NULL)
  LIMIT 1
);
INSERT INTO `companies` (`company_name`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT 'LCI PAKISTAN LIMITED', @tenant_id, @now, @created_by, @now
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `companies`
  WHERE `company_name` = 'LCI PAKISTAN LIMITED'
    AND (`tenant_id` = @tenant_id OR `tenant_id` IS NULL)
  LIMIT 1
);
INSERT INTO `companies` (`company_name`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT 'BECTON DICKINSON IMPORT', @tenant_id, @now, @created_by, @now
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `companies`
  WHERE `company_name` = 'BECTON DICKINSON IMPORT'
    AND (`tenant_id` = @tenant_id OR `tenant_id` IS NULL)
  LIMIT 1
);
INSERT INTO `companies` (`company_name`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT 'HORIZON PHARMACEUTICALS (PVT) LIMITED', @tenant_id, @now, @created_by, @now
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `companies`
  WHERE `company_name` = 'HORIZON PHARMACEUTICALS (PVT) LIMITED'
    AND (`tenant_id` = @tenant_id OR `tenant_id` IS NULL)
  LIMIT 1
);
INSERT INTO `companies` (`company_name`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT 'UNIFEROZ (SANI PLAST)', @tenant_id, @now, @created_by, @now
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `companies`
  WHERE `company_name` = 'UNIFEROZ (SANI PLAST)'
    AND (`tenant_id` = @tenant_id OR `tenant_id` IS NULL)
  LIMIT 1
);
INSERT INTO `companies` (`company_name`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT 'ABBOTT LABORATORIES PAKISTAN', @tenant_id, @now, @created_by, @now
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `companies`
  WHERE `company_name` = 'ABBOTT LABORATORIES PAKISTAN'
    AND (`tenant_id` = @tenant_id OR `tenant_id` IS NULL)
  LIMIT 1
);
INSERT INTO `companies` (`company_name`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT 'DKT PAKISTAN (PRIVATE) LIMITED', @tenant_id, @now, @created_by, @now
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `companies`
  WHERE `company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
    AND (`tenant_id` = @tenant_id OR `tenant_id` IS NULL)
  LIMIT 1
);
INSERT INTO `companies` (`company_name`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT 'HERBALSCIENCE PAKISTAN (PVT) LTD', @tenant_id, @now, @created_by, @now
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `companies`
  WHERE `company_name` = 'HERBALSCIENCE PAKISTAN (PVT) LTD'
    AND (`tenant_id` = @tenant_id OR `tenant_id` IS NULL)
  LIMIT 1
);
INSERT INTO `companies` (`company_name`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT 'FATHER AND SONS', @tenant_id, @now, @created_by, @now
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `companies`
  WHERE `company_name` = 'FATHER AND SONS'
    AND (`tenant_id` = @tenant_id OR `tenant_id` IS NULL)
  LIMIT 1
);
INSERT INTO `companies` (`company_name`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT 'MAZTON PHARMA', @tenant_id, @now, @created_by, @now
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `companies`
  WHERE `company_name` = 'MAZTON PHARMA'
    AND (`tenant_id` = @tenant_id OR `tenant_id` IS NULL)
  LIMIT 1
);
INSERT INTO `companies` (`company_name`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT 'MARTIN DOW MARKER LIMITED', @tenant_id, @now, @created_by, @now
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `companies`
  WHERE `company_name` = 'MARTIN DOW MARKER LIMITED'
    AND (`tenant_id` = @tenant_id OR `tenant_id` IS NULL)
  LIMIT 1
);
INSERT INTO `companies` (`company_name`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT 'MACTER INTERNATIONAL (PVT) LTD', @tenant_id, @now, @created_by, @now
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `companies`
  WHERE `company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
    AND (`tenant_id` = @tenant_id OR `tenant_id` IS NULL)
  LIMIT 1
);
INSERT INTO `companies` (`company_name`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT 'ATCO LIFE SCIENCES (PRIVATE) LIMITED', @tenant_id, @now, @created_by, @now
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `companies`
  WHERE `company_name` = 'ATCO LIFE SCIENCES (PRIVATE) LIMITED'
    AND (`tenant_id` = @tenant_id OR `tenant_id` IS NULL)
  LIMIT 1
);
INSERT INTO `companies` (`company_name`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT 'CCL & NEX PHARMA', @tenant_id, @now, @created_by, @now
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `companies`
  WHERE `company_name` = 'CCL & NEX PHARMA'
    AND (`tenant_id` = @tenant_id OR `tenant_id` IS NULL)
  LIMIT 1
);
INSERT INTO `companies` (`company_name`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT 'CUREXA HEALTH (PVT) LIMITED', @tenant_id, @now, @created_by, @now
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `companies`
  WHERE `company_name` = 'CUREXA HEALTH (PVT) LIMITED'
    AND (`tenant_id` = @tenant_id OR `tenant_id` IS NULL)
  LIMIT 1
);
INSERT INTO `companies` (`company_name`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT 'HIGHNOON LABORATORIES LTD', @tenant_id, @now, @created_by, @now
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `companies`
  WHERE `company_name` = 'HIGHNOON LABORATORIES LTD'
    AND (`tenant_id` = @tenant_id OR `tenant_id` IS NULL)
  LIMIT 1
);

UPDATE `companies`
SET `tenant_id` = @tenant_id
WHERE `tenant_id` IS NULL
  AND `company_name` IN ('PHARMEVO (PVT) LIMITED', 'SANOFI AVENTIS PAK LTD (SELSUN)', 'HELIX PHARMA PVT LTD', 'FEROZSONS LABORATORIES LIMITED', 'CHIESI PHARMACEUTICALS (PRIVATE) LIMITED', 'LCI PAKISTAN LIMITED', 'BECTON DICKINSON IMPORT', 'HORIZON PHARMACEUTICALS (PVT) LIMITED', 'UNIFEROZ (SANI PLAST)', 'ABBOTT LABORATORIES PAKISTAN', 'DKT PAKISTAN (PRIVATE) LIMITED', 'HERBALSCIENCE PAKISTAN (PVT) LTD', 'FATHER AND SONS', 'MAZTON PHARMA', 'MARTIN DOW MARKER LIMITED', 'MACTER INTERNATIONAL (PVT) LTD', 'ATCO LIFE SCIENCES (PRIVATE) LIMITED', 'CCL & NEX PHARMA', 'CUREXA HEALTH (PVT) LIMITED', 'HIGHNOON LABORATORIES LTD');

-- -------------------- PRODUCTS --------------------
-- Each insert resolves company_id from companies by name (no @company_id)

-- Company: PHARMEVO (PVT) LIMITED (199 products)
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ACTIFLOR SACHET 250 MG', '478', '-', 706.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '478' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ACTIFLOR SACHET 250 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ACTNISE CREAM 50GM CP', '13323', '-', 343.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13323' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ACTNISE CREAM 50GM CP'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AD FOLIC OD 600 MCG CP', '13149', '-', 526.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13149' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AD FOLIC OD 600 MCG CP'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AD FOLIC TABLET CP 30S', '12981', '-', 389.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '12981' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AD FOLIC TABLET CP 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AD-D CHEW TABLETS 10000IU 8S', '20447', '-', 169.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20447' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AD-D CHEW TABLETS 10000IU 8S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AD-D CHEW TABLETS 2000IU 30S', '20446', '-', 378.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20446' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AD-D CHEW TABLETS 2000IU 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AGOVIZ 25MG TABLET', '13555', '-', 711.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13555' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AGOVIZ 25MG TABLET'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AIR CARE PLUS DPI DEVICE', '30707', '-', 396.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30707' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AIR CARE PLUS DPI DEVICE'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AIREEZ 10 MG TAB', '481', '-', 791.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '481' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AIREEZ 10 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AIREEZ 5 MG TAB', '480', '-', 587.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '480' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AIREEZ 5 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AIREEZ SACHET', '482', '-', 357.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '482' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AIREEZ SACHET'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ANEX-M 85/500MG TABLETS 2S', '20329', '-', 333.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20329' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ANEX-M 85/500MG TABLETS 2S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ANPLAG 90MG TAB CP', '13543', '-', 1445.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13543' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ANPLAG 90MG TAB CP'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ARBI 150 MG TAB', '5889', '-', 319.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '5889' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ARBI 150 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ARBI 300 MG TAB', '5890', '-', 413.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '5890' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ARBI 300 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ARBI A 100/10MG TABLET 10S', '30427', '-', 311.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30427' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ARBI A 100/10MG TABLET 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ARBI A 100/5MG TABLET 10S', '30426', '-', 273.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30426' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ARBI A 100/5MG TABLET 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ARBI D 150/12.5 MG TAB', '5891', '-', 383.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '5891' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ARBI D 150/12.5 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ARBI D 300/12.5 MG TAB', '5892', '-', 570.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '5892' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ARBI D 300/12.5 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AVSAR 160/10MG', '3956', '-', 604.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '3956' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AVSAR 160/10MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AVSAR 160/5MG', '3955', '-', 498.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '3955' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AVSAR 160/5MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AVSAR 80/5MG', '3954', '-', 393.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '3954' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AVSAR 80/5MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AVSAR PLUS TAB 160/10/12.5 MG', '11148', '-', 463.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '11148' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AVSAR PLUS TAB 160/10/12.5 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AVSAR PLUS TAB 160/10/25 MG', '11149', '-', 469.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '11149' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AVSAR PLUS TAB 160/10/25 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AVSAR PLUS TAB 160/5/12.5 MG', '11150', '-', 427.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '11150' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AVSAR PLUS TAB 160/5/12.5 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AVSAR PLUS TAB 160/5/25 MG', '11151', '-', 438.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '11151' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AVSAR PLUS TAB 160/5/25 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AVSAR PLUS TAB 320/10/25 MG', '11152', '-', 565.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '11152' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AVSAR PLUS TAB 320/10/25 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BEMPION 180MG TABLET 10S', '32992', '-', 408.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32992' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BEMPION 180MG TABLET 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BEMPION EZ 180/10MG TABLET 10S', '32993', '-', 425.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32993' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BEMPION EZ 180/10MG TABLET 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BREVE NEBUL SUSP 1MG/2ML 5S', '34905', '-', 399.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34905' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BREVE NEBUL SUSP 1MG/2ML 5S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BUSONIDE 200/6MCG CAP 30S', '20917', '-', 355.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20917' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BUSONIDE 200/6MCG CAP 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BUSONIDE 400/12 MCG CAP 30S', '20918', '-', 472.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20918' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BUSONIDE 400/12 MCG CAP 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BYVAS 10MG TABLET', '13719', '-', 404.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13719' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BYVAS 10MG TABLET'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BYVAS 2.5MG TABLET', '13717', '-', 217.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13717' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BYVAS 2.5MG TABLET'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BYVAS 5MG TABLET', '13718', '-', 329.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13718' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BYVAS 5MG TABLET'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CLORES NEBUL SUS 0.8MG/2ML 10S', '34906', '-', 935.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34906' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CLORES NEBUL SUS 0.8MG/2ML 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CLORES-S NEBU SUS 0.8/1.6M 10S', '34907', '-', 1105.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34907' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CLORES-S NEBU SUS 0.8/1.6M 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DAPWIZ 10MG TABLETS 10S', '17843', '-', 357.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '17843' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DAPWIZ 10MG TABLETS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DAPWIZ 5MG TABLETS 10S', '17842', '-', 238.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '17842' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DAPWIZ 5MG TABLETS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DAPWIZ PLUS XR 10/1000MG 14S', '30279', '-', 393.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30279' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DAPWIZ PLUS XR 10/1000MG 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DAPWIZ PLUS XR 10/500MG 14S', '30278', '-', 476.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30278' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DAPWIZ PLUS XR 10/500MG 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DAPWIZ PLUS XR 5/1000MG 14S', '30277', '-', 442.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30277' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DAPWIZ PLUS XR 5/1000MG 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DAPWIZ PLUS XR 5/500MG 14S', '30276', '-', 439.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30276' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DAPWIZ PLUS XR 5/500MG 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DIPOF 3/25MG CAPSULE 20S', '19995', '-', 196.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19995' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DIPOF 3/25MG CAPSULE 20S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DIPOF 6/25MG CAPSULE 20S', '19996', '-', 329.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19996' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DIPOF 6/25MG CAPSULE 20S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DIU TANSIN', '439', '-', 234.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '439' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DIU TANSIN'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DUZALTA 20MG 14S', '10712', '-', 563.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '10712' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DUZALTA 20MG 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DUZALTA 30MG 14S', '10713', '-', 605.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '10713' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DUZALTA 30MG 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'GOURIC 40MG TAB', '4466', '-', 578.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '4466' OR (p.`company_id` = c.`id` AND p.`product_name` = 'GOURIC 40MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'GOURIC 80MG TAB', '4467', '-', 901.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '4467' OR (p.`company_id` = c.`id` AND p.`product_name` = 'GOURIC 80MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'HEM 7361 T-EBK M7 INTEL IT UA', '12682', '-', 26400.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '12682' OR (p.`company_id` = c.`id` AND p.`product_name` = 'HEM 7361 T-EBK M7 INTEL IT UA'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'HISTALIS 10MG TABLETS 10S', '20742', '-', 179.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20742' OR (p.`company_id` = c.`id` AND p.`product_name` = 'HISTALIS 10MG TABLETS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'HISTALIS 20MG TABLETS 10S', '20743', '-', 289.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20743' OR (p.`company_id` = c.`id` AND p.`product_name` = 'HISTALIS 20MG TABLETS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'INDALO CAP 110/50MCG 30S', '35348', '-', 1275.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '35348' OR (p.`company_id` = c.`id` AND p.`product_name` = 'INDALO CAP 110/50MCG 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'INDALO-M CAP 150/50/160MCG 30S', '35351', '-', 1275.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '35351' OR (p.`company_id` = c.`id` AND p.`product_name` = 'INDALO-M CAP 150/50/160MCG 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'INOSITA 50MG TAB 28S', '16356', '-', 1000.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '16356' OR (p.`company_id` = c.`id` AND p.`product_name` = 'INOSITA 50MG TAB 28S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'INOSITA PLUS 50/1000MG TAB 28S', '15825', '-', 1067.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '15825' OR (p.`company_id` = c.`id` AND p.`product_name` = 'INOSITA PLUS 50/1000MG TAB 28S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'INOSITA PLUS 50/500MG TAB 28S', '15667', '-', 1039.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '15667' OR (p.`company_id` = c.`id` AND p.`product_name` = 'INOSITA PLUS 50/500MG TAB 28S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'INOSITA PLUS 50/850MG TAB 28S', '15826', '-', 1058.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '15826' OR (p.`company_id` = c.`id` AND p.`product_name` = 'INOSITA PLUS 50/850MG TAB 28S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'INOSITA PLUS XR 100/1000MG TAB', '14589', '-', 690.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '14589' OR (p.`company_id` = c.`id` AND p.`product_name` = 'INOSITA PLUS XR 100/1000MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'INOSITA PLUS XR 50/1000MG TAB', '14588', '-', 629.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '14588' OR (p.`company_id` = c.`id` AND p.`product_name` = 'INOSITA PLUS XR 50/1000MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'INOSITA PLUS XR 50/500MG TAB', '14587', '-', 583.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '14587' OR (p.`company_id` = c.`id` AND p.`product_name` = 'INOSITA PLUS XR 50/500MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'IPRAZYME 0.025% INH SOL 5S', '34365', '-', 485.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34365' OR (p.`company_id` = c.`id` AND p.`product_name` = 'IPRAZYME 0.025% INH SOL 5S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'IPRAZYME-S 0.5/2.5M INH SOL 5S', '34366', '-', 595.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34366' OR (p.`company_id` = c.`id` AND p.`product_name` = 'IPRAZYME-S 0.5/2.5M INH SOL 5S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ITIPSO 50MG TABLETS 10S', '30581', '-', 187.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30581' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ITIPSO 50MG TABLETS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'K-1000 CHEW TABLET', '16428', '-', 627.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '16428' OR (p.`company_id` = c.`id` AND p.`product_name` = 'K-1000 CHEW TABLET'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'K-1000 PLUS 1200MG SACHET 10S', '32328', '-', 252.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32328' OR (p.`company_id` = c.`id` AND p.`product_name` = 'K-1000 PLUS 1200MG SACHET 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'KALSOB TABLET CP', '13150', '-', 627.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13150' OR (p.`company_id` = c.`id` AND p.`product_name` = 'KALSOB TABLET CP'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'KLEVRA 250MG TAB', '4464', '-', 988.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '4464' OR (p.`company_id` = c.`id` AND p.`product_name` = 'KLEVRA 250MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'KLEVRA 500MG TAB', '4465', '-', 1628.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '4465' OR (p.`company_id` = c.`id` AND p.`product_name` = 'KLEVRA 500MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'KLEVRA 60 ML', '4905', '-', 550.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '4905' OR (p.`company_id` = c.`id` AND p.`product_name` = 'KLEVRA 60 ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LOWPLAT 75MG TAB', '459', '-', 237.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '459' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LOWPLAT 75MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LOWPLAT PLUS 150 MG TAB', '460', '-', 263.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '460' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LOWPLAT PLUS 150 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LOWPLAT PLUS 75 MG TAB', '461', '-', 254.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '461' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LOWPLAT PLUS 75 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MOMIST 50MCG NASAL SPRAY 1S', '33024', '-', 587.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '33024' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MOMIST 50MCG NASAL SPRAY 1S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'NEO Q10 100MG CP', '13148', '-', 1117.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13148' OR (p.`company_id` = c.`id` AND p.`product_name` = 'NEO Q10 100MG CP'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'NISE TABLETS', '507', '-', 260.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '507' OR (p.`company_id` = c.`id` AND p.`product_name` = 'NISE TABLETS'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'OMRON ECO TEMP BASIC', '5723', '-', 1642.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '5723' OR (p.`company_id` = c.`id` AND p.`product_name` = 'OMRON ECO TEMP BASIC'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'OMRON M1 LIMITED HEM-7121 J-AF', '31678', '-', 6356.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31678' OR (p.`company_id` = c.`id` AND p.`product_name` = 'OMRON M1 LIMITED HEM-7121 J-AF'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'OMRON NEBULIZER NE-C101-E ESS', '31296', '-', 13424.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31296' OR (p.`company_id` = c.`id` AND p.`product_name` = 'OMRON NEBULIZER NE-C101-E ESS'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ONITA SACHET 2 GM', '1691', '-', 1190.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '1691' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ONITA SACHET 2 GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'OPT-D 200,000 IU INJ CP', '15448', '-', 143.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '15448' OR (p.`company_id` = c.`id` AND p.`product_name` = 'OPT-D 200,000 IU INJ CP'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'OPT-D CAP 10000IU 30S', '34904', '-', 720.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34904' OR (p.`company_id` = c.`id` AND p.`product_name` = 'OPT-D CAP 10000IU 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'OPT-D CAP 5000IU 30S', '34903', '-', 648.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34903' OR (p.`company_id` = c.`id` AND p.`product_name` = 'OPT-D CAP 5000IU 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'OPT-D CAPSULE 200000 IU CP', '13221', '-', 303.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13221' OR (p.`company_id` = c.`id` AND p.`product_name` = 'OPT-D CAPSULE 200000 IU CP'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'OPT-D CAPSULE 25000 IU CP', '13151', '-', 198.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13151' OR (p.`company_id` = c.`id` AND p.`product_name` = 'OPT-D CAPSULE 25000 IU CP'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ORSLIM 120 MG CAP', '462', '-', 2189.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '462' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ORSLIM 120 MG CAP'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PARIDOPA 100/25/200MG TAB 30S', '17562', '-', 1543.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '17562' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PARIDOPA 100/25/200MG TAB 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PARIDOPA 200/50/200MG TAB', '13730', '-', 2010.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13730' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PARIDOPA 200/50/200MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PAZOMEZ MR TAB 500/20MG 30S', '34902', '-', 1020.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34902' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PAZOMEZ MR TAB 500/20MG 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'RAMIPACE 1.25 MG TAB 28S', '6779', '-', 365.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '6779' OR (p.`company_id` = c.`id` AND p.`product_name` = 'RAMIPACE 1.25 MG TAB 28S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'RAMIPACE 10 MG TAB', '466', '-', 1015.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '466' OR (p.`company_id` = c.`id` AND p.`product_name` = 'RAMIPACE 10 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'RAMIPACE 2.5 MG TAB (28S)', '6587', '-', 618.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '6587' OR (p.`company_id` = c.`id` AND p.`product_name` = 'RAMIPACE 2.5 MG TAB (28S)'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'RAMIPACE 5 MG TAB', '465', '-', 753.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '465' OR (p.`company_id` = c.`id` AND p.`product_name` = 'RAMIPACE 5 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'REDEXA 30MG CAPSULE 30S', '18826', '-', 545.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18826' OR (p.`company_id` = c.`id` AND p.`product_name` = 'REDEXA 30MG CAPSULE 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'REDEXA 60MG CAPSULE 30S', '18827', '-', 761.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18827' OR (p.`company_id` = c.`id` AND p.`product_name` = 'REDEXA 60MG CAPSULE 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DUZALTA 60MG 10S', '10714', '-', 579.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '10714' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DUZALTA 60MG 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EGLARO 15MG TABLETS 14S', '20364', '-', 445.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20364' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EGLARO 15MG TABLETS 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EGLARO-S 15/100MG TABLETS 14S', '20365', '-', 672.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20365' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EGLARO-S 15/100MG TABLETS 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EGLARO-S 5/100MG TABLETS 14S', '20844', '-', 574.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20844' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EGLARO-S 5/100MG TABLETS 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ERLI 10MG TAB 14S', '16395', '-', 380.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '16395' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ERLI 10MG TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ERLI 25MG TAB 14S', '16396', '-', 553.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '16396' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ERLI 25MG TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ERLI PLUS 12.5/1000MG TABLETS', '22511', '-', 361.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '22511' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ERLI PLUS 12.5/1000MG TABLETS'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ERLI PLUS 12.5/500MG TABLETS', '22510', '-', 361.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '22510' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ERLI PLUS 12.5/500MG TABLETS'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ERLI PLUS 12.5/850MG TAB 14S', '21803', '-', 361.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21803' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ERLI PLUS 12.5/850MG TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ERLI PLUS 5/1000MG TABLETS 14S', '22514', '-', 182.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '22514' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ERLI PLUS 5/1000MG TABLETS 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ERLI PLUS 5/500MG TABLETS 14S', '22512', '-', 289.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '22512' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ERLI PLUS 5/500MG TABLETS 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ERLI PLUS 5/850MG TABLETS 14S', '22513', '-', 182.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '22513' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ERLI PLUS 5/850MG TABLETS 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ERLI PLUS XR 12.5/1000MG TAB', '17552', '-', 481.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '17552' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ERLI PLUS XR 12.5/1000MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ERLI PLUS XR 25/1000MG TAB 14S', '17553', '-', 687.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '17553' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ERLI PLUS XR 25/1000MG TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ERLINA 10/5MG TABLETS 14S', '21376', '-', 488.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21376' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ERLINA 10/5MG TABLETS 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ERLINA 25/5MG TABLETS 14S', '21377', '-', 690.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21377' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ERLINA 25/5MG TABLETS 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ERLINA PLU XR 12.5/2.5/1000M T', '31080', '-', 238.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31080' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ERLINA PLU XR 12.5/2.5/1000M T'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ERLINA PLU XR 25/5/1000M TB 14', '31081', '-', 286.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31081' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ERLINA PLU XR 25/5/1000M TB 14'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ERLINA PLUS XR 10/5/1000M TAB1', '31079', '-', 286.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31079' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ERLINA PLUS XR 10/5/1000M TAB1'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ERLINA PLUS XR 5/2.5/1000M TAB', '31078', '-', 238.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31078' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ERLINA PLUS XR 5/2.5/1000M TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ESTAR 10 MG TAB 14S', '10700', '-', 421.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '10700' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ESTAR 10 MG TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ESTAR 20 MG TAB', '442', '-', 608.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '442' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ESTAR 20 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ESTAR 5 MG TAB', '440', '-', 296.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '440' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ESTAR 5 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVOCHECK BGM 700S', '12820', '-', 4800.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '12820' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVOCHECK BGM 700S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVOCHECK BGM STRIPS', '12821', '-', 2241.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '12821' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVOCHECK BGM STRIPS'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVOCHECK GO METER KIT', '20414', '-', 3000.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20414' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVOCHECK GO METER KIT'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVOCHECK GO STRIP 50S', '20415', '-', 1451.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20415' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVOCHECK GO STRIP 50S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVOCHECK PREMIUM LINX CGM 1S', '34563', '-', 13600.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34563' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVOCHECK PREMIUM LINX CGM 1S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVOCHECK WEIGHING SCALE BLACK', '30816', '-', 2644.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30816' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVOCHECK WEIGHING SCALE BLACK'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVOFIX 400 MG CAP', '496', '-', 714.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '496' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVOFIX 400 MG CAP'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVOKALM 100 MG', '1496', '-', 414.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '1496' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVOKALM 100 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVOKALM 200MG', '1494', '-', 469.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '1494' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVOKALM 200MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVOKALM 25 MG', '1495', '-', 190.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '1495' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVOKALM 25 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVOKALM XR 300MG', '4463', '-', 553.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '4463' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVOKALM XR 300MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVOPRIDE PLUS 1/500 MG', '588', '-', 269.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '588' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVOPRIDE PLUS 1/500 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVOPRIDE PLUS 2/500 MG', '599', '-', 494.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '599' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVOPRIDE PLUS 2/500 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVOPRIDE TAB 1MG 30S', '11133', '-', 229.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '11133' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVOPRIDE TAB 1MG 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVOPRIDE TAB 2MG 30S', '10978', '-', 453.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '10978' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVOPRIDE TAB 2MG 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVOPRIDE TAB 3MG 30S', '10777', '-', 612.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '10777' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVOPRIDE TAB 3MG 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVOPRIDE TAB 4MG 30S', '10977', '-', 944.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '10977' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVOPRIDE TAB 4MG 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'FASTESO 20 MG TAB', '447', '-', 223.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '447' OR (p.`company_id` = c.`id` AND p.`product_name` = 'FASTESO 20 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'FASTESO 40 MG TAB', '448', '-', 448.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '448' OR (p.`company_id` = c.`id` AND p.`product_name` = 'FASTESO 40 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'FEMOVA SACHET CP', '14626', '-', 1081.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '14626' OR (p.`company_id` = c.`id` AND p.`product_name` = 'FEMOVA SACHET CP'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'FERFER SACHET CP 14MG', '11385', '-', 756.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '11385' OR (p.`company_id` = c.`id` AND p.`product_name` = 'FERFER SACHET CP 14MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'FINERDIA TABLET 10MG 30S', '34561', '-', 357.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34561' OR (p.`company_id` = c.`id` AND p.`product_name` = 'FINERDIA TABLET 10MG 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'FINERDIA TABLET 20MG 30S', '34562', '-', 536.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34562' OR (p.`company_id` = c.`id` AND p.`product_name` = 'FINERDIA TABLET 20MG 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'FINNO-Q 3MG SACHET 10S', '30582', '-', 504.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30582' OR (p.`company_id` = c.`id` AND p.`product_name` = 'FINNO-Q 3MG SACHET 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'FORSONIDE 50/250MCG CAP 30S', '31987', '-', 510.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31987' OR (p.`company_id` = c.`id` AND p.`product_name` = 'FORSONIDE 50/250MCG CAP 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'RETZOLE 2.5MG TABLET 10S', '18693', '-', 1785.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18693' OR (p.`company_id` = c.`id` AND p.`product_name` = 'RETZOLE 2.5MG TABLET 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'REVOLIC TAB CP', '13558', '-', 545.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13558' OR (p.`company_id` = c.`id` AND p.`product_name` = 'REVOLIC TAB CP'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SACVIN 100MG TAB', '14680', '-', 1950.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '14680' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SACVIN 100MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SACVIN 50MG TAB', '14679', '-', 1320.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '14679' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SACVIN 50MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SHEVIT MULTIVIT ORAL TAB 30S', '17746', '-', 497.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '17746' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SHEVIT MULTIVIT ORAL TAB 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SPARLIV TABLETS 30S', '20730', '-', 792.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20730' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SPARLIV TABLETS 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'STEVO 1GM SACHET 50S', '30280', '-', 450.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30280' OR (p.`company_id` = c.`id` AND p.`product_name` = 'STEVO 1GM SACHET 50S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SUPERCRAN SACHET CP', '13220', '-', 360.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13220' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SUPERCRAN SACHET CP'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TANSIN DS 100 MG TAB', '468', '-', 310.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '468' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TANSIN DS 100 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TANSIN TAB', '467', '-', 200.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '467' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TANSIN TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TELSARTA 20 MG TAB', '4124', '-', 187.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '4124' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TELSARTA 20 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TELSARTA 40 MG TAB', '4125', '-', 281.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '4125' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TELSARTA 40 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TELSARTA 80 MG TAB', '4126', '-', 400.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '4126' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TELSARTA 80 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TELSARTA A 10/40 MG TAB', '9079', '-', 323.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '9079' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TELSARTA A 10/40 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TELSARTA A 10/80 MG TAB', '9081', '-', 391.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '9081' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TELSARTA A 10/80 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TELSARTA A 5/40 MG TAB', '9078', '-', 417.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '9078' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TELSARTA A 5/40 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TELSARTA A 5/80 MG TAB', '9080', '-', 541.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '9080' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TELSARTA A 5/80 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TELSARTA-D 40/12.5 MG TAB', '4127', '-', 417.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '4127' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TELSARTA-D 40/12.5 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TELSARTA-D 80/12.5 MG TAB', '4128', '-', 621.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '4128' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TELSARTA-D 80/12.5 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'THEWRIL 4MG CAPS 20S', '17355', '-', 595.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '17355' OR (p.`company_id` = c.`id` AND p.`product_name` = 'THEWRIL 4MG CAPS 20S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TIOCAP 18MCG CAPSULE 30S', '30576', '-', 638.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30576' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TIOCAP 18MCG CAPSULE 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TREATAN 4 MG TAB', '469', '-', 338.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '469' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TREATAN 4 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TREATAN 8 MG TAB', '470', '-', 405.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '470' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TREATAN 8 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'VANZAK 10MG TABLET 10S', '32236', '-', 238.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32236' OR (p.`company_id` = c.`id` AND p.`product_name` = 'VANZAK 10MG TABLET 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'VANZAK 20MG TABLET 10S', '32237', '-', 383.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32237' OR (p.`company_id` = c.`id` AND p.`product_name` = 'VANZAK 20MG TABLET 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'VIBLE TABLETS 30S', '20749', '-', 720.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20749' OR (p.`company_id` = c.`id` AND p.`product_name` = 'VIBLE TABLETS 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'VOXAMINE 100 MG TAB', '474', '-', 623.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '474' OR (p.`company_id` = c.`id` AND p.`product_name` = 'VOXAMINE 100 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'VOXAMINE 50 MG TAB', '473', '-', 311.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '473' OR (p.`company_id` = c.`id` AND p.`product_name` = 'VOXAMINE 50 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'XCEPT 10MG TAB', '9487', '-', 455.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '9487' OR (p.`company_id` = c.`id` AND p.`product_name` = 'XCEPT 10MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'XCEPT 15MG TAB', '9488', '-', 774.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '9488' OR (p.`company_id` = c.`id` AND p.`product_name` = 'XCEPT 15MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'XCEPT 2.5MG TAB', '14373', '-', 298.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '14373' OR (p.`company_id` = c.`id` AND p.`product_name` = 'XCEPT 2.5MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'XCEPT 20MG TAB', '9489', '-', 914.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '9489' OR (p.`company_id` = c.`id` AND p.`product_name` = 'XCEPT 20MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'XILICA 100MG 14S', '10731', '-', 508.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '10731' OR (p.`company_id` = c.`id` AND p.`product_name` = 'XILICA 100MG 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'XILICA 150MG 14S', '10732', '-', 584.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '10732' OR (p.`company_id` = c.`id` AND p.`product_name` = 'XILICA 150MG 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'XILICA 25MG 14S', '13560', '-', 242.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13560' OR (p.`company_id` = c.`id` AND p.`product_name` = 'XILICA 25MG 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'XILICA 50MG 14S', '10729', '-', 365.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '10729' OR (p.`company_id` = c.`id` AND p.`product_name` = 'XILICA 50MG 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'XILICA 75MG 14S', '10730', '-', 453.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '10730' OR (p.`company_id` = c.`id` AND p.`product_name` = 'XILICA 75MG 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'X-PLENDED 05 MG TAB', '475', '-', 233.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '475' OR (p.`company_id` = c.`id` AND p.`product_name` = 'X-PLENDED 05 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'X-PLENDED 10 MG TAB', '476', '-', 405.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '476' OR (p.`company_id` = c.`id` AND p.`product_name` = 'X-PLENDED 10 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'X-PLENDED 20 MG TAB', '477', '-', 570.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '477' OR (p.`company_id` = c.`id` AND p.`product_name` = 'X-PLENDED 20 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'X-PLENDED EZ 10/10MG TAB 10S', '20537', '-', 374.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20537' OR (p.`company_id` = c.`id` AND p.`product_name` = 'X-PLENDED EZ 10/10MG TAB 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'X-PLENDED EZ 20/10MG TAB 10S', '20538', '-', 576.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20538' OR (p.`company_id` = c.`id` AND p.`product_name` = 'X-PLENDED EZ 20/10MG TAB 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'X-PLENDED EZ 5/10MG TAB 10S', '20536', '-', 247.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20536' OR (p.`company_id` = c.`id` AND p.`product_name` = 'X-PLENDED EZ 5/10MG TAB 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ZIBES 10MG TABLET 20S', '18722', '-', 389.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18722' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ZIBES 10MG TABLET 20S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ZIBES 2.5MG TABLET 14S', '18720', '-', 55.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18720' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ZIBES 2.5MG TABLET 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ZIBES 5MG TABLET 20S', '18721', '-', 209.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18721' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ZIBES 5MG TABLET 20S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ZILFOM 400MG TABLETS 5S', '20746', '-', 497.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20746' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ZILFOM 400MG TABLETS 5S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ZOLTAR 20MG CAPS', '512', '-', 308.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '512' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ZOLTAR 20MG CAPS'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'FORSONIDE 50/500MCG CAP 30S', '31988', '-', 561.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31988' OR (p.`company_id` = c.`id` AND p.`product_name` = 'FORSONIDE 50/500MCG CAP 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'GALVECTA 50MG 10S', '11011', '-', 340.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '11011' OR (p.`company_id` = c.`id` AND p.`product_name` = 'GALVECTA 50MG 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'GALVECTA PLUS 50/1000MG 14S', '11013', '-', 519.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '11013' OR (p.`company_id` = c.`id` AND p.`product_name` = 'GALVECTA PLUS 50/1000MG 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'GALVECTA PLUS 50/500MG TAB', '15843', '-', 493.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '15843' OR (p.`company_id` = c.`id` AND p.`product_name` = 'GALVECTA PLUS 50/500MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'GALVECTA PLUS 50/850MG 14S', '11012', '-', 510.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '11012' OR (p.`company_id` = c.`id` AND p.`product_name` = 'GALVECTA PLUS 50/850MG 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ZOLTAR 40MG CAPS', '15079', '-', 331.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '15079' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ZOLTAR 40MG CAPS'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ZOLTAR INJ.40 MG', '583', '-', 336.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'PHARMEVO (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '583' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ZOLTAR INJ.40 MG'))
    LIMIT 1
  )
LIMIT 1;

-- Company: SANOFI AVENTIS PAK LTD (SELSUN) (8 products)
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SELSUN 2.5% SUSPENSION 60ML', '30874', '-', 276.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'SANOFI AVENTIS PAK LTD (SELSUN)'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30874' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SELSUN 2.5% SUSPENSION 60ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SELSUN BLUE BF 180ML', '34956', '-', 595.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'SANOFI AVENTIS PAK LTD (SELSUN)'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34956' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SELSUN BLUE BF 180ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SELSUN BLUE BF 250ML', '30872', '-', 766.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'SANOFI AVENTIS PAK LTD (SELSUN)'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30872' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SELSUN BLUE BF 250ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SELSUN BLUE BF 90ML', '34954', '-', 336.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'SANOFI AVENTIS PAK LTD (SELSUN)'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34954' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SELSUN BLUE BF 90ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SELSUN BLUE MF 180ML', '34958', '-', 595.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'SANOFI AVENTIS PAK LTD (SELSUN)'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34958' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SELSUN BLUE MF 180ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SELSUN BLUE MF 250ML', '30873', '-', 766.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'SANOFI AVENTIS PAK LTD (SELSUN)'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30873' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SELSUN BLUE MF 250ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SELSUN BLUE MF 300ML', '34959', '-', 801.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'SANOFI AVENTIS PAK LTD (SELSUN)'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34959' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SELSUN BLUE MF 300ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SELSUN BLUE MF 90ML', '34957', '-', 336.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'SANOFI AVENTIS PAK LTD (SELSUN)'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34957' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SELSUN BLUE MF 90ML'))
    LIMIT 1
  )
LIMIT 1;

-- Company: HELIX PHARMA PVT LTD (7 products)
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CLARIDERM ANTI ACNE FA/WA 60ML', '23298', '-', 756.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HELIX PHARMA PVT LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23298' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CLARIDERM ANTI ACNE FA/WA 60ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'FUGIX CAPSULE 50MG CP 7S', '12941', '-', 506.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HELIX PHARMA PVT LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '12941' OR (p.`company_id` = c.`id` AND p.`product_name` = 'FUGIX CAPSULE 50MG CP 7S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'HYDRA FX MOISTUR CREAM 60GM', '22795', '-', 684.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HELIX PHARMA PVT LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '22795' OR (p.`company_id` = c.`id` AND p.`product_name` = 'HYDRA FX MOISTUR CREAM 60GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MYCONIL CREAM 30GM', '30406', '-', 885.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HELIX PHARMA PVT LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30406' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MYCONIL CREAM 30GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SOLERO TINTED 30GM', '30407', '-', 1020.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HELIX PHARMA PVT LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30407' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SOLERO TINTED 30GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TRESSFIX HAIR SERUM 60ML', '22798', '-', 2305.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HELIX PHARMA PVT LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '22798' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TRESSFIX HAIR SERUM 60ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'WYNN BRIGHTENING SERUM 20ML', '22802', '-', 1700.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HELIX PHARMA PVT LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '22802' OR (p.`company_id` = c.`id` AND p.`product_name` = 'WYNN BRIGHTENING SERUM 20ML'))
    LIMIT 1
  )
LIMIT 1;

-- Company: FEROZSONS LABORATORIES LIMITED (30 products)
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ATENORM 100MG TABLET 20S', '23377', '-', 259.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23377' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ATENORM 100MG TABLET 20S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ATENORM 50MG TABLETS 14S', '23378', '-', 119.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23378' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ATENORM 50MG TABLETS 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BRONOCHOL COUGH SYRUP 120ML', '19798', '-', 128.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19798' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BRONOCHOL COUGH SYRUP 120ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BRONOCHOL IVY SYRUP 120ML', '34430', '-', 205.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34430' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BRONOCHOL IVY SYRUP 120ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BRONOCHOL NAT LOZENGES 100S', '32076', '-', 1094.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32076' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BRONOCHOL NAT LOZENGES 100S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CALIPTROL 10MG TABLET 10S', '31560', '-', 204.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31560' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CALIPTROL 10MG TABLET 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CALIPTROL 20MG TABLET 10S', '31561', '-', 340.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31561' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CALIPTROL 20MG TABLET 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CLARION 125MG/5ML SUSP 60ML', '19786', '-', 318.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19786' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CLARION 125MG/5ML SUSP 60ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CLARION 250MG TABLETS 10S', '19787', '-', 327.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19787' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CLARION 250MG TABLETS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CLARION 500MG TABLETS 10S', '19788', '-', 514.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19788' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CLARION 500MG TABLETS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CLARION XR 500MG TABLETS 5S', '19785', '-', 223.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19785' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CLARION XR 500MG TABLETS 5S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ESOMEGA 20MG CAPSULE 14S', '19793', '-', 205.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19793' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ESOMEGA 20MG CAPSULE 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ESOMEGA 40MG CAPSULE 14S', '19794', '-', 349.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19794' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ESOMEGA 40MG CAPSULE 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'H2F 20MG TABLETS 10S', '21963', '-', 119.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21963' OR (p.`company_id` = c.`id` AND p.`product_name` = 'H2F 20MG TABLETS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'H2F 40MG TABLETS 10S', '21964', '-', 238.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21964' OR (p.`company_id` = c.`id` AND p.`product_name` = 'H2F 40MG TABLETS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'HELICURE TABLET/CAPSULE', '19795', '-', 860.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19795' OR (p.`company_id` = c.`id` AND p.`product_name` = 'HELICURE TABLET/CAPSULE'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LEVO 250MG TABLETS 10S', '19789', '-', 207.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19789' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LEVO 250MG TABLETS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LEVO 500MG TABLETS 10S', '19790', '-', 281.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19790' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LEVO 500MG TABLETS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LORMAX 10MG TABLETS 10S', '19784', '-', 102.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19784' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LORMAX 10MG TABLETS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MONTEKAST 10MG TABLETS 14S', '20732', '-', 282.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20732' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MONTEKAST 10MG TABLETS 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MONTEKAST 5MG TABLETS 14S', '20731', '-', 204.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20731' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MONTEKAST 5MG TABLETS 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'OMEGA 20MG CAPSULE 14S', '32782', '-', 332.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32782' OR (p.`company_id` = c.`id` AND p.`product_name` = 'OMEGA 20MG CAPSULE 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PROFLOX 250MG TABLETS 10S', '19791', '-', 174.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19791' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PROFLOX 250MG TABLETS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PROFLOX 500MG TABLETS 10S', '19792', '-', 295.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19792' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PROFLOX 500MG TABLETS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SEMAGEN 0.25MG/0.188ML INJ 1S', '34426', '-', 850.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34426' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SEMAGEN 0.25MG/0.188ML INJ 1S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SEMAGEN 0.5MG/0.375ML INJ 1S', '34427', '-', 1700.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34427' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SEMAGEN 0.5MG/0.375ML INJ 1S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SEMAGEN 1MG/0.75ML INJ 1S', '34428', '-', 2550.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34428' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SEMAGEN 1MG/0.75ML INJ 1S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ULTRAHEAT RUB CREAM 50GM', '32815', '-', 393.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32815' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ULTRAHEAT RUB CREAM 50GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ZENITH 0.25MG TABLETS 30S', '22948', '-', 128.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '22948' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ZENITH 0.25MG TABLETS 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ZENITH 0.50MG TABLETS 30S', '22949', '-', 179.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FEROZSONS LABORATORIES LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '22949' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ZENITH 0.50MG TABLETS 30S'))
    LIMIT 1
  )
LIMIT 1;

-- Company: CHIESI PHARMACEUTICALS (PRIVATE) LIMITED (14 products)
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'C-KAST 10MG', '21013', '-', 289.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CHIESI PHARMACEUTICALS (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21013' OR (p.`company_id` = c.`id` AND p.`product_name` = 'C-KAST 10MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LIOMETACEN 50MG INJ 6+6S', '30485', '-', 2104.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CHIESI PHARMACEUTICALS (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30485' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LIOMETACEN 50MG INJ 6+6S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PROLIFEN 50MG CAPSULE 10S', '30487', '-', 589.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CHIESI PHARMACEUTICALS (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30487' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PROLIFEN 50MG CAPSULE 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'RIACEN 20MG CAPSULE 20S', '21775', '-', 202.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CHIESI PHARMACEUTICALS (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21775' OR (p.`company_id` = c.`id` AND p.`product_name` = 'RIACEN 20MG CAPSULE 20S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'RIACEN CREAM 15GM', '30490', '-', 89.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CHIESI PHARMACEUTICALS (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30490' OR (p.`company_id` = c.`id` AND p.`product_name` = 'RIACEN CREAM 15GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TRICHOGIN 500MG TABLETS 20S', '30488', '-', 349.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CHIESI PHARMACEUTICALS (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30488' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TRICHOGIN 500MG TABLETS 20S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BREXIN 20MG TABLETS 30S', '34491', '-', 911.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CHIESI PHARMACEUTICALS (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34491' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BREXIN 20MG TABLETS 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ATEM 0.025% NEBULISER SOL 10S', '21008', '-', 1311.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CHIESI PHARMACEUTICALS (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21008' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ATEM 0.025% NEBULISER SOL 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BAMIFIX TABLETS', '21012', '-', 932.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CHIESI PHARMACEUTICALS (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21012' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BAMIFIX TABLETS'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PULVILOX 500MG', '21016', '-', 323.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CHIESI PHARMACEUTICALS (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21016' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PULVILOX 500MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CLENIL 250', '21011', '-', 1003.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CHIESI PHARMACEUTICALS (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21011' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CLENIL 250'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CLENIL AEROSOL NEBUL SUS 10S', '21009', '-', 946.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CHIESI PHARMACEUTICALS (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21009' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CLENIL AEROSOL NEBUL SUS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CLENIL COMP AEROSOL NEB SUS 10', '21010', '-', 1165.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CHIESI PHARMACEUTICALS (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21010' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CLENIL COMP AEROSOL NEB SUS 10'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EXRANGE 500MG INJECTION IV 1S', '30578', '-', 1165.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CHIESI PHARMACEUTICALS (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30578' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EXRANGE 500MG INJECTION IV 1S'))
    LIMIT 1
  )
LIMIT 1;

-- Company: LCI PAKISTAN LIMITED (19 products)
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ANPRA 0.25MG TABLETS 30S', '19389', '-', 200.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'LCI PAKISTAN LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19389' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ANPRA 0.25MG TABLETS 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ANPRA 0.50MG TABLETS 30S', '19390', '-', 278.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'LCI PAKISTAN LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19390' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ANPRA 0.50MG TABLETS 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ANSAID 100MG TABLETS 30S', '31147', '-', 357.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'LCI PAKISTAN LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31147' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ANSAID 100MG TABLETS 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CEFCIN 1G INJECTION IV', '33753', '-', 325.04, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'LCI PAKISTAN LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '33753' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CEFCIN 1G INJECTION IV'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CEPTIN 250MG CAPSULE 12S', '34132', '-', 284.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'LCI PAKISTAN LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34132' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CEPTIN 250MG CAPSULE 12S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CEPTIN 250MG/5ML SUSP 90ML', '33750', '-', 333.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'LCI PAKISTAN LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '33750' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CEPTIN 250MG/5ML SUSP 90ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CEPTIN 500MG CAPSULE 12S', '34130', '-', 439.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'LCI PAKISTAN LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34130' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CEPTIN 500MG CAPSULE 12S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CEPTIN SUSP 125MG/5 ML 90ML', '34133', '-', 302.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'LCI PAKISTAN LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34133' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CEPTIN SUSP 125MG/5 ML 90ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CORINEF 100MG/5ML SUSP 30ML', '33749', '-', 268.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'LCI PAKISTAN LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '33749' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CORINEF 100MG/5ML SUSP 30ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CORINEF 400MG CAPSULE 5S', '33748', '-', 480.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'LCI PAKISTAN LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '33748' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CORINEF 400MG CAPSULE 5S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ESOPASE 20MG CAPSULE 24S', '33751', '-', 415.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'LCI PAKISTAN LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '33751' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ESOPASE 20MG CAPSULE 24S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ESOPASE 40MG CAPSULE 24S', '33752', '-', 690.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'LCI PAKISTAN LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '33752' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ESOPASE 40MG CAPSULE 24S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'KALOS 100M/5ML SUSPEN 120ML', '22004', '-', 110.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'LCI PAKISTAN LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '22004' OR (p.`company_id` = c.`id` AND p.`product_name` = 'KALOS 100M/5ML SUSPEN 120ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LYSOVIT SYRUP 120ML', '31149', '-', 204.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'LCI PAKISTAN LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31149' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LYSOVIT SYRUP 120ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PONSTAN FLASH 250MG TAB 30S', '34687', '-', 166.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'LCI PAKISTAN LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34687' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PONSTAN FLASH 250MG TAB 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PONSTAN FORTE 500MG TAB 200S', '31148', '-', 1033.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'LCI PAKISTAN LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31148' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PONSTAN FORTE 500MG TAB 200S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PONSTAN SUSPENSION 90ML', '34391', '-', 121.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'LCI PAKISTAN LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34391' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PONSTAN SUSPENSION 90ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SAKOON 3MG TABLETS 30S', '19642', '-', 292.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'LCI PAKISTAN LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19642' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SAKOON 3MG TABLETS 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SUNPLUS SOFTGEL 200000 IU 1S', '19816', '-', 252.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'LCI PAKISTAN LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19816' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SUNPLUS SOFTGEL 200000 IU 1S'))
    LIMIT 1
  )
LIMIT 1;

-- Company: BECTON DICKINSON IMPORT (7 products)
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, '1CC 30 G 8MM POUCH PACK 10S', '4874', '-', 350.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'BECTON DICKINSON IMPORT'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '4874' OR (p.`company_id` = c.`id` AND p.`product_name` = '1CC 30 G 8MM POUCH PACK 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BD 1 CC 30G 8MM BOX REG NO 059212', '1492', '-', 3505.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'BECTON DICKINSON IMPORT'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '1492' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BD 1 CC 30G 8MM BOX REG NO 059212'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BD SYRINGE 1ML 31G 6MM', '20118', '-', 3868.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'BECTON DICKINSON IMPORT'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20118' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BD SYRINGE 1ML 31G 6MM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BD SYRINGE 1ML 31G 6MM (5 PCS)', '20247', '-', 193.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'BECTON DICKINSON IMPORT'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20247' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BD SYRINGE 1ML 31G 6MM (5 PCS)'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BD PEN NEEDLE 31G 5MM PCS', '4276', '-', 23.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'BECTON DICKINSON IMPORT'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '4276' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BD PEN NEEDLE 31G 5MM PCS'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BD PEN NEEDLE 32X4MM ASIA PCS', '13929', '-', 22.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'BECTON DICKINSON IMPORT'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13929' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BD PEN NEEDLE 32X4MM ASIA PCS'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BD PEN NEEDLE 32X4MM ASIA XTW', '13379', '-', 2239.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'BECTON DICKINSON IMPORT'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13379' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BD PEN NEEDLE 32X4MM ASIA XTW'))
    LIMIT 1
  )
LIMIT 1;

-- Company: HORIZON PHARMACEUTICALS (PVT) LIMITED (2 products)
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DEXXOO 30MG CAPSULE 30S', '35042', '-', 893.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HORIZON PHARMACEUTICALS (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '35042' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DEXXOO 30MG CAPSULE 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DEXXOO 60MG CAPSULE 30S', '35043', '-', 1403.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HORIZON PHARMACEUTICALS (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '35043' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DEXXOO 60MG CAPSULE 30S'))
    LIMIT 1
  )
LIMIT 1;

-- Company: UNIFEROZ (SANI PLAST) (8 products)
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SANI FAMILY PACK', '764', '-', 224.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'UNIFEROZ (SANI PLAST)'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '764' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SANI FAMILY PACK'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SANI PLAST SPOT PACK20', '4591', '-', 54.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'UNIFEROZ (SANI PLAST)'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '4591' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SANI PLAST SPOT PACK20'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SANI SWAB ALCOHOL PAD', '12071', '-', 229.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'UNIFEROZ (SANI PLAST)'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '12071' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SANI SWAB ALCOHOL PAD'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SANIPLAST AQUA BAND LARGE 20S', '17544', '-', 112.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'UNIFEROZ (SANI PLAST)'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '17544' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SANIPLAST AQUA BAND LARGE 20S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SANIPLAST AQUA MEDIUM 20S', '22492', '-', 101.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'UNIFEROZ (SANI PLAST)'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '22492' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SANIPLAST AQUA MEDIUM 20S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SANIPLAST FABRIC BANDAGE 100S', '16479', '-', 241.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'UNIFEROZ (SANI PLAST)'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '16479' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SANIPLAST FABRIC BANDAGE 100S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SANIPLAST JUNIOR PORORO SMALL', '21079', '-', 76.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'UNIFEROZ (SANI PLAST)'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21079' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SANIPLAST JUNIOR PORORO SMALL'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SANID PIMPLE PATCH 24S', '17273', '-', 200.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'UNIFEROZ (SANI PLAST)'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '17273' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SANID PIMPLE PATCH 24S'))
    LIMIT 1
  )
LIMIT 1;

-- Company: ABBOTT LABORATORIES PAKISTAN (19 products)
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ENSURE POWDER CHOCOLATE 400 GM', '756', '-', 2444.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ABBOTT LABORATORIES PAKISTAN'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '756' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ENSURE POWDER CHOCOLATE 400 GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ENSURE POWDER VANILLA 200GM', '32454', '-', 1170.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ABBOTT LABORATORIES PAKISTAN'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32454' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ENSURE POWDER VANILLA 200GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ENSURE POWDER VANILLA 400GM', '753', '-', 2444.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ABBOTT LABORATORIES PAKISTAN'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '753' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ENSURE POWDER VANILLA 400GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ENSURE POWDER VANILLA 850 GM', '9612', '-', 4853.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ABBOTT LABORATORIES PAKISTAN'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '9612' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ENSURE POWDER VANILLA 850 GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ENSURE STRAWBERRY POWDER 400GM', '754', '-', 2444.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ABBOTT LABORATORIES PAKISTAN'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '754' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ENSURE STRAWBERRY POWDER 400GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'GLUCERNA CHOCOLA 400G TRP CARE', '12034', '-', 3614.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ABBOTT LABORATORIES PAKISTAN'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '12034' OR (p.`company_id` = c.`id` AND p.`product_name` = 'GLUCERNA CHOCOLA 400G TRP CARE'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'GLUCERNA VANILLA 400G TRP CARE', '5625', '-', 3614.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ABBOTT LABORATORIES PAKISTAN'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '5625' OR (p.`company_id` = c.`id` AND p.`product_name` = 'GLUCERNA VANILLA 400G TRP CARE'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PEDIASURE TRIPLESURE (C) 400GM', '5675', '-', 2698.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ABBOTT LABORATORIES PAKISTAN'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '5675' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PEDIASURE TRIPLESURE (C) 400GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PEDIASURE TRIPLESURE (C) 850GM', '12077', '-', 5450.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ABBOTT LABORATORIES PAKISTAN'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '12077' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PEDIASURE TRIPLESURE (C) 850GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PEDIASURE TRIPLESURE (S) 850GM', '12078', '-', 5450.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ABBOTT LABORATORIES PAKISTAN'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '12078' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PEDIASURE TRIPLESURE (S) 850GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PEDIASURE TRIPLESURE (V) 400GM', '5668', '-', 2698.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ABBOTT LABORATORIES PAKISTAN'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '5668' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PEDIASURE TRIPLESURE (V) 400GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PEDIASURE TRIPLESURE (V) 600GM', '33977', '-', 3665.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ABBOTT LABORATORIES PAKISTAN'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '33977' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PEDIASURE TRIPLESURE (V) 600GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PEDIASURE TRIPLESURE (V) 850GM', '6578', '-', 5450.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ABBOTT LABORATORIES PAKISTAN'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '6578' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PEDIASURE TRIPLESURE (V) 850GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PEDIASURE VANILA 200GM', '19664', '-', 1248.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ABBOTT LABORATORIES PAKISTAN'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19664' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PEDIASURE VANILA 200GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SIMILAC GOLD STAGE 1 400GM', '30116', '-', 2390.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ABBOTT LABORATORIES PAKISTAN'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30116' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SIMILAC GOLD STAGE 1 400GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SIMILAC ISOMIL 400 GM S270.400', '11834', '-', 2542.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ABBOTT LABORATORIES PAKISTAN'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '11834' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SIMILAC ISOMIL 400 GM S270.400'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SIMILAC TOTAL COMFORT KID', '15887', '-', 2495.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ABBOTT LABORATORIES PAKISTAN'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '15887' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SIMILAC TOTAL COMFORT KID'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SIMILAC TOTAL COMFORT STAGE1', '7071', '-', 2495.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ABBOTT LABORATORIES PAKISTAN'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '7071' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SIMILAC TOTAL COMFORT STAGE1'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SIMILAC TOTAL COMFORT STAGE2', '7072', '-', 2495.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ABBOTT LABORATORIES PAKISTAN'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '7072' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SIMILAC TOTAL COMFORT STAGE2'))
    LIMIT 1
  )
LIMIT 1;

-- Company: DKT PAKISTAN (PRIVATE) LIMITED (23 products)
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'JOSH CLASSIC 4S SLEEVE', '21811', '-', 64.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21811' OR (p.`company_id` = c.`id` AND p.`product_name` = 'JOSH CLASSIC 4S SLEEVE'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'JOSH DELAY 3S SLEEVE', '21816', '-', 75.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21816' OR (p.`company_id` = c.`id` AND p.`product_name` = 'JOSH DELAY 3S SLEEVE'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'JOSH DOTTED 3S SLEEVE', '21815', '-', 75.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21815' OR (p.`company_id` = c.`id` AND p.`product_name` = 'JOSH DOTTED 3S SLEEVE'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'JOSH FAIR AND ROUGHLY 3S SLEEV', '21813', '-', 68.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21813' OR (p.`company_id` = c.`id` AND p.`product_name` = 'JOSH FAIR AND ROUGHLY 3S SLEEV'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'JOSH FANTASY LUBRICANT GEL 30M', '30252', '-', 354.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30252' OR (p.`company_id` = c.`id` AND p.`product_name` = 'JOSH FANTASY LUBRICANT GEL 30M'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'JOSH SALAJEET 3S SLEEVE', '21818', '-', 68.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21818' OR (p.`company_id` = c.`id` AND p.`product_name` = 'JOSH SALAJEET 3S SLEEVE'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'JOSH SINDHRI 3S SLEEVE', '30284', '-', 68.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30284' OR (p.`company_id` = c.`id` AND p.`product_name` = 'JOSH SINDHRI 3S SLEEVE'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'JOSH STRAWBERRY 3S SLEEVE', '21814', '-', 71.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21814' OR (p.`company_id` = c.`id` AND p.`product_name` = 'JOSH STRAWBERRY 3S SLEEVE'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'JOSH ULTRATHIN 3S SLEEVE', '21817', '-', 71.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21817' OR (p.`company_id` = c.`id` AND p.`product_name` = 'JOSH ULTRATHIN 3S SLEEVE'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CONDOM OK GOLD INFINITY', '30254', '-', 173.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30254' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CONDOM OK GOLD INFINITY'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DREIJET INJ 3 MONTHS', '34967', '-', 153.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34967' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DREIJET INJ 3 MONTHS'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ISMILA 28', '34970', '-', 98.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34970' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ISMILA 28'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LEVONOR TABLET 0.75 MG 2S', '34968', '-', 24.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34968' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LEVONOR TABLET 0.75 MG 2S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LEVONOR TABLET 1.50 MG 1S', '34969', '-', 24.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34969' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LEVONOR TABLET 1.50 MG 1S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MISOTIN 200MCG TABLETS 10S', '23080', '-', 152.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23080' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MISOTIN 200MCG TABLETS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'NINA ORANGE SACHET 1S', '34973', '-', 24.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34973' OR (p.`company_id` = c.`id` AND p.`product_name` = 'NINA ORANGE SACHET 1S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PREGNENCY STRIP HCG TEST 2.5MM', '34974', '-', 27.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34974' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PREGNENCY STRIP HCG TEST 2.5MM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PREGNENCY STRIP HCG TEST 4.0MM', '34975', '-', 92.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34975' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PREGNENCY STRIP HCG TEST 4.0MM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PREGNENCY STRIP HCG TEST 5.0MM', '34976', '-', 132.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34976' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PREGNENCY STRIP HCG TEST 5.0MM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PREGNENCY STRIP LH OVUL 3.0MM', '34977', '-', 51.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34977' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PREGNENCY STRIP LH OVUL 3.0MM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PREGNENCY STRIP LH OVUL 4.0MM', '34978', '-', 88.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34978' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PREGNENCY STRIP LH OVUL 4.0MM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'THERABION IRON SACHET', '34972', '-', 20.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34972' OR (p.`company_id` = c.`id` AND p.`product_name` = 'THERABION IRON SACHET'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ZEVION VITAMIN D 3 JAR', '34971', '-', 576.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'DKT PAKISTAN (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34971' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ZEVION VITAMIN D 3 JAR'))
    LIMIT 1
  )
LIMIT 1;

-- Company: HERBALSCIENCE PAKISTAN (PVT) LTD (12 products)
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'RITE SALT POUCH 500GM', '18815', '-', 245.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HERBALSCIENCE PAKISTAN (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18815' OR (p.`company_id` = c.`id` AND p.`product_name` = 'RITE SALT POUCH 500GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'RITE SALT POUCH 800GM', '18816', '-', 356.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HERBALSCIENCE PAKISTAN (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18816' OR (p.`company_id` = c.`id` AND p.`product_name` = 'RITE SALT POUCH 800GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SUCRAL DROPS 100', '10265', '-', 128.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HERBALSCIENCE PAKISTAN (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '10265' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SUCRAL DROPS 100'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SUCRAL DROPS 200', '18812', '-', 222.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HERBALSCIENCE PAKISTAN (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18812' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SUCRAL DROPS 200'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SUCRAL PLASTIC JAR 400GM', '32051', '-', 679.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HERBALSCIENCE PAKISTAN (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32051' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SUCRAL PLASTIC JAR 400GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SUCRAL SACHET BOX 50S', '383', '-', 256.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HERBALSCIENCE PAKISTAN (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '383' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SUCRAL SACHET BOX 50S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SUCRAL STEVIA SACHET 50S', '32057', '-', 369.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HERBALSCIENCE PAKISTAN (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32057' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SUCRAL STEVIA SACHET 50S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SUCRAL STEVIA TABLET 100S', '32343', '-', 302.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HERBALSCIENCE PAKISTAN (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32343' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SUCRAL STEVIA TABLET 100S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SUCRAL STEVIA TABLET 50S', '32117', '-', 189.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HERBALSCIENCE PAKISTAN (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32117' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SUCRAL STEVIA TABLET 50S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SUCRAL TABLET 50S', '10264', '-', 113.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HERBALSCIENCE PAKISTAN (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '10264' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SUCRAL TABLET 50S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SUCRAL TABLETS 100 S', '384', '-', 188.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HERBALSCIENCE PAKISTAN (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '384' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SUCRAL TABLETS 100 S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SUCRAL TABLETS 200 S', '770', '-', 339.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HERBALSCIENCE PAKISTAN (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '770' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SUCRAL TABLETS 200 S'))
    LIMIT 1
  )
LIMIT 1;

-- Company: FATHER AND SONS (21 products)
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CHARCOAL FACE WASH 100ML', '19779', '-', 427.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FATHER AND SONS'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19779' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CHARCOAL FACE WASH 100ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CHARCOAL FACE WASH 50ML', '20187', '-', 258.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FATHER AND SONS'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20187' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CHARCOAL FACE WASH 50ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CLEAR COMPLEX WHIT FW 100ML', '12334', '-', 361.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FATHER AND SONS'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '12334' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CLEAR COMPLEX WHIT FW 100ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CLEAR COMPLEXI WHITE FW 50ML', '12338', '-', 258.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FATHER AND SONS'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '12338' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CLEAR COMPLEXI WHITE FW 50ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CLEAR COMPLEXI WHITEN FW 150ML', '12330', '-', 441.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FATHER AND SONS'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '12330' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CLEAR COMPLEXI WHITEN FW 150ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DARK SPOT CLEAR TURME F/W 100M', '23384', '-', 413.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FATHER AND SONS'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23384' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DARK SPOT CLEAR TURME F/W 100M'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DARK SPOT CLEAR TURME F/W 150M', '23385', '-', 515.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FATHER AND SONS'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23385' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DARK SPOT CLEAR TURME F/W 150M'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DARK SPOT CLEAR TURME F/W 50ML', '23383', '-', 258.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FATHER AND SONS'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23383' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DARK SPOT CLEAR TURME F/W 50ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'GENTL EXFOLI APRIC FW 100ML', '15433', '-', 361.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FATHER AND SONS'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '15433' OR (p.`company_id` = c.`id` AND p.`product_name` = 'GENTL EXFOLI APRIC FW 100ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MOISTURIZING ALOE VER FW 100ML', '12331', '-', 427.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FATHER AND SONS'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '12331' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MOISTURIZING ALOE VER FW 100ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MOISTURIZING ALOE VERA FW 150M', '12325', '-', 441.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FATHER AND SONS'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '12325' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MOISTURIZING ALOE VERA FW 150M'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MOISTURIZING ALOE VERA FW 50ML', '12335', '-', 258.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FATHER AND SONS'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '12335' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MOISTURIZING ALOE VERA FW 50ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'NATURAL GLOW ROSE F/W 50ML', '23382', '-', 258.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FATHER AND SONS'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23382' OR (p.`company_id` = c.`id` AND p.`product_name` = 'NATURAL GLOW ROSE F/W 50ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'NATURAL GLOW SAFFRON F/W 100ML', '23379', '-', 361.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FATHER AND SONS'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23379' OR (p.`company_id` = c.`id` AND p.`product_name` = 'NATURAL GLOW SAFFRON F/W 100ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'NATURAL GLOW SAFFRON F/W 50ML', '23380', '-', 217.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FATHER AND SONS'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23380' OR (p.`company_id` = c.`id` AND p.`product_name` = 'NATURAL GLOW SAFFRON F/W 50ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'NOURISHING SKIN CREAM 150+50ML', '31233', '-', 963.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FATHER AND SONS'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31233' OR (p.`company_id` = c.`id` AND p.`product_name` = 'NOURISHING SKIN CREAM 150+50ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'OIL CONTROL LEMON FW 100ML', '12332', '-', 361.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FATHER AND SONS'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '12332' OR (p.`company_id` = c.`id` AND p.`product_name` = 'OIL CONTROL LEMON FW 100ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PURIFYING NEEM FACE W 50ML', '12337', '-', 228.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FATHER AND SONS'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '12337' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PURIFYING NEEM FACE W 50ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PURIFYING NEEM FW 100ML', '12333', '-', 376.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FATHER AND SONS'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '12333' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PURIFYING NEEM FW 100ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PURIFYING NEEM FW 150ML', '12328', '-', 457.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FATHER AND SONS'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '12328' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PURIFYING NEEM FW 150ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PURIFYING NEEM FW 15ML JAR', '30499', '-', 66.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'FATHER AND SONS'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30499' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PURIFYING NEEM FW 15ML JAR'))
    LIMIT 1
  )
LIMIT 1;

-- Company: MAZTON PHARMA (24 products)
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ACTAWHITE CLEANSER 50ML', '7081', '-', 837.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '7081' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ACTAWHITE CLEANSER 50ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BAKUTONE SERUM 20ML', '23375', '-', 1799.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23375' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BAKUTONE SERUM 20ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EPIVITAM TAB 30S', '14467', '-', 900.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '14467' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EPIVITAM TAB 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'FOLIBOOST HAIR SERUM 45ML', '16302', '-', 1600.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '16302' OR (p.`company_id` = c.`id` AND p.`product_name` = 'FOLIBOOST HAIR SERUM 45ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'FOLIBOOST SHAMPOO 100ML', '30600', '-', 1233.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30600' OR (p.`company_id` = c.`id` AND p.`product_name` = 'FOLIBOOST SHAMPOO 100ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'HYDROLATUM BAR 75 GM', '5930', '-', 217.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '5930' OR (p.`company_id` = c.`id` AND p.`product_name` = 'HYDROLATUM BAR 75 GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LUMEXA CREAM 30 GM', '13545', '-', 1269.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13545' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LUMEXA CREAM 30 GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LUMEXA GEL 30G', '18683', '-', 1718.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18683' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LUMEXA GEL 30G'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LUMEXA SERUM 20ML', '21699', '-', 1600.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21699' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LUMEXA SERUM 20ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MAZCLARITY CREAM 20G', '20664', '-', 761.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20664' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MAZCLARITY CREAM 20G'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MAZCLARITY FACE WASH 50ML', '22489', '-', 801.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '22489' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MAZCLARITY FACE WASH 50ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MAZCLARITY SERUM 20ML', '21700', '-', 1439.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21700' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MAZCLARITY SERUM 20ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'METAFIL CLEANSER 100ML', '13427', '-', 801.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13427' OR (p.`company_id` = c.`id` AND p.`product_name` = 'METAFIL CLEANSER 100ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'METAFIL MOIST CREAM 50GM', '17616', '-', 323.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '17616' OR (p.`company_id` = c.`id` AND p.`product_name` = 'METAFIL MOIST CREAM 50GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'METAFIL MOISTUR LOTION 150 ML', '13546', '-', 1383.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13546' OR (p.`company_id` = c.`id` AND p.`product_name` = 'METAFIL MOISTUR LOTION 150 ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'METAFIL OS 100ML', '13547', '-', 877.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13547' OR (p.`company_id` = c.`id` AND p.`product_name` = 'METAFIL OS 100ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'METAFIL SERUM 30ML', '31781', '-', 1716.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31781' OR (p.`company_id` = c.`id` AND p.`product_name` = 'METAFIL SERUM 30ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PARAMAX ANTI-LICE SHAMPOO 45ML', '15812', '-', 392.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '15812' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PARAMAX ANTI-LICE SHAMPOO 45ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SUNPRO SC 30GM', '15462', '-', 2691.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '15462' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SUNPRO SC 30GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SUNPRO SPRAY 100ML', '12702', '-', 1383.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '12702' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SUNPRO SPRAY 100ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SUNPRO-80 SUNPRO-80', '6391', '-', 821.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '6391' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SUNPRO-80 SUNPRO-80'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'VERSYL BAR 75GM', '18807', '-', 298.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18807' OR (p.`company_id` = c.`id` AND p.`product_name` = 'VERSYL BAR 75GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ZARNOL SENSITIVE LOTION 100ML', '6935', '-', 481.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '6935' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ZARNOL SENSITIVE LOTION 100ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ZYRO-MAZ SHAMPOO 100ML', '30184', '-', 860.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MAZTON PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30184' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ZYRO-MAZ SHAMPOO 100ML'))
    LIMIT 1
  )
LIMIT 1;

-- Company: MARTIN DOW MARKER LIMITED (123 products)
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ADVIT-D AMPOULE 1S', '19981', '-', 186.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19981' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ADVIT-D AMPOULE 1S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'APRANAX FC 550MG TABS 2X10S', '18067', '-', 449.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18067' OR (p.`company_id` = c.`id` AND p.`product_name` = 'APRANAX FC 550MG TABS 2X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ARZOMIC 250MG TABLETS 6S', '18069', '-', 224.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18069' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ARZOMIC 250MG TABLETS 6S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ARZOMIC 500MG TABLETS 6S', '18070', '-', 411.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18070' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ARZOMIC 500MG TABLETS 6S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ARZOMIC DS 200/5ML SUSP 15ML', '18068', '-', 237.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18068' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ARZOMIC DS 200/5ML SUSP 15ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ARZOMIC DS 200/5ML SUSP 30ML', '30883', '-', 460.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30883' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ARZOMIC DS 200/5ML SUSP 30ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AZOLAM 0.25MG TABLET 3X10S', '18071', '-', 178.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18071' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AZOLAM 0.25MG TABLET 3X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AZOLAM 0.5MG TABLET 3X10S', '18072', '-', 252.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18072' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AZOLAM 0.5MG TABLET 3X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CO-DEPEX 12MG/25MG CAPS 10S', '33178', '-', 300.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '33178' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CO-DEPEX 12MG/25MG CAPS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CO-DEPEX 3MG/25MG CAPS 10S', '33176', '-', 132.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '33176' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CO-DEPEX 3MG/25MG CAPS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CO-DEPEX 6MG/25MG CAPS 10S', '33177', '-', 220.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '33177' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CO-DEPEX 6MG/25MG CAPS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CONCOR 10MG TABLETS 14S', '18082', '-', 576.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18082' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CONCOR 10MG TABLETS 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CONCOR 2.5MG TABLETS 14S', '18083', '-', 163.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18083' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CONCOR 2.5MG TABLETS 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CONCOR 5MG TABLETS 14S', '18084', '-', 296.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18084' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CONCOR 5MG TABLETS 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CRESCOR 10MG TABLET 10S', '18087', '-', 355.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18087' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CRESCOR 10MG TABLET 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CRESCOR 20MG TABLET 10S', '18088', '-', 473.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18088' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CRESCOR 20MG TABLET 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CRESCOR 5MG TABLET 10S', '18089', '-', 187.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18089' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CRESCOR 5MG TABLET 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CRESCOR EZE TAB 10/10MG 10S', '34982', '-', 349.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34982' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CRESCOR EZE TAB 10/10MG 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CRESCOR EZE TAB 20/10MG 10S', '34983', '-', 459.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34983' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CRESCOR EZE TAB 20/10MG 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CRESCOR EZE TAB 5/10MG 10S', '34981', '-', 204.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34981' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CRESCOR EZE TAB 5/10MG 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DEPEX CAPSULE 10S', '18091', '-', 231.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18091' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DEPEX CAPSULE 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DOLOGAB 100MG CAPS 2X7S', '18092', '-', 587.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18092' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DOLOGAB 100MG CAPS 2X7S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DOLOGAB 150MG CAPS 2X7S', '18093', '-', 680.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18093' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DOLOGAB 150MG CAPS 2X7S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DOLOGAB 50MG CAPS 2X7S', '18094', '-', 417.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18094' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DOLOGAB 50MG CAPS 2X7S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DOLOGAB 75MG CAPS 2X7S', '18095', '-', 472.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18095' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DOLOGAB 75MG CAPS 2X7S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DOLOGAB CR 165MG TABLET 14S', '35341', '-', 510.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '35341' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DOLOGAB CR 165MG TABLET 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DOLOGAB CR 330MG TABLET 14S', '35342', '-', 1020.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '35342' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DOLOGAB CR 330MG TABLET 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DOLOGAB CR 82.5MG TABLET 14S', '35340', '-', 349.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '35340' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DOLOGAB CR 82.5MG TABLET 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPAPHAGE 10MG TABLETS 14S', '19835', '-', 350.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19835' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPAPHAGE 10MG TABLETS 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPAPHAGE 25MG TABLETS 14S', '19836', '-', 462.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19836' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPAPHAGE 25MG TABLETS 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPAPHAGE L 10MG+5MG TAB 14S', '30764', '-', 374.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30764' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPAPHAGE L 10MG+5MG TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPAPHAGE L 25MG+5MG TAB 14S', '30765', '-', 604.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30765' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPAPHAGE L 25MG+5MG TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPAPHAGE M XR 10/1000M TAB 14', '34415', '-', 309.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34415' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPAPHAGE M XR 10/1000M TAB 14'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPAPHAGE M XR 12.5/1000 TB 14', '34416', '-', 321.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34416' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPAPHAGE M XR 12.5/1000 TB 14'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPAPHAGE M XR 25/1000M TAB 14', '34417', '-', 417.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34417' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPAPHAGE M XR 25/1000M TAB 14'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPAPHAGE M XR 5/1000M TAB 14S', '34414', '-', 238.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34414' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPAPHAGE M XR 5/1000M TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPAPHAGE-M 12.5M+1000M TB 14S', '21970', '-', 390.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21970' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPAPHAGE-M 12.5M+1000M TB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPAPHAGE-M 12.5M+500M TAB 14S', '21968', '-', 370.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21968' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPAPHAGE-M 12.5M+500M TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPAPHAGE-M 12.5M+850M TAB 14S', '21969', '-', 390.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21969' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPAPHAGE-M 12.5M+850M TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPAPHAGE-M 5M+1000MG TAB 14S', '21967', '-', 315.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21967' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPAPHAGE-M 5M+1000MG TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPAPHAGE-M 5M+850MG TAB 14S', '21966', '-', 310.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21966' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPAPHAGE-M 5M+850MG TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ESVIN 20MG CAPSULE 2X7S', '18098', '-', 298.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18098' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ESVIN 20MG CAPSULE 2X7S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ESVIN 40MG CAPSULE 2X7S', '18099', '-', 480.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18099' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ESVIN 40MG CAPSULE 2X7S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVION 200MG CAPSULE 10X10S', '18179', '-', 797.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18179' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVION 200MG CAPSULE 10X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVION 400MG CAPSULE 10X10S', '18180', '-', 1201.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18180' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVION 400MG CAPSULE 10X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVION 600MG CAPSULE 10X10S', '18181', '-', 1710.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18181' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVION 600MG CAPSULE 10X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'FELBEX 20MG TABLET 20S', '32355', '-', 464.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32355' OR (p.`company_id` = c.`id` AND p.`product_name` = 'FELBEX 20MG TABLET 20S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'FOLINEO 300MCG TABLETS 30S', '20656', '-', 333.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20656' OR (p.`company_id` = c.`id` AND p.`product_name` = 'FOLINEO 300MCG TABLETS 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'GLUCOPHAGE 250MG TAB 5X10S', '18107', '-', 104.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18107' OR (p.`company_id` = c.`id` AND p.`product_name` = 'GLUCOPHAGE 250MG TAB 5X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'GLUCOPHAGE 500MG TAB 5X10S', '18108', '-', 179.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18108' OR (p.`company_id` = c.`id` AND p.`product_name` = 'GLUCOPHAGE 500MG TAB 5X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'GLUCOPHAGE XR 1GM TAB 3X10S', '19478', '-', 461.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19478' OR (p.`company_id` = c.`id` AND p.`product_name` = 'GLUCOPHAGE XR 1GM TAB 3X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'GLUCOPHAGE XR 750MG TAB 3X10S', '18110', '-', 349.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18110' OR (p.`company_id` = c.`id` AND p.`product_name` = 'GLUCOPHAGE XR 750MG TAB 3X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'GLUCOVANCE 250/1.25M TAB 2X15', '18111', '-', 149.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18111' OR (p.`company_id` = c.`id` AND p.`product_name` = 'GLUCOVANCE 250/1.25M TAB 2X15'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'GLUCOVANCE 500/2.5MG TAB 2X15', '18112', '-', 251.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18112' OR (p.`company_id` = c.`id` AND p.`product_name` = 'GLUCOVANCE 500/2.5MG TAB 2X15'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'GLUCOVANCE 500/5MG TAB 2X15', '18113', '-', 261.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18113' OR (p.`company_id` = c.`id` AND p.`product_name` = 'GLUCOVANCE 500/5MG TAB 2X15'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'INHIDEX 30MG CAPSULE 30S', '20182', '-', 710.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20182' OR (p.`company_id` = c.`id` AND p.`product_name` = 'INHIDEX 30MG CAPSULE 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'INHIDEX 60MG CAPSULE 30S', '20183', '-', 1023.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20183' OR (p.`company_id` = c.`id` AND p.`product_name` = 'INHIDEX 60MG CAPSULE 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'IVEUROMET SL 2000MCG TAB 30S', '30061', '-', 1225.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30061' OR (p.`company_id` = c.`id` AND p.`product_name` = 'IVEUROMET SL 2000MCG TAB 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'IVEUROMET SL 500MCG TAB 30S', '30063', '-', 843.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30063' OR (p.`company_id` = c.`id` AND p.`product_name` = 'IVEUROMET SL 500MCG TAB 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'KLARIBACT 250MG TABLETS 10S', '18118', '-', 446.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18118' OR (p.`company_id` = c.`id` AND p.`product_name` = 'KLARIBACT 250MG TABLETS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'KLARIBACT 500MG TABLETS 10S', '18119', '-', 803.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18119' OR (p.`company_id` = c.`id` AND p.`product_name` = 'KLARIBACT 500MG TABLETS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'KLARIBACT DS 125M/5ML SUS 60ML', '18117', '-', 401.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18117' OR (p.`company_id` = c.`id` AND p.`product_name` = 'KLARIBACT DS 125M/5ML SUS 60ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'KLARIBACT DS 250MG/5ML 60ML', '32566', '-', 576.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32566' OR (p.`company_id` = c.`id` AND p.`product_name` = 'KLARIBACT DS 250MG/5ML 60ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LAXOBERON 7.5Mg/ML DROP 30ML', '32830', '-', 128.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32830' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LAXOBERON 7.5Mg/ML DROP 30ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LAXOBERON LIQUID 120ML', '18120', '-', 213.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18120' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LAXOBERON LIQUID 120ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LAXOBERON TABLETS 10X10S', '18121', '-', 680.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18121' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LAXOBERON TABLETS 10X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LEVOMERC 250MG TABLET 10S', '18122', '-', 281.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18122' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LEVOMERC 250MG TABLET 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LEVOMERC 500MG TABLET 10S', '18123', '-', 398.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18123' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LEVOMERC 500MG TABLET 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LODOPIN 10MG TABLET 2X10S', '18124', '-', 205.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18124' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LODOPIN 10MG TABLET 2X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LODOPIN 2.5MG TABLET 2X10S', '18125', '-', 135.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18125' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LODOPIN 2.5MG TABLET 2X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LODOPIN 5MG TABLET 2X10S', '18126', '-', 154.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18126' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LODOPIN 5MG TABLET 2X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LODOPIN-V 10/160MG TAB 14S', '18127', '-', 500.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18127' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LODOPIN-V 10/160MG TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LODOPIN-V 5/160MG TAB 14S', '18128', '-', 417.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18128' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LODOPIN-V 5/160MG TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LODOPIN-V 5/80MG TAB 14S', '18129', '-', 333.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18129' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LODOPIN-V 5/80MG TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LODOPIN-V HCT 10/160/12.5M 14S', '20987', '-', 251.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20987' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LODOPIN-V HCT 10/160/12.5M 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'LODOPIN-V HCT 10/160/25M 14S', '20986', '-', 253.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20986' OR (p.`company_id` = c.`id` AND p.`product_name` = 'LODOPIN-V HCT 10/160/25M 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MERCIP 500MG TABLETS 10S', '18137', '-', 354.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18137' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MERCIP 500MG TABLETS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'METHANEM-H 1GM TABLET 14S', '34626', '-', 1300.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34626' OR (p.`company_id` = c.`id` AND p.`product_name` = 'METHANEM-H 1GM TABLET 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MIRONEU 15MG TABLET 14S', '34531', '-', 1020.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34531' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MIRONEU 15MG TABLET 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MIRONEU 2.5MG TABLET 14S', '34528', '-', 340.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34528' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MIRONEU 2.5MG TABLET 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MIRONEU 5MG TABLET 14S', '34529', '-', 425.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34529' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MIRONEU 5MG TABLET 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MULTIBIONTA 10ML INJECTION 5S', '18138', '-', 602.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18138' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MULTIBIONTA 10ML INJECTION 5S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MULTIBIONTA CAPSULE 3X10S', '21031', '-', 237.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '21031' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MULTIBIONTA CAPSULE 3X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MULTIBIONTA M CAPSULE 3X10S', '19982', '-', 344.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19982' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MULTIBIONTA M CAPSULE 3X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MULTIBIONTA SYRUP 120ML', '18139', '-', 159.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18139' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MULTIBIONTA SYRUP 120ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'NEOPROX 250MG TABLET 3X10S', '18140', '-', 306.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18140' OR (p.`company_id` = c.`id` AND p.`product_name` = 'NEOPROX 250MG TABLET 3X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'NEOPROX 500MG TABLET 2X10S', '18141', '-', 425.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18141' OR (p.`company_id` = c.`id` AND p.`product_name` = 'NEOPROX 500MG TABLET 2X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'NEUROBION TABLETS 10X10S', '18143', '-', 1217.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18143' OR (p.`company_id` = c.`id` AND p.`product_name` = 'NEUROBION TABLETS 10X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'NEUROMET INJECTION 1MLX10S', '18149', '-', 1360.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18149' OR (p.`company_id` = c.`id` AND p.`product_name` = 'NEUROMET INJECTION 1MLX10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'NEUROMET SL 1000MCG TAB 30S', '35417', '-', 1044.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '35417' OR (p.`company_id` = c.`id` AND p.`product_name` = 'NEUROMET SL 1000MCG TAB 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'OVI-F 50MG TABLETS 10S', '18154', '-', 361.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18154' OR (p.`company_id` = c.`id` AND p.`product_name` = 'OVI-F 50MG TABLETS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PCAM 0.5% GEL 25GM', '18156', '-', 306.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18156' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PCAM 0.5% GEL 25GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PCAM 20MG TABLETS 2X10S', '18158', '-', 425.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18158' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PCAM 20MG TABLETS 2X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PEXNEW 10MG TABLET 2X7S', '18159', '-', 404.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18159' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PEXNEW 10MG TABLET 2X7S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PEXNEW 20MG TABLET 2X7S', '18160', '-', 522.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18160' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PEXNEW 20MG TABLET 2X7S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PEXNEW 5MG TABLET 2X7S', '18161', '-', 201.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18161' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PEXNEW 5MG TABLET 2X7S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'POLYBION FORTE SYRUP 120ML', '18163', '-', 145.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18163' OR (p.`company_id` = c.`id` AND p.`product_name` = 'POLYBION FORTE SYRUP 120ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'POLYBION Z CAPS 3X10S', '20050', '-', 400.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20050' OR (p.`company_id` = c.`id` AND p.`product_name` = 'POLYBION Z CAPS 3X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'RESELVIA 100MG TABLET 14S', '35308', '-', 1666.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '35308' OR (p.`company_id` = c.`id` AND p.`product_name` = 'RESELVIA 100MG TABLET 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'RESELVIA 60MG TABLET 14S', '35306', '-', 1309.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '35306' OR (p.`company_id` = c.`id` AND p.`product_name` = 'RESELVIA 60MG TABLET 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'RESELVIA 80MG TABLET 14S', '35307', '-', 1428.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '35307' OR (p.`company_id` = c.`id` AND p.`product_name` = 'RESELVIA 80MG TABLET 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ROZANTO 100MG TABLETS 20S', '19462', '-', 898.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19462' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ROZANTO 100MG TABLETS 20S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SANGOBION CAPSULE 3X10S', '18184', '-', 281.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18184' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SANGOBION CAPSULE 3X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SANGOBION SYRUP 120ML', '18168', '-', 147.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18168' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SANGOBION SYRUP 120ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SITAPHAGE 50/1000MG TAB 2X7S', '18169', '-', 459.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18169' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SITAPHAGE 50/1000MG TAB 2X7S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SITAPHAGE 50/500MG TAB 2X7S', '18187', '-', 446.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18187' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SITAPHAGE 50/500MG TAB 2X7S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SITAPHAGE XR 100+1000MG TAB 14', '30861', '-', 510.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30861' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SITAPHAGE XR 100+1000MG TAB 14'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SITAPHAGE XR 50+1000MG TAB 14S', '30860', '-', 438.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30860' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SITAPHAGE XR 50+1000MG TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SITAPHAGE XR 50+500MG TAB 14S', '30859', '-', 408.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30859' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SITAPHAGE XR 50+500MG TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SOLURIA 10MG TABLET 10S', '33943', '-', 850.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '33943' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SOLURIA 10MG TABLET 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SOLURIA 5MG TABLET 10S', '33944', '-', 510.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '33944' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SOLURIA 5MG TABLET 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TAMVANCE SR CAP 0.4MG 20S', '33942', '-', 1020.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '33942' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TAMVANCE SR CAP 0.4MG 20S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TAMVANCE-S TAB 6MG/0.4MG 20S', '34716', '-', 2550.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34716' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TAMVANCE-S TAB 6MG/0.4MG 20S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TERIL 200MG TABLETS 5X10S', '18188', '-', 438.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18188' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TERIL 200MG TABLETS 5X10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TIXOMER 400MG CAPS 5S', '18189', '-', 394.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18189' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TIXOMER 400MG CAPS 5S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TIXOMER DS 100MG/5ML 30ML', '18190', '-', 219.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18190' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TIXOMER DS 100MG/5ML 30ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TIXOMER DS 200/5ML SUSP 30ML', '18170', '-', 365.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18170' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TIXOMER DS 200/5ML SUSP 30ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TRIPHAGE XR 12.5/2.5/1000 TAB', '34478', '-', 238.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34478' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TRIPHAGE XR 12.5/2.5/1000 TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TRIPHAGE XR 25/5/1000M TAB 14S', '34479', '-', 238.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34479' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TRIPHAGE XR 25/5/1000M TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TRIPHAGE XR 5/2.5/1000 TAB 14S', '34496', '-', 190.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34496' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TRIPHAGE XR 5/2.5/1000 TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'VONOSPIRE 10MG TABLET 14S', '30701', '-', 344.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30701' OR (p.`company_id` = c.`id` AND p.`product_name` = 'VONOSPIRE 10MG TABLET 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'VONOSPIRE 20MG TABLETS 14S', '30657', '-', 540.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30657' OR (p.`company_id` = c.`id` AND p.`product_name` = 'VONOSPIRE 20MG TABLETS 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'WHIZIX 10MG TABLETS 14S', '18175', '-', 340.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MARTIN DOW MARKER LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '18175' OR (p.`company_id` = c.`id` AND p.`product_name` = 'WHIZIX 10MG TABLETS 14S'))
    LIMIT 1
  )
LIMIT 1;

-- Company: MACTER INTERNATIONAL (PVT) LTD (111 products)
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ADALIN COUGH SYRUP', '199', '-', 128.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '199' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ADALIN COUGH SYRUP'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ADN6 TABLET 30S', '16319', '-', 715.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '16319' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ADN6 TABLET 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AEROHALER DPI DEVICE', '11122', '-', 251.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '11122' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AEROHALER DPI DEVICE'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AMSART 10/160MG TAB 14S', '16382', '-', 478.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '16382' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AMSART 10/160MG TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AMSART 5/160MG TAB 14S', '16381', '-', 423.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '16381' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AMSART 5/160MG TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AMSART 5/80MG TAB 14S', '16380', '-', 327.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '16380' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AMSART 5/80MG TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AMSART-H 10/160/12.5 TAB 28S', '20724', '-', 321.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20724' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AMSART-H 10/160/12.5 TAB 28S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AMSART-H 5/160/12.5 TAB 28S', '20727', '-', 296.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20727' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AMSART-H 5/160/12.5 TAB 28S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AVELIA SACHET 10S', '12539', '-', 226.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '12539' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AVELIA SACHET 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AVELIA TAB 30S', '10789', '-', 671.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '10789' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AVELIA TAB 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BISMOL SUSPENSION', '164', '-', 128.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '164' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BISMOL SUSPENSION'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BISMOL TABS', '165', '-', 204.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '165' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BISMOL TABS'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'BISMOL ULTRA 525/15M SUSP 120M', '32819', '-', 213.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32819' OR (p.`company_id` = c.`id` AND p.`product_name` = 'BISMOL ULTRA 525/15M SUSP 120M'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CIPRIQUINE TABS 250 MG', '166', '-', 194.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '166' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CIPRIQUINE TABS 250 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CIPRIQUINE TABS 500 MG', '308', '-', 333.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '308' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CIPRIQUINE TABS 500 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CLAVOX INJECTION 1000 MG', '310', '-', 221.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '310' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CLAVOX INJECTION 1000 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CO-AMOXI 1000MG TABLET', '5186', '-', 243.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '5186' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CO-AMOXI 1000MG TABLET'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CO-AMOXI 156.25MG 60 ML SYP', '5192', '-', 140.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '5192' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CO-AMOXI 156.25MG 60 ML SYP'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CO-AMOXI 156.25MG 90ML SYP', '5887', '-', 180.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '5887' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CO-AMOXI 156.25MG 90ML SYP'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CO-AMOXI 312.5MG 60 ML DS SYP', '5193', '-', 220.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '5193' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CO-AMOXI 312.5MG 60 ML DS SYP'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CO-AMOXI 312.5MG 90ML DS SYP', '5888', '-', 284.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '5888' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CO-AMOXI 312.5MG 90ML DS SYP'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CO-AMOXI 375MG TABLET', '5184', '-', 147.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '5184' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CO-AMOXI 375MG TABLET'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CO-AMOXI 625MG TABLET', '5185', '-', 192.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '5185' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CO-AMOXI 625MG TABLET'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'COBOLMIN 500 MCG 50S', '6303', '-', 935.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '6303' OR (p.`company_id` = c.`id` AND p.`product_name` = 'COBOLMIN 500 MCG 50S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'COBOLMIN INJECTION 500 UG 1ML', '185', '-', 1185.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '185' OR (p.`company_id` = c.`id` AND p.`product_name` = 'COBOLMIN INJECTION 500 UG 1ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'COBOLMIN SL 1000MCG TAB 30S', '34406', '-', 720.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34406' OR (p.`company_id` = c.`id` AND p.`product_name` = 'COBOLMIN SL 1000MCG TAB 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'COBOLMIN SL 2000MCG TAB 30S', '34424', '-', 972.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34424' OR (p.`company_id` = c.`id` AND p.`product_name` = 'COBOLMIN SL 2000MCG TAB 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'COBOLMIN SL 500MCG TAB 30S', '34405', '-', 504.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34405' OR (p.`company_id` = c.`id` AND p.`product_name` = 'COBOLMIN SL 500MCG TAB 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DDR 30MG CAPS', '13533', '-', 674.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13533' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DDR 30MG CAPS'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DDR 60MG CAPS', '13534', '-', 883.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13534' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DDR 60MG CAPS'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DICAINE SUSPENSION', '241', '-', 170.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '241' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DICAINE SUSPENSION'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DIGEBRO SYRUP 120ML', '31215', '-', 360.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31215' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DIGEBRO SYRUP 120ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DIMECO SUSPENSION 120ML', '240', '-', 140.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '240' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DIMECO SUSPENSION 120ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DRT 40MG TAB', '3069', '-', 115.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '3069' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DRT 40MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DRT FORTE 80MG TAB', '3070', '-', 162.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '3070' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DRT FORTE 80MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DX3 INJ 5 MG/ML', '5794', '-', 818.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '5794' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DX3 INJ 5 MG/ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DX3 SOFT GEL CAP 200000 IU 1S', '12982', '-', 303.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '12982' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DX3 SOFT GEL CAP 200000 IU 1S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DX3 SOFT GEL CAPS 50000IU', '9660', '-', 515.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '9660' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DX3 SOFT GEL CAPS 50000IU'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPOZIN 10MG TAB', '14662', '-', 393.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '14662' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPOZIN 10MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPOZIN 25MG TAB', '14666', '-', 566.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '14666' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPOZIN 25MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPOZIN 3XR 10/5/1000M TAB 14S', '32550', '-', 190.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32550' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPOZIN 3XR 10/5/1000M TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPOZIN 3XR 12.5/2.5/1000M TAB', '32548', '-', 238.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32548' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPOZIN 3XR 12.5/2.5/1000M TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPOZIN 3XR 25/5/1000M TAB 14S', '32549', '-', 238.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32549' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPOZIN 3XR 25/5/1000M TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPOZIN 3XR 5/2.5/1000M TAB 14', '32547', '-', 190.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32547' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPOZIN 3XR 5/2.5/1000M TAB 14'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPOZIN L 10MG+5MG TAB 14S', '22428', '-', 322.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '22428' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPOZIN L 10MG+5MG TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPOZIN L 25MG+5MG TAB 14S', '22429', '-', 595.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '22429' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPOZIN L 25MG+5MG TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPOZIN M TAB 12.5MG+1000MG', '14685', '-', 421.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '14685' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPOZIN M TAB 12.5MG+1000MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMPOZIN M TAB 12.5MG+500MG', '14668', '-', 411.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '14668' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMPOZIN M TAB 12.5MG+500MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ESANTE 20 MG CAPS', '586', '-', 213.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '586' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ESANTE 20 MG CAPS'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ESANTE 40 MG CAPS', '587', '-', 414.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '587' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ESANTE 40 MG CAPS'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ESANTE IV INJ', '16837', '-', 340.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '16837' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ESANTE IV INJ'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'GLIO 2 MG', '219', '-', 243.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '219' OR (p.`company_id` = c.`id` AND p.`product_name` = 'GLIO 2 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'GLIO 4 MG', '221', '-', 459.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '221' OR (p.`company_id` = c.`id` AND p.`product_name` = 'GLIO 4 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'GLIO -P TAB 2MG/15MG', '5210', '-', 299.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '5210' OR (p.`company_id` = c.`id` AND p.`product_name` = 'GLIO -P TAB 2MG/15MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'GLIO-P 2 MG/30MG TAB', '545', '-', 405.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '545' OR (p.`company_id` = c.`id` AND p.`product_name` = 'GLIO-P 2 MG/30MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'HEPANOX 40MG/0.4ML INJ 2S', '33071', '-', 1148.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '33071' OR (p.`company_id` = c.`id` AND p.`product_name` = 'HEPANOX 40MG/0.4ML INJ 2S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'HEPANOX 60MG/0.6ML INJ 2S', '33072', '-', 1488.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '33072' OR (p.`company_id` = c.`id` AND p.`product_name` = 'HEPANOX 60MG/0.6ML INJ 2S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'INDYCO 110MCG+50MCG CAP 30S', '22523', '-', 1020.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '22523' OR (p.`company_id` = c.`id` AND p.`product_name` = 'INDYCO 110MCG+50MCG CAP 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'INDYCO-M 150+50+160M CAP 30S', '31416', '-', 1105.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31416' OR (p.`company_id` = c.`id` AND p.`product_name` = 'INDYCO-M 150+50+160M CAP 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'INFAZITH 250MG TABLETS 6S', '19955', '-', 242.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19955' OR (p.`company_id` = c.`id` AND p.`product_name` = 'INFAZITH 250MG TABLETS 6S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'INFAZITH 500MG TABLETS 6S', '19956', '-', 344.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19956' OR (p.`company_id` = c.`id` AND p.`product_name` = 'INFAZITH 500MG TABLETS 6S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'INFAZITH ORAL SUSP 200/5ML 15M', '30288', '-', 247.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30288' OR (p.`company_id` = c.`id` AND p.`product_name` = 'INFAZITH ORAL SUSP 200/5ML 15M'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'INSPIROL 100 MCG', '3959', '-', 321.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '3959' OR (p.`company_id` = c.`id` AND p.`product_name` = 'INSPIROL 100 MCG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ITOGUARD OD CAPS 150 MG 10S', '6501', '-', 425.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '6501' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ITOGUARD OD CAPS 150 MG 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ITOGUARD TAB 50MG', '5202', '-', 248.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '5202' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ITOGUARD TAB 50MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'M.N.T.K 10 MG TAB 28S', '7113', '-', 765.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '7113' OR (p.`company_id` = c.`id` AND p.`product_name` = 'M.N.T.K 10 MG TAB 28S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MAC DX3 DROPS VITD3 400IUX10ML', '15920', '-', 297.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '15920' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MAC DX3 DROPS VITD3 400IUX10ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MAC-FENID 267MG TABLETS 30S', '17610', '-', 918.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '17610' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MAC-FENID 267MG TABLETS 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MAC-FENID 801MG TABLETS 30S', '17732', '-', 2554.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '17732' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MAC-FENID 801MG TABLETS 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MAC-FER SACHET 30S', '20704', '-', 815.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20704' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MAC-FER SACHET 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MACIVY COUGH SYRUP 120ML', '13093', '-', 222.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13093' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MACIVY COUGH SYRUP 120ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MACLIFE (SPACER FOR AEROSOL)', '5844', '-', 576.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '5844' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MACLIFE (SPACER FOR AEROSOL)'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MACTIFEN SYRUP 60ML 1.38 MG', '201', '-', 138.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '201' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MACTIFEN SYRUP 60ML 1.38 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MAXIL CAPSULES 500 MG', '203', '-', 320.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '203' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MAXIL CAPSULES 500 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MAXIMA CAPSULES 400 MG', '173', '-', 398.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '173' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MAXIMA CAPSULES 400 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MAXIMA DRY SUSPENSION 30 ML', '174', '-', 230.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '174' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MAXIMA DRY SUSPENSION 30 ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MAXIMA DS SUSPENSION 200MG/5ML', '175', '-', 284.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '175' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MAXIMA DS SUSPENSION 200MG/5ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MAXIMA TAB 200 MG', '1493', '-', 398.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '1493' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MAXIMA TAB 200 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MCLEVO 250MG TAB', '17372', '-', 187.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '17372' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MCLEVO 250MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MCLEVO 500MG TAB', '17373', '-', 319.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '17373' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MCLEVO 500MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MOFILOX 400MG TAB', '17319', '-', 463.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '17319' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MOFILOX 400MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'OMNITOR TABS 10 MG 20S', '7114', '-', 575.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '7114' OR (p.`company_id` = c.`id` AND p.`product_name` = 'OMNITOR TABS 10 MG 20S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'OMNITOR TABS 20 MG 20S', '7560', '-', 748.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '7560' OR (p.`company_id` = c.`id` AND p.`product_name` = 'OMNITOR TABS 20 MG 20S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'OMNITOR TABS 5 MG 20S', '7216', '-', 347.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '7216' OR (p.`company_id` = c.`id` AND p.`product_name` = 'OMNITOR TABS 5 MG 20S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'RELAXIN TABS 3 MG', '207', '-', 283.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '207' OR (p.`company_id` = c.`id` AND p.`product_name` = 'RELAXIN TABS 3 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ROPEN INJ 1 GM 1S', '9575', '-', 2338.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '9575' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ROPEN INJ 1 GM 1S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ROPEN INJ 500 MG 1S', '9574', '-', 1328.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '9574' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ROPEN INJ 500 MG 1S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SALMICORT INHALER 25/125 MCG', '238', '-', 771.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '238' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SALMICORT INHALER 25/125 MCG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SALMICORT INHALER 25/250 MCG', '239', '-', 1272.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '239' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SALMICORT INHALER 25/250 MCG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SALNON INHALER 100/50 MCG', '235', '-', 514.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '235' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SALNON INHALER 100/50 MCG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SANTE 40MG INJ', '13565', '-', 419.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13565' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SANTE 40MG INJ'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SANTE CAPSULES 20 MG', '171', '-', 276.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '171' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SANTE CAPSULES 20 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SANTE CAPSULES 40 MG', '2963', '-', 366.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '2963' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SANTE CAPSULES 40 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SIGEL SUSPENSION 120 ML', '254', '-', 170.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '254' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SIGEL SUSPENSION 120 ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SILO-M 50+500 MG TAB', '7022', '-', 430.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '7022' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SILO-M 50+500 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TACIP INJECTION 2.25G-1S', '11263', '-', 572.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '11263' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TACIP INJECTION 2.25G-1S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TAVIST TABS 10 MG', '216', '-', 179.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '216' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TAVIST TABS 10 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TAVIST TABS 20 MG', '217', '-', 260.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '217' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TAVIST TABS 20 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TAVORA 200MG TABLETS 10S', '20431', '-', 1766.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20431' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TAVORA 200MG TABLETS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TIO-VEEZ DPI CAPS 18 MCG-30S', '15869', '-', 662.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '15869' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TIO-VEEZ DPI CAPS 18 MCG-30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TITAN INJECTION 1000 MG I/V', '544', '-', 418.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '544' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TITAN INJECTION 1000 MG I/V'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TITAN INJECTION 2000 MG (IV)', '6549', '-', 594.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '6549' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TITAN INJECTION 2000 MG (IV)'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TITAN INJECTION 250 MG I/M', '542', '-', 151.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '542' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TITAN INJECTION 250 MG I/M'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TITAN INJECTION 250 MG I/V', '182', '-', 145.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '182' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TITAN INJECTION 250 MG I/V'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TITAN INJECTION 500 MG I/M', '543', '-', 255.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '543' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TITAN INJECTION 500 MG I/M'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TITAN INJECTION 500 MG I/V', '183', '-', 217.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '183' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TITAN INJECTION 500 MG I/V'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TRAMCET TABLET', '16836', '-', 170.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '16836' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TRAMCET TABLET'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'VENTICORT 400+12MCG CAP', '13564', '-', 456.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13564' OR (p.`company_id` = c.`id` AND p.`product_name` = 'VENTICORT 400+12MCG CAP'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'VENTICORT DPI CAPS 200MCG 30S', '11121', '-', 369.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '11121' OR (p.`company_id` = c.`id` AND p.`product_name` = 'VENTICORT DPI CAPS 200MCG 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'VPRAZAN 10MG TABLETS 14S', '22509', '-', 348.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '22509' OR (p.`company_id` = c.`id` AND p.`product_name` = 'VPRAZAN 10MG TABLETS 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'VPRAZAN 20MG TABLETS 14S', '22518', '-', 593.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'MACTER INTERNATIONAL (PVT) LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '22518' OR (p.`company_id` = c.`id` AND p.`product_name` = 'VPRAZAN 20MG TABLETS 14S'))
    LIMIT 1
  )
LIMIT 1;

-- Company: ATCO LIFE SCIENCES (PRIVATE) LIMITED (11 products)
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SERAVIO C20 SERUM VITAMIN C 30', '30894', '-', 1813.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ATCO LIFE SCIENCES (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30894' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SERAVIO C20 SERUM VITAMIN C 30'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SERAVIO NZ SERUM 30ML', '30857', '-', 1505.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ATCO LIFE SCIENCES (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30857' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SERAVIO NZ SERUM 30ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SERAVIO RETINOL SERUM 30ML', '30858', '-', 1309.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ATCO LIFE SCIENCES (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30858' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SERAVIO RETINOL SERUM 30ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SILCIO CERAMID MOIST CREAM 75M', '35014', '-', 792.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ATCO LIFE SCIENCES (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '35014' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SILCIO CERAMID MOIST CREAM 75M'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SILCIO FACE WASH 100ML', '30856', '-', 590.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ATCO LIFE SCIENCES (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30856' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SILCIO FACE WASH 100ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SILCIO LIP REPAIR BALM 10GM', '34616', '-', 306.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ATCO LIFE SCIENCES (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34616' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SILCIO LIP REPAIR BALM 10GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SILCIO MOISTURIZER 140ML', '30626', '-', 1280.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ATCO LIFE SCIENCES (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30626' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SILCIO MOISTURIZER 140ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'VELUCIO ANAGAIN EXT SERUM 100M', '34790', '-', 1656.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ATCO LIFE SCIENCES (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34790' OR (p.`company_id` = c.`id` AND p.`product_name` = 'VELUCIO ANAGAIN EXT SERUM 100M'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'VELUCIO HAIR SERUM 50ML', '30624', '-', 1121.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ATCO LIFE SCIENCES (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30624' OR (p.`company_id` = c.`id` AND p.`product_name` = 'VELUCIO HAIR SERUM 50ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'XELIO NEUTRAL FACE WASH 100ML', '34675', '-', 511.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ATCO LIFE SCIENCES (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34675' OR (p.`company_id` = c.`id` AND p.`product_name` = 'XELIO NEUTRAL FACE WASH 100ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'XELIO BODY WASH 180ML', '30623', '-', 697.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'ATCO LIFE SCIENCES (PRIVATE) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30623' OR (p.`company_id` = c.`id` AND p.`product_name` = 'XELIO BODY WASH 180ML'))
    LIMIT 1
  )
LIMIT 1;

-- Company: CCL & NEX PHARMA (13 products)
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'Pulmonol Cough Syrup 450ML', '7779', '-', 468.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CCL & NEX PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '7779' OR (p.`company_id` = c.`id` AND p.`product_name` = 'Pulmonol Cough Syrup 450ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'OAD MEN BOTTLE 30S', '20061', '-', 1148.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CCL & NEX PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20061' OR (p.`company_id` = c.`id` AND p.`product_name` = 'OAD MEN BOTTLE 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'OAD WOMEN BOTTLE 30S', '20062', '-', 1097.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CCL & NEX PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20062' OR (p.`company_id` = c.`id` AND p.`product_name` = 'OAD WOMEN BOTTLE 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'OAD X-MEN BOTTLE 30S', '20063', '-', 2168.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CCL & NEX PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '20063' OR (p.`company_id` = c.`id` AND p.`product_name` = 'OAD X-MEN BOTTLE 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PULMOLOZ CINAMON LOZENGE 20S', '31818', '-', 1700.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CCL & NEX PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31818' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PULMOLOZ CINAMON LOZENGE 20S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PULMOLOZ H&L LOZ 100S JAR', '30979', '-', 680.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CCL & NEX PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30979' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PULMOLOZ H&L LOZ 100S JAR'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PULMOLOZ H&L LOZ 20S', '30977', '-', 1700.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CCL & NEX PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30977' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PULMOLOZ H&L LOZ 20S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PULMOLOZ HONEY LEMON 10S', '34514', '-', 850.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CCL & NEX PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34514' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PULMOLOZ HONEY LEMON 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PULMOLOZ ORANGE LOZ 20S', '30980', '-', 1700.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CCL & NEX PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30980' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PULMOLOZ ORANGE LOZ 20S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PULMOLOZ TULSI 100S JAR', '34513', '-', 850.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CCL & NEX PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34513' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PULMOLOZ TULSI 100S JAR'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PULMOLOZ TULSI LOZENGES 20S', '31819', '-', 1700.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CCL & NEX PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31819' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PULMOLOZ TULSI LOZENGES 20S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'KIDZVITS 30S BOTTLE', '9810', '-', 594.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CCL & NEX PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '9810' OR (p.`company_id` = c.`id` AND p.`product_name` = 'KIDZVITS 30S BOTTLE'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'KIDZVITS 50S BOTTLE', '9811', '-', 911.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CCL & NEX PHARMA'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '9811' OR (p.`company_id` = c.`id` AND p.`product_name` = 'KIDZVITS 50S BOTTLE'))
    LIMIT 1
  )
LIMIT 1;

-- Company: CUREXA HEALTH (PVT) LIMITED (49 products)
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AIRTAL 100MG TABLETS', '34986', '-', 309.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34986' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AIRTAL 100MG TABLETS'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AIRTAL ER 200MG TABLET', '34928', '-', 281.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34928' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AIRTAL ER 200MG TABLET'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CEFIA 100MG/5ML SUSPEN 30ML', '23356', '-', 258.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23356' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CEFIA 100MG/5ML SUSPEN 30ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CEFIA 400MG CAPSULE 5S', '23354', '-', 458.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23354' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CEFIA 400MG CAPSULE 5S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CEFIA DS 200MG/5ML SUSP 30ML', '23358', '-', 313.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23358' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CEFIA DS 200MG/5ML SUSP 30ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CEFLARO INJECTION 400MG', '35063', '-', 2967.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '35063' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CEFLARO INJECTION 400MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CEFLARO INJECTION 600MG', '35062', '-', 3647.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '35062' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CEFLARO INJECTION 600MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CEFTRO INJECTION I.M 250MG', '23359', '-', 158.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23359' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CEFTRO INJECTION I.M 250MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CEFTRO INJECTION I.M 500MG', '23360', '-', 275.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23360' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CEFTRO INJECTION I.M 500MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CEFTRO INJECTION I.V 1GM', '23363', '-', 381.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23363' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CEFTRO INJECTION I.V 1GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CEFTRO INJECTION I.V 250MG', '23361', '-', 158.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23361' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CEFTRO INJECTION I.V 250MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CEFTRO INJECTION I.V 2GM', '23364', '-', 573.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23364' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CEFTRO INJECTION I.V 2GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CEFTRO INJECTION I.V 500MG', '23362', '-', 275.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23362' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CEFTRO INJECTION I.V 500MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'COLEXATE 100M INJECTIO IV 3MIU', '35040', '-', 2550.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '35040' OR (p.`company_id` = c.`id` AND p.`product_name` = 'COLEXATE 100M INJECTIO IV 3MIU'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'COLEXATE 34M INJECTION IV 1MIU', '35038', '-', 1020.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '35038' OR (p.`company_id` = c.`id` AND p.`product_name` = 'COLEXATE 34M INJECTION IV 1MIU'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'COLEXATE 68M INJECTION IV 2MIU', '35039', '-', 1700.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '35039' OR (p.`company_id` = c.`id` AND p.`product_name` = 'COLEXATE 68M INJECTION IV 2MIU'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DXL 30MG CAPS 30S', '32048', '-', 664.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32048' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DXL 30MG CAPS 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'DXL 60MG CAPS 30S', '32049', '-', 962.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32049' OR (p.`company_id` = c.`id` AND p.`product_name` = 'DXL 60MG CAPS 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMESSON 4MG INJECTION 1S', '31974', '-', 94.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31974' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMESSON 4MG INJECTION 1S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMESSON 4MG TABLETS 10S', '31971', '-', 170.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31971' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMESSON 4MG TABLETS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMESSON 4MG/5ML ORAL SOL 50ML', '31972', '-', 174.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31972' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMESSON 4MG/5ML ORAL SOL 50ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMESSON 8MG INJECTION 1S', '31976', '-', 119.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31976' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMESSON 8MG INJECTION 1S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EMESSON 8MG TABLETS 10S', '31973', '-', 213.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31973' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EMESSON 8MG TABLETS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVACEF 125MG/5ML SUSP 60ML', '35056', '-', 237.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '35056' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVACEF 125MG/5ML SUSP 60ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVACEF 250MG/5ML SUSP 60ML', '35057', '-', 306.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '35057' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVACEF 250MG/5ML SUSP 60ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EVACEF 500MG CAPS 2X6', '34997', '-', 399.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34997' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EVACEF 500MG CAPS 2X6'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'FORTEZ 1GM INJ (IV/IM) 1 VIAL', '23367', '-', 374.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23367' OR (p.`company_id` = c.`id` AND p.`product_name` = 'FORTEZ 1GM INJ (IV/IM) 1 VIAL'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'FORTEZ 250MG INJ (IV/IM) 1 VIA', '23366', '-', 136.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23366' OR (p.`company_id` = c.`id` AND p.`product_name` = 'FORTEZ 250MG INJ (IV/IM) 1 VIA'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'FORTEZ 2GM INJ IV 1 VIAL', '34894', '-', 490.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34894' OR (p.`company_id` = c.`id` AND p.`product_name` = 'FORTEZ 2GM INJ IV 1 VIAL'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'FORTEZ 500MG INJ (IV/IM) 1 VIA', '23365', '-', 198.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23365' OR (p.`company_id` = c.`id` AND p.`product_name` = 'FORTEZ 500MG INJ (IV/IM) 1 VIA'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'KYDOR 30MG INJECTION 1ML X 5S', '30813', '-', 366.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30813' OR (p.`company_id` = c.`id` AND p.`product_name` = 'KYDOR 30MG INJECTION 1ML X 5S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MAXUM 1GM INJECTION', '23369', '-', 787.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23369' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MAXUM 1GM INJECTION'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MAXUM 2GM INJECTION', '23368', '-', 1139.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23368' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MAXUM 2GM INJECTION'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MAXUM 500MG INJECTION', '23373', '-', 450.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23373' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MAXUM 500MG INJECTION'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MERZEL 1GM INJECTION 1S', '31036', '-', 1499.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31036' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MERZEL 1GM INJECTION 1S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MERZEL 500MG INJECTION 1S', '31035', '-', 825.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31035' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MERZEL 500MG INJECTION 1S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'RACEDO SACHET 10MG', '31979', '-', 476.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31979' OR (p.`company_id` = c.`id` AND p.`product_name` = 'RACEDO SACHET 10MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'RACEDO SACHET 30MG 10S', '31980', '-', 421.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31980' OR (p.`company_id` = c.`id` AND p.`product_name` = 'RACEDO SACHET 30MG 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SEDEN-P 37.5MG+325MG TAB 10S', '30812', '-', 145.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '30812' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SEDEN-P 37.5MG+325MG TAB 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SKILAX 30ML DROPS', '31981', '-', 111.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31981' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SKILAX 30ML DROPS'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'SKILAX TAB 5MG 60S', '31983', '-', 255.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31983' OR (p.`company_id` = c.`id` AND p.`product_name` = 'SKILAX TAB 5MG 60S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TAMADOL 100MG/2ML INJ 5S', '31985', '-', 119.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31985' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TAMADOL 100MG/2ML INJ 5S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TAMADOL 50MG CAPSULES 10S', '31984', '-', 168.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31984' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TAMADOL 50MG CAPSULES 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'TRES ORIX FORTE', '34929', '-', 255.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '34929' OR (p.`company_id` = c.`id` AND p.`product_name` = 'TRES ORIX FORTE'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'VENJAR 1GM INJECTION', '32934', '-', 961.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32934' OR (p.`company_id` = c.`id` AND p.`product_name` = 'VENJAR 1GM INJECTION'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'VENJAR 500MG INJECTION', '32933', '-', 595.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '32933' OR (p.`company_id` = c.`id` AND p.`product_name` = 'VENJAR 500MG INJECTION'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'XORBACT INJECTION 1GM', '23371', '-', 420.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23371' OR (p.`company_id` = c.`id` AND p.`product_name` = 'XORBACT INJECTION 1GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'XORBACT INJECTION 2GM', '23370', '-', 496.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23370' OR (p.`company_id` = c.`id` AND p.`product_name` = 'XORBACT INJECTION 2GM'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'XORBACT INJECTION 500MG', '23372', '-', 240.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'CUREXA HEALTH (PVT) LIMITED'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '23372' OR (p.`company_id` = c.`id` AND p.`product_name` = 'XORBACT INJECTION 500MG'))
    LIMIT 1
  )
LIMIT 1;

-- Company: HIGHNOON LABORATORIES LTD (33 products)
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ARTECXIN DISPERSIBLE TABLET', '4279', '-', 408.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '4279' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ARTECXIN DISPERSIBLE TABLET'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ARTECXIN FORTE DISP TAB', '4280', '-', 319.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '4280' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ARTECXIN FORTE DISP TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'ARTECXIN PLUS DISPERSI TAB 6S', '31784', '-', 373.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31784' OR (p.`company_id` = c.`id` AND p.`product_name` = 'ARTECXIN PLUS DISPERSI TAB 6S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AXESOM CAPS 20 MG', '5847', '-', 212.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '5847' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AXESOM CAPS 20 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AXESOM CAPS 40 MG', '5848', '-', 353.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '5848' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AXESOM CAPS 40 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AZIPOS 200MG/5ML DRY SUSP 15ML', '22735', '-', 219.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '22735' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AZIPOS 200MG/5ML DRY SUSP 15ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AZIPOS 250MG CAPS 10S', '16372', '-', 399.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '16372' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AZIPOS 250MG CAPS 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'AZIPOS 500MG TAB 6S', '16373', '-', 347.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '16373' OR (p.`company_id` = c.`id` AND p.`product_name` = 'AZIPOS 500MG TAB 6S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CYROCIN SUSPENSION 125MG/5ML', '6771', '-', 180.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '6771' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CYROCIN SUSPENSION 125MG/5ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CYROCIN SUSPENSION 250MG/5ML', '6772', '-', 268.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '6772' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CYROCIN SUSPENSION 250MG/5ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CYROCIN TABLETS 250 MG', '1100', '-', 196.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '1100' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CYROCIN TABLETS 250 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'CYROCIN TABLETS 500 MG', '1101', '-', 323.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '1101' OR (p.`company_id` = c.`id` AND p.`product_name` = 'CYROCIN TABLETS 500 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EFIX CAPS 400MG', '1280', '-', 444.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '1280' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EFIX CAPS 400MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EFIX DS SUSPENDION', '13284', '-', 327.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13284' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EFIX DS SUSPENDION'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'EFIX SUSPENSION', '1281', '-', 268.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '1281' OR (p.`company_id` = c.`id` AND p.`product_name` = 'EFIX SUSPENSION'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'HILORIC 40MG TAB', '9307', '-', 357.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '9307' OR (p.`company_id` = c.`id` AND p.`product_name` = 'HILORIC 40MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'HILORIC 80MG TAB', '9308', '-', 383.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '9308' OR (p.`company_id` = c.`id` AND p.`product_name` = 'HILORIC 80MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'HINOCAM 20MG TABLET 20S', '31615', '-', 295.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31615' OR (p.`company_id` = c.`id` AND p.`product_name` = 'HINOCAM 20MG TABLET 20S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'INHIBITOL CAPS 30 MG', '1127', '-', 310.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '1127' OR (p.`company_id` = c.`id` AND p.`product_name` = 'INHIBITOL CAPS 30 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'KESTINE 20MG TABLETS 14S', '19604', '-', 404.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19604' OR (p.`company_id` = c.`id` AND p.`product_name` = 'KESTINE 20MG TABLETS 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'KESTINE LIQUID 60ML', '22541', '-', 197.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '22541' OR (p.`company_id` = c.`id` AND p.`product_name` = 'KESTINE LIQUID 60ML'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'KESTINE TABLETS 10MG 14S', '19380', '-', 253.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '19380' OR (p.`company_id` = c.`id` AND p.`product_name` = 'KESTINE TABLETS 10MG 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MOBLO 500MCG INJECTION 10S', '31613', '-', 383.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31613' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MOBLO 500MCG INJECTION 10S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MOBLO 500MCG TABLET 30S', '31614', '-', 277.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31614' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MOBLO 500MCG TABLET 30S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'MONTIT 10MG TAB 14S', '15894', '-', 340.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '15894' OR (p.`company_id` = c.`id` AND p.`product_name` = 'MONTIT 10MG TAB 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'NUMTROL 5MG/ML INJECTION', '33022', '-', 160.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '33022' OR (p.`company_id` = c.`id` AND p.`product_name` = 'NUMTROL 5MG/ML INJECTION'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'OMEVEX IV INJECTION 40MG', '31611', '-', 332.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '31611' OR (p.`company_id` = c.`id` AND p.`product_name` = 'OMEVEX IV INJECTION 40MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'OMSTA 20MG CAPSULE 14S', '15486', '-', 191.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '15486' OR (p.`company_id` = c.`id` AND p.`product_name` = 'OMSTA 20MG CAPSULE 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'OMSTA 40MG CAPSULE 14S', '16344', '-', 258.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '16344' OR (p.`company_id` = c.`id` AND p.`product_name` = 'OMSTA 40MG CAPSULE 14S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'OXAQUIN TABLETS 400 MG', '1152', '-', 417.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '1152' OR (p.`company_id` = c.`id` AND p.`product_name` = 'OXAQUIN TABLETS 400 MG'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'PROSTAM 0.4MG CAPS 28S', '13679', '-', 1050.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '13679' OR (p.`company_id` = c.`id` AND p.`product_name` = 'PROSTAM 0.4MG CAPS 28S'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'VOXIQUIN 250 MG TAB', '7625', '-', 204.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '7625' OR (p.`company_id` = c.`id` AND p.`product_name` = 'VOXIQUIN 250 MG TAB'))
    LIMIT 1
  )
LIMIT 1;
INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)
SELECT c.`id`, 'VOXIQUIN 500 MG TAB', '7626', '-', 353.0, 0, 0, 0, @tenant_id, @now, @created_by, @now
FROM `companies` c
WHERE c.`company_name` = 'HIGHNOON LABORATORIES LTD'
  AND c.`tenant_id` = @tenant_id
  AND NOT EXISTS (
    SELECT 1 FROM `products` p
    WHERE p.`tenant_id` = @tenant_id
      AND (p.`barcode` = '7626' OR (p.`company_id` = c.`id` AND p.`product_name` = 'VOXIQUIN 500 MG TAB'))
    LIMIT 1
  )
LIMIT 1;

COMMIT;

-- Verify counts (should show real numbers, not empty)
SELECT
  (SELECT COUNT(*) FROM `companies` WHERE `tenant_id` = @tenant_id
     AND `company_name` IN ('PHARMEVO (PVT) LIMITED', 'SANOFI AVENTIS PAK LTD (SELSUN)', 'HELIX PHARMA PVT LTD', 'FEROZSONS LABORATORIES LIMITED', 'CHIESI PHARMACEUTICALS (PRIVATE) LIMITED', 'LCI PAKISTAN LIMITED', 'BECTON DICKINSON IMPORT', 'HORIZON PHARMACEUTICALS (PVT) LIMITED', 'UNIFEROZ (SANI PLAST)', 'ABBOTT LABORATORIES PAKISTAN', 'DKT PAKISTAN (PRIVATE) LIMITED', 'HERBALSCIENCE PAKISTAN (PVT) LTD', 'FATHER AND SONS', 'MAZTON PHARMA', 'MARTIN DOW MARKER LIMITED', 'MACTER INTERNATIONAL (PVT) LTD', 'ATCO LIFE SCIENCES (PRIVATE) LIMITED', 'CCL & NEX PHARMA', 'CUREXA HEALTH (PVT) LIMITED', 'HIGHNOON LABORATORIES LTD')) AS companies_inserted,
  (SELECT COUNT(*) FROM `products` WHERE `tenant_id` = @tenant_id) AS products_for_tenant;

-- Expected ~ Companies: 20, Products: 733