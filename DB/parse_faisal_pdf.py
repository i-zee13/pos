# -*- coding: utf-8 -*-
"""Parse FAISAL ENTERPRISES price-list PDF and compare to TEAM A/B DATA."""
import fitz
import re
import json
import importlib.util
from collections import OrderedDict
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PDF = Path(r"c:\Users\TechEsthete\Downloads\all companies product list.pdf")

spec = importlib.util.spec_from_file_location("g", ROOT / "generate_medical_products_sql.py")
g = importlib.util.module_from_spec(spec)
spec.loader.exec_module(g)
old = g.DATA
old_companies = set(old.keys())
old_barcodes = set()
old_names = set()
for prods in old.values():
    for b, n, p in prods:
        old_barcodes.add(str(b).strip())
        old_names.add(n.strip().upper())

pdf = fitz.open(str(PDF))
lines = []
for i in range(pdf.page_count):
    lines.extend(ln.strip() for ln in pdf[i].get_text("text").splitlines())

skip_prefixes = (
    "FAISAL ENTERPRISES",
    "Price List",
    "Near General",
    "Enlist.Code",
    "Gst",
    "Retail",
    "Code",
    "Description",
    "Pack",
    "T.P.",
    "Sr#",
    "Page ",
)


def is_noise(s: str) -> bool:
    if not s:
        return True
    if any(s.startswith(x) or s == x for x in skip_prefixes):
        return True
    if re.match(r"^\d{1,2}-[A-Za-z]{3}-\d{4}$", s):
        return True
    if re.match(r"^\d{1,2}:\d{2}:\d{2}(AM|PM)$", s, re.I):
        return True
    return False


code_re = re.compile(r"^\d{3,6}$")
price_re = re.compile(r"^[\d,]+\.\d{2}$")
pack_re = re.compile(
    r"^(\d+\*?S?'?S?|\d+\*?\d*|\d+ML|\d+GM|\d+G|\d+VIAL|AMP|\d+\s*AMP|"
    r"\d+'S|\d+\*S|\d+s|\d+ML/.+|1VIAL|\d+\*?10|\d+\*10)$",
    re.I,
)

products_by_co = OrderedDict()
current = None
idx = 0
n = len(lines)

while idx < n:
    ln = lines[idx]
    if is_noise(ln):
        idx += 1
        continue

    if (
        not code_re.match(ln)
        and not price_re.match(ln.replace(" ", ""))
        and not re.match(r"^\d+$", ln)
    ):
        look = False
        for j in range(idx + 1, min(idx + 6, n)):
            if code_re.match(lines[j]):
                look = True
                break
            if is_noise(lines[j]):
                continue
            break
        if look and len(ln) >= 4 and not pack_re.match(ln):
            if ln not in products_by_co:
                products_by_co[ln] = []
            current = ln
            idx += 1
            continue

    if current and code_re.match(ln):
        code = ln
        j = idx + 1
        while j < n and is_noise(lines[j]):
            j += 1
        if j >= n:
            break
        desc = lines[j]
        j += 1
        while j < n and is_noise(lines[j]):
            j += 1
        pack = lines[j] if j < n else ""
        j += 1
        while j < n and is_noise(lines[j]):
            j += 1
        # skip sr#
        k = j + 1
        prices = []
        while k < n and len(prices) < 3:
            raw = lines[k].strip()
            if price_re.match(raw) or re.match(r"^\d+\.\d{2}$", raw.replace(" ", "").replace(",", "")):
                prices.append(float(raw.replace(",", "").replace(" ", "")))
                k += 1
                continue
            if re.match(r"^\d+$", raw) and float(raw) in (0, 12, 15, 17, 18, 22):
                k += 1
                continue
            if is_noise(raw):
                k += 1
                continue
            break
        retail = prices[-1] if prices else 0.0
        products_by_co[current].append((code, desc.strip(), retail, pack))
        idx = k if prices else (j + 1)
        continue
    idx += 1

print("Companies found:", len(products_by_co))
print("Total products:", sum(len(v) for v in products_by_co.values()))
print()
print("=== NEW PDF COMPANIES ===")
for c, v in products_by_co.items():
    print(f"  {c}: {len(v)} products")

print()
print("=== EXACT COMPANY NAME MATCH vs TEAM A/B ===")
overlap_co = sorted(set(products_by_co) & old_companies)
print(overlap_co or "(none)")


def norm(s):
    return re.sub(r"[^A-Z0-9]", "", s.upper())


old_norm = {norm(c): c for c in old_companies}
fuzzy = []
for nc in products_by_co:
    nn = norm(nc)
    if nn in old_norm:
        fuzzy.append((nc, old_norm[nn], "exact-norm"))
        continue
    for on, oc in old_norm.items():
        if (nn in on or on in nn) and abs(len(nn) - len(on)) < 20:
            fuzzy.append((nc, oc, "partial"))
            break
print()
print("=== FUZZY COMPANY OVERLAP ===")
for a, b, how in fuzzy:
    print(f"  [{how}] NEW: {a}")
    print(f"         OLD: {b}")

new_barcodes = set()
new_names = set()
for v in products_by_co.values():
    for code, desc, retail, _ in v:
        new_barcodes.add(code)
        new_names.add(desc.upper())

bc_overlap = new_barcodes & old_barcodes
name_overlap = new_names & old_names
print()
print(f"Barcode overlap: {len(bc_overlap)} / {len(new_barcodes)}")
print(f"Name overlap: {len(name_overlap)} / {len(new_names)}")
if bc_overlap:
    print("sample barcode overlaps:", sorted(bc_overlap)[:15])
if name_overlap:
    print("sample name overlaps:", sorted(name_overlap)[:15])

out = {c: [(a, b, float(p), pk) for a, b, p, pk in v] for c, v in products_by_co.items()}
(ROOT / "_faisal_parsed.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
print("wrote", ROOT / "_faisal_parsed.json")
