var lastOp = "";
var glob_type = '';
import swal from 'sweetalert';
var deleteRef = '';
let action = '';
let vendors = ''
let cust_name = '';
$(document).ready(function() {
 
    var segments = location.href.split('/');
    action = segments[3];
    if (action == "customer") {
        fetchcustomers();
    }else{
        fetchcustomers();
    }
    $(document).on('click', '.openDataSidebarForAddingCustomer', function() {
        $('.dropify-clear').click();
        $('#savaCustomerForm')[0].reset()
        $('input[name="customer_id"]').val("");
        $('input[name="customer_name"]').val("");
        $('input[name="phone_no"]').val("");
        $('textare[name="address"]').val("");
        $('input[name="whatsapp_no"]').val("");
        $('input[name="cnic_no"]').val(""); 
        $('#dataSidebarLoader').hide();
        $('.dz-image-preview').remove();
        selectize.clear();
        $('.dz-default').show();
        if (lastOp == "update") {
            $('input[name="customer_name"]').val("");
            $('input[name="customer_name"]').blur();
        }
        lastOp = 'add';
        if ($('#savaCustomerForm input[name="_method"]').length) {
            $('#savaCustomerForm input[name="_method"]').remove();
        }
        $('input[id="operation"]').val('add');
        openSidebar();
    });
    $(document).on('click', '.openDataSidebarForUpdatecustomer', function() {
        $('input[id="operation"]').val('update');
        lastOp = 'update';
        $('#dataSidebarLoader').show();
        $('._cl-bottom').hide();
        $('.pc-cartlist').hide();

        var id = $(this).attr('id');
        $('input[name="customer_id"]').val(id);
        if (!$('#savaCustomerForm input[name="_method"]').length) {
            $('#savaCustomerForm').append('<input name="_method" value="PUT" hidden />');
        }

        $.ajax({
            type: 'GET',
            url: '/customer/'+id,
            success: function(response) {
            // console.log(response.customer);
                $('#dataSidebarLoader').hide();
                $('._cl-bottom').show();
                $('.pc-cartlist').show();

                setTimeout(() => { 
                    selectize.setValue(response.customer.id); 
                    var selectedOption = selectize.getItem(response.customer.id); 
                    $('#hidden_customer_name').val($(selectedOption).text()); 
                }, 500);
                $('.customer_name').trigger('click');

                // $('input[name="customer_name"]').focus();
                // $('input[name="customer_name"]').val(response.customer.customer_name);
                // $('input[name="customer_name"]').blur();

                $('input[name="phone_no"]').focus();
                $('input[name="phone_no"]').val(response.customer.phone_no);
                $('input[name="phone_no"]').blur();

                $('input[name="whatsapp_no"]').focus();
                $('input[name="whatsapp_no"]').val(response.customer.whatsapp_no);
                $('input[name="whatsapp_no"]').blur();

                $('input[name="cnic_no"]').focus();
                $('input[name="cnic_no"]').val(response.customer.cnic_no);
                $('input[name="cnic_no"]').blur();

               
                $('textarea[name="address"]').focus();
                $('textarea[name="address"]').val(response.customer.address);
                $('textarea[name="address"]').blur();
                
                if (response.customer.customer_type ==1) {
                    $('.vendor').prop('checked', true);
                }else{
                    $('.customer').prop('checked', true); 
                } 
                 
            }
        });

        openSidebar();
    });
    $(document).on('click', '#savaCustomer', function() {
        // if (!$('input[name="customer_name"]').val()) {
        //     $('#notifDiv').fadeIn();
        //     $('#notifDiv').css('background', 'red');
        //     $('#notifDiv').text('Please provide all the required information (*)');
        //     setTimeout(() => {
        //         $('#notifDiv').fadeOut();
        //     }, 3000);
        //     return;
        // }
        $('#savaCustomer').attr('disabled', 'disabled');
        $('#cancelMainCat').attr('disabled', 'disabled');
        $('#savaCustomer').text('Processing..');

        var ajaxUrl = "/customer";
        if ($('#operation').val() !== "add") {
            ajaxUrl = "/customer/"+$('input[name="customer_id"]').val();
        }

        $('#savaCustomerForm').ajaxSubmit({
            type: "POST",
            url: ajaxUrl,
            data: $('#savaCustomerForm').serialize(),
            cache: false,
            success: function(response) {
                if(response.status == "duplicate") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('customer Already Exist');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    $('#savaCustomer').removeAttr('disabled');
                    $('#cancelMainCat').removeAttr('disabled');
                    $('#savaCustomer').text('Save');
                }
                if (response.status == "success") {
                    fetchcustomers();
                    $('#savaCustomer').removeAttr('disabled');
                    $('#cancelMainCat').removeAttr('disabled');
                    $('#savaCustomer').text('Save');

                    $('#notifDiv').text('customer have been updated successfully');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    closeSidebar();
                } 
                 if (response.status == "failed") {

                    $('#savaCustomer').removeAttr('disabled');
                    $('#cancelMainCat').removeAttr('disabled');
                    $('#savaCustomer').text('Save');
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add customer at the moment');
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
    $(document).on('click', '.delete_cat', function () {
    var id = $(this).attr('id');
    deleteRef = $(this);
    swal({
        title   : "Are you sure?",
        // text    : "",
        icon    : "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            var thisRef = $(this);
            deleteRef.attr('disabled', 'disabled');
            deleteRef.text('Processing...');
            var id = $(this).attr('id');
            $.ajax({
                type: 'DELETE',
                url: '/customer/'+id,
                data: {
                    _token: $('meta[name="csrf_token"]').attr('content'),
                    id: id
                },
                success: function (response) {
                    if (response.status == 'success') {
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'green');
                        $('#notifDiv').text('Successfully deleted.');
                        fetchcustomers();
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    } else {
                        deleteRef.removeAttr('disabled');
                        deleteRef.text('Delete');
                        $('#notifDiv').fadeIn();
                        $('#notifDiv').css('background', 'red');
                        $('#notifDiv').text('Unable to delete at the moment');
                        setTimeout(() => {
                            $('#notifDiv').fadeOut();
                        }, 3000);
                    }
                }
            });
        }
      });
      
    })
   
});
function fetchcustomers() {
    $.ajax({
        type    :     'post',
        url     :     '/get-customers',
        data    : {
            _token: $('meta[name="csrf_token"]').attr('content'),
            route:action
        },
        success :     function(response) {
                  vendors = response.customers;
                  table(response.customers);
                }
    });
    function table(data){
        $('.body').empty();
        $('.body').append('<table class="table table-hover dt-responsive nowrap mainCatsListTable" style="width:100%;"><thead><tr><th>S.No</th><th>Name</th><th>Cnic</th><th>Phone #</th><th>Whatsapp #</th><th>Address</th><th>Action</th></tr></thead><tbody></tbody></table>');
        $('.mainCatsListTable tbody').empty();
        // var response = JSON.parse(response);
        var sNo = 1;
        data.forEach((element, key) => {
            $('.mainCatsListTable tbody').append(`
            <tr>
                <td>${key + 1}</td>
                <td>${element['customer_name']}</td>
                <td>${element['cnic_no'] ? element['cnic_no'] : 'NA'}</td>
                <td>${element['phone_no'] ? element['phone_no'] : 'NA'}</td>
                <td>${element['whatsapp_no'] ? element['whatsapp_no'] : 'NA'}</td>
                <td>${element['address'] ? element['address'].substring(0, 40) + '...' : 'NA'}</td> 
                <td>
                    <button id="${element['id']}" class="btn btn-default btn-line openDataSidebarForUpdatecustomer">Edit</button>
                    <button type="button" id="${element['id']}" class="btn btn-default red-bg deleteMaincustomer delete_cat" name="main_cat" title="Delete">Delete</button>
                    
                </td>
            </tr>`);
        });
        $('#tblLoader').hide();
        $('.body').fadeIn();
        $('.mainCatsListTable').DataTable();
    }
}
var select = $('.customer_name').selectize({ 
    onFocus: function() {
        var $activeSelect = select[0].selectize;
        var $value        = $activeSelect.getValue(); 
        if ($value.length > 0) {
          var item = $activeSelect.getItem($value); 
          if(item) {
            var element        = document.querySelector('div.item');
            var innerHTMLValue = element.innerHTML;  
            $activeSelect.clear();
            $activeSelect.setTextboxValue(innerHTMLValue);
          }
        }
      }, 
    create:function(input,callback){
        cust_name = input;
        $('#hidden_customer_name').val(input);
        // $('#hidden_product_name').val(input)
        callback({value:input,text:input})
        return; 
    },
});
var selectize = select[0].selectize;
$('.customer_name,.attribute').on('click input',function(){  
        vendors.forEach(element => { 
            selectize.addOption({value:element.id,text:element.id+'-'+element.customer_name});
        });  
});
 selectize.on('change', function onChange(id) {  
    var selectedOption  = selectize.getItem(id);
    cust_name           = $(selectedOption).text();
    $('#hidden_customer_name').val($(selectedOption).text());
    // $('#hidden_product_name').val($(selectedOption).text());
}); 
selectize.clear();