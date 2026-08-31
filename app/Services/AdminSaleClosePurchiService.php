<?php

namespace App\Services;

use stdClass;

class AdminSaleClosePurchiService
{
    /**
     * Build purchi layout from legacy controller values (100% parity with manual).
     * Does NOT overwrite $records — safe for purchi_use_dynamic = 1.
     */
    public function buildLayoutFromRecords(array $config, stdClass $records): array
    {
        $incoming = [];
        $outgoing = [];

        foreach ($config['special'] ?? [] as $slug => $line) {
            if (($line['type'] ?? '') === 'formula_sody_khareed') {
                continue;
            }
            if (($line['side'] ?? '') === 'internal') {
                continue;
            }
            $amount = (float) ($records->$slug ?? 0);
            $this->pushLayoutRow($incoming, $outgoing, array_merge($line, ['slug' => $slug]), $amount);
        }

        foreach ($config['product_lines'] ?? [] as $line) {
            if (($line['type'] ?? '') === 'formula_mutafirq_sody') {
                continue;
            }
            $slug = $line['slug'];
            $qty = !empty($line['show_qty']) ? ($records->{$slug . '_qty'} ?? null) : null;
            $this->pushLayoutRow($incoming, $outgoing, $line, (float) ($records->$slug ?? 0), $qty);
        }

        foreach ($config['pools'] ?? [] as $slug => $line) {
            $this->pushLayoutRow(
                $incoming,
                $outgoing,
                array_merge($line, ['slug' => $slug]),
                (float) ($records->$slug ?? 0)
            );
        }

        foreach ($config['customer_lines'] ?? [] as $line) {
            $slug = $line['slug'];
            $this->pushLayoutRow($incoming, $outgoing, $line, (float) ($records->$slug ?? 0));
        }

        foreach ($config['vendor_lines'] ?? [] as $line) {
            $slug = $line['slug'];
            $this->pushLayoutRow($incoming, $outgoing, $line, (float) ($records->$slug ?? 0));
        }

        if (isset($config['special']['sody_khareed'])) {
            $this->pushLayoutRow(
                $incoming,
                $outgoing,
                array_merge($config['special']['sody_khareed'], ['slug' => 'sody_khareed']),
                (float) ($records->sody_khareed ?? 0)
            );
        }

        foreach ($config['product_lines'] ?? [] as $line) {
            if (($line['type'] ?? '') === 'formula_mutafirq_sody') {
                $this->pushLayoutRow($incoming, $outgoing, $line, (float) ($records->mutafirq_sody ?? 0));
            }
        }

        $incoming = $this->sortLayout($incoming);
        $outgoing = $this->sortLayout($outgoing);

        $ttlIn = (float) ($records->ttl_in ?? 0);
        $ttlOut = (float) ($records->ttl_out ?? 0);
        $totalMeezan = $ttlIn - $ttlOut;

        foreach ($config['totals']['incoming_footer'] ?? [] as $row) {
            $incoming[] = $this->layoutRow($row, $ttlIn, true);
        }
        foreach ($config['totals']['outgoing_footer'] ?? [] as $row) {
            $val = (($row['formula'] ?? '') === 'ttl_in_minus_ttl_out')
                ? $totalMeezan
                : (float) ($records->{$row['slug']} ?? 0);
            $outgoing[] = $this->layoutRow($row, $val, !empty($row['highlight']));
        }

        return [
            'layout' => [
                'incoming' => $incoming,
                'outgoing' => $outgoing,
            ],
        ];
    }

    /**
     * Recompute purchi from config (for future JSON-driven IDs).
     * May differ from legacy until fully audited — prefer buildLayoutFromRecords for display.
     */
    public function apply(array $config, array $saleRecords, $customerPayment, $vendorPayment, stdClass $records): array
    {
        $customerPayment = collect($customerPayment);
        $vendorPayment = collect($vendorPayment);
        $sales = collect($saleRecords['sales'] ?? []);
        $saleReturns = collect($saleRecords['sale_returns'] ?? []);

        $values = [];
        $incoming = [];
        $outgoing = [];
        $ttlVendorDr = 0;

        foreach ($config['special'] ?? [] as $slug => $line) {
            if (($line['type'] ?? '') === 'formula_sody_khareed') {
                continue;
            }
            $values[$slug] = $this->resolveSpecial($line, $customerPayment, $vendorPayment, $values);
            if (($line['side'] ?? '') !== 'internal') {
                $this->pushLayoutRow(
                    $incoming,
                    $outgoing,
                    array_merge($line, ['slug' => $slug]),
                    $values[$slug]
                );
            }
        }

        foreach ($config['product_lines'] ?? [] as $line) {
            if (($line['type'] ?? '') === 'formula_mutafirq_sody') {
                continue;
            }
            $slug = $line['slug'];
            $companyIds = $line['company_ids'] ?? [];
            $amount = $sales->whereIn('company_id', $companyIds)->sum('sale_total_amount');
            if (!empty($line['subtract_returns'])) {
                $amount -= $saleReturns->whereIn('company_id', $companyIds)->sum('return_total_amount');
            }
            $values[$slug] = $amount;
            if (!empty($line['show_qty'])) {
                $qty = $sales->whereIn('company_id', $companyIds)->sum('qty');
                if (!empty($line['subtract_returns'])) {
                    $qty -= $saleReturns->whereIn('company_id', $companyIds)->sum('qty');
                }
                $values[$slug . '_qty'] = $qty;
            }
            $this->pushLayoutRow($incoming, $outgoing, $line, $values[$slug], $values[$slug . '_qty'] ?? null);
        }

        foreach ($config['pools'] ?? [] as $slug => $line) {
            $exclude = $line['exclude_customer_ids'] ?? [];
            $direction = $line['direction'] ?? 'cr';
            $values[$slug] = $direction === 'cr'
                ? $customerPayment->whereNotIn('customer_id', $exclude)->sum('cr')
                : $customerPayment->whereNotIn('customer_id', $exclude)->sum('dr');
            $this->pushLayoutRow($incoming, $outgoing, array_merge($line, ['slug' => $slug]), $values[$slug]);
        }

        foreach ($config['customer_lines'] ?? [] as $line) {
            $slug = $line['slug'];
            $direction = $line['direction'] ?? 'cr';
            $query = $customerPayment->where('customer_id', $line['customer_id']);
            if (!empty($line['trx_type'])) {
                $query = $query->where('trx_type', $line['trx_type']);
            }
            $values[$slug] = $direction === 'cr' ? $query->sum('cr') : $query->sum('dr');
            $this->pushLayoutRow($incoming, $outgoing, $line, $values[$slug]);
        }

        foreach ($config['vendor_lines'] ?? [] as $line) {
            $slug = $line['slug'];
            $direction = $line['direction'] ?? 'dr';
            $query = $vendorPayment->where('vendor_id', $line['vendor_id']);
            if (!empty($line['trx_type'])) {
                $query = $query->where('trx_type', $line['trx_type']);
            }
            $amount = $direction === 'cr' ? $query->sum('cr') : $query->sum('dr');
            $values[$slug] = $amount;
            if (!empty($line['in_vendor_total'])) {
                $ttlVendorDr += $amount;
            }
            $this->pushLayoutRow($incoming, $outgoing, $line, $amount);
        }

        $excludedVendors = $config['excluded_vendor_ids'] ?? [];
        $values['ttl_purchase_dr'] = $vendorPayment
            ->whereNotIn('vendor_id', $excludedVendors)
            ->where('trx_type', 3)
            ->sum('dr');

        $vendorCrExclude = $config['vendor_cr_exclude_ids'] ?? [];
        $values['ttl_purchase_cr'] = $vendorPayment
            ->whereNotIn('vendor_id', $vendorCrExclude)
            ->where('trx_type', 3)
            ->sum('cr');

        $receiveSlugs = $config['customer_receive_slugs'] ?? [];
        $banamSlugs = $config['customer_banam_slugs'] ?? [];
        $values['customer_receive'] = collect($receiveSlugs)->sum(fn ($s) => $values[$s] ?? 0);
        $values['customer_banam'] = collect($banamSlugs)->sum(fn ($s) => $values[$s] ?? 0);

        $categorizedSlugs = collect($config['product_lines'] ?? [])
            ->filter(fn ($l) => ($l['type'] ?? '') !== 'formula_mutafirq_sody' && !empty($l['categorized']))
            ->pluck('slug')
            ->all();
        $totalCategorized = collect($categorizedSlugs)->sum(fn ($s) => $values[$s] ?? 0);

        $ttlSale = $sales->sum('sale_total_amount');
        $ttlSale -= ($records->total_net_sale_returns ?? 0)
            + ($records->total_invoice_discount ?? 0)
            + ($records->total_product_discount ?? 0)
            + ($records->total_credit_sale_returns ?? 0);

        $values['mutafirq_sody'] = $ttlSale - $totalCategorized;
        foreach ($config['product_lines'] ?? [] as $line) {
            if (($line['type'] ?? '') === 'formula_mutafirq_sody') {
                $this->pushLayoutRow($incoming, $outgoing, $line, $values['mutafirq_sody']);
            }
        }

        $values['sody_khareed'] = ($values['ttl_purchase_dr'] ?? 0)
            - ($values['ttl_purchase_cr'] ?? 0)
            + ($values['open_khad'] ?? 0);

        if (isset($config['special']['sody_khareed'])) {
            $this->pushLayoutRow(
                $incoming,
                $outgoing,
                array_merge($config['special']['sody_khareed'], ['slug' => 'sody_khareed']),
                $values['sody_khareed']
            );
        }

        $values['ttl_in'] = ($values['ilyas_bakhtawar'] ?? 0)
            + $ttlSale
            + ($values['openning_balance'] ?? 0)
            + ($values['mutafirq_udhar_receive'] ?? 0)
            + ($values['customer_receive'] ?? 0)
            + ($values['ubl_m_waqas_jama'] ?? 0)
            + ($values['hbl_m_waqas_jama'] ?? 0)
            + ($values['karaya_dokan_receive'] ?? 0)
            + ($values['mcb_ka_jama'] ?? 0)
            + ($values['meezan_bank_jama'] ?? 0)
            + ($values['ubl_aftab_jama'] ?? 0)
            + ($values['abdul_shakoor_exchange_jama'] ?? 0);

        $values['ttl_out'] = $ttlVendorDr
            + ($values['sody_khareed'] ?? 0)
            + ($values['mutafariq_udhar_banam'] ?? 0)
            + ($values['expense'] ?? 0)
            + ($values['beej_khareed'] ?? 0)
            + ($values['customer_banam'] ?? 0)
            + ($values['karaya_dokan_banam'] ?? 0)
            + ($values['salries_banam'] ?? 0)
            + ($values['mcb_ka'] ?? 0)
            + ($values['meezan_bank_banam'] ?? 0)
            + ($values['ubl_aftab_banam'] ?? 0);

        $values['total_meezan'] = $values['ttl_in'] - $values['ttl_out'];

        foreach ($values as $slug => $amount) {
            $records->$slug = $amount;
        }
        // Blade class alias (legacy static purchi HTML)
        if (isset($values['habib_bank_abdul_shakoor'])) {
            $records->abdul_shakoor_habib_bank = $values['habib_bank_abdul_shakoor'];
        }

        $incoming = $this->sortLayout($incoming);
        $outgoing = $this->sortLayout($outgoing);

        foreach ($config['totals']['incoming_footer'] ?? [] as $row) {
            $incoming[] = $this->layoutRow($row, $values[$row['slug']] ?? 0, true);
        }
        foreach ($config['totals']['outgoing_footer'] ?? [] as $row) {
            $slug = $row['slug'];
            $val = (($row['formula'] ?? '') === 'ttl_in_minus_ttl_out')
                ? $values['total_meezan']
                : ($values[$slug] ?? 0);
            $outgoing[] = $this->layoutRow($row, $val, !empty($row['highlight']));
        }

        return [
            'values' => $values,
            'layout' => [
                'incoming' => $incoming,
                'outgoing' => $outgoing,
            ],
        ];
    }

    protected function resolveSpecial(array $line, $customerPayment, $vendorPayment, array $values): float
    {
        $type = $line['type'] ?? '';

        if ($type === 'customer_ledger') {
            $query = $customerPayment->where('customer_id', $line['customer_id']);
            if (!empty($line['trx_type'])) {
                $query = $query->where('trx_type', $line['trx_type']);
            }
            return ($line['direction'] ?? 'cr') === 'cr' ? $query->sum('cr') : $query->sum('dr');
        }

        if ($type === 'vendor_ledger') {
            $query = $vendorPayment->where('vendor_id', $line['vendor_id']);
            if (!empty($line['trx_type'])) {
                $query = $query->where('trx_type', $line['trx_type']);
            }
            return ($line['direction'] ?? 'dr') === 'cr' ? $query->sum('cr') : $query->sum('dr');
        }

        return 0;
    }

    protected function pushLayoutRow(array &$incoming, array &$outgoing, array $line, float $amount, $qty = null): void
    {
        $side = $line['side'] ?? 'incoming';
        if ($side === 'internal') {
            return;
        }
        $row = $this->layoutRow($line, $amount, false, $qty);
        if ($side === 'outgoing') {
            $outgoing[] = $row;
        } else {
            $incoming[] = $row;
        }
    }

    protected function layoutRow(array $line, float $amount, bool $highlight = false, $qty = null): array
    {
        $row = [
            'slug' => $line['slug'],
            'label' => $line['label'] ?? $line['slug'],
            'amount' => $amount,
            'highlight' => $highlight,
        ];
        if ($qty !== null) {
            $row['qty'] = $qty;
        }
        if (isset($line['sort'])) {
            $row['sort'] = $line['sort'];
        }
        return $row;
    }

    protected function sortLayout(array $rows): array
    {
        usort($rows, function ($a, $b) {
            return ($a['sort'] ?? 999) <=> ($b['sort'] ?? 999);
        });
        return $rows;
    }
}
