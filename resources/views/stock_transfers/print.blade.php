<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Stock Transfer #{{ $transfer->id }} {{ \Carbon\Carbon::parse($transfer->transfer_date)->format('d-m-Y') }}</title>
    <style>
        @media print {
            @page {
                size: 80mm 297mm;
                margin: 0;
            }

            #invoice-POS {
                width: 72mm;
                padding: 4mm;
            }
        }

        body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        #invoice-POS {
            padding: 0;
            margin: 0;
            background: #FFF;
            font-family: Tahoma, "Trebuchet MS", sans-serif;
            color: #111;
        }

        * {
            box-sizing: border-box;
        }

        .top {
            text-align: center;
        }

        .brand-logo {
            height: 56px;
            width: auto;
            display: block;
            margin: 0 auto 6px;
        }

        .brand-name {
            font-weight: 800;
            letter-spacing: 0.6px;
            text-transform: uppercase;
            margin: 0;
            font-size: 14px;
            line-height: 1.2;
        }

        .brand-meta {
            margin: 2px 0 0;
            font-size: 11px;
            line-height: 1.25;
        }

        .rule {
            border: 0;
            border-top: 1px dashed #2b2b2b;
            margin: 8px 0;
            height: 0;
        }

        .title-chip {
            width: 100%;
            background: #111;
            color: #fff;
            text-align: center;
            padding: 6px 8px;
            margin: 8px 0;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        #invoice-POS table {
            width: 74mm;
            border-collapse: collapse;
            font-size: 12px;
        }

        .kv {
            width: 100%;
            border: 1px solid #111;
            border-radius: 6px;
            padding: 8px;
            margin: 8px 0 10px;
        }

        .kv .row {
            display: grid;
            grid-template-columns: 22mm 1fr;
            gap: 2mm;
            padding: 2px 0;
        }

        .kv .k {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }

        .kv .v {
            font-size: 12px;
            font-weight: 700;
        }

        .kv .v.muted {
            font-weight: 500;
            color: #444;
        }

        .items {
            width: 100%;
        }

        .items thead th {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            padding: 5px 0 6px;
            border-top: 1.5px solid #111;
            border-bottom: 1.5px solid #111;
        }

        .items tbody td {
            padding: 5px 0;
            border-bottom: 1px dashed #444;
            vertical-align: top;
            font-size: 12px;
        }

        .items .col-idx {
            width: 6mm;
        }

        .items .col-qty {
            width: 14mm;
            text-align: right;
            font-weight: 800;
        }

        .items .prod {
            text-transform: uppercase;
            font-weight: 700;
            padding-right: 6px;
        }

        .totals {
            margin-top: 8px;
            width: 100%;
        }

        .totals td {
            padding: 2px 0;
            font-size: 12px;
        }

        .totals .label {
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }

        .totals .value {
            text-align: right;
            font-weight: 900;
        }

        #invoice-POS .footer-copyright .copyright {
            font-size: 10px;
            color: #232323;
        }

        .muted {
            color: #666;
        }
    </style>
</head>

<body translate="no" onload="javascript:window.print()">
    <div id="invoice-POS">
        <div class="top">
            <img src="/images/print-logo.png" class="brand-logo" alt="Logo">
            <p class="brand-name">{{ $organization->name }}</p>
            <p class="brand-meta">{{ $organization->address }}</p>
            <p class="brand-meta">Phone # {{ $organization->phone_number }}</p>
        </div>

        <hr class="rule">
        <div class="title-chip">Stock Transfer</div>

        <div class="kv">
            <div class="row">
                <div class="k">Transfer #</div>
                <div class="v">{{ $transfer->id }}</div>
            </div>
            <div class="row">
                <div class="k">Date</div>
                <div class="v">{{ \Carbon\Carbon::parse($transfer->transfer_date)->format('d-m-Y') }}</div>
            </div>
            <div class="row">
                <div class="k">From</div>
                <div class="v">{{ $transfer->from_godown_name }}</div>
            </div>
            <div class="row">
                <div class="k">To</div>
                <div class="v">{{ $transfer->to_godown_name }}</div>
            </div>
            @if ($transfer->reference_no)
                <div class="row">
                    <div class="k">Reference</div>
                    <div class="v muted">{{ $transfer->reference_no }}</div>
                </div>
            @endif
            @if ($transfer->description)
                <div class="row">
                    <div class="k">Description</div>
                    <div class="v muted">{{ $transfer->description }}</div>
                </div>
            @endif
        </div>

        <table class="items">
            <thead>
                <tr>
                    <th class="col-idx">#</th>
                    <th>Product</th>
                    <th class="col-qty">Qty</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($items as $k => $item)
                    <tr>
                        <td class="col-idx">{{ $k + 1 }}</td>
                        <td class="prod">{{ $item->product_name }}</td>
                        <td class="col-qty">{{ number_format((float) $item->qty, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <table class="totals">
            <tr>
                <td class="label">Total Items</td>
                <td class="value">{{ count($items) }}</td>
            </tr>
            <tr>
                <td class="label">Total Qty</td>
                <td class="value">{{ number_format((float) collect($items)->sum('qty'), 2) }}</td>
            </tr>
        </table>

            <table class="footer-copyright" style="margin-top: 8px;">
                <tr class="copyright">
                    <td>Software developed by <b>Zeeshan Hamza (0333-6701313)</b></td>
                </tr>
            </table>
    </div>
    <script>
        window.onafterprint = function() {
            window.close();
        };
    </script>
</body>

</html>

