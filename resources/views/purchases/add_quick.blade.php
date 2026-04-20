@extends('layouts.app')

@section('content')
<style>
  .qp-card .form-control { height: 38px; font-weight: 700; }
  .qp-card label { font-size: 13px; font-weight: 800; margin-bottom: 6px; }
  .qp-title { font-size: 22px; font-weight: 900; letter-spacing: .5px; }
  .qp-sub { color: #6b7280; font-weight: 700; font-size: 12px; }
  .qp-table th { font-size: 12px; text-transform: uppercase; letter-spacing: .6px; }
  .qp-table td { vertical-align: middle; font-weight: 700; }
  .qp-amount { font-family: 'Rationale', sans-serif !important; font-size: 26px; }
  .qp-box { background: #152e4d; color: #fff; border-radius: 10px; }
  .qp-box .form-control, .qp-box select, .qp-box textarea { background: #fff; color:#111; border: 0; }
  .qp-box textarea { width: 100%; padding: 10px; border-radius: 8px; min-height: 90px; }
  .qp-actions { background: #f6f6f6; padding: 10px; border-radius: 10px; }
</style>

<div class="header">
  <div class="header-body">
    <div class="row">
      <div class="col">
        <h6 class="header-pretitle">Overview</h6>
        <h1 class="header-title">
          <span class="qp-title">Quick Purchase</span>
          <span class="qp-sub d-block">Add product inline (mobile shop mode)</span>
        </h1>
      </div>
    </div>
  </div>
</div>

<div class="container-fluid">
  <form id="form">
    @csrf
    <input type="hidden" name="hidden_invoice_id" id="hidden_invoice_id" value="">
    <input type="hidden" name="invoice_no" value="{{ $invoice_no }}">
    <input type="hidden" name="previous_receivable" id="previous_receivable" value="0">
    <input type="hidden" name="service_charges" class="service_charges_input" value="0">
    <input type="hidden" name="invoice_discount" id="invoice_discount" value="0">
    <input type="hidden" name="product_net_total" class="product_net_total" value="0">
    <input type="hidden" name="cash_return" class="cash_return_input" value="0">

    <div class="row">
      <div class="col-md-4">
        <div class="card p-20 qp-card qp-box">
          <h2 class="title pt-0 mb-2 border-bottom">Invoice <span>Details</span></h2>

          <div class="mb-3">
            <label>Invoice Type</label>
            <select class="form-control" name="invoice_type" id="invoice_type">
              <option value="1">Net Purchase</option>
              <option value="2">Add To Ledger</option>
            </select>
          </div>

          <div class="mb-3">
            <label>Invoice #</label>
            <input type="text" class="form-control" value="{{ $invoice_first_part }}" readonly>
          </div>

          <div class="mb-3">
            <label>Date</label>
            <input type="date" name="invoice_date" id="invoice_date" class="form-control" value="{{ $current_date }}">
          </div>

          <div class="mb-3">
            <label>Select Vendor</label>
            <select class="form-control" name="customer_id" id="customer_id">
              <option value="">Select Vendor</option>
            </select>
          </div>

          <div class="mb-3">
            <label>Description</label>
            <textarea name="description" id="description" placeholder="Optional remarks..."></textarea>
          </div>

          <div class="row mt-2">
            <div class="col-6">
              <div class="qp-sub">Net Total</div>
              <div class="qp-amount text-warning"><span class="net_total_text">0</span></div>
            </div>
            <div class="col-6">
              <div class="qp-sub">Cash Paid</div>
              <input type="number" class="form-control amount_received" name="amount_received" id="amount_received" value="0" min="0">
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <div class="card p-20 qp-card">
          <div class="d-flex align-items-center justify-content-between">
            <h2 class="title font22 PT-10 mb-10">Purchase <span>Items</span></h2>
            <a href="{{ route('stock-add') }}" class="btn btn-cancel">Old Screen</a>
          </div>

          <div class="row g-2">
            <div class="col-md-4">
              <label>Company</label>
              <select class="form-control" id="company_id">
                <option value="">Select Company</option>
              </select>
            </div>
            <div class="col-md-8">
              <label>Product Name</label>
              <input type="text" class="form-control" id="product_name" placeholder="e.g. iPhone 13">
            </div>

            <div class="col-md-4">
              <label>Variant (optional)</label>
              <input type="text" class="form-control" id="variant" placeholder="Black / 128GB">
            </div>
            <div class="col-md-4">
              <label>IMEI/Barcode (optional)</label>
              <input type="text" class="form-control" id="barcode" placeholder="IMEI or barcode">
            </div>
            <div class="col-md-4">
              <label>Qty</label>
              <input type="number" class="form-control" id="qty" min="0.01" step="0.01" value="1">
            </div>

            <div class="col-md-4">
              <label>Purchase Price</label>
              <input type="number" class="form-control" id="purchase_price" min="0" step="0.01" placeholder="0">
            </div>
            <div class="col-md-4">
              <label>Sale Price</label>
              <input type="number" class="form-control" id="sale_price" min="0" step="0.01" placeholder="0">
            </div>
            <div class="col-md-4">
              <label>Discount</label>
              <input type="number" class="form-control" id="discount" min="0" step="0.01" value="0">
            </div>

            <div class="col-12 text-right mt-2">
              <button type="button" class="btn btn-primary" id="add_item">Add Item</button>
            </div>
          </div>

          <div class="table-responsive mt-3">
            <table class="table table-hover qp-table" id="items_table">
              <thead>
                <tr>
                  <th style="width:70px;">ID</th>
                  <th>Product</th>
                  <th style="width:100px;">Qty</th>
                  <th style="width:140px;">P.Price</th>
                  <th style="width:140px;">S.Price</th>
                  <th style="width:120px;">Disc</th>
                  <th style="width:140px;">Amount</th>
                  <th style="width:90px;">Action</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>

          <div class="qp-actions mt-3 text-right">
            <button type="button" id="save" class="btn btn-primary mr-2">Save</button>
            <button type="button" id="print" class="btn btn-primary mr-2">Save & Print</button>
            <a href="{{ route('purchases') }}" class="btn btn-cancel">Cancel</a>
          </div>
        </div>
      </div>
    </div>
  </form>
</div>
@endsection

@push('js')
<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
<script src="{{ asset('js/custom/purchase_quick.js') }}?v={{ time() }}"></script>
@endpush

