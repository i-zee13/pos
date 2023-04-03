<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <title>{{$student_name.' Invoice'}}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fira+Code&display=swap" rel="stylesheet">
<head>
   <style>
      /* font-family: 'Bebas Neue'
      font-family: 'Fira Code', monospace; */
      @page {
         margin: 30px;
         width: 100%;
         header: page-header;
         footer: page-footer;

      }

      table {
         color: #4f4f4f;
         font-size: 13px;
         font-family: 'firacode';
      }

      table td {
         border: solid 1px #fff;
         text-align: left;
      }

      .table {
         padding: 10px 0px;
         border-bottom: solid 1px #dadada;
      }

      .table th {
         border: solid 1px #fff;
         text-align: left;
         font-family: 'firacode';
         font-size: 15px;
         text-transform: uppercase;
         border-bottom: solid 2px #a2c85a;
         padding: 8px 0;
         color: #101010;
      }

      .table td {
         padding: 8px 0;
      }
   </style>
</head>
<body>
   <htmlpageheader name="page-header">
      <table width="800" border="0" align="center" cellpadding="0" cellspacing="0" style="padding-top:10px">
         <tbody>
            <tr>
               <td>
                  <img style="width: auto; height:55px" src="{{asset('/images/shama-logo.png')}}" alt="">
               </td>
               <td align="right" width="260px" valign="top">
                  <table align="right" cellpadding="0" cellspacing="0">
                     <tbody cellpadding="0" cellspacing="0">
                        <tr>
                           <td align="right" style="font-size:48px; font-family: 'bebas';
                           line-height:1; letter-spacing:10px; color:#101010; padding-top:10px"><b>INOVICE</b></td>
                        </tr>
                        <tr>
                           <td align="right" style="padding-right:5px; letter-spacing: 1px;">
                              Inovice No: {{$invoice->invoice_id}}
                           </td>
                        </tr>
                        <tr>
                           <td align="right" style="padding-right:5px; letter-spacing: 1px;">
                         12-feb-12
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </td>
            </tr>
         </tbody>
      </table>
   </htmlpageheader>
   <htmlpagefooter name="page-footer">
      <table style="padding: 5px 0px; border-top:solid 1px #cccccc; padding-bottom:15px" width="800" border="0" cellspacing="0" cellpadding="2" align="center">
         <tbody>
            <tr>
               <td>Phone: 2345</td>
               <td align="right">Address: sdfgh.</td>
            </tr>
         </tbody>
      </table>
   </htmlpagefooter>
   <main>
      <table style="padding-top:95px" width="100%" border="0" cellspacing="0" cellpadding="0">
         <tbody>
            <tr>
               <td>
                  <table width="350" border="0" cellspacing="0" cellpadding="0">
                     <tbody>
                        <tr>
                           <td>Invoice to:</td>
                        </tr>
                        <tr>
                           <td style="font-size:22px; font-family: 'bebas';
                           line-height:1; color:#101010; letter-spacing:2px"><b>{{$invoice->first_name}} {{$invoice->last_name}}</b></td>
                        </tr>
                        <tr>
                           <td style="height:3px"></td>
                        </tr>
                        <tr>
                           <td style="border-left:solid 2px #cfcfcf; padding-left:10px;">
                           {{$invoice->primary_address}}<br> {{$invoice->email}}
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </td>
               <td style="vertical-align: bottom;">
                  <table style="border:solid 1px #cfcfcf; color:#101010; font-size:10px; letter-spacing:0px;" align="right" width="220" border="0" cellspacing="3" cellpadding="3">
                     <tbody>
                     <tr>
                           <td>Subscription # :</td>
                           <td>{{$invoice->subscription_id}}</td>
                        </tr>
                     </tbody>
                  </table>
               </td>
            </tr>
         </tbody>
      </table>
      <table class="table" width="100%" border="0" cellspacing="0" cellpadding="0">
         <thead>
            <tr>
               <th>No.</th>
               <th>Course Name</th>
               <th>Students</th>
               <th>Qty</th>
               <th align="right">Price</th>
               <th align="right">Total</th>
            </tr>
         </thead>
         <tbody>
            <tr>
               <td>01</td>
               <td> {!! Str::words($invoice->course_title, 3, ' ...') !!}</td>
               <td>{{$invoice->total_students}}</td>
               <td>{{$invoice->interval}}</td>
               <td align="right">{{$invoice->currency == 1 ? 'PKR.' : 'USD'}}  {{number_format($invoice->batch_price_after_discount ,2)}}</td>
               <td align="right">{{$invoice->currency == 1 ? 'PKR.' : 'USD'}}  {{number_format(($invoice->course_price_detail_id > 0  ? $invoice->single_unit_cost*$invoice->interval : $invoice->batch_price_after_discount*$invoice->interval),2)}}</td>

            </tr>
         </tbody>
      </table>
      <table width="800" border="0" cellspacing="0" cellpadding="0" style="padding-top:30px">
         <tbody>
            <tr>
                
               <td style="vertical-align:top">
                  <table width="270" border="0" cellspacing="0" cellpadding="2" align="right">
                  <tbody>
                        <tr>
                           <td width="120">Sub Total</td>
                           <td align="right">{{$invoice->currency == 1 ? 'PKR.' : 'USD'}}  {{number_format($invoice->course_price_detail_id > 0  ? $invoice->single_unit_cost*$invoice->interval : $invoice->batch_price_after_discount*$invoice->interval,2)}}</td>
                        </tr>
                        {{--<tr>
                           <td width="120">Campaign Diss</td>
                           <td align="right">{{$invoice->currency == 1 ? 'PKR.' : 'USD'}}  {{number_format($invoice->campaign_discount*$invoice->interval,2)}}</td>
                        </tr>
                        <tr>
                           <td width="120">Extra Diss</td>
                           <td align="right">{{$invoice->currency == 1 ? 'PKR.' : 'USD'}}  {{number_format($invoice->extra_discount ,2)}}</td>
                        </tr>--}}
                        <tr>
                            <td width="120">Discount</td>
                            @if($invoice->course_price_detail_id > 0)
                                 @if($invoice->course_price_plan == '1')
                                    @php
                                          $total_amount     =   $invoice->single_unit_cost * $invoice->interval;
                                          $discount_amount  =   ($total_amount * $invoice->group_discount) / 100;
                                    @endphp
                                 @else
                                    @php
                                          $total_amount     =   $invoice->single_unit_cost * $invoice->interval;
                                          $discount_amount  =   ($total_amount * $invoice->single_subscription_discount) / 100;
                                    @endphp
                                 @endif
                            @else
                                 @php
                                          $total_amount     =   $invoice->batch_price_after_discount * $invoice->interval;
                                          $discount_amount  =   $invoice->extra_discount * $invoice->interval;
                                 @endphp
                            @endif

                            <td align="right">{{$invoice->currency == 1 ? 'PKR.' : 'USD'}}  {{number_format($discount_amount ,2)}}</td>
                        </tr>
                        <tr>
                           <td height="15"></td>
                           <td height="15"></td>
                        </tr>
                        <tr>
                           <td style="background-color:#a2c85a;font-size:16px; color:#101010; border-color:#a2c85a; padding:5px 8px">TOTAL:</td>
                           <td style="background-color:#a2c85a;font-size:16px; color:#101010; border-color:#a2c85a; text-align:right; padding:5px 8px">{{$invoice->currency == 1 ? 'PKR.' : 'USD'}} {{number_format($invoice->net_payable ,2)}}</td>
                        </tr>
                     </tbody>
                  </table>
               </td>
            </tr>
         </tbody>
      </table>
   </main>
</body>
</html>
