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
                 <b> <img src="{{ ($organization && $organization->print_logo) ? asset('storage/'.$organization->print_logo) : asset('images/print-logo.png') }}" class="" alt="..." style="height:60px;margin:0px"> 
                <p><b>{{$organization->name}}</b></p>
                <p>{{$organization->address}}</p> 
               <p style="padding:0px;margin:0px!important">
                                  
                  
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone-forward-fill" viewBox="0 0 16 16"  style="height:12px;margin-right:3px">
                      <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877zm10.761.135a.5.5 0 0 1 .708 0l2.5 2.5a.5.5 0 0 1 0 .708l-2.5 2.5a.5.5 0 0 1-.708-.708L14.293 4H9.5a.5.5 0 0 1 0-1h4.793l-1.647-1.646a.5.5 0 0 1 0-.708"/>
                    </svg>
                {{$organization->phone_number}} </p>
                   <p style="padding:0px;margin:2px 2px 10px 5px !important">
                <!--<img  style="height:20px;margin-right:3px" src="https://cdn.brandfetch.io/idkvKigo-P/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B" >-->
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16" style="height:12px;margin-right:3px">
                      <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                    </svg> 
                {{$organization->whatsapp_no}} </p></b>
            </div>
            <!--End Info-->
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
                    <th colspan="6" style=" background-color: black;color: white;">IN</th>
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
                    <th colspan="6" style=" background-color: black;color: white;">OUT</th>
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
                    <td class="payable-heading">Cash Received :</td>
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
                    <td>Software doveloped by <b>{{$developer}}</b></td>
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