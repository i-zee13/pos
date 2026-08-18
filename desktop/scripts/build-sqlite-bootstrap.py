#!/usr/bin/env python3
"""
Build SQLite bootstrap SQL from a MySQL dump (schema only + minimal seed).
Does NOT connect to MySQL — reads a local .sql dump file.

Usage:
  python3 desktop/scripts/build-sqlite-bootstrap.py [path/to/dump.sql]
  → desktop/assets/sqlite-bootstrap.sql
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parents[1] / "assets" / "sqlite-bootstrap.sql"

DEFAULT_DUMPS = [
    Path.home() / "Downloads" / "storeeoa_atta_traders.sql",
    ROOT / "DB" / "backups" / "pos_before_batch_browser_test_20260723_012306.sql",
    ROOT / "DB" / "pos_new.sql",
]

CREATE_RE = re.compile(
    r"CREATE TABLE `([^`]+)`\s*\((.*?)\)\s*ENGINE=",
    re.S | re.I,
)


def map_col_type(mysql_type: str, is_single_ai_pk: bool) -> str:
    t = mysql_type.lower().strip()
    if is_single_ai_pk:
        return "INTEGER PRIMARY KEY AUTOINCREMENT"
    if t.startswith(("int", "bigint", "smallint", "tinyint", "mediumint", "bool", "bit")):
        return "INTEGER"
    if t.startswith(("decimal", "float", "double", "real", "numeric")):
        return "REAL"
    if t.startswith(("blob", "binary", "varbinary", "longblob", "mediumblob")):
        return "BLOB"
    return "TEXT"


def parse_default(rest: str) -> str:
    m = re.search(r"DEFAULT\s+(\S+(?:\s+\S+)?)", rest, re.I)
    if not m:
        return ""
    d = m.group(1).rstrip(",")
    if d.upper() in ("CURRENT_TIMESTAMP", "CURRENT_TIMESTAMP()"):
        # SQLite: avoid ON UPDATE forms
        return " DEFAULT CURRENT_TIMESTAMP"
    if d.upper() == "NULL":
        return " DEFAULT NULL"
    if re.match(r"^-?\d+(\.\d+)?$", d):
        return f" DEFAULT {d}"
    if d.startswith("'"):
        # may be truncated; take quoted string from rest
        m2 = re.search(r"DEFAULT\s+'((?:\\'|[^'])*)'", rest, re.I)
        if m2:
            return " DEFAULT '" + m2.group(1).replace("\\'", "''") + "'"
    return ""


def convert_create(table: str, body: str) -> str:
    lines = []
    for raw in body.splitlines():
        line = raw.strip().rstrip(",")
        if not line:
            continue
        up = line.upper()
        if up.startswith(
            (
                "PRIMARY KEY",
                "UNIQUE KEY",
                "UNIQUE INDEX",
                "KEY ",
                "INDEX ",
                "CONSTRAINT",
                "FULLTEXT",
                "SPATIAL",
            )
        ):
            # Keep table-level PRIMARY KEY if composite
            if up.startswith("PRIMARY KEY"):
                lines.append(("PK", line))
            continue
        if line.startswith("`"):
            lines.append(("COL", line))

    col_defs = []
    pk_cols = []
    for kind, line in lines:
        if kind == "PK":
            m = re.search(r"PRIMARY KEY\s*\(([^)]+)\)", line, re.I)
            if m:
                pk_cols = re.findall(r"`([^`]+)`", m.group(1))
            continue

        m = re.match(r"`([^`]+)`\s+([a-zA-Z0-9_()]+)(.*)$", line)
        if not m:
            continue
        name, typ, rest = m.group(1), m.group(2), m.group(3)
        is_ai = "AUTO_INCREMENT" in rest.upper()
        not_null = "NOT NULL" in rest.upper()
        col_defs.append(
            {
                "name": name,
                "typ": typ,
                "rest": rest,
                "ai": is_ai,
                "not_null": not_null,
            }
        )

    # Detect single-column AI PK from PRIMARY KEY (...) or inline
    if not pk_cols:
        for c in col_defs:
            if "PRIMARY KEY" in c["rest"].upper():
                pk_cols = [c["name"]]

    single_ai_pk = len(pk_cols) == 1 and any(
        c["name"] == pk_cols[0] and c["ai"] for c in col_defs
    )
    # SQLite: even without AUTO_INCREMENT, a single integer PK works as rowid alias
    single_int_pk = False
    if len(pk_cols) == 1:
        pk_col = next((c for c in col_defs if c["name"] == pk_cols[0]), None)
        if pk_col and map_col_type(pk_col["typ"], False) == "INTEGER":
            single_int_pk = True
            single_ai_pk = True  # use INTEGER PRIMARY KEY AUTOINCREMENT

    out_cols = []
    for c in col_defs:
        is_this_ai_pk = single_ai_pk and c["name"] == pk_cols[0]
        mapped = map_col_type(c["typ"], is_this_ai_pk)
        bits = [f'  "{c["name"]}" {mapped}']
        if not is_this_ai_pk:
            if c["not_null"] and "PRIMARY KEY" not in mapped:
                bits.append("NOT NULL")
            def_sql = parse_default(c["rest"])
            if def_sql:
                bits.append(def_sql.strip())
        out_cols.append(" ".join(bits))

    if pk_cols and not single_ai_pk and not single_int_pk:
        out_cols.append(
            "  PRIMARY KEY (" + ", ".join(f'"{c}"' for c in pk_cols) + ")"
        )

    return f'CREATE TABLE IF NOT EXISTS "{table}" (\n' + ",\n".join(out_cols) + "\n);\n"


def main() -> None:
    dump_path = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    if dump_path is None:
        for p in DEFAULT_DUMPS:
            if p.exists():
                dump_path = p
                break
    if dump_path is None or not dump_path.exists():
        raise SystemExit(
            "No MySQL dump found. Pass path:\n"
            "  python3 desktop/scripts/build-sqlite-bootstrap.py /path/to/dump.sql"
        )

    print(f"Reading {dump_path} ...")
    text = dump_path.read_text(encoding="utf-8", errors="ignore")
    creates = list(CREATE_RE.finditer(text))
    if not creates:
        raise SystemExit("No CREATE TABLE found in dump")

    priority = ["organization", "users", "migrations", "postal_codes", "sessions"]
    by_name = {m.group(1): m for m in creates}
    ordered = [t for t in priority if t in by_name] + [
        t for t in by_name if t not in priority
    ]

    parts = [
        "-- Storeeo POS — SQLite bootstrap (schema + minimal local seed)",
        f"-- Source: {dump_path.name}",
        "PRAGMA foreign_keys = OFF;",
        "BEGIN;",
        "",
    ]

    for t in ordered:
        m = by_name[t]
        try:
            parts.append(f"-- table: {t}")
            parts.append(convert_create(t, m.group(2)))
        except Exception as e:
            print(f"WARN skip {t}: {e}", file=sys.stderr)

    # Patch common tenant / feature columns missing from older dumps
    patches = [
        ('organization', 'tenant_id', 'INTEGER'),
        ('organization', 'print_logo', 'TEXT'),
        ('organization', 'refund_policy', 'TEXT'),
        ('organization', 'purchi_use_dynamic', 'INTEGER DEFAULT 0'),
        ('organization', 'purchi_config', 'TEXT'),
        ('users', 'tenant_id', 'INTEGER'),
        ('customers', 'tenant_id', 'INTEGER'),
        ('customers', 'system_code', 'TEXT'),
        ('products', 'tenant_id', 'INTEGER'),
    ]
    parts.append("-- schema patches (idempotent via ignore errors at apply time)")
    for table, col, typ in patches:
        parts.append(f'-- PATCH:{table}:{col}')
        parts.append(f'ALTER TABLE "{table}" ADD COLUMN "{col}" {typ};')
    parts.append("")

    pw = "$2y$12$RADti.Q8P.FW6dGZv9uLq.1tCrujCqehEik7Gra93pHok.UIAW3S6"
    parts.append("-- seed: local admin (email: admin / password: admin123)")
    parts.append(
        """INSERT OR IGNORE INTO "organization" (
  "id","name","phone_number","email","address",
  "city_id","postal_code_id","state_id","country_id","logo_img",
  "created_by","created_at","updated_by","updated_at"
) VALUES (
  1, 'Storeeo Local', '0000000000', 'local@storeeo.app', 'Local offline shop',
  0, 0, 0, 0, '',
  1, CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP
);
"""
    )
    parts.append(
        """UPDATE "organization" SET "tenant_id" = 1 WHERE "id" = 1;
"""
    )
    parts.append(
        f"""INSERT OR IGNORE INTO "users" (
  "id","name","username","email","country",
  "reporting_to","department_id","password","super","active",
  "password_changed","force_logout","created_at","updated_at"
) VALUES (
  1, 'Local Admin', 'admin', 'admin', '0',
  0, 0, '{pw}', 1, 1,
  0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);
"""
    )
    parts.append(
        """UPDATE "users" SET "tenant_id" = 1 WHERE "id" = 1;
"""
    )
    parts.append("COMMIT;")
    parts.append("")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(parts), encoding="utf-8")
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes, {len(ordered)} tables)")


if __name__ == "__main__":
    main()
