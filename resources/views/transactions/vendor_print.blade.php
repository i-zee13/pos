<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>{{$invoice->customer_name}} {{date('d-m-Y',strtotime($invoice->date))}} {{$invoice->cpv_no ? 'Cash Payment' : 'Cash Received'}} Voucher</title>
    <style>
        @media print {
            .page-break {
                display: block;
                page-break-before: always;
            }
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
            border-bottom: 1px solid #EEE;
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
            margin-top: 5px;
            /* border-top: 1.5px solid black; */
            border-bottom: 1.5px solid black;
            text-align: left;
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
            border-top: 1px solid #1b1b1b;
            margin-top: 3mm;
            width: 76mm;
        }

        #invoice-POS .footer tr {
            border-bottom: 1px solid #1b1b1b;
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
                {{$invoice->cpv_no ? 'Cash Payment' : 'Cash Received'}} Voucher
            </div>
        </div><!--End Invoice Mid-->
        <div id="bot">
            <table class="bot-1-table">
                <tr>
                    @php
                    $parts = explode('-', $invoice->cpv_no ?? $invoice->crv_no );
                    $invoice_first_part = $parts[1];
                    @endphp
                    <td class="bot-1-table-td">Voucher No: <b>{{$invoice_first_part}}</b></td>
                    <td class="bot-1-table-td">Date: {{date('d-m-Y',strtotime($invoice->date))}}</td>
                    <td class="bot-1-table-td">Time: {{ date('h:i A', strtotime($invoice->created_at)) }}</td>
                </tr>
            </table>
            <table class="bot-2-table">
                <tr>
                    <td>Vendor : <span style="text-transform:capitalize">{{$invoice->customer_name}}</span></td>
                </tr>
            </table>

            <table class="bot-5-table">
                @php

                if($type == 1){
                $bal = $invoice->balance-($invoice->cr);
                } else{
                $bal = $invoice->balance+($invoice->dr);
                }
                @endphp
                <tr>
                    <td class="payable-heading">Previous {{$bal >= 0 ? 'Payable' : 'Receivable' }} :</td>
                    <td>{{number_format($type == 1 ? $invoice->balance-($invoice->cr) : $invoice->balance+($invoice->dr))}}</td>
                </tr>
                <!-- <tr>
                        <td class="payable-heading">Total Amount:</td>
                        <td>{{number_format($invoice->total_invoice_amount)}}</td>
                    </tr> -->
                <tr>
                    <td class="payable-heading">Cash{{$type == 1 ? ' Received'  : ' Paid'}} :</td>
                    <td>{{number_format($type == 2 ? $invoice->dr : $invoice->cr)}}</td>
                </tr>
                <tr>
                    <td class="payable-heading">{{$invoice->balance > 0 ? 'Remaining Payable'  : 'Remaining Receivable'}} :</td>
                    <td>{{number_format(-$invoice->balance,2)}}</td>
                </tr>


            </table>
            @if($invoice->comment)
            <table class="bot-3-table w-50">
                <tr class="tabletitle">
                    <th>Remarks :</th>
                </tr>
                <tr class="body-description-tr">
                    <td class=" tableitem">{{$invoice->comment}}</td>
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