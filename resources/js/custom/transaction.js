var lastOp = "";  
var action = '';
let ledger_balance = '';
$(document).ready(function() {
    var segments = location.href.split('/');
     action = segments[3]; 
        fetchCustomers(); 
       
    $(document).on('click', '.openDataSidebarForUpdateCustomerLedger', function() {
        var id            =  $(this).attr('customer-id');
        var customer_name =  $(this).attr('customer_name');
        var cr            =  $(this).attr('cr');
        var dr            =  $(this).attr('dr');
        var balance       =  $(this).attr('balance');

        $('input[id="operation"]').val('update');
        lastOp = 'update';
        $('#dataSidebarLoader').show();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();
        
        $('#dataSidebarLoader').hide();
        $('._cl-bottom').show();
        $('.pc-cartlist').show();
        
        $('input[id="customer_id"]').val(id);
        $('input[id="hidden_balance"]').val(balance);
        $('.customer_name').text(customer_name+' Details');
        $('input[name="cr"]').focus().val(cr).blur();
        $('input[name="dr"]').focus().val(dr).blur();
        $('input[name="balance"]').focus().val(balance >= 0 ? balance + ' DR' : (-balance) + ' CR').blur();

        openSidebar();
    });
     
    $(document).on('click', '#saveTransaction', function() {
        if (!$('input[name="amount"]').val() ) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Add Amount.');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        $('#saveTransaction').attr('disabled', 'disabled');
        $('#cancelSubCat').attr('disabled', 'disabled');
        $('#saveTransaction').text('Processing..');

        $('#saveTransactionForm').ajaxSubmit({
            type   : "POST",
            url    : '/transaction-store',
            cache  : false,
            success: function(response) {
                
                if (response.status == "success") {
                    closeSidebar();
                    fetchCustomers();
                    $('#saveTransaction').removeAttr('disabled').text('Save');
                    $('#cancelSubCat').removeAttr('disabled');
                    $('#amount').val('');
                    var msg = 'Transaction Successfully Updated';
                    $('#notifDiv').fadeIn().text(msg).css('background', 'green');
                    
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }   
                if (response.status == "failed") {
                    $('#saveTransaction').removeAttr('disabled');
                    $('#cancelSubCat').removeAttr('disabled');
                    $('#saveTransaction').text('Save');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Not Updated at this moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }
            },
            error: function(err) {
                if (err.status == 422) {
                    $.each(err.responseJSON.errors, function(i, error) {
                        var el = $(document).find('[name="' + i + '"]');
                        el.after($('<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' + error[0] + '</small>'));
                    });
                }
            }
        });

    });
});
function fetchCustomers() {
    $.ajax({
        type    : 'post',
        url     : '/get-ledgers-list',
        data    : {
            _token: $('meta[name="csrf_token"]').attr('content'),
            current_url:action
        },
        success : function(response) {
                    $('.body').empty();
                    $('.body').append(`
                    <table class="table table-hover dt-responsive nowrap subCatsListTable" style="width:100%;">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Name</th>
                                <th>Balance</th>
                                <th>Dated</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                    <tbody></tbody>
                    </table>`);
                    $('.subCatsListTable tbody').empty();
                    var sNo = 1;
                    response.customers.forEach((element,key) => {   
                        if(action == 'vendor-ledgers'){
                         ledger_balance =   element['balance'] >= 0 ? element['balance'] + ' CR' : (-element['balance']) + ' DR' 
                        }else{
                         ledger_balance =   element['balance'] >= 0 ? element['balance'] + ' DR' : (-element['balance']) + ' CR' 
                        }

                        $('.subCatsListTable tbody').append(`
                        <tr>
                            <td>${key + 1}</td>
                            <td> ${element['customer_name']}</td>
                            <td>${ledger_balance}</td>
                            <td> ${moment(element['date']).format('D MMM YYYY')}</td> 
                            <td>
                                <button  class="btn btn-default btn-line openDataSidebarForUpdateCustomerLedger"
                                        customer-id="${element['customer_id']}" 
                                        customer_name="${element['customer_name']}" 
                                        cr="${element['cr']}" 
                                        dr="${element['dr']}" 
                                        balance="${element['balance']}" 
                                >Add Payment</button>
                            </td>
                        </tr>`);
                    });
                    $('#tblLoader').hide();
                    $('.body').fadeIn();
                    $('.subCatsListTable').DataTable();
                }
    });
}  
$(document).on('click', '.dropify-clear', function () {
    var old_input_name = $(this).parent().children('input').attr('data-old_input');
    $('input[name="' + old_input_name + '"]').val('');
});
 