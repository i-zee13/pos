# -*- coding: utf-8 -*-
"""Generate INSERT SQL from FAISAL ENTERPRISES 'all companies product list.pdf' parse."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PARSED = ROOT / "_faisal_parsed.json"
OUT = ROOT / "medical_products_faisal_enterprises_insert.sql"

# Cleanup truncated / display names from PDF
COMPANY_ALIASES = {
    "CONTINENTAL PHARMACEUTICAL LABORATORIES (": "CONTINENTAL PHARMACEUTICAL LABORATORIES",
}


def esc(s: str) -> str:
    return str(s).replace("\\", "\\\\").replace("'", "''")


def main():
    raw = json.loads(PARSED.read_text(encoding="utf-8"))
    # merge aliases into clean company map
    data = {}
    for company, products in raw.items():
        name = COMPANY_ALIASES.get(company, company).strip()
        bucket = data.setdefault(name, [])
        seen = {(b, n) for b, n, *_ in bucket}
        for item in products:
            code, desc, retail, pack = item[0], item[1], float(item[2]), item[3] if len(item) > 3 else "-"
            key = (str(code), desc)
            if key in seen:
                continue
            seen.add(key)
            size = (pack or "-")[:100]
            bucket.append((str(code), desc[:100], retail, size))

    company_names = list(data.keys())
    in_list = ", ".join(f"'{esc(c)}'" for c in company_names)

    lines = []
    lines.append("-- ============================================================")
    lines.append("-- Medical products import from:")
    lines.append("--   all companies product list.pdf (FAISAL ENTERPRISES)")
    lines.append("-- NEW catalog vs TEAM A/B - different supplier codes and mostly")
    lines.append("-- different companies/products. Safe to import alongside prior SQL.")
    lines.append("-- barcode = Enlist/Code | sale_price = Retail | size = Pack")
    lines.append("-- SET @tenant_id and @created_by before run")
    lines.append("-- ============================================================")
    lines.append("")
    lines.append("SET NAMES utf8mb4;")
    lines.append("SET @tenant_id := 1;  -- <<< change to your real tenant_id")
    lines.append("SET @created_by := 1; -- <<< change to your user id")
    lines.append("SET @now := NOW();")
    lines.append("")
    lines.append("START TRANSACTION;")
    lines.append("")
    lines.append("-- -------------------- COMPANIES --------------------")

    for company in company_names:
        c = esc(company)
        lines.append(
            f"INSERT INTO `companies` (`company_name`, `tenant_id`, `created_at`, `created_by`, `updated_at`)\n"
            f"SELECT '{c}', @tenant_id, @now, @created_by, @now\n"
            f"FROM DUAL\n"
            f"WHERE NOT EXISTS (\n"
            f"  SELECT 1 FROM `companies`\n"
            f"  WHERE `company_name` = '{c}'\n"
            f"    AND (`tenant_id` = @tenant_id OR `tenant_id` IS NULL)\n"
            f"  LIMIT 1\n"
            f");"
        )

    lines.append("")
    lines.append(
        f"UPDATE `companies`\n"
        f"SET `tenant_id` = @tenant_id\n"
        f"WHERE `tenant_id` IS NULL\n"
        f"  AND `company_name` IN ({in_list});"
    )

    lines.append("")
    lines.append("-- -------------------- PRODUCTS --------------------")

    total = 0
    for company, products in data.items():
        c = esc(company)
        lines.append(f"\n-- Company: {company} ({len(products)} products)")
        for barcode, name, price, size in products:
            total += 1
            b = esc(barcode)
            n = esc(name)
            s = esc(size)
            p = float(price)
            lines.append(
                f"INSERT INTO `products` (`company_id`, `product_name`, `barcode`, `size`, `sale_price`, `old_purchase_price`, `new_purchase_price`, `stock_balance`, `tenant_id`, `created_at`, `created_by`, `updated_at`)\n"
                f"SELECT c.`id`, '{n}', '{b}', '{s}', {p}, 0, 0, 0, @tenant_id, @now, @created_by, @now\n"
                f"FROM `companies` c\n"
                f"WHERE c.`company_name` = '{c}'\n"
                f"  AND c.`tenant_id` = @tenant_id\n"
                f"  AND NOT EXISTS (\n"
                f"    SELECT 1 FROM `products` p\n"
                f"    WHERE p.`tenant_id` = @tenant_id\n"
                f"      AND (p.`barcode` = '{b}' OR (p.`company_id` = c.`id` AND p.`product_name` = '{n}'))\n"
                f"    LIMIT 1\n"
                f"  )\n"
                f"LIMIT 1;"
            )

    lines.append("")
    lines.append("COMMIT;")
    lines.append("")
    lines.append("-- Verify")
    lines.append(
        "SELECT\n"
        "  (SELECT COUNT(*) FROM `companies` WHERE `tenant_id` = @tenant_id\n"
        f"     AND `company_name` IN ({in_list})) AS companies_matched,\n"
        "  (SELECT COUNT(*) FROM `products` WHERE `tenant_id` = @tenant_id) AS products_for_tenant;"
    )
    lines.append("")
    lines.append(f"-- Expected ~ Companies: {len(data)}, Products: {total}")

    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT}")
    print(f"Companies: {len(data)}, Products: {total}")
    for c, v in data.items():
        print(f"  {c}: {len(v)}")


if __name__ == "__main__":
    main()
