<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\PurchaseInvoice;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        return view('dashboard');
    }

    /**
     * JSON summary for Daily / Monthly analytics dashboard.
     * GET /analytics/summary?mode=daily&date=YYYY-MM-DD
     * GET /analytics/summary?mode=monthly&month=YYYY-MM
     */
    public function summary(Request $request)
    {
        $mode = strtolower($request->get('mode', 'daily')) === 'monthly' ? 'monthly' : 'daily';

        if ($mode === 'monthly') {
            $month = $request->get('month', date('Y-m'));
            try {
                $cursor = Carbon::createFromFormat('Y-m', $month)->startOfMonth();
            } catch (\Throwable $e) {
                $cursor = Carbon::now()->startOfMonth();
                $month = $cursor->format('Y-m');
            }
            $start = $cursor->copy()->startOfMonth()->toDateString();
            $end = $cursor->copy()->endOfMonth()->toDateString();
            $prevStart = $cursor->copy()->subMonth()->startOfMonth()->toDateString();
            $prevEnd = $cursor->copy()->subMonth()->endOfMonth()->toDateString();
            $label = $cursor->format('M Y');
        } else {
            $date = $request->get('date', date('Y-m-d'));
            try {
                $cursor = Carbon::parse($date);
            } catch (\Throwable $e) {
                $cursor = Carbon::today();
            }
            $start = $end = $cursor->toDateString();
            $prevStart = $prevEnd = $cursor->copy()->subDay()->toDateString();
            $month = $cursor->format('Y-m');
            $label = $cursor->format('d M Y');
        }

        $current = $this->buildPeriodMetrics($start, $end, $mode);
        $previous = $this->buildPeriodMetrics($prevStart, $prevEnd, $mode);

        $salesChange = $this->percentChange($previous['kpis']['net_sales'], $current['kpis']['net_sales']);
        $profitChange = $this->percentChange($previous['kpis']['gross_profit'], $current['kpis']['gross_profit']);

        $daysInPeriod = max(1, Carbon::parse($start)->diffInDays(Carbon::parse($end)) + 1);
        $invoiceCount = (int) $current['kpis']['invoice_count'];
        $netSales = (float) $current['kpis']['net_sales'];
        $grossProfit = (float) $current['kpis']['gross_profit'];
        $saleReturns = (float) $current['kpis']['sale_returns'];
        $expense = (float) $current['kpis']['expense'];
        $cashSales = (float) $current['split']['cash_sales'];
        $cashRecoveries = (float) $current['kpis']['cash_recoveries'];
        $snapshot = $this->balanceSnapshot();
        $receivables = (float) $snapshot['receivables'];

        $profitMargin = $netSales > 0 ? round(($grossProfit / $netSales) * 100, 1) : 0.0;
        $cashShare = $netSales > 0 ? round(($cashSales / $netSales) * 100, 1) : 0.0;
        $returnRate = ($netSales + $saleReturns) > 0
            ? round(($saleReturns / ($netSales + $saleReturns)) * 100, 1)
            : 0.0;
        $returnControl = max(0, min(100, round(100 - $returnRate, 1)));
        $collectionStrength = ($cashRecoveries + $receivables) > 0
            ? round(($cashRecoveries / ($cashRecoveries + $receivables)) * 100, 1)
            : ($cashRecoveries > 0 ? 100.0 : 0.0);
        $expenseLoad = $netSales > 0 ? round(($expense / $netSales) * 100, 1) : 0.0;
        $expenseControl = max(0, min(100, round(100 - min(100, $expenseLoad), 1)));

        return response()->json([
            'meta' => [
                'mode' => $mode,
                'start_date' => $start,
                'end_date' => $end,
                'month' => $month,
                'label' => $label,
                'user_name' => optional(auth()->user())->name,
                'company_name' => optional(Organization::query()->first())->name,
            ],
            'kpis' => array_merge($current['kpis'], [
                'avg_daily_sales' => round($netSales / $daysInPeriod, 2),
                'aov' => $invoiceCount > 0 ? round($netSales / $invoiceCount, 2) : 0,
                'sales_change_pct' => $salesChange,
                'profit_change_pct' => $profitChange,
                'units_qty' => (float) ($current['kpis']['units_qty'] ?? 0),
            ]),
            'performance' => [
                [
                    'key' => 'profit_margin',
                    'label' => 'Profit Margin',
                    'value' => max(0, min(100, $profitMargin)),
                    'display' => $profitMargin,
                    'hint' => 'Gross profit / net sales',
                ],
                [
                    'key' => 'cash_share',
                    'label' => 'Cash Sales Share',
                    'value' => max(0, min(100, $cashShare)),
                    'display' => $cashShare,
                    'hint' => 'Cash sales vs net sales',
                ],
                [
                    'key' => 'collection',
                    'label' => 'Collection Strength',
                    'value' => max(0, min(100, $collectionStrength)),
                    'display' => $collectionStrength,
                    'hint' => 'Recoveries vs outstanding',
                ],
                [
                    'key' => 'return_control',
                    'label' => 'Return Control',
                    'value' => $returnControl,
                    'display' => $returnControl,
                    'hint' => 'Lower returns = higher score',
                ],
            ],
            'split' => $current['split'],
            'trend' => $this->buildTrend($start, $end, $mode),
            'mix' => $this->buildCompanyMix($start, $end),
            'top_products' => $this->buildTopProducts($start, $end, $mode === 'monthly' ? 10 : 5),
            'top_customers' => $this->buildTopCustomers($start, $end, $mode === 'monthly' ? 10 : 5),
            'top_receivables' => $this->topReceivables(5),
            'snapshot' => $snapshot,
        ]);
    }

    protected function dateRequest(string $start, string $end): object
    {
        return (object) [
            'start_date' => $start,
            'end_date' => $end,
        ];
    }

    protected function buildPeriodMetrics(string $start, string $end, string $mode): array
    {
        $req = $this->dateRequest($start, $end);
        $saleRecords = SaleReportRecords($req, $start, 1);

        $sales = collect($saleRecords['sales'] ?? []);
        $returns = collect($saleRecords['sale_returns'] ?? []);

        $totalSales = (float) $sales->sum('sale_total_amount');
        $invoiceDiscount = (float) $sales->unique('invoice_no')->sum('invoice_discount');
        $productDiscount = (float) $sales->sum('product_discount');
        $serviceCharges = (float) $sales->unique('invoice_no')->sum('service_charges');
        $saleReturnTotal = (float) $returns->unique('invoice_no')->sum('total_invoice_amount');
        $netSales = ($totalSales + $serviceCharges) - ($productDiscount + $invoiceDiscount);

        $cashSales = (float) $sales->where('invoice_type', 1)->sum('sale_total_amount');
        $creditSalesReceived = (float) $sales->where('invoice_type', 2)->unique('invoice_no')->sum('paid_amount');
        $netSaleReturnAmount = (float) $returns->where('invoice_type', 1)->unique('invoice_no')->sum('total_invoice_amount');
        $creditSaleReturnPaid = (float) $returns->where('invoice_type', 2)->unique('invoice_no')->sum('paid_amount');

        $tenantId = current_tenant_id();
        $expenseId = sys_customer_id('EXPENSE') ?: 5;
        $openingId = sys_customer_id('OPENING_BALANCE') ?: 170;
        $counterId = sys_customer_id('COUNTER_SALE') ?: 8;
        $excludeIds = array_values(array_filter([$expenseId, $counterId, 97, $openingId]));

        $vendorLdgr = DB::table('vendor_ledger')
            ->selectRaw('customer_id as vendor_id, IFNULL(cr,0) as cr, IFNULL(dr,0) as dr, trx_type')
            ->when($tenantId, function ($q, $t) {
                return $q->where('tenant_id', $t);
            })
            ->whereRaw('DATE(created_at) BETWEEN ? AND ? AND trx_type = 3 AND is_deleted = 0', [$start, $end])
            ->get();

        $customerLdgr = DB::table('customer_ledger')
            ->selectRaw('customer_id, IFNULL(cr,0) as cr, IFNULL(dr,0) as dr, trx_type')
            ->when($tenantId, function ($q, $t) {
                return $q->where('tenant_id', $t);
            })
            ->whereRaw('DATE(created_at) BETWEEN ? AND ?', [$start, $end])
            ->get();

        $prPaid = (float) collect($saleRecords['pr_paid_amount'] ?? [])->sum('paid_amount');
        $prInvc = (float) collect($saleRecords['pr_invc_amount'] ?? [])->sum('paid_amount');
        $netSaleDiscount = (float) $sales->unique('invoice_no')->where('customer_id', $counterId)->sum('invoice_discount');

        $customerPayment = (float) collect($customerLdgr)->whereNotIn('customer_id', $excludeIds)->where('trx_type', 3)->sum('dr');
        $expense = (float) collect($customerLdgr)->where('customer_id', $expenseId)->where('trx_type', 3)->sum('dr');
        $vendorPayment = (float) collect($vendorLdgr)->sum('dr');
        $openingBalance = (float) collect($customerLdgr)->where('customer_id', $openingId)->where('trx_type', 3)->sum('cr');
        $cashRecovery = (float) collect($customerLdgr)->whereNotIn('customer_id', $excludeIds)->where('trx_type', 3)->sum('cr');
        $vendorCashRecovery = (float) collect($vendorLdgr)->where('vendor_id', '!=', 7)->where('trx_type', 3)->sum('cr');

        $ttlCashRecovery = $cashRecovery + $vendorCashRecovery + $creditSalesReceived + $openingBalance;
        $ttlPayments = $vendorPayment + $customerPayment + $creditSaleReturnPaid + $prPaid + $prInvc + $expense;
        $cashInHand = ($cashSales + $ttlCashRecovery) - $netSaleDiscount - $ttlPayments - $netSaleReturnAmount;

        $purchasePaid = (float) PurchaseInvoice::query()
            ->when($tenantId, function ($q, $t) {
                return $q->where('tenant_id', $t);
            })
            ->whereBetween('date', [$start, $end])
            ->sum('paid_amount');

        $grossProfit = $this->grossProfit($start, $end);
        $unitsQty = (float) $sales->sum('qty');

        return [
            'kpis' => [
                'net_sales' => round($netSales, 2),
                'sale_returns' => round($saleReturnTotal, 2),
                'purchases' => round($purchasePaid, 2),
                'expense' => round($expense, 2),
                'cash_recoveries' => round($ttlCashRecovery, 2),
                'cash_in_hand' => round($cashInHand, 2),
                'gross_profit' => round($grossProfit, 2),
                'invoice_count' => $sales->unique('invoice_no')->count(),
                'units_qty' => round($unitsQty, 2),
            ],
            'split' => [
                'cash_sales' => round($cashSales, 2),
                'credit_sales_received' => round($creditSalesReceived, 2),
                'customer_receipts' => round($cashRecovery, 2),
                'vendor_payments' => round($vendorPayment, 2),
            ],
        ];
    }

    protected function grossProfit(string $start, string $end): float
    {
        $tenantSql = tenant_and('ps');
        $row = DB::selectOne("
            SELECT ROUND(SUM(
                (IFNULL(ps.sale_price, 0) - IFNULL(ps.product_discount, 0) - IFNULL(ps.purchase_price, 0))
                * IFNULL(ps.qty, 0)
            ), 2) AS profit
            FROM products_sales ps
            WHERE ps.deleted_at IS NULL
              $tenantSql
              AND DATE(ps.created_at) BETWEEN ? AND ?
        ", [$start, $end]);

        return (float) ($row->profit ?? 0);
    }

    protected function buildTrend(string $start, string $end, string $mode): array
    {
        $tenantSql = tenant_and('ps');

        if ($mode === 'daily') {
            $rows = DB::select("
                SELECT HOUR(ps.created_at) AS bucket,
                       ROUND(SUM(IFNULL(ps.sale_total_amount, 0)), 2) AS amount
                FROM products_sales ps
                WHERE ps.deleted_at IS NULL
                  $tenantSql
                  AND DATE(ps.created_at) = ?
                GROUP BY HOUR(ps.created_at)
                ORDER BY bucket
            ", [$start]);

            $map = collect($rows)->keyBy('bucket');
            $points = [];
            for ($h = 0; $h < 24; $h++) {
                $points[] = [
                    'label' => sprintf('%02d:00', $h),
                    'value' => (float) ($map[$h]->amount ?? 0),
                ];
            }

            return $points;
        }

        $rows = DB::select("
            SELECT DATE(ps.created_at) AS bucket,
                   ROUND(SUM(IFNULL(ps.sale_total_amount, 0)), 2) AS amount
            FROM products_sales ps
            WHERE ps.deleted_at IS NULL
              $tenantSql
              AND DATE(ps.created_at) BETWEEN ? AND ?
            GROUP BY DATE(ps.created_at)
            ORDER BY bucket
        ", [$start, $end]);

        $map = collect($rows)->keyBy('bucket');
        $points = [];
        $cursor = Carbon::parse($start);
        $last = Carbon::parse($end);
        while ($cursor->lte($last)) {
            $key = $cursor->toDateString();
            $points[] = [
                'label' => $cursor->format('d M'),
                'value' => (float) ($map[$key]->amount ?? 0),
            ];
            $cursor->addDay();
        }

        return $points;
    }

    protected function buildCompanyMix(string $start, string $end): array
    {
        $tenantSql = tenant_and('ps');
        $rows = DB::select("
            SELECT IFNULL(co.company_name, 'Other') AS name,
                   ROUND(SUM(IFNULL(ps.sale_total_amount, 0)), 2) AS amount
            FROM products_sales ps
            LEFT JOIN companies co ON co.id = ps.company_id
            WHERE ps.deleted_at IS NULL
              $tenantSql
              AND DATE(ps.created_at) BETWEEN ? AND ?
            GROUP BY co.company_name
            ORDER BY amount DESC
            LIMIT 8
        ", [$start, $end]);

        $total = array_sum(array_map(function ($r) {
            return (float) $r->amount;
        }, $rows));

        return array_map(function ($r) use ($total) {
            $amount = (float) $r->amount;
            return [
                'name' => $r->name,
                'value' => $amount,
                'pct' => $total > 0 ? round(($amount / $total) * 100, 2) : 0,
            ];
        }, $rows);
    }

    protected function buildTopProducts(string $start, string $end, int $limit = 5): array
    {
        $tenantSql = tenant_and('ps');
        $rows = DB::select("
            SELECT IFNULL(pr.product_name, 'Unknown') AS name,
                   ROUND(SUM(IFNULL(ps.qty, 0)), 2) AS qty,
                   ROUND(SUM(IFNULL(ps.sale_total_amount, 0)), 2) AS amount
            FROM products_sales ps
            LEFT JOIN products pr ON pr.id = ps.product_id
            WHERE ps.deleted_at IS NULL
              $tenantSql
              AND DATE(ps.created_at) BETWEEN ? AND ?
            GROUP BY ps.product_id, pr.product_name
            ORDER BY amount DESC
            LIMIT {$limit}
        ", [$start, $end]);

        return array_map(function ($r) {
            return [
                'name' => $r->name,
                'qty' => (float) $r->qty,
                'amount' => (float) $r->amount,
            ];
        }, $rows);
    }

    protected function buildTopCustomers(string $start, string $end, int $limit = 5): array
    {
        $tenantSql = tenant_and('ps');
        $rows = DB::select("
            SELECT IFNULL(c.customer_name, 'Unknown') AS name,
                   ROUND(SUM(IFNULL(ps.sale_total_amount, 0)), 2) AS amount,
                   COUNT(DISTINCT si.invoice_no) AS invoices
            FROM products_sales ps
            LEFT JOIN sale_invoices si ON si.id = ps.sale_invoice_id
            LEFT JOIN customers c ON c.id = si.customer_id
            WHERE ps.deleted_at IS NULL
              $tenantSql
              AND DATE(ps.created_at) BETWEEN ? AND ?
            GROUP BY si.customer_id, c.customer_name
            ORDER BY amount DESC
            LIMIT {$limit}
        ", [$start, $end]);

        return array_map(function ($r) {
            return [
                'name' => $r->name,
                'amount' => (float) $r->amount,
                'invoices' => (int) $r->invoices,
            ];
        }, $rows);
    }

    protected function topReceivables(int $limit = 5)
    {
        $expenseId = sys_customer_id('EXPENSE') ?: 5;

        return DB::table('customers')
            ->selectRaw('id, customer_name, balance')
            ->when(current_tenant_id(), function ($q, $t) {
                return $q->where('tenant_id', $t);
            })
            ->where('customer_type', 2)
            ->whereNotIn('id', [$expenseId, 49, 356])
            ->where('balance', '>', 0)
            ->orderByDesc('balance')
            ->limit($limit)
            ->get();
    }

    protected function balanceSnapshot(): array
    {
        $tenantId = current_tenant_id();
        $expenseId = sys_customer_id('EXPENSE') ?: 5;

        $receivables = (float) DB::table('customers')
            ->when($tenantId, fn ($q, $t) => $q->where('tenant_id', $t))
            ->where('customer_type', 2)
            ->whereNotIn('id', [$expenseId])
            ->where('balance', '>', 0)
            ->sum('balance');

        $payables = (float) DB::table('customers')
            ->when($tenantId, fn ($q, $t) => $q->where('tenant_id', $t))
            ->where('customer_type', 1)
            ->where('balance', '>', 0)
            ->sum('balance');

        return [
            'receivables' => round($receivables, 2),
            'payables' => round($payables, 2),
        ];
    }

    protected function percentChange($previous, $current): ?float
    {
        $previous = (float) $previous;
        $current = (float) $current;
        if (abs($previous) < 0.00001) {
            return $current > 0 ? 100.0 : 0.0;
        }

        return round((($current - $previous) / abs($previous)) * 100, 1);
    }
}
