 let deleteRef = '';
 let batches = [];
 let sessions = [];
 let CurrentRef = '';
 let report_segments = location.href.split('/');
 let current_url = report_segments[3].replace(/[#?]+$/, '');
 let trx_inv = false;
 let tabIndexCounter = 1;  

 $(document).ready(function () {

     $('.customer_id').on('change', function () {
         var id         = $('option:selected', this).val();
         var name       = $('option:selected', this).attr('cust-name');
         var balance    = $('option:selected', this).attr('balance');
         ledger_balance =   balance >= 0 ? balance + ' DR' : (-balance) + ' CR' 

         if (id > 0) {
             $('.empty_div').hide();
             $('.TeacherAttendanceListTable').show();
             $('.TeacherAttendanceListTable tbody').append(`
                <tr id='tr-${id}'>
                    <td>${id}</td>
                    <td>${name}</td>
                    <td>${ledger_balance}</td>
                    <td><input type="number" value="0" balance="${balance}" cust-id="${id}" class="inputSale amount-input add-stock-input td-input-amount${id}"   min="0" tabindex="${tabIndexCounter}"></td>
                    <td class="action-btn-client">
                        <button id="${id}" class="btn smBTN red-bg remove_btn" >Remove</button>
                    </td>
                </tr>
            `);
            tabIndexCounter++;
             $('.TeacherAttendanceListTable').DataTable();
             $('.customer_id').children('option[value="' + id + '"]').attr('disabled', true);
             $(".customer_id").val("0").trigger('change');
             $(".customer_id").select2(); // Initialize Select2 here
         }
     });

     $(document).on('click', '.remove_btn', function () {
         var id = $(this).attr('id');
         $("#tr-" + id).remove();
         $('.customer_id').children('option[value="' + id + '"]').attr('disabled', false);
         $(".customer_id").select2();
     });

     $("#print-invoice").on('click',function(){
        var current_action = $(this);
        storeTransctions(current_action,'print');
        current_action.text('Print')
    })
    $("#btn_save").on('click',function(){
        var current_action = $(this);
        storeTransctions(current_action,'Save');
        current_action.text('Save')
    })
     function storeTransctions(current_action,type) {
         var customers = [];
         $('.TeacherAttendanceListTable tbody tr').each(function () {
             var id = $(this).find('.inputSale').attr('cust-id');
             var name = $(this).find('td:eq(1)').text(); // Get customer name from the second column
             var balance = $(this).find('.inputSale').attr('balance');
             var receiving_amount = $(this).find('.inputSale').val();
             console.log(id, name, balance, receiving_amount)
             // Create customer object and push to array
             var customer = {
                 id: id,
                 name: name,
                 balance: balance,
                 receiving_amount: receiving_amount
             };
             customers.push(customer);
         });
         current_action.text('Processing...')
         current_action.attr('disabled', 'disabled');
         $.ajax({
            type : 'post',
            url  : '/save-tranasctions',
            data : {
                        customers: customers,
                        _token: $('meta[name="csrf_token"]').attr('content'),
                    },
            success : function(response){
                            if (response.status == 'success') {
                                if(type == 'print'){
                                    var printWindow    = window.open("/print-ledger-purchi");
                                    printWindow.onload = function() { printWindow.print(); }; 
                                }
                                setTimeout(() => {
                                    $('#notifDiv').fadeOut(); 
                                    window.location  = "/sale-add";
                                }, 1500);
                            } else{
                                current_action.removeAttr('disabled');
                                $('.btn-cancel').removeAttr('disabled');
                                $('#print-invoice').removeAttr('disabled');
                            }
            }     
         }) 
     };

 });

 $('.reset-btn').on('click', function () {
     $(".customer_id").select2('destroy');
     $('.TeacherAttendanceListTable').DataTable().destroy();
     $('.empty_div').show();
     $('.TeacherAttendanceListTable').hide();
     $('.TeacherAttendanceListTable tbody').empty();
     $('.customer_id option').prop('disabled', false);
     $(".customer_id").select2();

 });
