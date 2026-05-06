var lastOp = "";
var glob_type = '';
var deleteRef = '';
$(document).ready(function() {
    $('.stripeCustomersListTable').DataTable( {
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excelHtml5',
                title: 'Customers List',
                exportOptions: {
                    columns: [0,1,2,3,4,5,6,7]
                }
            }
        ]
    });
    $('.stripePaymentsListTable').DataTable( {
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excelHtml5',
                title: 'Payments List',
                exportOptions: {
                    columns: [0,1,2,3,4,5]
                }
            }
        ]
    });
});

