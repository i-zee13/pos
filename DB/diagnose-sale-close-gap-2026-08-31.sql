-- Run on LIVE DB for 2026-08-31 (gap 258520 - 258240 = 280)
-- Find Counter Sale / discount entries that TTL IN HAND subtracts

SELECT id, invoice_no, customer_id, invoice_type, invoice_discount, product_discount,
       paid_amount, total_invoice_amount, date
FROM sale_invoices
WHERE DATE(date) = '2026-08-31'
  AND deleted_at IS NULL
  AND (
    invoice_discount > 0
    OR product_discount > 0
    OR ABS(invoice_discount - 280) < 0.05
  )
ORDER BY customer_id, invoice_no;

-- Counter Sale only (customer_id = 8 on Shama legacy)
SELECT invoice_no, customer_id, MAX(invoice_discount) AS inv_disc,
       SUM(product_discount) AS prod_disc
FROM sale_invoices
WHERE DATE(date) = '2026-08-31'
  AND deleted_at IS NULL
  AND customer_id = 8
GROUP BY invoice_no, customer_id;

SELECT 'counter_invoice_discount_sum' AS k,
       SUM(inv_disc) AS v
FROM (
  SELECT MAX(invoice_discount) AS inv_disc
  FROM sale_invoices
  WHERE DATE(date) = '2026-08-31'
    AND deleted_at IS NULL
    AND customer_id = 8
  GROUP BY invoice_no
) t;
