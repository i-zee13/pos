@extends('layouts.app')
@section('content')
<style>
    .analytics-page { position: relative; min-height: 60vh; background: #f4f6f9; margin: -12px -15px; padding: 18px 18px 28px; }
    .analytics-toolbar {
        display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
        gap: 12px; margin-bottom: 16px;
    }
    .analytics-modes .btn {
        border-radius: 6px !important; font-weight: 600; min-width: 90px;
    }
    .analytics-modes .btn.active {
        background: #0038ba; border-color: #0038ba; color: #fff;
    }
    .analytics-pickers { display: flex; gap: 10px; align-items: center; }
    .analytics-pickers input {
        border: 1px solid #d9dee7; border-radius: 6px; padding: 6px 10px; font-weight: 600; background: #fff;
    }
    .analytics-meta { color: #6b7a90; font-size: 13px; }
    .analytics-meta strong { color: #152e4d; }
    .an-section {
        background: #fff; border-radius: 12px; padding: 18px 20px; margin-bottom: 16px;
        box-shadow: 0 1px 3px rgba(21,46,77,.06);
    }
    .an-section-title {
        display: flex; align-items: center; gap: 10px; margin: 0 0 16px;
        font-size: 14px; font-weight: 700; letter-spacing: .6px; text-transform: uppercase; color: #3d4a5c;
    }
    .an-section-title:before {
        content: ''; width: 4px; height: 18px; background: #0038ba; border-radius: 2px; display: inline-block;
    }
    .hero-sales .hero-amount {
        font-family: 'Rationale', sans-serif !important; font-size: 42px; color: #0038ba; line-height: 1;
        display: inline-block; margin-right: 12px;
    }
    .hero-sales .hero-change {
        display: inline-block; font-weight: 700; font-size: 16px; vertical-align: middle;
    }
    .hero-sales .hero-change.up { color: #1aa35c; }
    .hero-sales .hero-change.down { color: #d64545; }
    .hero-secondary {
        display: flex; flex-wrap: wrap; gap: 28px; margin: 18px 0 8px; padding-bottom: 16px;
        border-bottom: 1px solid #eef1f5;
    }
    .hero-secondary .hs-item .hs-label { font-size: 12px; color: #8896a8; font-weight: 600; }
    .hero-secondary .hs-item .hs-value {
        font-family: 'Rationale', sans-serif !important; font-size: 22px; color: #243447; margin-top: 2px;
    }
    .hero-grid {
        display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin-top: 8px;
    }
    .hero-grid .hg-cell {
        padding: 14px 10px; text-align: center; border-right: 1px solid #eef1f5;
    }
    .hero-grid .hg-cell:nth-child(4n) { border-right: none; }
    .hero-grid .hg-value {
        font-family: 'Rationale', sans-serif !important; font-size: 26px; color: #0038ba; line-height: 1.1;
    }
    .hero-grid .hg-label { font-size: 12px; color: #8896a8; margin-top: 4px; font-weight: 600; }
    .gauge-row {
        display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
    }
    .gauge-card { text-align: center; padding: 8px 6px; }
    .gauge-card .gauge-chart { height: 150px; }
    .gauge-card .gauge-label {
        font-size: 12px; font-weight: 700; color: #4a586c; text-transform: uppercase; letter-spacing: .3px; margin-top: 2px;
    }
    .gauge-card .gauge-hint { font-size: 11px; color: #9aa6b5; margin-top: 2px; }
    .trend-avg {
        font-size: 14px; color: #6b7a90; margin: -6px 0 10px;
    }
    .trend-avg strong {
        font-family: 'Rationale', sans-serif !important; font-size: 28px; color: #0038ba; margin-left: 6px;
    }
    .mix-bars { margin-top: 8px; }
    .mix-bar-row { margin-bottom: 14px; }
    .mix-bar-head { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; color: #243447; margin-bottom: 5px; }
    .mix-bar-head .pct { color: #0038ba; }
    .mix-bar-track { height: 7px; background: #eef1f5; border-radius: 6px; overflow: hidden; }
    .mix-bar-fill { height: 100%; background: linear-gradient(90deg, #0038ba, #1e54d3); border-radius: 6px; width: 0; transition: width .5s ease; }
    .mix-bar-meta { display: flex; justify-content: space-between; font-size: 11px; color: #8896a8; margin-top: 4px; }
    .product-cards {
        display: flex; gap: 12px; overflow-x: auto; padding-bottom: 6px;
    }
    .product-card-an {
        min-width: 160px; max-width: 180px; flex: 0 0 160px;
        border: 1px solid #e8ecf1; border-radius: 10px; padding: 12px 14px;
        position: relative; background: #fff;
        transition: transform .2s ease, box-shadow .2s ease;
    }
    .product-card-an:hover {
        transform: translateY(-2px); box-shadow: 0 8px 18px rgba(0,0,0,.08);
    }
    .product-card-an:before {
        content: ''; position: absolute; left: 0; top: 12px; width: 3px; height: 28px; background: #0038ba; border-radius: 0 2px 2px 0;
    }
    .product-card-an .pc-name {
        font-size: 13px; font-weight: 700; color: #243447; height: 38px; overflow: hidden; line-height: 1.3; margin-bottom: 10px;
    }
    .product-card-an .pc-amount {
        font-family: 'Rationale', sans-serif !important; font-size: 22px; color: #0038ba; line-height: 1;
    }
    .product-card-an .pc-qty { font-size: 12px; color: #8896a8; margin-top: 4px; }
    .split-pill {
        display: flex; justify-content: space-between; background: #f4f6f9; border-radius: 8px;
        padding: 10px 12px; margin-bottom: 8px; font-size: 13px;
    }
    .split-pill span:last-child { font-family: 'Rationale', sans-serif !important; font-size: 18px; color: #152e4d; }
    .analytics-table { width: 100%; font-size: 13px; }
    .analytics-table th {
        color: #6b7a90; font-weight: 600; border-bottom: 1px solid #eef1f5; padding: 8px 6px;
    }
    .analytics-table td {
        padding: 8px 6px; border-bottom: 1px solid #f3f5f8; font-weight: 600; color: #243447;
    }
    .analytics-table td.num, .analytics-table th.num { text-align: right; font-family: 'Rationale', sans-serif !important; font-size: 16px; }
    @media (max-width: 991px) {
        .hero-grid { grid-template-columns: repeat(2, 1fr); }
        .hero-grid .hg-cell:nth-child(2n) { border-right: none; }
        .hero-grid .hg-cell:nth-child(-n+2) { border-bottom: 1px solid #eef1f5; }
        .gauge-row { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 575px) {
        .hero-sales .hero-amount { font-size: 32px; }
        .gauge-row { grid-template-columns: 1fr 1fr; }
    }
</style>

{{-- Same preloader as sales/add --}}
<div class="preloader" id="tblLoader">
    <div class="loading">
      <div class="bar bar1"></div>
      <div class="bar bar2"></div>
      <div class="bar bar3"></div>
      <div class="bar bar4"></div>
      <div class="bar bar5"></div>
      <div class="bar bar6"></div>
      <div class="bar bar7"></div>
      <div class="bar bar8"></div>
    </div>
  </div>

<div class="parent-div analytics-page" id="analyticsPage" style="display:none">
    <div class="analytics-toolbar">
        <div>
            <h2 class="_head01 mb-1" style="font-size:22px;">Monthly / Daily <span>Analytics</span></h2>
            <div class="analytics-meta">
                <span>Company:</span> <strong id="metaCompany">-</strong>
                &nbsp;·&nbsp;
                <span>User:</span> <strong id="metaUser">-</strong>
            </div>
        </div>
        <div class="d-flex flex-wrap align-items-center gap-2">
            <div class="btn-group analytics-modes" role="group">
                <button type="button" class="btn btn-outline-primary active" data-mode="daily">Daily</button>
                <button type="button" class="btn btn-outline-primary" data-mode="monthly">Monthly</button>
            </div>
            <div class="analytics-pickers">
                <div id="dailyPickerWrap">
                    <input type="date" id="analyticsDate" class="form-control" value="{{ date('Y-m-d') }}">
                </div>
                <div id="monthlyPickerWrap" style="display:none;">
                    <input type="month" id="analyticsMonth" class="form-control" value="{{ date('Y-m') }}">
                </div>
                <span class="analytics-meta" id="periodLabel"></span>
            </div>
        </div>
    </div>

    {{-- Hero Gross / Net Sales --}}
    <div class="an-section hero-sales">
        <h3 class="an-section-title">Net Sales</h3>
        <div>
            <span class="hero-amount" data-kpi="net_sales">0</span>
            <span class="hero-change" data-kpi-change="sales_change_pct"></span>
        </div>
        <div class="hero-secondary">
            <div class="hs-item">
                <div class="hs-label">Invoices</div>
                <div class="hs-value" data-kpi="invoice_count">0</div>
            </div>
            <div class="hs-item">
                <div class="hs-label">Total Units</div>
                <div class="hs-value" data-kpi="units_qty">0</div>
            </div>
            <div class="hs-item">
                <div class="hs-label">Gross Profit</div>
                <div class="hs-value" data-kpi="gross_profit">0</div>
            </div>
            <div class="hs-item">
                <div class="hs-label">AOV</div>
                <div class="hs-value" data-kpi="aov">0</div>
            </div>
        </div>
        <div class="hero-grid">
            <div class="hg-cell">
                <div class="hg-value" data-kpi="sale_returns">0</div>
                <div class="hg-label">Sale Returns</div>
            </div>
            <div class="hg-cell">
                <div class="hg-value" data-kpi="purchases">0</div>
                <div class="hg-label">Purchases</div>
            </div>
            <div class="hg-cell">
                <div class="hg-value" data-kpi="expense">0</div>
                <div class="hg-label">Expense</div>
            </div>
            <div class="hg-cell">
                <div class="hg-value" data-kpi="cash_in_hand">0</div>
                <div class="hg-label">Cash In Hand</div>
            </div>
            <div class="hg-cell">
                <div class="hg-value" data-kpi="cash_recoveries">0</div>
                <div class="hg-label">Cash Recoveries</div>
            </div>
            <div class="hg-cell">
                <div class="hg-value" data-split="cash_sales">0</div>
                <div class="hg-label">Cash Sales</div>
            </div>
            <div class="hg-cell">
                <div class="hg-value" data-split="credit_sales_received">0</div>
                <div class="hg-label">Credit Received</div>
            </div>
            <div class="hg-cell">
                <div class="hg-value" data-snap="receivables">0</div>
                <div class="hg-label">Receivables</div>
            </div>
        </div>
    </div>

    {{-- Key Performance Metrics (gauges) --}}
    <div class="an-section">
        <h3 class="an-section-title">Key Performance Metrics</h3>
        <div class="gauge-row" id="gaugeRow">
            <div class="gauge-card">
                <div class="gauge-chart" id="gaugeProfit"></div>
                <div class="gauge-label">Profit Margin</div>
                <div class="gauge-hint">Gross profit / net sales</div>
            </div>
            <div class="gauge-card">
                <div class="gauge-chart" id="gaugeCash"></div>
                <div class="gauge-label">Cash Sales Share</div>
                <div class="gauge-hint">Cash sales vs net sales</div>
            </div>
            <div class="gauge-card">
                <div class="gauge-chart" id="gaugeCollection"></div>
                <div class="gauge-label">Collection Strength</div>
                <div class="gauge-hint">Recoveries vs outstanding</div>
            </div>
            <div class="gauge-card">
                <div class="gauge-chart" id="gaugeReturns"></div>
                <div class="gauge-label">Return Control</div>
                <div class="gauge-hint">Lower returns = higher score</div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-8">
            <div class="an-section">
                <h3 class="an-section-title" id="trendTitle">Daily Sale Trend</h3>
                <div class="trend-avg">AVG. Sale/Day <strong data-kpi="avg_daily_sales">0</strong></div>
                <div id="trendChart" style="height:280px;"></div>
            </div>
            <div class="an-section">
                <h3 class="an-section-title">In vs Out</h3>
                <div class="trend-avg mb-2" style="font-size:12px;">Sales &amp; recoveries vs purchases, expense &amp; returns</div>
                <div id="flowChart" style="height:260px;"></div>
            </div>
            <div class="an-section">
                <h3 class="an-section-title">Top Customers</h3>
                <table class="analytics-table">
                    <thead><tr><th>Customer</th><th class="num">Invoices</th><th class="num">Amount</th></tr></thead>
                    <tbody id="topCustomersBody"><tr><td colspan="3">Loading…</td></tr></tbody>
                </table>
            </div>
        </div>
        <div class="col-lg-4">
            <div class="an-section">
                <h3 class="an-section-title">Top Categories</h3>
                <div id="mixBars" class="mix-bars"></div>
                <canvas id="mixChart" height="180" style="margin-top:12px;"></canvas>
            </div>
            <div class="an-section">
                <h3 class="an-section-title">Top Receivables</h3>
                <table class="analytics-table">
                    <thead><tr><th>Customer</th><th class="num">Balance</th></tr></thead>
                    <tbody id="topReceivablesBody"><tr><td colspan="2">Loading…</td></tr></tbody>
                </table>
            </div>
            <div class="an-section">
                <h3 class="an-section-title">Cash Split</h3>
                <div class="split-pill"><span>Cash Sales</span><span data-split="cash_sales">0</span></div>
                <div class="split-pill"><span>Credit Received</span><span data-split="credit_sales_received">0</span></div>
                <div class="split-pill"><span>Customer Receipts</span><span data-split="customer_receipts">0</span></div>
                <div class="split-pill"><span>Vendor Payments</span><span data-split="vendor_payments">0</span></div>
                <div class="split-pill"><span>Payables</span><span data-snap="payables">0</span></div>
            </div>
        </div>
    </div>

    <div class="an-section">
        <h3 class="an-section-title">Top Products</h3>
        <div class="product-cards" id="topProductCards"></div>
    </div>
</div>
@endsection

@push('js')
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/highcharts-more.js"></script>
<script src="https://code.highcharts.com/modules/solid-gauge.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
<script src="{{ asset('js/custom/analytics.js') }}?v=4"></script>
@endpush
