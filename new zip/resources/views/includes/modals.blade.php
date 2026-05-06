<div class="modal fade newSubModModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Sub Module Settings</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body PT-0">
                <div id="floating-label">
                    <form id="newParentModForm" enctype="multipart/form-data">
                        @csrf
                        <input name="parent_op" hidden />
                        <div class="form-wrap _w90 PT-10 PB-10" style="width: 100%;">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label mb-10">Parent Module Name*</label>
                                        <input type="text" name="parent_module_name" class="form-control">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label mb-10">Show in sidebar*</label>
                                        <select class="form-control" name="show_in_sidebar">
                                            <option value="1" selected>Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="pt-19">
                                        <label class="font12">Parent Icon*</label>
                                        <div class="upload-pic"></div>
                                        <input type="file" name="parent_icon" id="icon" class="dropify"
                                            accept="image/*" />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label mb-10">Sub Module Name*</label>
                                        <input type="text" name="module_name" class="form-control">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label mb-10">Route*</label>
                                        <input type="text" name="route" class="form-control">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label mb-10">Made Up Name*</label>
                                        <input type="text" name="made_up_name" class="form-control">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label mb-10">Show in sub-menu*</label>
                                        <select class="form-control" name="show_in_sub_menu">
                                            <option value="1" selected>Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="pt-19">
                                        <label class="font12">Icon*</label>
                                        <div class="upload-pic"></div>
                                        <input type="file" name="icon" id="icon" class="dropify" accept="image/*" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <form id="newSubModForm" enctype="multipart/form-data">
                        @csrf
                        <div class="form-wrap _w90 PT-10 PB-10" style="width: 100%;">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label mb-10">Module Name*</label>
                                        <input type="text" name="module_name" class="form-control">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label mb-10">Route*</label>
                                        <input type="text" name="route" class="form-control">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label mb-10">Made Up Name*</label>
                                        <input type="text" name="made_up_name" class="form-control">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label mb-10">Show in sub-menu*</label>
                                        <select class="form-control" name="show_in_sub_menu">
                                            <option value="1" selected>Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="pt-19">
                                        <label class="font12">Icon*</label>
                                        <div class="upload-pic"></div>
                                        <input type="file" name="icon" id="icon" class="dropify" accept="image/*" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" style="font-size: 12px; font-weight: normal"
                    data-dismiss="modal">Close</button>
                <button type="button" id="saveNewSubMod" class="btn btn-primary"
                    style="font-size: 12px; font-weight: normal">Save</button>
                <button type="button" id="saveParentMod" class="btn btn-primary"
                    style="font-size: 12px; font-weight: normal">Save</button>
            </div>
        </div>
    </div>
</div>
<button style="display:none" class="openSubModModal" data-toggle="modal" data-target=".newSubModModal"></button>
<div class="modal fade" id="docsModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Documents</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" style="font-size: 12px; font-weight: normal"
                    data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" style="font-size: 12px; font-weight: normal">Save
                    changes</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade supplierProductAssignmentModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Assignments</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-wrap _w90 PT-10 PB-10" id="assignmendModalContent">
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal fade AddDynamicStagesMediums" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="mediumStageTitle"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-wrap _w90 PT-10 PB-10" id="mediumStageFormDiv">
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal fade AddDynamicCompetitionModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">New Competition</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-wrap _w90 PT-10 PB-10">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label class="control-label mb-10">Competition Name*</label>
                                <input type="text" id="competitionName" class="form-control" placeholder="">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 pt-19" style="text-align: center">
                            <button class="btn btn-primary" id="saveCompetition">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="performaInvoiceModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-full" role="document">
        <div class="modal-content">
            <div class="modal-header border-0">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">×</button>
            </div>
            <div class="modal-body">
                <div class="container _order-container">
                    <div class="row mt-2 mb-3 justify-content-center">
                        <div class="col-md-12">
                            <h2 class="_head01 float-left">Proforma <span> Invoice </span></h2>
                            <div class="_order-top-r">
                                <a href="#" id="editPerformaFromInvoice" class="btn btn-primary">Edit</a>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-2 justify-content-center">
                        <div class="col-md-12">
                            <div class="card p-20 top_border _invPRINT mb-3">
                                <div class="row">
                                    <div class="col-5">
                                        <img class="CI_logo" src="/images/danpak-logo.jpg" alt="" />
                                    </div>
                                    <div class="col-7">
                                        <div class="Co-address">
                                            <span>Head Office: <strong>24-D,Block-1, K.A.E.C.H.S. - 75350
                                                    Pakistan.</strong><br> Tel: <strong>92-21-34539572</strong></span>
                                            <span class="border-0">Unit # 1: <strong>E-29, S.I.T.E., Karachi - 75700
                                                    Pakistan.</strong><br>Tel: <strong>92-21-32577762, 32578025,
                                                    32578026</strong> Fax: <strong>92-21-32563435</strong></span>
                                            <span class="border-0">Unit # 2: <strong>E-3/A, S.I.T.E., Karachi - 75700
                                                    Pakistan.</strong><br>Tel: <strong>92-21-32566693, 32566802</strong>
                                                Email: <strong>info@danpakfoods.com</strong></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="row _add-customer">
                                    <div class="col-12">
                                        <div class="row m-0">
                                            <div class="_date-order"><label class="date_label">Date of
                                                    Issue</label><span id="dateOfIssue">12-02-2012</span></div>
                                            <div class="_date-order"><label class="date_label">PO NO.</label><span
                                                    id="poNum">021542</span></div>
                                            <div class="_date-order"><label class="date_label">Invoice NO.</label><span
                                                    id="invoiceNum">4548785555</span></div>
                                            <div class="col _order-price"><span>Total Amount (PKR)</span>Rs.0.00</div>
                                        </div>
                                        <div class="_cut-detail">
                                            <div class="row">
                                                <div class="col-md-6"><strong>Company Name: &nbsp; </strong> <span
                                                        id="companyName">Web Soft Company</span>.</div>
                                                <div class="col-md-6"><strong>Poc: &nbsp; </strong> <span
                                                        id="poc">Sahbaz Khan</span></div>
                                                <div class="col-md-6"><strong>Country: &nbsp; </strong> <span
                                                        id="country">Pakistan</span></div>
                                                <div class="col-md-6"><strong>City: &nbsp; </strong> <span
                                                        id="region">region here</span></div>
                                            </div>
                                        </div>
                                        <div class="_add-product">
                                            <div class="row AP_heading">
                                                <div class="addItemCell PL-5">Product Name</div>
                                                <div class="addItemCell2">QTY.</div>
                                                <div class="addItemCelWEIGHT">Weight Per Unit</div>
                                                <div class="addItemCelWEIGHT">Weight Per Carton</div>
                                                <div class="addItemCellcbm">CBM</div>
                                                <div class="addItemCellcbm">Total CBM</div>
                                                <div class="addItemCell2">Unit Price</div>
                                                <div class="addItemCell3">Amount</div>
                                            </div>
                                            <div id="dynamicRowProducts"></div>
                                            <div class="row AP_heading _totalBar">
                                                <div class="addItemCell PL-5 text-right">Total: </div>
                                                <div class="addItemCell2" class="totalCtns">1,420CTNS</div>
                                                <div class="addItemCelWEIGHT"></div>
                                                <div class="addItemCelWEIGHT"></div>
                                                <div class="addItemCellcbm"></div>
                                                <div class="addItemCellcbm"></div>
                                                <div class="addItemCell2 text-right"></div>
                                                <div class="addItemCell3" class="totalAmModal">USD19,590.00</div>
                                            </div>
                                            <div class="row _notesTER">
                                                <div class="col-md-6">
                                                    <label class="date_label">Notes</label>
                                                    <span id="notes">Notes info here</span>
                                                </div>
                                                <div class="col-md-6 mt-5">
                                                    <label class="date_label">Terms</label>
                                                    <span id="terms">Terms info here</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="text-align: right">
                                <a id="downloadInvoicePDF" target="_blank" class="btn btn-primary"
                                    style="color: white !important">Download PDF</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<button style="display:none" class="open_confirmation_modal" data-toggle="modal"
    data-target=".db-confirmation-modal"></button>
<div class="modal fade db-confirmation-modal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered" style="max-width: 650px">
        <div class="modal-content top_border">
            <div class="modal-header" style="text-align: center; display: block">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="check_mark">
                    <div class="sa-icon sa-success animate">
                        <span class="sa-line sa-tip animateSuccessTip"></span>
                        <span class="sa-line sa-long animateSuccessLong"></span>
                        <div class="sa-placeholder"></div>
                        <div class="sa-fix"></div>
                    </div>
                </div>
                <div class="form-wrap p-0">
                    <h5 class="modal-title" style="text-align: center; width: 100%;" id="exampleModalLongTitle">Email
                        <span>has been sent successfully</span>
                    </h5>
                    <div class="PT-15 PB-10" align="center">
                        <button type="button" id="dismissConfirmationModal" class="btn btn-primary font13 m-0 mb-2"
                            data-dismiss="modal" style="display: none">Ok</button>
                        <!--<button type="submit" class="btn btn-cancel m-0 mb-2" data-dismiss="modal" aria-label="Close">No</button> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<button style="display:none" class="openOrderCompletionModal" data-toggle="modal"
    data-target=".markCompleteModal"></button>
<div class="modal fade markCompleteModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered" style="max-width: 650px">
        <div class="modal-content top_border">
            <div class="modal-header">
                <h5 class="modal-title _head03 w-100" id="exampleModalLongTitle">Left-Over Stock</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span
                        aria-hidden="true">&times;</span> </button>
            </div>
            <div class="modal-body">
                <p id="stockMsg">
                    Below stock is yet to dispatch. Do you wish to save the items as <strong>left-over stock</strong>?
                </p>
                <table class="table table-hover dt-responsive nowrap table-PL" style="width:100% !important"
                    id="leftOverStockTable">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th id="prodQtyLeftOverStock">Produced</th>
                            <th>Dispatched</th>
                            <th>Remaining</th>
                            <th>Expiry</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer p-0 PT-10" style="margin-bottom: 10px; text-align: center; display: block;">
                <button type="button" id="saveLeftOverStock" class="btn btn-primary page_speed_2020456426"
                    style="display: inline-block;">Yes! Save It</button>
                <button type="submit" class="btn btn-cancel" data-dismiss="modal" aria-label="Close">No! Let me
                    edit</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade orderSheetModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-full" role="document">
        <div class="modal-content">
            <div class="modal-header border-0">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">×</button>
            </div>
            <div class="modal-body">
                <div class="container _order-container">
                    <div class="row mt-2 mb-3 justify-content-center">
                        <div class="col-md-10">
                            <h2 class="_head01 float-left">Order <span> Sheet </span></h2>
                        </div>
                    </div>
                    <div class="row mt-2 justify-content-center">
                        <div class="col-md-10">
                            <div class="card p-20 top_border _invPRINT mb-3">
                                <div class="row _add-customer" style="margin-top: 0px">
                                    <div class="col-12">
                                        <div class="row m-0">
                                            <div class="_date-order"><label class="date_label">Order Date</label><span
                                                    id="orderModalDate">12-02-2012</span></div>
                                            <div class="_date-order"><label class="date_label">PO NO.</label><span
                                                    id="orderModalPo">021542</span></div>
                                            <div class="_date-order"><label class="date_label">Invoice NO.</label><span
                                                    id="orderModalInv">4548785555</span></div>
                                            <div hidden class="_date-order"><label
                                                    class="date_label">Discount.</label><span
                                                    id="order_discount_modal">00</span></div>
                                            <div hidden class="col _order-price" id="orderModalOrderPrice"><span>Total
                                                    Amount
                                                    (PKR)</span>Rs.0.00</div>
                                        </div>
                                        <div class="_cut-detail">
                                            <div class="row">
                                                <div class="col-md-6"><strong>Company Name: &nbsp; </strong> <span
                                                        id="orderModalCompany">Web Soft Company</span>.</div>
                                                <div class="col-md-6"><strong>Poc: &nbsp; </strong> <span
                                                        id="orderModalPoc">Sahbaz Khan</span></div>
                                                <div class="col-md-6"><strong>Country: &nbsp; </strong> <span
                                                        id="orderModalCountry">Pakistan</span></div>
                                                <div class="col-md-6"><strong>City: &nbsp; </strong> <span
                                                        id="orderModalRegion">region here</span></div>
                                            </div>
                                        </div>
                                        <div class="_add-product">
                                            <div class="row AP_heading">
                                                <div class="addItemCell PL-5" style="width: 250px !important">QTY IN
                                                    CTNS</div>
                                                <div class="addItemCell2"
                                                    style="width: 300px !important; text-align: left !important;">
                                                    DESCRIPTION OF GOODS</div>
                                                <div class="addItemCell3"
                                                    style="width: 300px !important; text-align: left !important;">
                                                    SPECIAL NOTE</div>
                                            </div>
                                            <div id="dynamicRowProductsOrderModal">

                                            </div>
                                            <div class="row AP_heading _totalBar">
                                                <div class="addItemCell PL-5 text-left" style="width: 250px !important"
                                                    id="orderModalTtlCtns">
                                                    1950</div>
                                                <div class="addItemCellcbm"></div>
                                                <div class="addItemCell2 text-right"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="text-align: right">
                                <a id="downloadOrderSheetPDF" target="_blank" class="btn btn-primary"
                                    style="color: white !important">Download PDF</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered" style="max-width: 650px">
        <div class="modal-content top_border">
            <div class="modal-header" style="text-align: center; display: block">
                <h5 class="modal-title" id="exampleModalLongTitle">Product <span>Cost</span></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <table class="table table-hover dt-responsive nowrap" id="example4" style="width:100% !important">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>QTY.</th>
                            <th>Selling Price</th>
                            <th>Cost Price</th>
                            <th>GP</th>
                        </tr>
                    </thead>
                    <tbody class="body_table_modal">
                    </tbody>
                </table>


                <div class="check_mark">
                    <div class="sa-icon sa-success animate">
                        <span class="sa-line sa-tip animateSuccessTip"></span>
                        <span class="sa-line sa-long animateSuccessLong"></span>
                        <div class="sa-placeholder"></div>
                        <div class="sa-fix"></div>
                    </div>
                </div>

                <div class="form-wrap p-0">
                    <h1 class="_head05" align="center"><span>Are you sure </span>Add Cost?</h1>

                    <div class="PT-15 PB-10" align="center">
                        <button type="button" class="btn btn-primary font13 m-0 mr-2 mb-2 add_bulk_cost_price">Add
                            Cost</button>
                        <button type="button" class="btn btn-cancel m-0 mb-2 close_modal_pnl" data-dismiss="modal"
                            aria-label="Close">Cancel</button>
                    </div>


                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content top_border">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Add <span> Payment </span></h5>
                {{-- <h5 class="modal-title" id="ttl_payment_modal"> ()</span></h5> --}}
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div id="floating-label" class="modal-body">
                <div class="row">
                    <div class="col-md-6 PT-10 font14">
                        <strong>Advance Paid:</strong>
                    </div>
                    <div class="col-md-6">
                        <div class="advPaidAmt" style="font-family: 'Rationale', sans-serif; font-size: 30px">
                            PKR. 52,730</div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 PT-15 font14">
                        <strong> Amount Due:</strong>
                    </div>
                    <div class="col-md-6">
                        <div class="ttl_payment_modal" style="font-family: 'Rationale', sans-serif; font-size: 30px">
                            $8,730.00</div>
                    </div>
                </div>
                <hr class="mb-5 mt-5">

                <div class="row">
                    <div class="col-md-6">
                        <label class="font12">Transaction Date</label>
                        <div class="form-group" style="height: auto !important">
                            <input type="text" id="transaction_date_cash" class="form-control required_modal"
                                style="font-size: 13px">
                        </div>
                    </div>

                    <div class="col-md-6">
                        <label class="font12">Transaction Type</label>
                        <div class="form-s2">
                            <select class="form-control formselect" id="payment_type_modal" placeholder="Select Rider">
                                <option selected disabled value="0">Select Payment Type</option>
                                <option value="1" selected>Cash</option>
                                <option value="2">Bank Transfer</option>
                            </select>
                        </div>
                    </div>
                </div>
                <hr class="mb-10 mt-5">
                <div class="m-0 bank_div" style="display:none;">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label mb-10">Banks Name*</label>
                                <input type="text" class="form-control required_modal" id="bank_name_modal"
                                    style="font-size: 13px">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label mb-10">Transaction No*</label>
                                <input type="text" class="form-control required_modal" id="checque_num_modal"
                                    style="font-size: 13px">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        {{-- <div class="col-md-6">
                                <label class="PT-10 font12">Transaction Date*</label>
                                <div class="form-group" style="height: auto !important">
                                    <input type="text" id="datepicker-modal" class="form-control required_modal"
                                        style="font-size: 13px">
                                </div>
                            </div> --}}
                        <div class="col-md-12">
                            <div class="form-s2">
                                <label class="PT-10 font12">Select Account*</label>
                                <div>
                                    <select class="form-control formselect required_modal" name="select_account"
                                        id="select_account" placeholder="Customer type">
                                        <option value="0" disabled selected>Select Account</option>
                                        {{-- @if(!empty($accounts))
                                            @foreach ($accounts as $account)
                                            <option value="{{$account->id}}">{{$account->account_name}}
                                        ({{$account->account_num}})</option>
                                        @endforeach
                                        @endif --}}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr class="m-0 mt-10">
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="control-label mb-10">Exchange Rate*</label>
                            <input type="number" class="form-control" id="exchange_rate_payment_rec"
                                style="font-size: 13px">
                        </div>
                    </div>
                </div>
                <hr class="mb-10 mt-5">
                <div class="row">
                    <div class="col-md-6 PT-10 font14">
                        <strong>Add Payment:</strong>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group" style="height: auto !important">
                            <input type="number" class="form-control required_modal" id="payment_modal"
                                style="font-size: 13px">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 PT-15 font14">
                        <strong> Amount Due:</strong>
                    </div>
                    <div class="col-md-6">
                        <div class="ttl_payment_modal" style="font-family: 'Rationale', sans-serif; font-size: 30px">
                            PKR. 52,730</div>
                    </div>
                </div>
                <hr class="mb-10 mt-5">
                <div class="row">
                    <div class="col-md-6 PT-5 font14">
                        <strong> Remaining Amount:</strong>
                    </div>
                    <div class="col-md-6">
                        <div style="font-family: 'Rationale', sans-serif; font-size: 22px" class="remaining_amt"> Rs.
                            1,120.00</div>
                    </div>

                </div>
                <div class="row" id="custBalanceDiv" style="display: none">
                    <div class="col-md-6 PT-10 font14">
                        <strong>Deduct From Balance <span id="custBalance"></span></strong>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group" style="height: auto !important">
                            <input type="number" class="form-control required_modal" id="amountFromBalance"
                                style="font-size: 13px">
                        </div>
                    </div>
                </div>
                {{-- <div class="col-md-12">
                    <label class="PT-10 font12">Transaction Date*</label>
                    <div class="form-group" style="height: auto !important">
                        <input type="text" id="transaction_date_cash" class="form-control required_modal"
                            style="font-size: 13px">
                    </div>
                </div> --}}
            </div>
            <div class="modal-footer border-0">
                <button type="button" class="btn btn-primary add_payment_from_modal">Add</button>
                <button type="submit" class="btn btn-cancel cancel_modal" data-dismiss="modal"
                    aria-label="Close">Cancel</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="SearchDiv" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-full" role="document">
        <div class="modal-content">
            <div class="modal-body">
                <div class="container-fluid">
                    <div class="row SearchTopHead">
                        <div class="col-6">
                            <h2 class="_head01 mb-0">Search</h2>
                        </div>
                        <div class="col-6">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">Close</button>
                        </div>
                    </div>
                    <div class="row Search__Input">
                        <input type="search" class="form-control search_whole_site" placeholder="Type to search...">
                        <a href="#"><img src="/images/search-icon.svg" alt="" /></a>
                    </div>
                </div>
                <div style="min-height: 400px" id="tblLoader_search" style="display:none">
                    <img src="/images/loader.gif" width="30px" height="auto"
                        style="position: absolute; left: 50%; top: 45%;">
                </div>
                <div class="container-fluid SearchList">
                    <ul>
                        <h3>Notes</h3>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients Call to new
                                clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design Call to new
                                clients</a>
                        </li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients Call to new
                                clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders Email to
                                Ali
                                TraderEmail to Ali Traders Email to Ali Trader</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders</a></li>
                    </ul>

                    <ul>
                        <h3>Task</h3>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders Call to
                                new
                                clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design Make Web Design
                                Make Web
                                Design Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders</a></li>
                    </ul>

                    <ul>
                        <h3>Order</h3>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients Call to new
                                clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders Call to
                                new
                                clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders</a></li>
                    </ul>

                    <ul>
                        <h3>Payment</h3>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali TradersCall to new
                                clients
                            </a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web DesignMake Web
                                Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders</a></li>
                    </ul>

                    <ul>
                        <h3>Recently Modified</h3>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="paymentHistoryModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Payments</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; line-height: 10;" id="loaderDiv">
                    Loading..
                </div>
                <table class="table table-hover dt-responsive nowrap" id="paymentHistoryTable"
                    style="width:100% !important">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Paid at</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" style="font-size: 12px; font-weight: normal"
                    data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
    aria-hidden="true" id="confirmationModal">
    <div class="modal-dialog modal-lg modal-dialog-centered" style="max-width: 650px">
        <div class="modal-content top_border">
            <div class="modal-header" style="text-align: center; display: block">
                <h5 class="modal-title" id="exampleModalLongTitle">Delete<span> Confirmation</span>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">

                <div style="display: none" class="completionCheckMark check_mark">
                    <div class="sa-icon sa-success animate">
                        <span class="sa-line sa-tip animateSuccessTip"></span>
                        <span class="sa-line sa-long animateSuccessLong"></span>
                        <div class="sa-placeholder"></div>
                        <div class="sa-fix"></div>
                    </div>
                </div>

                <h5 class="modal-title" style="text-align: center; width: 100%;" id="deleteCorrespondenceMsg">
                    Are you sure you want to delete this correspondence?
                </h5>

                <div class="form-wrap p-0">
                    <div class="PT-15 PB-10 actionBtnsDiv" align="center">
                        <button type="submit" class="btn btn-primary font13 m-0 mr-2 mb-2 yesDeleteIt">Yes</button>
                        <button type="submit" class="btn btn-cancel m-0 mb-2 closeConfirmationModal"
                            data-dismiss="modal" aria-label="Close">No</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<button style="display:none" id="openConfirmationModal" data-toggle="modal" data-target="#confirmationModal"></button>

<div class="modal fade" id="TaskDetailModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog  modal-lg modal-dialog-centered" role="document">
        <div class="modal-content top_border">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel"><img class="_T-img-title" src="/images/task-icon-b.svg"
                        alt="">
                    <h5 class="task_modal_title"></h5>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="col-md-12 _TDetail mom_div">
                </div>

            </div>
            <div class="modal-footer">
                <div class="_Tinfo"><strong>Created by:</strong><br>
                    <img class="_Tas-img created_by_pic_modal" src="" alt=""><span class="modal_created_by">Saif
                        Ali</span></div>
                <div class="_Tinfo"><strong>Due Date</strong> <br> <span class="modal_due_date">25/10/2019</span></div>
                <div class="_Tinfo"><strong>Time</strong> <br> <span class="modal_due_time">2:00 PM</span></div>
                <div class="_Tinfo"><strong>Status</strong> <br> <span class="Tpending status_modal">Pending</span>
                </div>
                <button type="button" class="btn btn-cancel" data-dismiss="modal" aria-label="Close">Close</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade bd-example-modal-task_comment" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title _head03" id="exampleModalLongTitle">Task <span>Comment</span></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div id="floating-label" class="form-wrap p-10 pt-0 pb-0">
                    <div class="row">
                        <div class="col-md-12">
                            <label class="PT-10 font12">Comment*</label>
                            <div class="form-group">
                                <textarea name="task_comment" id="task_comment" rows="8"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0 p-0 pt-19">
                        <button type="button" class="btn btn-primary save_task_completion">Save</button>
                        <button type="button" class="btn btn-cancel close_comment_modal" data-dismiss="modal"
                            aria-label="Close">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade bd-example-modal-task_comment" id="deleteSuppAssignmentReasonModal" tabindex="-1" role="dialog"
    aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title _head03" id="exampleModalLongTitle">Delete <span>Reasoning</span></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body pt-0">
                <div id="floating-label" class="form-wrap p-10 pt-0 pb-0">
                    <div class="row">
                        <div class="col-md-12">
                            <label class="PT-10 font12">Reason*</label>
                            <div class="form-group">
                                <textarea id="deleteSuppAssignmentReason" rows="8"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0 p-0 pt-19">
                        <button type="button" class="btn btn-primary deleteSuppAssignment">Delete</button>
                        <button type="button" class="btn btn-cancel close_comment_modal" data-dismiss="modal"
                            aria-label="Close">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<button style="display:none" class="openAssignmentModal" data-toggle="modal"
    data-target=".assignSupplierModal"></button>
<div class="modal fade assignSupplierModal" id="assignSupplierModal" tabindex="-1" role="dialog"
    aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title _head03" id="exampleModalLongTitle"></h5>
                <div class="col-md-6 pr-0">
                    <div class="form-s2">
                        <select class="form-control formselect" id="selectSupplierForAssignment"
                            placeholder="Select Supplier">
                            <option value="0" disabled selected>Select Supplier</option>
                            @if (isset($suppliers))
                            @foreach ($suppliers as $item)
                            <option value="{{ $item['id'] }}">{{ $item['company_name'] }}</option>
                            @endforeach
                            @endif
                        </select>
                    </div>
                </div>
            </div>
            <div class="modal-body pt-5">
                <div id="floating-label" class="form-wrap pt-0 pb-0">
                    <div class="row">
                        <div class="col-md-12 productRate-table m-0">
                            <table class="table table-hover dt-responsive nowrap table-PL" style="width:100% !important"
                                id="productsToAssignToSupplierTable">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Item</th>
                                        <th style="width: 20px !important">QTY.</th>
                                        <th style="width: 20px !important">Rem. QTY.</th>
                                        <th style="width: 30px !important">Assign QTY.</th>
                                        <th style="width: 200px">Note</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                        <div class="row mt-15 mb-10">
                            <div class="col-6">
                                <div class="assigned-to">
                                    <div class="col-12 font13 p-0">Delivery Date</div>
                                    <div class="col-auto p-0"> <img class="calendarIcon"
                                            src="/images/calendar-icon002.svg" alt="">
                                        <input class="assignedDate" type="text" id="edtDp" value="{{ date('Y-m-d') }}"
                                            style="font-size: 13px">
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="assigned-to">
                                    <div class="col-12 font13 p-0">Follow Up Date</div>
                                    <div class="col-auto p-0"> <img class="calendarIcon"
                                            src="/images/calendar-icon002.svg" alt="">
                                        <input class="assignedDate" type="text" id="followUpDate"
                                            value="{{ date('Y-m-d', strtotime("+7 days")) }}" style="font-size: 13px">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 float-left mb-10">
                            <label class="font12 mb-5">Assign Employee</label>
                            <div class="form-s2 date-List EMP__List">
                                <select class="form-control formselect" id="assignEmpsToSupplierAssignmentDD"
                                    multiple="multiple">
                                    @if (isset($employees))
                                    @foreach ($employees as $emp)
                                    <option value="{{ $emp->id }}">{{ $emp->name }}</option>
                                    @endforeach
                                    @endif
                                </select>
                            </div>
                        </div>
                        <div class="col-12">
                            <label class="font12 mb-5">Remarks</label>
                            <div class="form-group">
                                <textarea name="description" id="assignSuppRemarks" rows="8"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer p-0 PT-10">
                    <button type="button" class="btn btn-primary" id="completeSupplierAssignment"
                        disabled=true>Assign</button>
                    <button type="button" class="btn btn-primary" id="completeSupplierReAssignment"
                        disabled=true>Save</button>
                    <button type="submit" class="btn btn-cancel" data-dismiss="modal" aria-label="Close">Close</button>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade followModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title _head03 w-100" id="exampleModalLongTitle">Supplier: <span>Supplier Name
                        Here...</span> <span class="float-right"> <strong>Follow </strong> Up</span></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span
                        aria-hidden="true">&times;</span> </button>
            </div>
            <div class="modal-body">

                <!--first section action buttons-->
                <div class="col-12 mt-10 pt-10" id="followUpDeciderDiv">
                    <div class="row">
                        <div class="col-4"> <a id="addProdBtn"
                                class="follow_action d-flex align-content-center flex-wrap"><span class="img-svg"><img
                                        src="/images/product-dash-icon.svg" alt="">Add
                                    Production</span></a> </div>
                        <div class="col-4"><a id="repDelayBtn"
                                class="follow_action d-flex align-content-center flex-wrap"><span class="img-svg"><img
                                        src="/images/product-reportDelay.svg" alt="">Report
                                    Delay</span> </a> </div>
                        <div class="col-4"> <a id="markComplBtn"
                                class="follow_action d-flex align-content-center flex-wrap"><span class="img-svg"><img
                                        src="/images/product-mark.svg" alt="">Mark
                                    Complete</span></a></div>
                        <div class="clearfix"></div>
                    </div>
                </div>
                <div id="floating-label" class="form-wrap pt-0 pb-0">

                    <!--Add Production section-->

                    <div class="row" id="addProductionDiv">
                        <div class="col-12">
                            <h2 class="_head04">Add Production</h2>
                        </div>
                        <div class="col-md-12 productRate-table m-0 AssSup-table">
                            <table class="table table-hover dt-responsive nowrap table-PL" style="width:100% !important"
                                id="addProductionTable">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Item</th>
                                        <th>Assign QTY.</th>
                                        <th>Dispatched QTY.</th>
                                        <th>Produce QTY.</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                        <div class="row mt-15 mb-10">
                            <div class="col-6">
                                <div class="assigned-to">
                                    <div class="col-12 font13 p-0">Delivery Date</div>
                                    <div class="col-auto p-0"> <img class="calendarIcon"
                                            src="/images/calendar-icon002.svg" alt="">
                                        <input class="assignedDate" type="text" id="prodDelivDate"
                                            style="font-size: 13px">
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="assigned-to">
                                    <div class="col-12 font13 p-0">Follow Up Date</div>
                                    <div class="col-auto p-0"> <img class="calendarIcon"
                                            src="/images/calendar-icon002.svg" alt="">
                                        <input class="assignedDate" type="text" id="prodFollowupDate"
                                            style="font-size: 13px">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 float-left mb-10">
                            <label class="font12 mb-5">Assign Employee</label>
                            <div class="form-s2 date-List EMP__List">
                                <select class="form-control formselect" multiple="multiple" style="width: 100%"
                                    id="prodAssignedEmps">
                                    @if (isset($employees))
                                    @foreach ($employees as $emp)
                                    <option value="{{ $emp->id }}">{{ $emp->name }}</option>
                                    @endforeach
                                    @endif
                                </select>
                            </div>
                        </div>
                        <div class="col-12">
                            <label class="font12 mb-5">Remarks</label>
                            <textarea name="description" id="addProductionRemarks" rows="5"></textarea>
                        </div>
                    </div>

                    <!-- Report Delay -->

                    <div class="row" id="reportDelayDiv">
                        <div class="col-12">
                            <h2 class="_head04">Report Delay</h2>
                        </div>
                        <div class="row mt-15 mb-10">
                            <div class="col-6">
                                <div class="assigned-to">
                                    <div class="col-12 font13 p-0">Orignal Delivery Date</div>
                                    <div class="col-auto p-0"><strong
                                            class="font13 originalDelivDate">03/11/2019</strong></div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="assigned-to">
                                    <div class="col-12 font13 p-0">New Delivery Date</div>
                                    <div class="col-auto p-0"> <img class="calendarIcon"
                                            src="/images/calendar-icon002.svg" alt="">
                                        <input class="assignedDate" type="text" id="newDelivDate"
                                            style="font-size: 13px">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <label class="font13 mb-5">Add Reason </label>
                            <select class="delayReason">
                            </select>
                        </div>
                    </div>

                    <!-- Mark Complete -->

                    <div class="row" id="markCompleteDiv">
                        <div class="col-12">
                            <h2 class="_head04">Mark Complete</h2>
                        </div>
                        <div class="col-md-12 productRate-table m-0 AssSup-table">
                            <table class="table table-hover dt-responsive nowrap table-PL" style="width:100% !important"
                                id="markCompleteTable">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Item</th>
                                        <th>Assign QTY.</th>
                                        <th>Produce QTY.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Product Name Here </td>
                                        <td>Item Name Here....</td>
                                        <td>254</td>
                                        <td>254</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="col-12">
                            <div class="MarkCM"><strong class="Marktext">Are you sure you want to Mark
                                    Complete?</strong>
                                <button type="button" class="btn btn-primary" id="yesMarkComplete">Yes</button>
                                <button type="submit" class="btn btn-cancel" data-dismiss="modal"
                                    aria-label="Close">No</button>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer p-0 PT-10">
                        <button type="button" class="btn btn-primary" id="saveFollowupBtn"
                            style="display: none">Save</button>
                        <button type="button" class="btn btn-cancel" id="backToFollowupDecider">Back</button>
                        <button type="submit" class="btn btn-cancel closeFollowupModal" data-dismiss="modal"
                            aria-label="Close">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade bd-example-modal-lg" id="customerAssignmentModal" tabindex="-1" role="dialog"
    aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog  modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <div class="col-12">
                    <div class="row">
                        <div class="col-6 pl-0">
                            <h5 class="modal-title" id="exampleModalLongTitle">Assignments</h5>
                        </div>
                        <div class="col-6 pr-0">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                                    aria-hidden="true">&times;</span></button>
                            <div class="S__Activity"> <a href="#"><i class="fa fa-search"></i></a>
                                <input type="search" id="searchAssignment" placeholder="Search">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-body">
                <div class="form-wrap PT-10 PB-10" style="overflow-y: scroll; max-height:410px; padding-right: 30px"
                    id="assignmentsModal">
                </div>
            </div>
        </div>
    </div>
</div>

<div id="taskCentralizedModal" class="modalWindow h-auto">
    <div class="_MW-content">
        <h1 class="modalWindowTitle">Task <a class="modalWindow-act" id="modalCloseTaskCentralized"><img
                    src="/images/close-icon.svg" alt="" /></a> <a class="modalWindow-act" id="modalExpand-btn"><i
                    class="fa fa-expand test_i"></i></a></h1>
        <div class="_MW-mid-content">
            <div class="row task-assign-date border-bP-5">
                <div class="assigned-to SelectCust">
                    <div class="col-12 p-0 text-gray mb-5">Select Customer:</div>
                    <div class="col-auto l-height p-0"> <img class="calendarIcon float-left" src="/images/cust-icon.svg"
                            alt="">
                        <div class="form-s2 date-List customerSelectDD">
                            <select id="customerIdTaskCentralized" class="form-control formselect"
                                style="width: 230px!important">
                                <option value="0" selected disabled>Select Customer</option>
                                @foreach ($customersFromProvider as $item)
                                <option value="{{ $item->id }}">{{ $item->company_name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                </div>
                <div class="assigned-to w-auto">
                    <div class="col-12 p-0 text-gray mb-5">Due Date:</div>
                    <div class="col-auto l-height p-0"> <img class="calendarIcon" src="/images/calendar-icon002.svg"
                            alt="">
                        <input class="assignedDate centralizedTaskDp" type="text" value="{{ date('Y-m-d') }}"
                            id="dueDateDpTaskCentralized" style="font-size: 13px">
                    </div>
                </div>
                <div class="assigned-to w-auto">
                    <div class="col-12 p-0 text-gray mb-5">Time:</div>
                    <div class="col-auto l-height p-0"> <img class="calendarIcon float-left" src="/images/time-icon.svg"
                            alt="">
                        <div class="form-s2 date-List H-arrow">
                            <select class="form-control formselect" id="dueTimeDDTaskCentralized"
                                style="width: 85px!important">
                                <?php $increment = 900; $day_in_increments = range( 0, (86400 - $increment), $increment );
                                    array_walk( $day_in_increments, function( $time ) {
                                        echo '<option value="'.date( 'g:i A', $time ).'">'.date( 'g:i A', $time ).'</option>';
                                    } ); ?>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="assigned-to w-auto pl-0">
                    <div class="col-12 p-0 text-gray">Priority:</div>
                    <div class="col-12 p-0">
                        <div class="flag-iconP"><span class="fa fa-flag"></span> </div>
                        <div class="float-left TaskStAction PriorityFlag">
                            <select id="taskPriority" class="custom-select SP_flag">
                                <option value="critical" selected>Critical</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col TaskTitle pl-0">
                <input type="text" id="taskTitleTaskCentralized" class="form-control" placeholder="Task Title">
            </div>
            <textarea class="FW-textareaTask" id="momTaskMomCentralized" placeholder="Notes..."></textarea>
            <div class="row task-assign-date border-TP-5">
                <div class="assigned-to AssTask">
                    <div class="col-12 p-0 text-gray mb-5">Assigned to:</div>
                    <div class="col-12 pl-0 float-left">
                        <div class="form-s2 date-List EMP__List assignToDD">
                            <select class="form-control formselect" id="assigned_toTaskCentralized" multiple="multiple"
                                style="width: 100%">
                                @foreach ($empsForCentralizedTask as $item)
                                <option value="{{ $item->id }}">{{ $item->name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                </div>
                <div class="assigned-to EmailR">
                    <div class="col-12 p-0 text-gray mb-5"><strong>Email Reminder</strong></div>
                    <div class="col-auto l-height p-0"> <img class="calendarIcon" src="/images/calendar-icon002.svg"
                            alt="">
                        <input class="assignedDate centralizedTaskDp" type="text" value="{{ date('Y-m-d') }}"
                            id="reminderDateDpTaskCentralized" style="font-size: 13px">
                    </div>
                </div>
                <div class="assigned-to ERTime">
                    <div class="col-12 p-0 text-gray mb-5"><br>
                    </div>
                    <div class="col-auto l-height p-0"> <img class="calendarIcon float-left" src="/images/time-icon.svg"
                            alt="">
                        <div class="form-s2 date-List H-arrow">
                            <select class="form-control formselect" id="reminderTimeDDTaskCentralized"
                                style="width: 100px !important">
                                <?php array_walk( $day_in_increments, function( $time ) {
                                        echo '<option value="'.date( 'g:i A', $time ).'">'.date( 'g:i A', $time ).'</option>';
                                    } ); ?>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modalWindow-bottom">
            <button type="button" id="saveCentralizedTask" class="btn btn-primary mr-2 float-left">Save Task</button>
        </div>
    </div>
</div>

<div class="modal fade" id="taskCommentsModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog   modal-full modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header border-0">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                    style="font-size:30px">×</button>
            </div>
            <div class="modal-body p-0">
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <div class="card">
                                <div class="header">
                                    <div class="row m-0">
                                        <div class="col pl-0">
                                            <h2 class="_head03 font18 border-0 pb-0" id="viewDetailsTaskTitleModal">
                                            </h2>
                                        </div>
                                        <div class="col-auto TaskStAction">
                                            <div class="row">
                                                <div class="col-auto"><strong class="font13 float-left">Status:
                                                    </strong> <span class="TS-Circle TS-Completed"></span></div>
                                                <div class="col-auto pl-0">
                                                    <select class="custom-select SP_flag taskStatusChange"
                                                        style="margin-top: -7px">
                                                        <option value="not-started" selected>Not Started
                                                        </option>
                                                        <option value="in-review">In Review</option>
                                                        <option value="in-progress">In Progress</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="body p-0">
                                    <div class="row">
                                        <div class="col-7 task-Leftinfo">
                                            <div class="row task-assign-date">
                                                <div class="assigned-to SelectCust">
                                                    <div class="col-12 p-0 text-gray mb-5">Select Customer:</div>
                                                    <div class="col-auto l-height p-0"> <img
                                                            class="calendarIcon float-left" src="/images/cust-icon.svg"
                                                            alt="">
                                                        <div class="form-s2 date-List customerSelectDDViewDetails">
                                                            <select id="customerIdViewTaskDetails" disabled
                                                                class="form-control formselect"
                                                                style="width: 230px!important">
                                                                <option value="0" selected disabled>Select Customer
                                                                </option>
                                                                @foreach ($customersFromProvider as $item)
                                                                <option value="{{ $item->id }}">
                                                                    {{ $item->company_name }}</option>
                                                                @endforeach
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="assigned-to w-auto">
                                                    <div class="col-12 p-0 text-gray mb-5">Due Date:</div>
                                                    <div class="col-auto l-height p-0"> <img class="calendarIcon"
                                                            src="/images/calendar-icon002.svg" alt="">
                                                        <input class="assignedDate" type="text" value="10/10/2019"
                                                            id="dueDateViewTaskDetails" style="font-size: 13px">
                                                    </div>
                                                </div>
                                                <div class="assigned-to w-auto">
                                                    <div class="col-12 p-0 text-gray mb-5">Time:</div>
                                                    <div class="col-auto l-height p-0"> <img
                                                            class="calendarIcon float-left" src="/images/time-icon.svg"
                                                            alt="">
                                                        <div class="form-s2 date-List H-arrow">
                                                            <select class="form-control formselect"
                                                                style="width: 100px!important;" disabled
                                                                id="dueTimeViewTaskDetails">
                                                                <?php $increment = 900; $day_in_increments = range( 0, (86400 - $increment), $increment );
                                array_walk( $day_in_increments, function( $time ) {
                                    echo '<option value="'.date( 'g:i A', $time ).'">'.date( 'g:i A', $time ).'</option>';
                                } ); ?>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="assigned-to w-auto pl-0">
                                                    <div class="col-12 p-0 text-gray">Priority:</div>
                                                    <div class="col-12 p-0">
                                                        <div class="flag-iconP"><span
                                                                class="fa fa-flag flag_colors"></span>
                                                        </div>
                                                        <div class="float-left TaskStAction PriorityFlag">
                                                            <select id="taskPriorityViewDetails"
                                                                class="custom-select SP_flag" disabled>
                                                                <option value="critical" selected>Critical</option>
                                                                <option value="high">High</option>
                                                                <option value="medium">Medium</option>
                                                                <option value="low">Low</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="row">
                                                <div class="col-12 PT-15 PB-15">
                                                    <textarea class="taskTextarea" id="viewDetailsTaskMomModal"
                                                        disabled>Loading..</textarea>
                                                </div>
                                            </div>


                                            <div class="row attachments_div" style="display: none;">
                                                <div class="col-12 TaskAtachDiv">
                                                    <h2 class="_head03 font18"><img class="_T-img-title"
                                                            src="/images/attach-icon-b.svg" alt="">Attachments <span
                                                            class="_attachV"> 13</span> <button
                                                            class="btn btn-primary mb-0 AllDownload-btn downloadAllDocs"><i
                                                                class="fa fa-download"></i> Download All</button></h2>
                                                    <div class="col-12 TaskAtachList"
                                                        style="height: 150px; overflow: auto;">

                                                    </div>
                                                </div>
                                            </div>



                                            <div class="row task-assign-date BL-border">
                                                <div class="assigned-to AssTask">
                                                    <div class="col-12 p-0 text-gray mb-5">Assigned to:</div>
                                                    <div class="col-12 pl-0 float-left">
                                                        <div
                                                            class="form-s2 date-List EMP__List assignToDDViewTaskDetails">
                                                            <select class="form-control formselect" multiple="multiple"
                                                                style="width: 100%" id="viewDetailsAssignedTo">
                                                                @foreach ($empsForCentralizedTask as $item)
                                                                <option value="{{ $item->id }}">{{ $item->name }}
                                                                </option>
                                                                @endforeach
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="assigned-to EmailR">
                                                    <div class="col-12 p-0 text-gray mb-5">Email Reminder</div>
                                                    <div class="col-auto l-height p-0"> <img class="calendarIcon"
                                                            src="/images/calendar-icon002.svg" alt="">
                                                        <input class="assignedDate" id="viewDetailsReminderDate"
                                                            type="text" value="{{ date('Y-m-d') }}" id="datepicker2"
                                                            style="font-size: 13px">
                                                    </div>
                                                </div>
                                                <div class="assigned-to ERTime">
                                                    <div class="col-12 p-0 text-gray mb-5"><br>
                                                    </div>
                                                    <div class="col-auto l-height p-0"> <img
                                                            class="calendarIcon float-left" src="/images/time-icon.svg"
                                                            alt="">
                                                        <div class="form-s2 date-List  H-arrow">
                                                            <select class="form-control formselect"
                                                                id="viewDetailsReminderTime" disabled
                                                                style="width: 100px!important">
                                                                <?php $increment = 900; $day_in_increments = range( 0, (86400 - $increment), $increment );
                                array_walk( $day_in_increments, function( $time ) {
                                    echo '<option value="'.date( 'g:i A', $time ).'">'.date( 'g:i A', $time ).'</option>';
                                } ); ?>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-5">
                                            <div class="TaskComment">
                                                <div class="TaskCommentHD">
                                                    <h4>Comments</h4>
                                                    <small id="typingStatusSpan" style="display: none">Wakas Bajwa is
                                                        typing</small>
                                                </div>
                                                <div class="TaskCommentSec">
                                                    <div class="FU-history">
                                                        <ul class="Act-timeline taskCommentsActivityWindow">
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div class="TaskCommentType">
                                                    <div class="row">
                                                        <div class="col pr-0">
                                                            <textarea rows="2" placeholder="Type Your Comment"
                                                                id="commentOnTask"></textarea>
                                                        </div>
                                                        <div class="col-auto pl-0 PT-15"><button
                                                                class="btn btn-primary mb-0"
                                                                id="sendComment">Send</button></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<div class="modal fade add_production_modal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
    aria-hidden="true">
    <div class="modal-dialog  modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Add Production <span></span></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body pt-0">
                <div class="row">
                    <div class="col-md-12 productRate-table AssSup-table m-0 border-bottom">
                        <table class="table table-hover dt-responsive nowrap table-PL production_table_modal"
                            style="width:100% !important">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Item</th>
                                    <th>Assign QTY.</th>
                                    <th>Producted QTY.</th>
                                    <th>Produce QTY.</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="pro_name_modal"> </td>
                                    <td class="item_name_modal"></td>
                                    <td class="ass_qty_modal"></td>
                                    <td class="producted_qty_modal"></td>
                                    <td><input type="number" class="CN-st-end new_produce_qty_modal" placeholder="0">
                                    </td>
                                    <td><button class="btn btn-default mb-0 add_production_btn_modal">Add</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="row mt-15 mb-10">
                    <div class="col-auto pl-0">
                        <div class="assigned-to">
                            <div class="col-12 font13 p-0">Delivery Date</div>
                            <div class="col-auto p-0"> <img class="calendarIcon" src="/images/calendar-icon002.svg"
                                    alt="">
                                <input class="assignedDate delivery_date_modal" type="text" value="" id="datepicker2"
                                    style="font-size: 13px">
                            </div>
                            {{-- <button class="btn btn-primary btnChange">Change</button> --}}
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="assigned-to">
                            <div class="col-12 font13 p-0">Follow Up Date</div>
                            <div class="col-auto p-0"> <img class="calendarIcon" src="/images/calendar-icon002.svg"
                                    alt="">
                                <input class="assignedDate follow_date_modal" type="text" value=""
                                    id="change_follow_up_date" style="font-size: 13px">
                            </div>
                            {{-- <button class="btn btn-primary btnChange">Change</button> --}}
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 float-left mb-10">
                        <label class="font12 mb-5">Assign Employee</label>
                        <div class="form-s2 date-List EMP__List">
                            <select class="form-control formselect assigned_emp_modal" disabled multiple="multiple"
                                style="width: 100%">
                                @if (isset($employees))
                                @foreach ($employees as $emp)
                                <option value="{{ $emp->id }}">{{ $emp->name }}</option>
                                @endforeach
                                @endif
                            </select>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="form-wrap p-0">
                            <label class="font12 mb-5">Remarks</label>
                            <textarea name="description" class="production_remarks_modal" rows="3"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer border-0">
                <button type="button" class="btn btn-primary add_production_follow_up">Save</button>
                <button type="button" class="btn btn-cancel" data-dismiss="modal" aria-label="Close">Close</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="active_deactive" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content top-border">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Status: <span class="modal_customer_name">Saudi Aramco
                    </span></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body pb-0">
                <div class="row status-sh">
                    <div class="col-12">
                        <div class="custom-control custom-radio">
                            <input class="custom-control-input" type="radio" id="ac-001" value="1" data-id="ac-001"
                                name="activation_checkBox" checked>
                            <label class="custom-control-label head-sta" for="ac-001">Active</label>
                        </div>
                    </div>
                </div>
                <div class="row status-sh">
                    <div class="col-12">
                        <div class="custom-control custom-radio">
                            <input class="custom-control-input" type="radio" id="hid001" value="0" data-id="hid001"
                                name="activation_checkBox">
                            <label class="custom-control-label head-sta" for="hid001">Deactive</label>
                        </div>
                    </div>
                </div>

            </div>
            <div class="modal-footer pt-0 border-0">
                <button type="button" class="btn btn-primary modal_activation_save">Save</button>
                <button type="button" class="btn btn-cancel close_activation_modal" hidden data-dismiss="modal"
                    aria-label="Close">Cancel</button>
            </div>
        </div>
    </div>
</div>

<button style="display:none" class="openWarningModal" data-toggle="modal" data-target="#warningModal"></button>
<div class="modal fade" id="warningModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content top-border">
            <div class="modal-header">
                <h5 class="modal-title _head03" id="exampleModalLongTitle">Payment Alert</h5>
            </div>
            <div class="modal-body pb-0">
                Payment for this order is in pending state. Do you wish to continue?
            </div>
            <div class="modal-footer pt-0 border-0">
                <button type="button" class="btn btn-primary continueAssignment">Yes! Continue</button>
                <button type="button" class="btn btn-cancel cancelAssignment" data-dismiss="modal"
                    aria-label="Close">Cancel</button>
            </div>
        </div>
    </div>
</div>

<div id="modalWindow" class="modalWindow h-auto">
    <div class="_MW-content">
        <h1 class="modalWindowTitle">Add <span class="sample_heading">Samples</span> <a class="modalWindow-act"
                id="modalClose"><img src="/images/close-icon.svg" alt="" /></a> <a class="modalWindow-act"
                id="modalExpand-btn-sample"><i class="fa fa-expand"></i></a></h1>
        <div class="_MW-mid-content pb-0">
            <div class="row border-bP-5">

                <div class="col pr-0">
                    <div class="form-s2">
                        <select class="form-control formselect select_product_sample" placeholder="select Country"
                            style="width: 100%">
                            <option selected>Select Product</option>
                        </select>
                    </div>
                </div>
                <div class="col pr-0">
                    <div class="form-s2">
                        <select class="form-control formselect select_item_sample" placeholder="select Country"
                            style="width: 100%">
                            <option value="0" selected disabled>Select Item</option>
                        </select>
                    </div>
                </div>
                <div class="col-auto"><button type="button" class="btn btn-primary add_sample_to_table">Add</button>
                </div>
            </div>
            <div class="samplePRlist sampleTableBody">

            </div>
            <div id="floating-label" class="row form-wrap p-0">
                <div class="col-12 p-0">
                    <hr class="mt-0 mb-10">
                </div>
                <div class="col-auto pl-0">
                    <div class="assigned-to w-auto pl-0">
                        <div class="col-12 p-0 text-gray font12">Due Date:</div>
                        <div class="col-auto l-height p-0"> <img class="calendarIcon" src="/images/calendar-icon002.svg"
                                alt="" style="padding-top:7px">
                            <input class="assignedDate expected_delivery_date" type="text" value="10/10/2019"
                                id="datepicker2" style="font-size: 13px">
                        </div>
                    </div>
                </div>

                <div class="col-md-3 pl-0">
                    <div class="form-group">
                        <label class="control-label mb-10">Transaction Id*</label>
                        <input type="text" id="" class="form-control transaction_id" placeholder="">
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="form-group">
                        <label class="control-label mb-10">Courier*</label>
                        <input type="text" id="" class="form-control courier" placeholder="">
                    </div>
                </div>

                <div class="col-md-12 p-0">
                    <label class="font12 m-0">Remarks</label>
                    <div class="form-group">
                        <textarea name="description" class="sampleRemarks" rows="5"></textarea>
                    </div>
                </div>
            </div>
        </div>
        <div class="modalWindow-bottom">
            <button type="button" class="btn btn-primary mr-2 float-left save_sampling">Save</button>
        </div>
    </div>
</div>

<div class="modal fade bd-example-modal-task_comment" id="CorrespondenceCompetitionModal" tabindex="-1" role="dialog"
    aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title _head03" id="exampleModalLongTitle">Competition <span>Detail</span></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body pt-0">
                <div id="floating-label" class="form-wrap p-10 pt-0 pb-0">
                    <div class="row">
                        {{-- <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label mb-10">Sub Service*</label>
                                <select class="form-control select_competition_category">
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label mb-10">Products*</label>
                                <select class="form-control select_competition_product">
                                </select>
                            </div>
                        </div> --}}
                        <div class="col-md-6">
                            <label class="PT-10 font12">Company Name*</label>
                            <div class="form-group">
                                <input class="form-control company_name_competition_modal" type="text" />
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="PT-10 font12">Country*</label>
                            <div class="form-group">
                                <input class="form-control country_competition_modal" type="text" />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0 p-0 pt-19" style="background-color:white !important">
                        <button type="button" class="btn btn-primary add_competition">Add Competition</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
{{-- Intrested In Products Modal --}}
<div class="modal fade bd-example-modal-task_comment" id="CorrespondenceInterestedModal" tabindex="-1" role="dialog"
    aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title _head03" id="exampleModalLongTitle">Interested IN <span>Detail</span></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body pt-0">
                <div id="floating-label" class="form-wrap p-10 pt-0 pb-0">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="PT-10 font12">Sub Service*</label>
                                <select class="form-control sd-type select_interested_category" multiple="multiple">
                                </select>
                                {{-- <label class="control-label mb-10">Sub Service*</label>
                                <select class="form-control select_interested_category" >
                                </select> --}}
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="PT-10 font12">Products*</label>
                                <select class="form-control sd-type select_interested_products" multiple="multiple">
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0 p-0 pt-19" style="background-color:white !important">
                        <button type="button" class="btn btn-primary add_interested_products">Add Competition</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


{{-- <button style="display:none" class="openRecAdvModal" data-toggle="modal" data-target="#receiveAdvanceModal"></button> --}}
<div class="modal fade" id="receiveAdvanceModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content top_border">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Receive <span> Advance </span></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div id="floating-label" class="modal-body" style="padding-top: 0px;">
                <div class="row">
                    <div class="col-md-12">
                        <label class="font12">Customer</label>
                        <div class="form-s2">
                            <select class="form-control formselect" id="advPmtCustomer" placeholder="Select Customer">
                                <option selected disabled value="0">Select Customer</option>
                            </select>
                        </div>
                    </div>
                </div>
                <br>
                <div class="row">
                    <div class="col-md-6">
                        <label class="font12">Transaction Date*</label>
                        <div class="form-group" style="height: auto !important">
                            <input type="text" id="advAmtTransDate" class="form-control advReqFields"
                                style="font-size: 13px">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="font12">Transaction Type</label>
                        <div class="form-s2">
                            <select class="form-control formselect" id="advAmtPmtType" placeholder="Select Rider">
                                <option selected disabled value="0">Select Payment Type</option>
                                <option value="1" selected>Cash</option>
                                <option value="2">Bank Transfer</option>
                            </select>
                        </div>
                    </div>
                </div>
                <hr class="mb-10 mt-5">
                <div class="m-0 bank_div" style="display:none;">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label mb-10">Bank Name*</label>
                                <input type="text" class="form-control" id="advAmtBank" style="font-size: 13px">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label mb-10">Transaction No*</label>
                                <input type="text" class="form-control" id="advAmtTransNum" style="font-size: 13px">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-s2">
                                <label class="PT-10 font12">Select Account*</label>
                                <div>
                                    <select class="form-control formselect" id="advAmtAccount"
                                        placeholder="Customer type">
                                        <option value="0" disabled selected>Select Account</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr class="m-0 mt-10">
                </div>
                <hr class="mb-10 mt-5">
                <div class="row">
                    <div class="col-md-6 PT-10 font14">
                        <strong>Advance Amount*</strong>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group" style="height: auto !important">
                            <input type="number" class="form-control advReqFields" id="advanceAmount"
                                style="font-size: 13px">
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer border-0">
                <button type="button" class="btn btn-primary saveAdvAmt">Save</button>
                <button type="submit" class="btn btn-cancel cancel_modal" data-dismiss="modal"
                    aria-label="Close">Cancel</button>
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content top-borderRed">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Delete <span></span></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="col-md-12">
                    <p id="modal_text">Are you sure you want to delete?</p>
                </div>
            </div>
            <div class="modal-footer border-0">
                <button type="button" class="btn btn-primary confirm_delete">Yes</button>
                <button type="button" class="btn btn-cancel cancel_delete_modal" data-dismiss="modal"
                    aria-label="Close">No</button>
            </div>
        </div>
    </div>
    <button hidden data-toggle="modal" data-target="#deleteModal" id="hidden_btn_to_open_modal"></button>
</div>


<div class="modal fade occurencesModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered" style="max-width: 650px">
        <div class="modal-content top_border">
            <div class="modal-header">
                <h5 class="modal-title _head03 w-100" id="exampleModalLongTitle">Item Occurences</h5>
            </div>
            <div class="modal-body" id="occurenciesModalTblDiv">
                <table class="table table-hover dt-responsive nowrap table-PL" style="width:100% !important"
                    id="occurenciesModalTbl">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Item</th>
                            <th>E-Invoice</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer p-0 PT-10" style="margin-bottom: 10px; text-align: center; display: block;">
                <button type="button" class="btn btn-cancel" data-dismiss="modal" aria-label="Close">Close</button>
            </div>
        </div>
    </div>
</div>