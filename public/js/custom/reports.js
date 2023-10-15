let deleteRef   = '';
let batches   = [] ;
let sessions  = [] ;
let CurrentRef = '';
let report_segments = location.href.split('/'); 
$(document).ready(function(){
    var currentDate = new Date();
    var startDate = new Date();
    startDate.setMonth(currentDate.getMonth() - 1);
    var formattedStartDate = startDate.toISOString().split('T')[0];
    $('.start_date').val(formattedStartDate);
    var formattedEndDate = currentDate.toISOString().split('T')[0];
    $('.end_date').val(formattedEndDate);
})
 $('.search-btn').on('click',function(){ 
    var start_date = $('.start_date').val();
    var end_date   = $('.end_date').val();
    if(start_date != '' && end_date == ''){
        $('#notifDiv').fadeIn().css('background', 'red').text('End Date should not be Empty').focus();
        $('.end_date').focus();
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return
    }
    if(end_date != '' && start_date == ''){
        $('#notifDiv').fadeIn().css('background', 'red').text('End Date should not be Empty');
        $('.start_date').focus();
        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return
    }
    if($('.vendor_id').val() == 0){
        $('#notifDiv').fadeIn().css('background', 'red').text('Please Select Vendor First.');

        setTimeout(() => {
            $('#notifDiv').fadeOut();
        }, 3000);
        return
    }
    CurrentRef = $(this);
    CurrentRef.attr('disabled', 'disabled');
     url = '/report-list';
     $(`#search-form`).ajaxSubmit({
         type: 'POST',
         url: url,
         data: {
             _token: $('meta[name="csrf_token"]').attr('content'),
             current_url:report_segments[3]
         },
         success: function(response){
            CurrentRef.attr('disabled', false);
            $('.loader').show();
            $('.teacher_attendance_list').empty();
            $('.teacher_attendance_list').append(`
                <table class="table table-hover dt-responsive nowrap TeacherAttendanceListTable" style="width:100%;">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Invoice</th>
                            <th>CR</th>
                            <th>DR</th> 
                            <th>Balance</th>
                            <th>Action</th>
                        </tr>
                    </thead><tbody>
                </tbody>
                </table>`);
            $('.TeacherAttendanceListTable tbody').empty();
            if(response.vendor.length == 0){
                $('#notifDiv').fadeIn();
                $('#notifDiv').css('background', 'green');
                $('#notifDiv').text('No data available');
                setTimeout(() => {
                    $('#notifDiv').fadeOut();
                }, 3000);
            }
            response.vendor.forEach((element, key) => {
                  console.log(element);
                if (element['sale_return_invoice_id'] > 0) {
                    label = 'Sale Return Inv';
                } else if (element['product_replacement_invoice_id'] > 0) {
                    label = 'Product Replace';
                } else if (element['return_invoice_id'] > 0) {
                    label = 'Return Inv';
                } else if (element['sale_invoice_id'] > 0) {
                    label = 'Sale Inv';
                }  else if (element['crv_no'] > 0) {
                    label = 'Cash Receiving Voucher (' + comment + ' )';
                } else if (element['cpv_no'] > 0) {
                    label = 'Cash Payment Voucher (' + comment + ' )';
                } 
                var date = new Date(element.created_at); 

                function formatAMPM(date) {
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12; // Handle midnight (0 hours)
                    minutes = minutes < 10 ? '0' + minutes : minutes; // Add leading zero for single digit minutes
                    var timeStr = ' (' + hours + ':' + minutes + ' ' + ampm + ')';
                    return timeStr;
                }

                var formattedDate = `${date.toDateString()} ${formatAMPM(date)}`;


                $('.TeacherAttendanceListTable tbody').append(`
                    <tr>
                        <td>${formattedDate}</td>
                        <td>${label}</td>
                        <td style="font-family: 'Rationale', sans-serif !important;font-size: 20px;">${element['cr']      ? element['cr']      : '0'}</td>
                        <td style="font-family: 'Rationale', sans-serif !important;font-size: 20px;">${element['dr']      ? element['dr']      : '0'}</td>
                        <td style="font-family: 'Rationale', sans-serif !important;font-size: 20px;">${element['balance'] ? (element['balance'] < 0 ? element['balance']+' CR' : element['balance']+' DR') : '0'}</td>

                        <td><a id="${element['id']}"  class="btn btn-default btn-line"  href="/">Detail </a> </td>                       
                    </tr>`);
            });
            $('.TeacherAttendanceListTable').fadeIn();
            $('.loader').hide();
           var title = '';
           if(report_segments[3] == 'customer-reports'){
            title = 'Customer Report'
        }else{
            title = 'Vendor Report'

            
        }
            
    if ($.fn.DataTable.isDataTable(".TeacherAttendanceListTable")) {
        $('.TeacherAttendanceListTable').DataTable().clear().destroy();
    }
     var table = $('.TeacherAttendanceListTable').DataTable({ 
         dom    : 'Bfrtip', 
        buttons : [
            {
                extend: 'excelHtml5',
                text: 'Excel',
                title: title,
                 exportOptions: {
                    // columns: ':visible:not(:last-child)',
                    format: {
                        body: function ( innerHtml, rowIdx, colIdx, node ) { 
                            return node.textContent; 
                        }
                    }
                },
                customize: function (xlsx) {
    
                    //copy _createNode function from source
                    function _createNode(doc, nodeName, opts) {
                        var tempNode = doc.createElement(nodeName);
    
                        if (opts) {
                            if (opts.attr) {
                                $(tempNode).attr(opts.attr);
                            }
    
                            if (opts.children) {
                                $.each(opts.children, function (key, value) {
                                    tempNode.appendChild(value);
                                });
                            }
    
                            if (opts.text !== null && opts.text !== undefined) {
                                tempNode.appendChild(doc.createTextNode(opts.text));
                            }
                        }
    
                        return tempNode;
                    }
    
                }
            },
            
            ],
       
    })
     
        }
     });
 }); 
 $('.reset-btn').on('click',function(){
    $('.vendor_id').val('').trigger('change');
    $('#search-form')[0].reset();
 })