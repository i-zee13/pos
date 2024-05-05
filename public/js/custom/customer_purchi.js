 let deleteRef = '';
 let batches = [];
 let sessions = [];
 let CurrentRef = '';
 let report_segments = location.href.split('/');
 let current_url = report_segments[3].replace(/[#?]+$/, '');
 let trx_inv = false;
 $(document).ready(function () {

     $('.customer_id').on('change', function () {
         var id = $('option:selected', this).val();
         var name = $('option:selected', this).attr('cust-name');
         var balance = $('option:selected', this).attr('balance');
         if (id > 0) {
             $('.empty_div').hide();
             $('.TeacherAttendanceListTable').show();
             $('.TeacherAttendanceListTable tbody').append(`
                <tr id='tr-${id}'>
                    <td>${id}</td>
                    <td>${name}</td>
                    <td>${balance}</td>
                    <td><input type="number" value="0" balance="${balance}" cust-id="${id}" class="inputSale amount-input add-stock-input td-input-amount${id}"   min="0"></td>
                    <td class="action-btn-client">
                        <button id="${id}" class="btn smBTN red-bg remove_btn" >Remove</button>
                    </td>
                </tr>
            `);
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
     $(document).on('click', '#btn_save', function () {
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
         $.ajax({
             type: 'post',
             url: '/save-tranasctions',
             data: {
                 customers: customers,
                 _token: $('meta[name="csrf_token"]').attr('content'),
             }
         })

     });

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
