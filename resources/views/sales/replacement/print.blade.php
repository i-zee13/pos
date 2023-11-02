<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>{{$invoice->customer_name}} {{date('d-m-Y',strtotime($invoice->date))}} {{request()->segment(1) == 'print-replacement-invoice' ? 'Return' : 'Sale'}} Invoice</title>
    <style>
        @media print {
            .page-break {
                display: block;
                page-break-before: always;
            }
        }
        #invoice-POS .bot-3-table .body-description-tr {
            border-bottom: 1px solid #444444;
            border-bottom-style: dashed;
            color: #000000;
        }

        #invoice-POS .bot-3-table .body-description-tr .tableitem {
            text-transform: uppercase;
            width: 30mm;
        }

        #invoice-POS .bot-3-table .body-description-tr .other-des-td {
            vertical-align: text-top;
        }
        body {
            margin: 0;
            padding: 0;
        }

        #invoice-POS {
            /* box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5); */
            padding: 0;
            margin: 0;
            /* width: 74mm; */
            /* height: 83mm; */
            background: #FFF;
            font-family: Tahoma, "Trebuchet MS", sans-serif;
        }

        #invoice-POS ::selection {
            background: #f31544;
            color: #FFF;
        }

        #invoice-POS ::moz-selection {
            background: #f31544;
            color: #FFF;
        }

        #invoice-POS h1 {
            font-size: 1.5em;
            color: #222;
        }

        #invoice-POS h2 {
            font-size: .9em;
        }

        #invoice-POS h3 {
            font-size: 1.2em;
            font-weight: 300;
            line-height: 2em;
        }

        #invoice-POS p {
            font-size: 12px;
            color: rgb(0, 0, 0);
            line-height: 0.5em;
        }

        #invoice-POS #top {
            /* Targets all id with 'col-' */
            border-bottom: 1px solid black;
            width: 74mm;
        }

        #invoice-POS #mid .info {
            width: 76mm;
            background-color: black;
            color: white;
            text-align: center;
            padding: 0.3em;
            margin-bottom: 0.4000em;
        }

        #invoice-POS .bot-1-table,
        #invoice-POS .bot-2-table {
            width: 74mm;
            font-size: 12px;
            margin-bottom: 0.2em;
        }

        /* #invoice-POS .   bot-1-table .bot-1-table-td{
            width: 30px !important;
        } */
        #invoice-POS .info {
            display: block;
            margin-left: 0;
        }

        #invoice-POS .title {
            float: right;
        }

        #invoice-POS .title p {
            text-align: right;
        }

        #invoice-POS table {
            width: 74mm;
            border-collapse: collapse;
            font-size: 12px;
        }

        #invoice-POS .bot-3-table .tabletitle {
            font-size: 11.5px;
            border-top: 1.5px solid black;
            border-bottom: 1.5px solid black;
            text-align: left;
        }

        #invoice-POS .bot-3-table .body-description-tr {
            border-bottom: 2px solid black;
            border-bottom-style: dashed;
            color: #000000;
        }

        #invoice-POS .bot-3-table .body-description-tr .tableitem {
            text-transform: uppercase;
            width: 30mm;
        }

        #invoice-POS .bot-3-table .body-description-tr .other-des-td {
            vertical-align: text-top;
        }

        #invoice-POS .bot-4-table .net-total {
            font-weight: bolder;
            width: 38mm;
            font-size: 12px;
            border-bottom: 1.5px solid black;
        }

        #invoice-POS .bot-5-table {
            margin-top: 2mm;
            font-weight: bolder;
            font-size: 12px;
            text-align: center;
        }

        #invoice-POS .bot-5-table td {
            text-align: left;
        }

        #invoice-POS .bot-5-table .payable-heading {
            text-align: right;
        }

        #invoice-POS .footer {
            border-top: 1px solid black;
            margin-top: 3mm;
            width: 76mm;
        }

        #invoice-POS .footer tr {
            border-bottom: 1px solid black;
        }

        #invoice-POS .footer-copyright {
            width: 76mm;
        }

        #invoice-POS .footer-copyright .copyright {
            font-size: 10px;
            color: #232323;
        }
    </style>
</head>

<body translate="no" onload="javascript:window.print()">
    <div id="invoice-POS">
        <center id="top">
            <div class="info">
                <p>SHAMA STORE TOUNSA MOR CHOWK KOT ADDU.</p>
                <p>Phone # 03456873232 03326873232</p>
            </div><!--End Info-->
        </center><!--End InvoiceTop-->
        <div id="mid">
            <div class="info">
               Replacement Invoice
            </div>
        </div><!--End Invoice Mid-->
        <div id="bot">
            <table class="bot-1-table">
                <tr>
                    @php
                    $parts = explode('-',$invoice->invoice_no);
                    $invoice_first_part = $parts[0];
                    @endphp
                    <td class="bot-1-table-td">Bill No: <b>{{$invoice_first_part}}</b></td>
                    <td class="bot-1-table-td">Date: {{date('d-m-Y',strtotime($invoice->date))}}</td>
                    <td class="bot-1-table-td">Time: {{ date('h:i A', strtotime($invoice->created_at)) }}</td>
                </tr>
            </table>
            <table class="bot-2-table">
                <tr>
                    <td>Customer: <span style="text-transform:capitalize">{{$invoice->customer_name}}</span></td>
                </tr>
            </table>
            <style>
                /* Style for IN Table */
                .in-table-title {
                    background-color: #33cc33;
                    /* Green background */
                    color: white;
                    /* White text */
                    font-weight: bold;
                    /* Bold text */
                    text-align: center;
                    /* Centered text */
                }

                /* Style for OUT Table */
                .out-table-title {
                    background-color: #ff6666;
                    /* Red background */
                    color: white;
                    /* White text */
                    font-weight: bold;
                    /* Bold text */
                    text-align: center;
                    /* Centered text */
                }

                .bot-3-table {
                    width: 100%;
                    /* Adjust the width as needed */
                    border-collapse: collapse;
                    margin-bottom: 20px;
                    /* Add some spacing between tables */
                }

                .bot-3-table td,
                .bot-3-table th {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: left;
                }
            </style>

            @if (count($products) > 0)
            <!-- IN Table -->
            <table class="bot-3-table">
                <tr class="tabletitle">
                    <th></th>
                    <th>Product Name</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Disc</th>
                    <th>Total</th>
                </tr>
                <tr class="in-table-title"> 
                    <th colspan="6"  style=" background-color: black;color: white;">IN</th>
                </tr @foreach ($products as $key=> $item)
                @if ($item->product_type == 1)
                <tr class="body-description-tr">
                    <td class="other-des-td">{{ $key + 1 }}</td>
                    <td class="tableitem">{{ $item->product_name }}</td>
                    <td class="other-des-td">{{ $item->qty }}</td>
                    <td class="other-des-td">{{ $item->sale_price }}</td>
                    <td class="other-des-td">{{ $item->product_discount }}</td>
                    <td class="other-des-td">{{ $item->sale_total_amount }}</td>
                </tr>
                @endif
                @endforeach
            </table>

            <!-- OUT Table -->
            <table class="bot-3-table">
                <tr class="out-table-title">
                    <th colspan="6"  style=" background-color: black;color: white;">OUT</th>
                </tr>
                @foreach ($products as $key => $item)
                @if ($item->product_type == 2)
                <tr class="body-description-tr">
                    <td class="other-des-td">{{ $key + 1 }}</td>
                    <td class="tableitem">{{ $item->product_name }}</td>
                    <td class="other-des-td">{{ $item->qty }}</td>
                    <td class="other-des-td">{{ $item->sale_price }}</td>
                    <td class="other-des-td">{{ $item->product_discount }}</td>
                    <td class="other-des-td">{{ $item->sale_total_amount }}</td>
                </tr>
                @endif
                @endforeach
            </table>
            @endif


            <table class="bot-5-table">
                <tr>
                    <td class="payable-heading">Return Total :</td>
                    <td>{{number_format($invoice->product_return_total)}}</td>
                </tr>
                <tr>
                    <td class="payable-heading">Sale Total :</td>
                    <td>{{number_format($invoice->product_net_total)}}</td>
                </tr>
                <tr>
                    <td class="payable-heading">Service Charges :</td>
                    <td>{{number_format($invoice->service_charges)}}</td>
                </tr>

                <tr>
                    <td class="payable-heading">Discount :</td>
                    <td>{{number_format($invoice->invoice_discount)}}</td>
                </tr>

                @if(request()->segment(1) == 'print-replacement-invoice')
                @if($invoice->invoice_type == 2)
                <!-- <tr>
                        <td class="payable-heading">Previous Paid :</td>
                        <td>{{number_format($invoice->invoice_discount)}}</td>
                    </tr> -->
                <tr>
                    <td class="payable-heading">Previous {{$invoice->previous_receivable >= 0 ? 'Receivable' : 'Payable' }} :</td>
                    <td>{{number_format($invoice->previous_receivable)}}</td>
                </tr>
                <!-- <tr>
                        <td class="payable-heading">Total Amount:</td>
                        <td>{{number_format($invoice->total_invoice_amount)}}</td>
                    </tr> -->
                <tr>
                    <td class="payable-heading">{{$invoice->previous_receivable > 0 ? 'Total Receivable'  : 'Total Payable'}} :</td>
                    <td>{{number_format($invoice->invoice_remaining_amount_after_pay)}}</td>
                </tr>
                <tr>
                    <td class="payable-heading">{{$invoice->previous_receivable > 0 ? 'Cash Recevied'  : 'Cash Paid'}} :</td>
                    <td>{{number_format($invoice->amount_received)}}</td>
                </tr>
                <?php
                $difference = $invoice->total_invoice_amount - $invoice->received_amount;
                // $difference = abs($difference);
                ?>
                <tr>
                    <td class="payable-heading">{{$invoice->previous_receivable > 0 ? 'Remaining Receivable'  : 'Remaining Payable'}} :</td>
                    <td>{{number_format($invoice->invoice_remaining_amount_after_pay,2)}}</td>
                </tr>
                @else
                <tr>
                    <td class="payable-heading">Cash Paid :</td>
                    <td>{{number_format($invoice->amount_received)}}</td>
                </tr>
                <tr>
                    <td class="payable-heading">Cash Return :</td>
                    <td>{{ number_format($invoice->cash_return) }}
                    </td>
                </tr>
                @endif
                @else
                @if($invoice->invoice_type == 2)
                <!-- <tr>
                        <td class="payable-heading">Previous Paid :</td>
                        <td>{{number_format($invoice->invoice_discount)}}</td>
                    </tr> -->
                <tr>
                    <td class="payable-heading">Previous {{$customer_balance >= 0 ? 'Receivable' : 'Payable' }} :</td>
                    <td>{{number_format($customer_balance)}}</td>
                </tr>
                <!-- <tr>
                        <td class="payable-heading">p;;;l Amount:</td>
                        <td>{{number_format($invoice->total_invoice_amount)}}</td>
                    </tr> -->
                <tr>
                    <td class="payable-heading">Total Receivable :</td>
                    <td>{{number_format($invoice->total_invoice_amount)}}</td>
                </tr>
                <tr>
                    <td class="payable-heading">Cash Received :</td>
                    <td>{{number_format($invoice->amount_received)}}</td>
                </tr>
                <?php
                $difference = $invoice->total_invoice_amount - $invoice->received_amount;
                // $difference = abs($difference);
                ?>
                <tr>
                    <td class="payable-heading">{{$difference >= 0 ? 'Remaining Receivable'  : 'Remaining Payable'}} :</td>
                    <td>{{number_format($difference,2)}}</td>
                </tr>
                @else
                <tr>
                    <td class="payable-heading">Cash Received :</td>
                    <td>{{number_format($invoice->amount_received)}}</td>
                </tr>
                <tr>
                    <td class="payable-heading">Cash Return :</td>
                    <td>{{ number_format($invoice->cash_return) }}
                    </td>
                </tr>
                @endif
                @endif
            </table>
            @if($invoice->description)
            <table class="bot-3-table w-50">
                <tr class="tabletitle">
                    <th>Remarks :</th>
                </tr>
                <tr class="body-description-tr">
                    <td class=" tableitem">{{$invoice->description}}</td>
                </tr>
               
            </table>
            @endif
            <table class="footer">
                <tr class="thankyou">
                    <td>Thank for your kind visit </td>
                    <td>{{Auth::user()->name}}(user)</td>
                </tr>
            </table>
            <table class="footer-copyright">
                <tr class="copyright">
                    <td>Software doveloped by Zeeshan Hamza +92-333-6701313</td>
                </tr>
            </table>

        </div><!--End InvoiceBot-->
    </div><!--End Invoice-->
    <script src="{{asset('/js/jquery-3.3.1.min.js')}}"></script>
    <script>
        window.onafterprint = function() {
            window.close();
        };
    </script>
</body>

</html