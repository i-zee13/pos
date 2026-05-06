var acceptedFileTypes = "image/*"; //dropzone requires this param be a comma separated list
var fileList = new Array();
var i = 0;
var callForDzReset = false;
var customersInfo = [];
var leftOverStock = [];
var itemsInfo = [];
var totalProducts = 1;
var totalPayments = 0;
var selectedProducts = [];
var oldSelectedItem = 0;
var newSelectedItem = 0;
var orderId = null;
var orderValue = 0;
var paymCriteriaSelected = $('[name="paymentCriteria"]:checked').val();
var oldPaymAmount = null;
var currencySelected = "USD.";
var segments = location.href.split("/");

var removed_items = [];
var totalPocs = 1;
var totalContacts = 1;
var dispatchBatch = null;
var updateInProgress = false;
var allAssignments = null;
var allReasons = [];
let productionItemsData = [];
let unassigned = [];
var rows_counts = 0;
var container20FtCbmLimit = 29.25077203;
var container40FtCbmLimit = 57.66580772;
var container40FtHcCbmLimit = 73.54479825;
var advPaymentReceived = false;
var container20Added = [];
var sendingEmail = true;

let allProducts = [];
let allContents = [];

//Reference of the row from which sidebar opening click is initiated
let addItemPrefsRef = null;
let containerTypesAdded = [];

let dropzoneReferences = {
    shipment: null,
    eform: null,
    all: null
};
var order_id_for_payment = 0;
var receive_payment_ref = "";
var pending_inv_amt = 0;
var order_currency_symbol = "";

var multiple_cust_phone_nums = [];
var cust_address_array = [];

let leftOverStockAdjusted = [];

var glob_type = '';
var deleteRef = '';

$(document).ready(function () {

    if (segments[3] == 'historicOrders') {
        $('#tblLoader').hide();
        $('table').DataTable();
        $('.body').show();
    }

    if (segments[3] == "PendingPayments") {
        fetchCustomers();
        fetch_bank_accounts('#advAmtAccount');
        $("#advAmtTransDate").datepicker({
            format: "yyyy-mm-dd"
        });
        $(".recPaymTbld").length ? $(".recPaymTbld").dataTable() : null;
    }

    var oldCbm = 0;

    $('[name="life_cycle_stage"]').change(function () {
        if ($(this).val() == "prospect") {
            $("#prospectDataDiv").css("display", "");
        } else {
            $("#prospectDataDiv").css("display", "none");
        }
    });

    $("#change_follow_up_date")
        .datepicker({
            format: "yyyy-mm-dd"
        })
        .on("changeDate", function (e) {
            $(this).datepicker("hide");
        });

    //For order type in new performa, update performa and dispatch page
    $('[name="order_type"]').change(function () {
        // if ($(this).val() == "FOB") {
        //     $(".nonFobDiv").hide();
        //     $(".fobDiv").show();
        //     $(".insuranceDiv").hide();
        // } else if ($(this).val() == "CFR") {
        //     $(".nonFobDiv").show();
        //     $(".fobDiv").hide();
        //     $(".insuranceDiv").hide();
        // } else {
        //     $(".nonFobDiv").show();
        //     $(".fobDiv").hide();
        //     $(".insuranceDiv").show();
        // }
    });

    //Saif Work (Dispatch)
    if (segments[3] && segments[3] === "Dispatch") {
        dispatchBatch = segments[5];

        $("#invoice_country option").each(function () {
            if (
                $.trim($(this).text()).toLowerCase() ==
                $.trim(orderData["customer_country"]).toLowerCase()
            ) {
                $(this).attr("selected", "selected");
                $("#invoice_country").trigger("change");
            }
        });

        if (orderData["customer_city"])
            $("#invoice_city")
            .val(orderData["customer_city"].toLowerCase())
            .trigger("change");

        $("#editInvoiceDetails").click(function () {
            $("#invoice_to, #invoice_to_address").removeAttr("readonly");
        });

        $(
            "#v-pills-tabContent input, #v-pills-tabContent select, #v-pills-tabContent span"
        ).each(function () {
            let elemId = $(this).attr("id");
            if (!elemId) return;

            if ($(this).hasClass("customInvoiceField")) {
                if (orderData["custom_invoice"][elemId]) {
                    $("#" + elemId).val(orderData["custom_invoice"][elemId]);
                    if (
                        $(this).hasClass("formselect") ||
                        $(this).hasClass("custom-select")
                    ) {
                        $(this).trigger("change");
                    }
                }
                if (elemId == "invoice_date") {
                    $("#" + elemId).val(
                        orderData["custom_invoice"][elemId] ?
                        orderData["custom_invoice"][elemId] :
                        orderData["date_of_shipment"]
                    );
                }
            } else {
                if (
                    $("#" + elemId) &&
                    (orderData[elemId] || orderData[elemId] == 0)
                ) {
                    if ($(this).attr("id") == "all_documents") return;

                    if (!$(this).is("span"))
                        $("#" + elemId).val(orderData[elemId]);
                    else $("#" + elemId).text(orderData[elemId]);

                    if (!$(this).hasClass("datepicker")) $(this).focus();

                    if ($(this).is("select")) $(this).trigger("change");

                    //Saif
                    if (elemId == "invoice_num") {
                        $("#invoice_num_custom_invoice").text(
                            orderData[elemId]
                        );
                    }
                    if (elemId == "eform_num") {
                        $("#form_e_no").val(orderData[elemId]);
                    }
                }
            }
        });

        $(".dispatchOrderDatepicker")
            .datepicker({
                format: "yyyy-mm-dd"
            })
            .on("changeDate", function (e) {
                $(this).datepicker("hide");
            });

        orderData.container_types.forEach(element => {
            $("#dynamicallyAddedContainerTypes")
                .append(`<div class="alert fade show alert-color _add-secon w-100"
            role="alert">
            <div class="row">
                <div class="col-6"><strong>Container
                        Type: &nbsp;</strong> ${element.type}
                        <input value="${element.type}" class="container_type" hidden />
                </div>
                <div class="col-6"><strong>Container
                        No: &nbsp;</strong> ${element.number}
                        <input value="${element.number}" class="container_number" hidden />
                </div>
                <button type="button" class="close alert_close removeAddedContaienr"
                    data-dismiss="alert" aria-label="Close"> <span
                        aria-hidden="true">×</span>
                </button>
            </div>
        </div>`);
        });

        $("#shipment_route")
            .val(orderData.shipment_route)
            .trigger("change");

        setTimeout(() => {
            $("input").blur();
            // if ($('[name="order_type"]:checked').val() == "FOB") {
            //     $(".nonFobDiv").hide();
            //     $(".fobDiv").show();
            //     $(".insuranceDiv").hide();
            // } else if ($('[name="order_type"]:checked').val() == "CFR") {
            //     $(".nonFobDiv").show();
            //     $(".fobDiv").hide();
            //     $(".insuranceDiv").hide();
            // } else {
            //     $(".fobDiv").hide();

            // }
            $(".fobDiv").show();
            $(".nonFobDiv").show();
            $(".insuranceDiv").show();
            $("#loaderWaitDiv").hide();
            $(".tab-content").show();
        }, 200);

        $("#shippingDocsDzContainer").append(
            `<form action="/DispatchOrderDocumentsUpload/Shipment/${
                segments[4]
            }/${dispatchBatch}" class="dropzone" id="shipInfoDz" method="POST" enctype="multipart/form-data"><input name="_token" value="${$(
                '[name="csrf_token"]'
            ).attr("content")}" hidden /></form>`
        );
        $("#eformDocsDzContainer").append(
            `<form action="/DispatchOrderDocumentsUpload/Eform/${
                segments[4]
            }/${dispatchBatch}" class="dropzone" id="eformDz" method="POST" enctype="multipart/form-data"><input name="_token" value="${$(
                '[name="csrf_token"]'
            ).attr("content")}" hidden /></form>`
        );
        $("#diffTypesOfDocumentsDispatchOrdersDzContainer").append(
            `<form action="/DispatchOrderDocumentsUpload/all/${
                segments[4]
            }/${dispatchBatch}" class="dropzone" id="allDocsDz" method="POST" enctype="multipart/form-data"><input name="document_type_selected" hidden /><input name="_token" value="${$(
                '[name="csrf_token"]'
            ).attr("content")}" hidden /></form>`
        );
        setTimeout(() => {
            initMultipleDropzones([{
                    elem: $("form#shipInfoDz"),
                    data: orderData.shipping_documents,
                    type: "shipment"
                },
                {
                    elem: $("form#eformDz"),
                    data: orderData.eform_documents,
                    type: "eform"
                },
                {
                    elem: $("form#allDocsDz"),
                    type: "all"
                }
            ]);
        }, 500);

        renderAllDocs();

        $("#all_documents").change(function () {
            $("#allDocsDz")
                .find('[name="document_type_selected"]')
                .val($(this).val());
        });

        $("#addContainerTypes").click(function () {
            if (!$("#containerNumber").val() || !$("#containerTypeDD").val())
                return;
            $(
                "#dynamicallyAddedContainerTypes"
            ).append(`<div class="alert fade show alert-color _add-secon w-100"
            role="alert">
            <div class="row">
                <div class="col-6"><strong>Container
                        Type: &nbsp;</strong> ${$("#containerTypeDD").val()}
                        <input value="${$(
                            "#containerTypeDD"
                        ).val()}" class="container_type" hidden />
                </div>
                <div class="col-6"><strong>Container
                        No: &nbsp;</strong> ${$("#containerNumber").val()}
                        <input value="${$(
                            "#containerNumber"
                        ).val()}" class="container_number" hidden />
                </div>
                <button type="button" class="close alert_close removeAddedContaienr"
                    data-dismiss="alert" aria-label="Close"> <span
                        aria-hidden="true">×</span>
                </button>
            </div>
        </div>`);
            $("#containerNumber").val("");
        });

        $(document).on("input", ".prodQtyForDispatch", function (e) {
            let toDispatch = parseInt($(this).val());
            let alreadyShipped = parseInt($(this).attr("shipped"));
            let produced = parseInt($(this).attr("produced"));
            if (toDispatch > produced - alreadyShipped) {
                $(this).val(produced - alreadyShipped);
            }
        });

        $(document).on("input", ".gross_weight", function (e) {
            let grossWeight = 0;
            $(".gross_weight").each(function () {
                grossWeight += $(this).val() ? parseFloat($(this).val()) : 0;
            });
            $("#grossWeightPackingList").text(grossWeight + " KGS");
        });

        $(document).on("input", ".dispatch_actual_NW", function (e) {
            let actualNW = 0;
            $(".dispatch_actual_NW").each(function () {
                actualNW += $(this).val() ? parseFloat($(this).val()) : 0;
            });
            $("#actual_NW_packingList").text(actualNW + " KGS");
        });

        $(document).on("keyup", ".commercialUnitPrice", function (e) {
            let newUp = $(this)
                .val()
                .replace(/,/g, "");
            if (!newUp) newUp = 0;

            if (isNaN(newUp) && newUp)
                newUp = newUp.substr(0, newUp.length - 1);

            if (newUp < 0) {
                newUp = 0;
                $(this).val(0);
            }

            newUp ? $(this).val(addCommas(newUp)) : "";
            let itemId = $(this).attr("item-id");
            var itemFound = orderData.contents.find(x => x.id == itemId);
            let finalAmount = (
                parseFloat(newUp) * parseFloat(itemFound.qty)
            ).toFixed(2);
            $(this)
                .parent()
                .parent()
                .find(".totalAmountCommercial span")
                .text(orderData.currency_symbol + " " + addCommas(finalAmount));
            $(this)
                .parent()
                .parent()
                .find(".final_amount")
                .val(finalAmount);
        });

        $("#saveDispatchQty").click(function () {
            let dispatchData = [];
            let qtyMismatch = false;
            $(".prodQtyForDispatch").each(function () {
                if ($(this).val()) {
                    if (
                        parseInt($(this).val()) >
                        parseInt($(this).attr("produced"))
                    )
                        qtyMismatch = true;

                    dispatchData.push({
                        "assignment-id": $(this)
                            .parent()
                            .parent()
                            .attr("assignment-id"),
                        batch: $(this)
                            .parent()
                            .parent()
                            .attr("batch"),
                        "content-id": $(this)
                            .parent()
                            .parent()
                            .attr("content-id"),
                        "item-id": $(this)
                            .parent()
                            .parent()
                            .attr("item-id"),
                        "supplier-id": $(this)
                            .parent()
                            .parent()
                            .attr("supplier-id"),
                        qty: $(this).val(),
                        already_dispatched: $(this).attr("dispatched")
                    });
                }
            });
            if (qtyMismatch) {
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "red");
                $("#notifDiv").text(
                    `You can not dispatch quantity more than produced`
                );
                setTimeout(() => {
                    $("#notifDiv").fadeOut();
                }, 3000);
                return;
            }
            if (!dispatchData.length) {
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "red");
                $("#notifDiv").text(
                    `Please add dispatch quantity for an item first`
                );
                setTimeout(() => {
                    $("#notifDiv").fadeOut();
                }, 3000);
                return;
            }
            $(this).attr("disabled", "disabled");
            $(this).text("Saving..");
            $.ajax({
                type: "POST",
                url: "/SaveDispatchQty/" + segments[4],
                data: {
                    _token: $('meta[name="csrf_token"]').attr("content"),
                    dispatch_batch: dispatchBatch,
                    data: dispatchData
                },
                success: function (response) {
                    if (response.code == 200) {
                        $("#notifDiv").fadeIn();
                        $("#notifDiv").css("background", "green");
                        $("#notifDiv").text(`Dispatch quantities saved`);
                        // $('#v-pills-tab').find('.nav-link').removeClass('disabledWizardSelectors')
                        setTimeout(() => {
                            location.reload();
                            $("#notifDiv").fadeOut();
                        }, 1500);
                        return;
                        orderData = response.data;
                        $("#dispatchProductsTable tbody tr").remove();
                        for (const elem of orderData.contents) {
                            $("#dispatchProductsTable tbody")
                                .append(`<tr class="dispatchProductsSelectionTr"
                                item-id="${elem.item_id}">
                                <td>${elem.item_name}</td>
                                <td>${elem.assigned_qty}</td>
                                <td>${elem.production_quantity}</td>
                                <td>${elem.dispatched_quantity}</td>
                                <td>${elem.production_quantity -
                                    (elem.dispatched_quantity
                                        ? elem.dispatched_quantity
                                        : 0)}</td>
                                <td>
                                    <input
                                        dispatched="${elem.dispatched_quantity}"
                                        max-dispatch-qty="${elem.production_quantity -
                                            (elem.dispatched_quantity
                                                ? elem.dispatched_quantity
                                                : 0)}"
                                        type="number" item-id="${
                                            elem.item_id
                                        }" produced="${
                                elem.production_quantity
                            }" class="cu-Rate prodQtyForDispatch">
                                </td>
                            </tr>`);
                        }
                    }
                    $(this).removeAttr("disabled");
                    $(this).text("Save");
                }.bind($(this))
            });
        });

        $("#saveAllDocuments").click(function () {
            $(this).attr("disabled", "disabled");
            $(this).text("Saving..");
            $.ajax({
                type: "POST",
                url: "/SaveOrderDispatchInfo/All/" +
                    segments[4] +
                    "/" +
                    dispatchBatch,
                data: {
                    _token: $('meta[name="csrf_token"]').attr("content")
                },
                success: function (response) {
                    if (response.code == 200) {
                        $("#notifDiv").fadeIn();
                        $("#notifDiv").css("background", "green");
                        $("#notifDiv").text(`All documents saved`);
                        setTimeout(() => {
                            $("#notifDiv").fadeOut();
                        }, 3000);
                        // dropzoneReferences.all.removeAllFiles(true);
                        orderData = response.data;
                    }
                    $(this).removeAttr("disabled");
                    $(this).text("Save");
                }.bind($(this))
            });
        });

        $("#saveCommercialPrices").click(function () {
            let dirty = false;
            let payload = [];

            $(".commercialPricesTr input").each(function () {
                if (!$(this).val()) dirty = true;
            });

            $(".commercialPricesTr").each(function () {
                payload.push({
                    commercial_unit_price: $(this)
                        .find(".commercialUnitPrice")
                        .val()
                        .replace(/,/g, ""),
                    commercial_amount: $(this)
                        .find(".final_amount")
                        .val(),
                    assignment_id: $(this).attr("assignment-id"),
                    item_id: $(this).attr("item-id"),
                    batch: $(this).attr("batch")
                });
            });

            if (dirty) {
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "red");
                $("#notifDiv").text(
                    "Please provide all the required information"
                );
                setTimeout(() => {
                    $("#notifDiv").fadeOut();
                }, 3000);
                return;
            }

            $(this).attr("disabled", "disabled");
            $(this).text("Saving..");
            $.ajax({
                type: "POST",
                url: "/SaveOrderDispatchInfo/Commercial/" +
                    segments[4] +
                    "/" +
                    dispatchBatch,
                data: {
                    _token: $('meta[name="csrf_token"]').attr("content"),
                    data: payload
                },
                success: function (response) {
                    if (response.code == 200) {
                        $("#notifDiv").fadeIn();
                        $("#notifDiv").css("background", "green");
                        $("#notifDiv").text(`Commercial invoice saved`);
                        setTimeout(() => {
                            $("#notifDiv").fadeOut();
                        }, 3000);
                        orderData = response.data;
                    }
                    $(this).removeAttr("disabled");
                    $(this).text("Save");
                }.bind($(this))
            });
        });

        $("#savePackingList").click(function () {
            let dirty = false;
            let payload = [];

            $(".packingListTr input").each(function () {
                if (!$(this).val()) dirty = true;
            });

            $(".packingListTr").each(function () {
                payload.push({
                    from_ctn_no: $(this)
                        .find(".from_ctn_no")
                        .val(),
                    to_ctn_no: $(this)
                        .find(".to_ctn_no")
                        .val(),
                    gross_weight: $(this)
                        .find(".gross_weight")
                        .val(),
                    dispatch_actual_NW: $(this)
                        .find(".dispatch_actual_NW")
                        .val(),
                    assignment_id: $(this).attr("assignment-id"),
                    item_id: $(this).attr("item-id"),
                    batch: $(this).attr("batch")
                });
            });

            if (dirty) {
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "red");
                $("#notifDiv").text(
                    "Please provide all the required information"
                );
                setTimeout(() => {
                    $("#notifDiv").fadeOut();
                }, 3000);
                return;
            }

            $(this).attr("disabled", "disabled");
            $(this).text("Saving..");
            $.ajax({
                type: "POST",
                url: "/SaveOrderDispatchInfo/PackingList/" +
                    segments[4] +
                    "/" +
                    dispatchBatch,
                data: {
                    _token: $('meta[name="csrf_token"]').attr("content"),
                    data: payload
                },
                success: function (response) {
                    if (response.code == 200) {
                        $("#notifDiv").fadeIn();
                        $("#notifDiv").css("background", "green");
                        $("#notifDiv").text(`Packing list saved`);
                        setTimeout(() => {
                            $("#notifDiv").fadeOut();
                        }, 3000);
                        orderData = response.data;
                    }
                    $(this).removeAttr("disabled");
                    $(this).text("Save");
                }.bind($(this))
            });
        });

        $("#saveEformInfo").click(function () {
            let dirty = false;
            let payload = null;

            if (!$("#bank_name").val()) {
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "red");
                $("#notifDiv").text(
                    "Please provide all the required information"
                );
                setTimeout(() => {
                    $("#notifDiv").fadeOut();
                }, 3000);
                return;
            }
            payload = {
                _token: $('meta[name="csrf_token"]').attr("content"),
                issue_date: $("#issue_date").val(),
                bank_name: $("#bank_name").val(),
                currency: $("#currency").val(),
                currency_symbol: $("#currency option:selected").attr("sign"),
                eform_num: $("#form_e_no").val()
            };

            $(this).attr("disabled", "disabled");
            $(this).text("Saving..");
            $.ajax({
                type: "POST",
                url: "/SaveOrderDispatchInfo/Eform/" +
                    segments[4] +
                    "/" +
                    dispatchBatch,
                data: payload,
                success: function (response) {
                    if (response.code == 200) {
                        $("#notifDiv").fadeIn();
                        $("#notifDiv").css("background", "green");
                        $("#notifDiv").text(`E-Form information saved`);
                        setTimeout(() => {
                            $("#notifDiv").fadeOut();
                        }, 3000);
                        orderData = response.data;
                    }
                    $(this).removeAttr("disabled");
                    $(this).text("Save");
                }.bind($(this))
            });
        });

        $("#saveShipmentInfo").click(function () {
            let dirty = false;
            let payload = null;
            containerTypesAdded = [];
            $(
                ".nonFobDiv input, .nonFobDiv select, .nonFobDiv span, .fobDiv input, .fobDiv select, .fobDiv span, .allField input, .allField select, .allField span"
            ).css("border", "0");
            if ($('[name="order_type"]:checked').val() !== "FOB") {
                $("#dynamicallyAddedContainerTypes .row").each(function () {
                    containerTypesAdded.push({
                        type: $(this)
                            .find(".container_type")
                            .val(),
                        number: $(this)
                            .find(".container_number")
                            .val()
                    });
                });
                $(
                    '.nonFobDiv input:not([type="search"]), .nonFobDiv select'
                ).each(function () {
                    if (
                        $('[name="order_type"]:checked').val() !== "CFI" &&
                        $(this).attr("id") == "insurance_charges"
                    )
                        return;
                    if (
                        (!$(this).val() || $(this).val() == "0") &&
                        $(this).attr("id") != "containerTypeDD" &&
                        $(this).attr("id") != "containerNumber"
                    ) {
                        if (
                            $(this).hasClass("formselect") ||
                            $(this).hasClass("sd-type")
                        ) {
                            $(this)
                                .parent()
                                .find(".select2-container")
                                .css("border", "1px solid red");
                        } else {
                            $(this).css("border", "1px solid red");
                        }
                        dirty = true;
                    }
                });

                if (!containerTypesAdded.length) dirty = true;

                payload = {
                    _token: $('meta[name="csrf_token"]').attr("content"),
                    date_of_shipment: $("#date_of_shipment").val(),
                    port_of_discharge: $("#port_of_discharge").val(),
                    shipment_route: $("#shipment_route").val(),
                    forwarder: $("#forwarder").val(),
                    shipment_company: $("#shipment_company").val(),
                    vessel_number: $("#vessel_number").val(),
                    order_type: $('[name="order_type"]:checked').val(),
                    quoted_freight_charges: $("#quoted_freight_charges").val(),
                    actual_freight_charges: $("#actual_freight_charges").val(),
                    discharge_date: $("#discharge_date").val(),
                    eta_date: $("#eta_date").val(),
                    voyage_number: $("#voyage_number").val(),
                    vessel_name: $("#vessel_name").val(),
                    omi_number: $("#omi_number").val(),
                    quoted_charges_currency: $(
                        "#quoted_charges_currency"
                    ).val(),
                    actual_freight_currency: $(
                        "#actual_freight_currency"
                    ).val(),
                    insurance_charges_currency: $(
                        "#insurance_charges_currency"
                    ).val(),
                    expected_delivery_date: $("#expected_delivery_date").val(),
                    container_types: containerTypesAdded
                };
                if ($('[name="order_type"]:checked').val() == "CFI") {
                    payload.insurance_charges = $("#insurance_charges").val();
                }
            } else {
                $(".fobDiv input, .fobDiv select").each(function () {
                    if (!$(this).val() &&
                        $(this).attr("id") != "containerTypeDD" &&
                        $(this).attr("id") != "containerNumber"
                    ) {
                        if (
                            $(this).hasClass("formselect") ||
                            $(this).hasClass("sd-type")
                        ) {
                            $(this)
                                .parent()
                                .find(".select2-container")
                                .css("border", "1px solid red");
                        } else {
                            $(this).css("border", "1px solid red");
                        }
                        dirty = true;
                    }
                });
                payload = {
                    _token: $('meta[name="csrf_token"]').attr("content"),
                    expected_delivery_date: $("#expected_delivery_date").val(),
                    eta_date: $("#eta_date").val(),
                    order_type: $('[name="order_type"]:checked').val()
                };
            }

            if (!$("#expected_delivery_date").val() || !$("#eta_date").val()) {
                $(".allField input, .allField select").each(function () {
                    if (!$(this).val()) {
                        if (
                            $(this).hasClass("formselect") ||
                            $(this).hasClass("sd-type")
                        ) {
                            $(this)
                                .parent()
                                .find(".select2-container")
                                .css("border", "1px solid red");
                        } else {
                            $(this).css("border", "1px solid red");
                        }
                        dirty = true;
                    }
                });
            }

            if (dirty) {
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "red");
                $("#notifDiv").text(
                    "Please provide all the required information"
                );
                setTimeout(() => {
                    $("#notifDiv").fadeOut();
                }, 3000);
                return;
            }

            $(this).attr("disabled", "disabled");
            $(this).text("Saving..");
            $.ajax({
                type: "POST",
                url: "/SaveOrderDispatchInfo/Shipment/" +
                    segments[4] +
                    "/" +
                    dispatchBatch,
                data: payload,
                success: function (response) {
                    if (response.code == 200) {
                        if (!orderData.custom_invoice.invoice_date) {
                            $(".InvdateTP").datepicker("destroy");
                            $(".InvdateTP").val($("#date_of_shipment").val());
                            $(".InvdateTP").datepicker({
                                format: "yyyy-mm-dd"
                            });
                        }

                        $("#notifDiv").fadeIn();
                        $("#notifDiv").css("background", "green");
                        $("#notifDiv").text("Shipping information saved");
                        setTimeout(() => {
                            $("#notifDiv").fadeOut();
                        }, 3000);
                        orderData = response.data;
                    }
                    $(this).removeAttr("disabled");
                    $(this).text("Save");
                }.bind($(this))
            });
        });

        let editsBegin = false;

        $(document).on("click", ".editableTd", function () {
            $(".editableTd input").each(function () {
                $(this)
                    .parent()
                    .parent()
                    .find("span")
                    .text($(this).val());
                $(this).hide();
                $(this)
                    .parent()
                    .parent()
                    .find("span")
                    .show();
            });
            $(this)
                .find("span")
                .hide();
            $(this)
                .find("input")
                .show();
            editsBegin = true;
        });

        $("body").click(function (e) {
            if (
                editsBegin &&
                !$(e.target).parents("#customInvoiceItemsTable").length
            ) {
                $(".editableTd input").each(function () {
                    $(this)
                        .parent()
                        .parent()
                        .find("span")
                        .text($(this).val());
                    $(this).hide();
                    $(this)
                        .parent()
                        .parent()
                        .find("span")
                        .show();
                });
            }
        });

        $("#saveCustominvInfo").click(function () {
            $(".lcRequired").css("border", "0px");
            let payload = {
                _token: $('meta[name="csrf_token"]').attr("content"),
                data: {},
                items: []
            };

            $(".customInvoiceField").each(function () {
                // if ($(this).attr('id') != 'custom_invoice_id')
                payload.data[$(this).attr("id")] = $(this).val();
            });

            if (
                (orderData.payment_type == "LC" || orderData.payment_type == "ADVLC" || orderData.payment_type == "LCBL") &&
                (!payload.data.lc_through ||
                    !payload.data.lc_number ||
                    !payload.data.lc_date)
            ) {
                $(".lcRequired").each(function () {
                    if (!$(this).val()) $(this).css("border", "1px solid red");
                });
                return;
            }

            $(this).attr("disabled", "disabled");
            $(this).text("Saving..");
            $.ajax({
                type: "POST",
                url: "/SaveCustomInvoice/" + segments[4] + "/" + dispatchBatch,
                data: payload,
                success: function (response) {
                    if (response.code == 200) {
                        $("#notifDiv").fadeIn();
                        $("#notifDiv").css("background", "green");
                        $("#notifDiv").text("Custom invoice saved");
                        setTimeout(() => {
                            $("#notifDiv").fadeOut();
                        }, 3000);
                        orderData = response.data;
                        $("#custom_invoice_id").val(
                            orderData.custom_invoice.custom_invoice_id
                        );
                    }
                    $(this).removeAttr("disabled");
                    $(this).text("Save");
                }.bind($(this))
            });
        });
    } else if (segments[3] == "OrderDetails") {
        $("#content-wrapper").css("padding-left", "15px");
        $("#content-wrapper").addClass("pb-0");

        $("#contentContainerDiv")
            .parent()
            .removeClass("container");
        $("#contentContainerDiv")
            .parent()
            .addClass("container-fluid");
        $("#contentContainerDiv")
            .parent()
            .addClass("OrderWrapper");
        $(".sidebarblue").hide();

        $("#content-wrapper").css("padding-top", "0");
        $(".navbar").hide();
        $("footer").hide();

        $("#followUpDate, .detailsEdt")
            .datepicker({
                format: "yyyy-mm-dd"
            })
            .on("changeDate", function (e) {
                $(this).datepicker("hide");
            });

        // $('#prodDelivDate, #prodFollowupDate').datepicker({
        //     format: 'yyyy-mm-dd'
        // });

        $("#productsToAssignToSupplierTable tbody").html(
            `<tr><td colspan=6 style="text-align: center">Loading..</td></tr>`
        );
        ajaxer("/GetOrderDetailsData", "POST", {
            _token: $('meta[name="csrf_token"]').attr("content"),
            order_id: segments[4]
        }).then(response => {
            $("#productsToAssignToSupplierTable tbody").empty();

            allItemsInOrder = response.order.contents;
            orderData = response.order;
            allAssignments = response.assignments;
            let produced = allAssignments.reduce(
                (sum, val) => sum + val.production_quantity,
                0
            );
            let dispatched = allAssignments.reduce(
                (sum, val) => sum + val.dispatched_quantity,
                0
            );

            if (dispatched > 0) {
                $("#markCompleteBtn").removeClass("peventsDisabled");
                $("#markCompleteBtn").css("opacity", 1);
            }

            allAssignments.forEach(x => {
                if (
                    x.items.find(y => y.production_quantity > 0) &&
                    produced != dispatched
                ) {
                    $("#dispatchBtn").removeClass("peventsDisabled");
                    $("#dispatchBtn").css("opacity", 1);
                }
            });
            renderAllDocs(response.order.all_documents);

            allAssignments.forEach(assigns => {
                assigns.activity_timeline.forEach(item => {
                    if (item.activity_type == "delay") {
                        if (!allReasons.includes(
                                item.before_updated.old_reason
                            ) &&
                            item.before_updated.old_reason
                        ) {
                            allReasons.push(item.before_updated.old_reason);
                        }
                        if (!allReasons.includes(item.new_reason)) {
                            allReasons.push(item.new_reason);
                        }
                    }
                });
            });

            updateContainer20Ft();

            allReasons.forEach(item => {
                $(".delayReason").append(`<option>${item}</option>`);
            });

            $(".delayReason").selectize({
                create: true,
                sortField: "text"
            });

            $("#completeSupplierAssignment").removeAttr("disabled");
            $("#completeSupplierReAssignment").removeAttr("disabled");
            $(".AddSupp, .AssSupplier").removeClass("peventsDisabled");
            $(".reassignment, .followUpBtnModalOpener").removeClass(
                "peventsDisabled"
            );
        });

        $(document).on("click", ".saveCbmCalcOnly", function (e) {
            $(".saveCbmCalcOnly").attr("disabled", true);
            $(".saveCbmCalcOnly").text("Saving");
            ajaxer("/SaveCbmCalcOnly", "POST", {
                _token: $('meta[name="csrf_token"]').attr("content"),
                additional_weight_ctn: $(
                    '[name="additional_weight_ctn"]'
                ).val(),
                actual_net_weight: $('[name="actual_net_weight"]').val(),
                net_weight: $('[name="net_weight"]').val(),
                order_id: segments[4]
            }).then(x => {
                $(".saveCbmCalcOnly").removeAttr("disabled");
                $(".saveCbmCalcOnly").text("Save");
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "green");
                $("#notifDiv").text("CBM information saved successfully");
                setTimeout(() => {
                    $("#notifDiv").fadeOut();
                }, 3000);
            });
        });

        $(document).on("click", ".unassignBtn", function (e) {
            if (!window.confirm("Are you sure you want to unaasign this item?"))
                return;

            let assignFnd = allAssignments.find(
                x =>
                x.batch ==
                $(this)
                .parent()
                .parent()
                .find(".inputQtyToSupplier")
                .attr("batch-code")
            );
            let itmFnd = assignFnd.items.find(
                x =>
                x.item_id ==
                $(this)
                .parent()
                .parent()
                .find(".inputQtyToSupplier")
                .attr("item-id")
            );
            unassigned.push(itmFnd.id);

            $(this)
                .parent()
                .parent()
                .remove();
        });

        $(document).on("click", "#saveShipmentInfoFromDetailsPage", function (
            e
        ) {
            $("#saveShipmentInfoFromDetailsPage").attr("disabled", true);
            $("#saveShipmentInfoFromDetailsPage").text("Saving");
            ajaxer("/SaveShipmentInfoOnly", "POST", {
                _token: $('meta[name="csrf_token"]').attr("content"),
                order_id: segments[4],
                expected_delivery_date: $(".detailsEdt").val(),
                port_of_loading: $("#portOfLoading").val(),
                port_of_discharge: $("#portOfDisch").val(),
                mode_of_shipment: $("#modeOfShipment").val(),
                shipment_route: $("#shipping_route").val(),
                shipment_company: $("#shippedVia").val(),
                quoted_freight_charges: $("#quoted_freight_charges").val()
            }).then(x => {
                if (x.code == 200) {
                    $("#notifDiv").fadeIn();
                    $("#notifDiv").css("background", "green");
                    $("#notifDiv").text("Order information saved successfully");
                    setTimeout(() => {
                        $("#notifDiv").fadeOut();
                    }, 3000);
                } else {
                    $("#notifDiv").fadeIn();
                    $("#notifDiv").css("background", "red");
                    $("#notifDiv").text(
                        "There was a problem saving information"
                    );
                    setTimeout(() => {
                        $("#notifDiv").fadeOut();
                    }, 3000);
                }
                $("#saveShipmentInfoFromDetailsPage").text("Save");
                $("#saveShipmentInfoFromDetailsPage").removeAttr("disabled");
            });
        });

        $(document).on("click", ".reassignment", function (e) {
            if (!allAssignments) return;

            unassigned = [];
            let batch = $(this).attr("batch-code");
            let assignFnd = allAssignments.find(x => x.batch == batch);
            $("#selectSupplierForAssignment").val(assignFnd.supplier_id);
            $("#selectSupplierForAssignment").trigger("change");
            $("#assignEmpsToSupplierAssignmentDD")
                .val(assignFnd.assigned_employees)
                .trigger("change");
            // $('#assignSuppRemarks').val(assignFnd.remarks)
            $(".assignSupplierModal #exampleModalLongTitle").html(
                "Reassignment"
            );

            if ($(this).attr("batch-code"))
                activeBatchForFollowup = $(this).attr("batch-code");

            $("#productsToAssignToSupplierTable tbody").empty();

            $("#completeSupplierAssignment").hide();
            $("#completeSupplierReAssignment").show();

            allItemsInOrder.forEach(x => {
                let itmInAssignmentFnd = assignFnd.items.find(
                    item => item.item_id == x.item_id
                );
                $("#productsToAssignToSupplierTable tbody").append(`
                            <tr content-id="${x.id}">
                                <td>${x.product_name}</td>
                                <td>${x.item_name}</td>
                                <td>${x.qty}</td>
                                <td>${x.qty - x.assigned_qty}</td>
                                <td>
                                <input type="text" class="CN-st-end inputQtyToSupplier" item-id="${
                                    x.item_id
                                }" batch-code="${batch}" content-id="${
                    x.id
                }" placeholder="0" value="${
                    itmInAssignmentFnd ? itmInAssignmentFnd.assigned_qty : ""
                }" >
                                </td>
                                <td>
                                <input type="text" style="width: 100%" class="CN-st-end inputSpecialNote" placeholder="Special Note" value="${
                                    itmInAssignmentFnd &&
                                    itmInAssignmentFnd.special_note
                                        ? itmInAssignmentFnd.special_note
                                        : ""
                                }" />
                                </td>
                                <td>
                                <button class="btn btn-default mb-0 assignQty">${
                                    itmInAssignmentFnd ? "Update" : "Assign"
                                }</button>
                                ${
                                    itmInAssignmentFnd
                                        ? '<button class="btn btn-default mb-0 unassignBtn">UnAssign</button>'
                                        : ""
                                }
                                </td>
                            </tr>`);
            });

            $("#edtDp").datepicker("destroy");
            $("#edtDp").val(assignFnd.expected_delivery_date);
            $("#followUpDate")
                .datepicker()
                .datepicker("setDate", assignFnd.follow_up_date);

            assignUpdating = true;
        });

        $(".continueAssignment").click(function () {
            advPaymentReceived = true;
            $('.cancelAssignment').click();
            openSupplierAssignmentModal();
        });

        $(".AssSupplier, .AddSupp").click(function () {
            if (!allItemsInOrder) return;

            openSupplierAssignmentModal();
        });

        $(document).on("input", ".inputQtyToSupplier", function () {
            let itmFndInOrder = allItemsInOrder.find(
                x => x.id == $(this).attr("content-id")
            );
            let maxQty = itmFndInOrder.qty - itmFndInOrder.assigned_qty;
            if ($(this).attr("batch-code")) {
                let batchFnd = allAssignments.find(
                    x => x.batch == $(this).attr("batch-code")
                );
                let assignmentFnd = batchFnd.items.find(
                    x => x.item_id == $(this).attr("item-id")
                );
                if (assignmentFnd)
                    maxQty =
                    itmFndInOrder.qty -
                    itmFndInOrder.assigned_qty +
                    assignmentFnd.assigned_qty;
                else maxQty = itmFndInOrder.qty - itmFndInOrder.assigned_qty;
            }
            if (parseFloat($(this).val()) > maxQty) $(this).val(maxQty);

            if (isNaN($(this).val()) && $(this).val()) $(this).val("");

            if (parseInt($(this).val()) < 0) $(this).val(0);

            if ($(this).val() > 0)
                $(this)
                .parent()
                .parent()
                .find(".assignQty")
                .removeAttr("disabled");
            else if (!$(this).val() || parseInt($(this).val()) == 0)
                $(this)
                .parent()
                .parent()
                .find(".assignQty")
                .attr("disabled", true);
        });

        $(document).on("click", ".assignQty", function () {
            if (!$(this)
                .parent()
                .parent()
                .find(".inputQtyToSupplier")
                .val()
            ) {
                alert("Please provide valid quantity");
                return;
            }
            if ($(this).text() == "Assign") {
                $(this).text("Assigned");
                $(this).attr("disabled", true);
            } else {
                $(this).text("Updated");
            }
            $(this)
                .parent()
                .parent()
                .find(".inputQtyToSupplier, .inputSpecialNote")
                .attr("disabled", true);
        });

        $(document).on("input", ".assignedProdQtyInput", function () {
            let shippedQty = $(this).attr("dispatched");
            let batchFnd = allAssignments.find(
                x => x.batch == $(this).attr("batch-code")
            );
            let itmFnd = batchFnd.items.find(
                x => x.item_id == $(this).attr("item-id")
            );
            if (parseInt($(this).val()) > parseInt(itmFnd.assigned_qty))
                $(this).val(parseInt(itmFnd.assigned_qty));

            if (parseInt($(this).val()) < parseInt(shippedQty))
                $(this).val(shippedQty);

            if (isNaN($(this).val()) && $(this).val()) $(this).val("");

            if (parseInt($(this).val()) < 0) $(this).val(0);

            if ($(this).val() > 0)
                $(this)
                .parent()
                .parent()
                .find(".assignProdQtyBtn")
                .removeAttr("disabled");
            else if (!$(this).val() || parseInt($(this).val()) == 0)
                $(this)
                .parent()
                .parent()
                .find(".assignProdQtyBtn")
                .attr("disabled", true);
        });

        $(document).on("click", ".assignProdQtyBtn", function () {
            if (!$(this)
                .parent()
                .parent()
                .find(".assignedProdQtyInput")
                .val()
            ) {
                alert("Please provide valid quantity");
                return;
            }
            $(this).text("Added");
            $(this).attr("disabled", true);
            $(this)
                .parent()
                .parent()
                .find(".assignedProdQtyInput")
                .attr("disabled", true);

            productionItemsData = [];
            $(".assignedProdQtyInput").each(function () {
                if (!$(this).val()) return;
                let batchFnd = allAssignments.find(
                    x => x.batch == $(this).attr("batch-code")
                );
                let itmFnd = batchFnd.items.find(
                    x => x.item_id == $(this).attr("item-id")
                );
                productionItemsData.push({
                    assignment_id: itmFnd.id,
                    production_quantity: $(this).val()
                });
            });
        });

        $("#markCompleteBtn").click(function () {
            $("#leftOverStockTable tbody").empty();
            let itemsArr = allAssignments.map(x => x.items);
            let itemsAssignedCombined = [].concat.apply([], itemsArr);
            let itemsAssigned = [];
            itemsAssignedCombined.forEach(elem => {
                let itmFnd = itemsAssigned.find(x => x.item_id == elem.item_id);
                if (itmFnd) {
                    itmFnd.total_qty += elem.total_qty;
                    itmFnd.production_quantity += elem.production_quantity;
                    itmFnd.dispatched_quantity += elem.dispatched_quantity;
                } else itemsAssigned.push(Object.assign({}, elem, {}));
            });
            itemsAssigned.forEach(elem => {
                if (
                    parseFloat(elem.total_qty) -
                    parseFloat(elem.dispatched_quantity) >
                    0
                ) {
                    $("#leftOverStockTable tbody").append(`<tr>
                        <td>${elem.product} <small style="font-weight: 500">${
                        elem.item
                    }</small></td>
                        <td><span class="qty">${elem.total_qty}</span></td>
                        <td>${elem.production_quantity}</td>
                        <td>${elem.dispatched_quantity}</td>
                        <td><span class="rem">${parseFloat(elem.total_qty) -
                            parseFloat(elem.dispatched_quantity)}</span></td>
                        <td><input item-id="${
                            elem.item_id
                        }" class="leftOverStockDpicker" type="text" style="font-size: 13px"></td>
                        </tr>`);
                }
            });
            $(".leftOverStockDpicker").datepicker({
                format: "yyyy-mm-dd",
                startDate: "+1d"
            });
            $(".openOrderCompletionModal").click();
        });

        //First time assignment
        $(document).on("click", "#completeSupplierAssignment", function () {
            if (!$("#selectSupplierForAssignment").val()) {
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "red");
                $("#notifDiv").text("Please select supplier");
                setTimeout(() => {
                    $("#notifDiv").fadeOut();
                }, 3000);
                return;
            }
            let payload = {
                _token: $('meta[name="csrf_token"]').attr("content"),
                contents: []
            };
            let anyItemFnd = false;
            $(".inputQtyToSupplier").each(function () {
                if ($(this).val()) anyItemFnd = true;
            });

            if (!anyItemFnd ||
                !$("#assignEmpsToSupplierAssignmentDD").val() ||
                $("#assignEmpsToSupplierAssignmentDD").val() == ""
            ) {
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "red");
                $("#notifDiv").text(
                    "Please provide all the required information"
                );
                setTimeout(() => {
                    $("#notifDiv").fadeOut();
                }, 3000);
                return;
            }

            if (!$("#assignSuppRemarks").val()) {
                alert("Please provide remarks");
                return;
            }

            $("#completeSupplierAssignment").text("Please Wait");
            $("#completeSupplierAssignment").attr("disabled", true);
            $("#productsToAssignToSupplierTable tbody tr").each(function () {
                if (!$(this)
                    .find(".inputQtyToSupplier")
                    .val() ||
                    parseInt(
                        $(this)
                        .find(".inputQtyToSupplier")
                        .val()
                    ) <= 0
                )
                    return;
                payload.contents.push({
                    item_id: $(this)
                        .find(".inputQtyToSupplier")
                        .attr("item-id"),
                    content_id: $(this)
                        .find(".inputQtyToSupplier")
                        .attr("content-id"),
                    item_quantity: $(this)
                        .find(".inputQtyToSupplier")
                        .val(),
                    order_id: allItemsInOrder[0].order_id,
                    supplier_id: $("#selectSupplierForAssignment").val(),
                    follow_up_date: $("#followUpDate").val(),
                    remarks: $("#assignSuppRemarks").val(),
                    assigned_employees: $(
                        "#assignEmpsToSupplierAssignmentDD"
                    ).val(),
                    special_notes: $(this)
                        .find(".inputSpecialNote")
                        .val(),
                    expected_delivery_date: $("#edtDp").val()
                });
            });
            ajaxer("/AssignSupplier", "POST", payload).then(x => {
                $("#completeSupplierAssignment").text("Assign");
                $("#completeSupplierAssignment").removeAttr("disabled");
                if (x.code == 200) {
                    location.reload();
                    $(".close").click();
                }
            });
        });

        // Reassignment
        $(document).on("click", "#completeSupplierReAssignment", function () {
            if (!$("#selectSupplierForAssignment").val()) {
                alert("Please select a supplier");
                return;
            }
            if (!$("#assignSuppRemarks").val()) {
                alert("Please provide remarks for this update");
                return;
            }
            let payload = {
                _token: $('meta[name="csrf_token"]').attr("content"),
                contents: [],
                removed: unassigned,
                batch: activeBatchForFollowup
            };
            let anyItemFnd = false;
            $(".inputQtyToSupplier").each(function () {
                if ($(this).val()) anyItemFnd = true;
            });
            if (!anyItemFnd ||
                !$("#assignEmpsToSupplierAssignmentDD").val() ||
                $("#assignEmpsToSupplierAssignmentDD").val() == ""
            ) {
                alert("Please provide all the required information");
                return;
            }
            $("#completeSupplierReAssignment").text("Please Wait");
            $("#completeSupplierReAssignment").attr("disabled", true);
            $("#productsToAssignToSupplierTable tbody tr").each(function () {
                if (!$(this)
                    .find(".inputQtyToSupplier")
                    .val() ||
                    parseInt(
                        $(this)
                        .find(".inputQtyToSupplier")
                        .val()
                    ) <= 0
                )
                    return;

                let batchFnd = allAssignments.find(
                    x =>
                    x.batch ==
                    $(this)
                    .find(".inputQtyToSupplier")
                    .attr("batch-code")
                );
                let itmFnd = batchFnd.items.find(
                    x =>
                    x.item_id ==
                    $(this)
                    .find(".inputQtyToSupplier")
                    .attr("item-id")
                );
                payload.contents.push({
                    item_id: $(this)
                        .find(".inputQtyToSupplier")
                        .attr("item-id"),
                    batch: $(this)
                        .find(".inputQtyToSupplier")
                        .attr("batch-code"),
                    content_id: $(this)
                        .find(".inputQtyToSupplier")
                        .attr("content-id"),
                    assignment_id: itmFnd ? itmFnd.id : "",
                    item_quantity: $(this)
                        .find(".inputQtyToSupplier")
                        .val(),
                    order_id: allItemsInOrder[0].order_id,
                    supplier_id: $("#selectSupplierForAssignment").val(),
                    follow_up_date: $("#followUpDate").val(),
                    remarks: $("#assignSuppRemarks").val(),
                    assigned_employees: $(
                        "#assignEmpsToSupplierAssignmentDD"
                    ).val(),
                    special_notes: $(this)
                        .find(".inputSpecialNote")
                        .val(),
                    expected_delivery_date: $("#edtDp").val()
                });
            });
            ajaxer("/UpdateSupplierAssignment", "POST", payload).then(x => {
                $("#completeSupplierReAssignment").text("Assign");
                $("#completeSupplierReAssignment").removeAttr("disabled");
                if (x.code == 200) {
                    location.reload();
                    $(".close").click();
                }
            });
        });

        $(document).on("click", ".deleteSuppAssignmentModal", function () {
            $(".deleteSuppAssignment").attr(
                "batch-code",
                $(this).attr("batch-code")
            );
        });

        $(document).on("click", ".deleteSuppAssignment", function () {
            if (!$("#deleteSuppAssignmentReason").val()) {
                alert("Please provide reason");
                return;
            }
            let batch = $(this).attr("batch-code");
            $(".deleteSuppAssignment").text("Deleting");
            $(".deleteSuppAssignment").attr("disabled", true);
            let payload = {
                _token: $('meta[name="csrf_token"]').attr("content"),
                batch: batch,
                reason: $("#deleteSuppAssignmentReason").val()
            };
            ajaxer("/DeleteSuppAssignment", "POST", payload).then(x => {
                if (x.code == 200) {
                    location.reload();
                    $(".close_comment_modal").click();
                } else {
                    $(".deleteSuppAssignment").removeAttr("disabled");
                    $(".deleteSuppAssignment").text("Delete");
                }
            });
        });

        let activeBatchForFollowup = null;

        $(document).on(
            "click",
            ".followUpBtnModalOpener, #backToFollowupDecider",
            function () {
                $(
                    "#addProductionDiv, #reportDelayDiv, #markCompleteDiv, #backToFollowupDecider, #saveFollowupBtn"
                ).hide();
                $("#followUpDeciderDiv, .closeFollowupModal").show();
                if ($(this).attr("batch-code"))
                    activeBatchForFollowup = $(this).attr("batch-code");

                let batchFnd = allAssignments.find(
                    x => x.batch == activeBatchForFollowup
                );
                $(".followModal #exampleModalLongTitle").html(
                    `Supplier: <span>${batchFnd.supplier}</span> <span class="float-right"> <strong>Follow </strong> Up</span>`
                );
            }
        );

        let layout = "production";

        //Add Production in follow up
        $(document).on("click", "#addProdBtn", function () {
            layout = "production";
            $(
                "#addProductionDiv, #saveFollowupBtn, #backToFollowupDecider"
            ).show();
            $("#followUpDeciderDiv").hide();
            $("#addProductionTable tbody").empty();
            let batchFnd = allAssignments.find(
                x => x.batch == activeBatchForFollowup
            );
            $("#selectSupplierForAssignment").val(batchFnd.supplier_id);
            $("#selectSupplierForAssignment").trigger("change");
            $("#prodAssignedEmps")
                .val(batchFnd.assigned_employees)
                .trigger("change");
            $("#prodAssignedEmps").prop("disabled", true);

            $("#prodDelivDate").val(batchFnd.expected_delivery_date);
            $("#prodFollowupDate").val(batchFnd.follow_up_date);

            batchFnd.items.forEach(x => {
                $("#addProductionTable tbody").append(`
                            <tr>
                                <td>${x.product}</td>
                                <td>${x.item}</td>
                                <td>${x.assigned_qty}</td>
                                <td>${x.dispatched_quantity}</td>
                                <td>
                                <input type="text" class="CN-st-end assignedProdQtyInput" item-id="${
                                    x.item_id
                                }" batch-code="${x.batch}" dispatched="${
                    x.dispatched_quantity
                }" value="${
                    x.production_quantity ? x.production_quantity : ""
                }" placeholder="0">
                                </td>
                                <td>
                                <button class="btn btn-default mb-0 assignProdQtyBtn" disabled>Add</button>
                                </td>
                            </tr>`);
            });
        });

        $(document).on("click", "#repDelayBtn", function () {
            layout = "delay";
            $(
                "#reportDelayDiv, #saveFollowupBtn, #backToFollowupDecider"
            ).show();
            $("#followUpDeciderDiv").hide();

            let assignFnd = allAssignments.find(
                x => x.batch == activeBatchForFollowup
            );
            $(".originalDelivDate").html(assignFnd.expected_delivery_date);
            $("#newDelivDate").val(assignFnd.expected_delivery_date);
            $("#newDelivDate")
                .datepicker({
                    format: "yyyy-mm-dd",
                    startDate: `+${Math.round(
                        moment
                            .duration(
                                moment(
                                    assignFnd.expected_delivery_date,
                                    "YYYY-MM-DD"
                                ).diff(moment())
                            )
                            .asDays() + 1
                    )}d`
                })
                .on("changeDate", function (e) {
                    $(this).datepicker("hide");
                });
        });

        $(document).on("click", "#markComplBtn", function () {
            layout = "completion";
            $("#markCompleteDiv, #backToFollowupDecider").show();
            $(
                "#followUpDeciderDiv, #saveFollowupBtn, .closeFollowupModal"
            ).hide();

            let batchFnd = allAssignments.find(
                x => x.batch == activeBatchForFollowup
            );
            $("#markCompleteTable tbody").empty();
            batchFnd.items.forEach(x => {
                $("#markCompleteTable tbody").append(`
                            <tr>
                                <td>${x.product}</td>
                                <td>${x.item}</td>
                                <td>${x.assigned_qty}</td>
                                <td>
                                ${
                                    x.production_quantity
                                        ? x.production_quantity
                                        : 0
                                }
                                </td>
                            </tr>`);
            });
        });

        $(document).on("click", "#yesMarkComplete", function () {
            $("#yesMarkComplete").text("Saving");
            $("#yesMarkComplete").attr("disabled", true);
            ajaxer("/MarkComplete", "POST", {
                _token: $('meta[name="csrf_token"]').attr("content"),
                batch: activeBatchForFollowup
            }).then(response => {
                if (response.code == 200) {
                    $("#yesMarkComplete").text("Saved");
                    location.reload();
                } else {
                    $("#yesMarkComplete").text("Yes");
                    $("#yesMarkComplete").removeAttr("disabled");
                }
            });
        });

        $(document).on("click", "#saveFollowupBtn", function () {
            if (layout == "production") {
                if (!productionItemsData.length) {
                    alert("Please add items to production");
                    return;
                }
                if (!$("#addProductionRemarks").val()) {
                    alert(
                        "Please provide remarks for this production information"
                    );
                    return;
                }
                $("#saveFollowupBtn").text("Saving");
                $("#saveFollowupBtn").attr("disabled", true);
                ajaxer("/SaveProductionQty", "POST", {
                    _token: $('meta[name="csrf_token"]').attr("content"),
                    data: productionItemsData,
                    remarks: $("#addProductionRemarks").val(),
                    follow_up_date: $("#prodFollowupDate").val()
                }).then(response => {
                    if (response.code == 200) {
                        $("#saveFollowupBtn").text("Saved");
                        location.reload();
                    } else {
                        $("#saveFollowupBtn").text("Save");
                        $("#saveFollowupBtn").attr("disabled", true);
                    }
                });
            } else {
                if (!$(".delayReason").val()) {
                    alert("Please provide reason for the delay");
                    return;
                }
                if (
                    $("#newDelivDate").val() == $(".originalDelivDate").text()
                ) {
                    alert("Please provide new delivery date");
                    return;
                }
                $("#saveFollowupBtn").text("Saving");
                $("#saveFollowupBtn").attr("disabled", true);
                ajaxer("/ReportDelay", "POST", {
                    _token: $('meta[name="csrf_token"]').attr("content"),
                    batch: activeBatchForFollowup,
                    delay_reason: $(".delayReason").val(),
                    expected_delivery_date: $("#newDelivDate").val()
                }).then(response => {
                    if (response.code == 200) {
                        $("#saveFollowupBtn").text("Saved");
                        location.reload();
                    } else {
                        $("#saveFollowupBtn").text("Save");
                        $("#saveFollowupBtn").attr("disabled", true);
                    }
                });
            }
        });
    }

    $(document).on("click", "#saveLeftOverStock", function () {
        if (orderLayout) {
            addLeftoverStockToOrder();
            return;
        }
        let data = [];
        $(".leftOverStockDpicker").each(function () {
            data.push({
                item_id: $(this).attr("item-id"),
                expiry: $(this).val(),
                stock_qty: $(this)
                    .parent()
                    .parent()
                    .find(".qty")
                    .text(),
                left_over_qty: $(this)
                    .parent()
                    .parent()
                    .find(".rem")
                    .text()
            });
        });
        $(this).attr("disabled", true);
        $(this).text("Saving..");
        ajaxer("/SaveLeftoverStock/" + segments[4], "POST", {
            _token: $('meta[name="csrf_token"]').attr("content"),
            data: data
        }).then(x => {
            $(this).text("Saved");
            if (x.code == 200) {
                window.location = "/OrderManagement";
            }
        });
    });

    if (
        (segments[4] &&
            segments[4] === "create" &&
            segments[3] !== "Correspondence") ||
        (segments[5] && segments[5] === "edit")
    ) {
        var myDropzone = new Dropzone("#dropzonewidgetcustImages", {
            url: "/upload_customer_images",
            addRemoveLinks: true,
            maxFiles: 4,
            acceptedFiles: "image/*",
            maxFilesize: 5,
            init: function () {
                this.on("success", function (file, serverFileName) {
                    file.serverFn = serverFileName;
                    fileList[i] = {
                        serverFileName: serverFileName,
                        fileName: file.name,
                        fileId: i
                    };
                    i++;
                });
            },
            removedfile: function (file) {
                var cust_key = $(".doc_key").val();
                if ($(".operation_docs").val() == "update") {
                    var name = "";
                    if (file.name.split("customer_docs/")[1]) {
                        name = file.name.split("customer_docs/")[1];
                    } else {
                        name = file.serverFn;
                    }
                    $.ajax({
                        type: "GET",
                        url: "/remove_customer_images/" + name,
                        data: {
                            _token: "{!! csrf_token() !!}",
                            cust_key: cust_key
                        },
                        success: function (data) {
                            var _ref;
                            return (_ref = file.previewElement) != null ?
                                _ref.parentNode.removeChild(
                                    file.previewElement
                                ) :
                                void 0;
                        }
                    });
                } else {
                    if (!callForDzReset) {
                        var name = file.serverFn;
                        //var cust_key = $('.doc_key').val();
                        //console.log(cust_id);
                        $.ajax({
                            type: "GET",
                            url: "/remove_customer_images/" + name,
                            data: {
                                _token: "{!! csrf_token() !!}",
                                cust_key: cust_key
                            },
                            success: function (data) {
                                console.log("success: " + data);
                            }
                        });
                    }
                    var _ref;
                    return (_ref = file.previewElement) != null ?
                        _ref.parentNode.removeChild(file.previewElement) :
                        void 0;
                }
            }
        });

        setTimeout(() => {
            $(".fobDiv").show();
            $(".nonFobDiv").show();
            $(".insuranceDiv").show();

            $("#loaderWaitDiv").hide();
            $(".tab-content").show();
        }, 500);

        $(".sidebarblue").hide();
        $("#content-wrapper").css("padding-left", "10px");
        $("#content-wrapper").css("padding-bottom", "70px");
        $(".navbar").hide();
        $("footer").hide();
        fetchCustomers();
        if (segments[5] && segments[5] === "edit") {
            debugger;
            ajaxer("/GetOrderDetailsData", "POST", {
                _token: $('meta[name="csrf_token"]').attr("content"),
                order_id: segments[4]
            }).then(response => {
                allItemsInOrder = response.order;
                allProducts = response.products;
                allContents = response.items;
                currencySelected = $("#currencySelector").val() + ".";
                //Bcause totalProducts start from index 1
                totalProducts =
                    $("#productsContainer ._row-product").length + 1;
                totalPayments = $(".pamentsRow").length;
                allItemsInOrder.contents.forEach((element, index) => {
                    let itemsForThisProduct = allProducts.find(
                        x => x.id == element.product_id
                    ).items;
                    $(`#prodItemsListDD${index + 1}`).empty();
                    itemsForThisProduct.forEach(item => {

                        let itmName = `${item.unit_weight} Gm/${item.unit_name},
                                ${ (item.unit_quantity ? (item.unit_quantity + ' ' + item.unit_name+'s/'+item.variant_name+',') : '') }
                                ${ (item.variant_2_name ? (item.variant_quantity_2 + ' ' + item.variant_name+'s/'+item.variant_2_name+',') : '') }
                                ${ (item.variant_3_name ? (item.variant_quantity_3 + ' ' + item.variant_2_name+'s/'+item.variant_3_name+',') : '') }
                                ${ (item.variant_3_name ? (item.unit_variant_quantity + " "+item.variant_3_name) : (item.variant_2_name ? (item.unit_variant_quantity+" "+item.variant_2_name) : (item.unit_variant_quantity+" "+(item.variant_name ? item.variant_name : item.unit_name)))) }s/Carton`;

                        let newOption = new Option(
                            itmName,
                            item.id,
                            false,
                            false
                        );

                        $(`#prodItemsListDD${index + 1}`).append(newOption);
                    });
                    $(`#prodItemsListDD${index + 1}`).val(element.item_id);
                    updateInProgress = true;
                    $(`#prodItemsListDD${index + 1}`).trigger("change");
                    var itemFound = itemsForThisProduct.find(
                        x => x.id == element.item_id
                    );
                    $(`#prodItemsListDD${index + 1}`)
                        .parent()
                        .parent()
                        .parent()
                        .find("#description")
                        .html(
                            `${itemFound.unit_weight} Gm/${itemFound.unit_name},
        ${ (itemFound.unit_quantity ? (itemFound.unit_quantity + ' ' + itemFound.unit_name+'s/'+itemFound.variant_name+',') : '') }
        ${ (itemFound.variant_2_name ? (itemFound.variant_quantity_2 + ' ' + itemFound.variant_name+'s/'+itemFound.variant_2_name+',') : '') }
        ${ (itemFound.variant_3_name ? (itemFound.variant_quantity_3 + ' ' + itemFound.variant_2_name+'s/'+itemFound.variant_3_name+',') : '') }
        ${ (itemFound.variant_3_name ? (itemFound.unit_variant_quantity + " "+itemFound.variant_3_name) : (itemFound.variant_2_name ? (itemFound.unit_variant_quantity+" "+itemFound.variant_2_name) : (itemFound.unit_variant_quantity+" "+(itemFound.variant_name ? itemFound.variant_name : itemFound.unit_name)))) }s/Carton`
                        );
                    $(`#prodItemsListDD${index + 1}`)
                        .parent()
                        .parent()
                        .parent()
                        .find(".itemCbm")
                        .val(element.cbm ? element.cbm : "");
                    $(`#prodItemsListDD${index + 1}`)
                        .parent()
                        .parent()
                        .parent()
                        .find(".totalQty")
                        .val(element.qty ? element.qty : "");
                    $(`#prodItemsListDD${index + 1}`)
                        .parent()
                        .parent()
                        .parent()
                        .find(".totalItemCbm")
                        .val(
                            element.total_cbm ?
                            parseFloat(element.total_cbm) :
                            ""
                        );
                    $(`#prodItemsListDD${index + 1}`)
                        .parent()
                        .parent()
                        .parent()
                        .find(".unitPrice")
                        .val(
                            element.unit_price ?
                            currencySelected + element.unit_price :
                            ""
                        );
                    $(`#prodItemsListDD${index + 1}`)
                        .parent()
                        .parent()
                        .parent()
                        .find(".totalItemAmount")
                        .val(
                            element.amount ?
                            currencySelected +
                            addCommas(element.amount) :
                            ""
                        );
                });
                setTimeout(() => {
                    updateInProgress = false;
                    updateTotalAmount($("#order_discount").val());
                    updateTotalCartansQty();
                    updateContainer20Ft();
                }, 500);
                for (let index = 1; index <= totalPayments; index++) {
                    if ($(".paymDueDate" + index).length)
                        $(".paymDueDate" + index)
                        .datepicker({
                            format: "yyyy-mm-dd",
                            startDate: "+0d"
                        })
                        .on("changeDate", function (e) {
                            $(this).datepicker("hide");
                        });
                }

                orderValue = $("#totalOrderValue").val();
                orderId = $('[name="order_id"]').val();
            });
        } else {
            $("#addMoreProductsInOrder").css("pointer-events", "none");
            $("#addMoreProductsInOrder").html("Loading..");
            fetchProducts().then(x => {
                $("#addMoreProductsInOrder").css("pointer-events", "");
                $("#addMoreProductsInOrder").html(`<i class="fa fa-plus"> </i>
                        Add a Product`);
            });
        }
    }

    if (segments[3] == "OrderManagement") {
        fetch_bank_accounts();
        $("#datepicker-modal, #transaction_date_cash").datepicker({
            format: "yyyy-mm-dd"
        });
        $(".order_listing").dataTable();
    }

    if (segments[3] == "home") {
        fetch_bank_accounts();
    }

    $("#cbmCalculation").click(function () {
        openSidebar("#performaPreferences");
    });

    $("#shippingDetailsBtn").click(function () {
        openSidebar("#performaPreferences");
        $("#performaPreferences .form-wrap").hide();
        $("#shippingDetailsDiv").show();
        $("#performaPreferencesHeading").text("Shipping Details");
        $(".paymentContentFooter").hide();
        $(".itemContentFooter").hide();
        $(".saveContentFooter").show();
    });

    $("#paymentSettingsBtn").click(function () {
        openSidebar("#performaPreferences");
        $("#performaPreferences .form-wrap").hide();
        $("#paymentSettingsDiv").show();
        $("#performaPreferencesHeading").text("Payment Settings");
        $(".paymentContentFooter").show();
        $(".itemContentFooter").hide();
        $(".saveContentFooter").hide();
    });

    $("#currencyBtn").click(function () {
        openSidebar("#performaPreferences");
        $("#performaPreferences .form-wrap").hide();
        $("#currencyOption").show();
        $("#performaPreferencesHeading").text("Currency Options");
        $(".paymentContentFooter").hide();
        $(".itemContentFooter").hide();
        $(".saveContentFooter").show();
    });

    $("#cbmCalculationBtn").click(function () {
        openSidebar("#performaPreferences");
        $("#performaPreferences .form-wrap").hide();
        $("#shipmentCalculation").show();
        $("#performaPreferencesHeading").text("CBM Calculation");
        $(".paymentContentFooter").hide();
        $(".itemContentFooter").hide();
        $(".saveContentFooter").show();
    });

    $("#currencySelector").change(function () {
        var newCurrency = $(this).val() + ".";
        let totalAmount = 0;
        $("._row-product").each(function () {
            if (
                $(this)
                .find(".unitPrice")
                .attr("placeholder")
            )
                $(this)
                .find(".unitPrice")
                .attr(
                    "placeholder",
                    $(this)
                    .find(".unitPrice")
                    .attr("placeholder")
                    .replace(currencySelected, newCurrency)
                );

            totalAmount += $(this)
                .find(".totalItemAmount")
                .val() ?
                parseFloat(
                    $(this)
                    .find(".totalItemAmount")
                    .val()
                    .replace(currencySelected, "")
                    .replace(/,/g, "")
                ) :
                0;

            if (
                $(this)
                .find(".totalItemAmount")
                .attr("placeholder")
            )
                $(this)
                .find(".totalItemAmount")
                .attr(
                    "placeholder",
                    $(this)
                    .find(".totalItemAmount")
                    .attr("placeholder")
                    .replace(currencySelected, newCurrency)
                );

            $(this)
                .find(".unitPrice")
                .val() ?
                $(this)
                .find(".unitPrice")
                .val(
                    $(this)
                    .find(".unitPrice")
                    .val()
                    .replace(currencySelected, newCurrency)
                ) :
                "";
            $(this)
                .find(".totalItemAmount")
                .val() ?
                $(this)
                .find(".totalItemAmount")
                .val(
                    $(this)
                    .find(".totalItemAmount")
                    .val()
                    .replace(currencySelected, newCurrency)
                ) :
                "";
        });
        $(".totalAm").html() ?
            $(".totalAm").html(
                $(".totalAm")
                .html()
                .replace(currencySelected, newCurrency)
            ) :
            "";
        $(".amount_after_discount").html() ?
            $(".amount_after_discount").html(
                $(".amount_after_discount")
                .html()
                .replace(currencySelected, newCurrency)
            ) :
            "";
        $("._order-price").html(
            `<span>Amount Due (${newCurrency})</span> ${newCurrency}${addCommas(
                totalAmount
            )}`
        );
        $(".currencyChange").text(newCurrency);
        currencySelected = newCurrency;
    });

    var oldLength = 0;
    var oldWidth = 0;
    var oldHeight = 0;
    var oldIprice = 0;
    var oldQty = 0;
    var oldUp = 0;

    $(document).on("click", "#saveSupplierOrderAssignment", function () {
        if (!$("#supplierIdforAssignment").val()) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please select supplier");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
        $("#saveSupplierOrderAssignment").attr("disabled", "disabled");
        $.ajax({
            type: "GET",
            url: `/Orders/assignOrderToSupplier/${$(
                "#supplierIdforAssignment"
            ).val()}/${orderId}`,
            success: function (response) {
                if (JSON.parse(response) == "success") {
                    $("#notifDiv").fadeIn();
                    $("#notifDiv").css("background", "green");
                    $("#notifDiv").text(
                        "Order has been assigned to the supplier"
                    );
                    setTimeout(() => {
                        $("#notifDiv").fadeOut();
                    }, 3000);
                    $("#dismissAssignmentModal").click();
                }
                $("#saveSupplierOrderAssignment").removeAttr("disabled");
            }
        });
    });

    $(".viewInvoiceFromCard").click(function () {
        $("#dateOfIssue").text("Loading..");
        $("#poNum").text("Loading..");
        $("#invoiceNum").text("Loading..");
        $("#companyName").text("Loading..");
        $("._order-price").html(`<span>Total Amount (PKR)</span>Loading..`);
        $("#poc").text("Loading..");
        $("#country").text("Loading..");
        $("#region").text("Loading..");
        $(".totalCtns").html("Loading..");
        $(".totalAmModal").html("Loading..");
        $("#notes").text("Loading..");
        $("#terms").text("Loading..");
        $("#editPerformaFromInvoice").attr(
            "href",
            `Orders/${$(this).attr("id")}/edit`
        );
        $.ajax({
            type: "GET",
            url: `/Orders/invoice/${$(this).attr("id")}`,
            success: function (response) {
                var data = JSON.parse(response);
                $("#dateOfIssue").text(data["basic_info"].issue_date);
                $("#poNum").text(data["basic_info"].po_num);
                $("#invoiceNum").text(data["basic_info"].invoice_num);
                $("#companyName").text(data["basic_info"].company);
                $("._order-price").html(
                    `<span>Total Amount (${
                        data["basic_info"].currency
                    })</span>${data["basic_info"].currency} ${addCommas(
                        data["basic_info"].total_amount
                    )}`
                );
                $("#poc").text(data["basic_info"].poc);
                $("#country").text(data["basic_info"].country);
                $("#region").text(data["basic_info"].region);
                $(".totalAmModal").html(
                    `${data["basic_info"].currency} ${addCommas(
                        data["basic_info"].total_amount
                    )}`
                );
                $("#notes").text(data["basic_info"].notes);
                $("#terms").text(data["basic_info"].terms);
                $("#dynamicRowProducts").empty();
                let ttlCtns = 0;
                data.contents.forEach(element => {
                    $("#dynamicRowProducts")
                        .append(`<div class="row _row-product">
                    <div class="col-12 p-0">
                        <div class="addItemCell PL-5">
                            <strong>${element.product}</strong><br>
                            ${
                                element.product_description
                                    ? element.product_description
                                    : ""
                            }
                        </div>
                        <div class="addItemCell2 _h25">${element.qty}</div>
                        <div class="addItemCelWEIGHT _h25">${element.weight_per_unit.toFixed(
                            2
                        )} Grams</div>
                        <div class="addItemCelWEIGHT _h25">${element.weight_per_ctn.toFixed(
                            2
                        )} KG</div>
                        <div class="addItemCellcbm _h25">${element.cbm.toFixed(
                            4
                        )}</div>
                        <div class="addItemCellcbm _h25">${element.total_cbm.toFixed(
                            4
                        )}</div>
                        <div class="addItemCell2 _h25">${
                            data["basic_info"].currency
                        } ${addCommas(element.unit_price.toFixed(2))}</div>
                        <div class="addItemCell3 _h25">${
                            data["basic_info"].currency
                        } ${addCommas(element.amount.toFixed(2))}</div>
                    </div>
                    <div class="col-12 p-0">
                        <div class="row m-0 mt-5">
                            <div class="itemCellpDes">${
                                element.product_desc
                            }</div>
                        </div>
                    </div>
                </div>`);
                    ttlCtns += element.qty;
                });
                $(".viewInvoice").click();
                $(".totalCtns").html(ttlCtns);
            }
        });
    });

    $(document).on("click", "#processOrder", function () {
        let dirty = false;
        // if (
        //     orderData.order_type !== "FOB" &&
        //     (!orderData.date_of_shipment ||
        //         !orderData.port_of_discharge ||
        //         !orderData.shipment_route ||
        //         !orderData.shipment_route.length ||
        //         !orderData.container_types ||
        //         !orderData.container_types.length ||
        //         !orderData.forwarder ||
        //         !orderData.quoted_freight_charges ||
        //         !orderData.actual_freight_charges ||
        //         !orderData.discharge_date)
        // )
        //     dirty = true;
        // else if (
        //     orderData.order_type == "FOB" &&
        //     !orderData.expected_delivery_date
        // ) {
        //     dirty = true;
        // }
        dirty = !dirty ?
            orderData.contents.filter(x => x.from_ctn_no).length ?
            false :
            true :
            true;
        dirty = !dirty ?
            orderData.contents.filter(x => x.commercial_unit_price).length ?
            false :
            true :
            true;
        if (!orderData.bank_name || !orderData.issue_date) dirty = true;

        if (dirty) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text(
                "Please provide all the required information (*) in each section"
            );
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }

        var thisRef = $(this);
        thisRef.attr("disabled", "disabled");
        thisRef.text("Processing...");
        $.ajax({
            type: "POST",
            url: `/OrderManagement/updateOrderStatus`,
            data: {
                id: segments[4],
                status: "processed",
                dispatch_batch: dispatchBatch,
                _token: $('meta[name="csrf_token"]').attr("content")
            },
            success: function (response) {
                if (response) {
                    $("#notifDiv").fadeIn();
                    $("#notifDiv").css("background", "green");
                    $("#notifDiv").text("Order processed successfully");
                    setTimeout(() => {
                        $("#notifDiv").fadeOut();
                    }, 3000);
                    location.href = "/OrderDetails/" + segments[4];
                    return;
                }
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "red");
                $("#notifDiv").text("Unable to process order at the moment");
                setTimeout(() => {
                    $("#notifDiv").fadeOut();
                }, 3000);
            }
        });
    });

    $(document).on("click", ".completeOrder", function () {
        var thisRef = $(this);
        thisRef.attr("disabled", "disabled");
        thisRef.text("Completing");
        $.ajax({
            type: "POST",
            url: `/OrderManagement/updateOrderStatus`,
            data: {
                id: thisRef.attr("id"),
                status: "completed",
                _token: $('meta[name="csrf_token"]').attr("content")
            },
            success: function (response) {
                if (response) {
                    $("#notifDiv").fadeIn();
                    $("#notifDiv").css("background", "green");
                    $("#notifDiv").text("Order completed successfully");
                    setTimeout(() => {
                        $("#notifDiv").fadeOut();
                    }, 3000);
                    thisRef
                        .parent()
                        .parent()
                        .find(".processOrder")
                        .remove();
                    thisRef
                        .parent()
                        .parent()
                        .find("td:eq(4)")
                        .text("Completed");
                    thisRef.remove();
                    return;
                }
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "red");
                $("#notifDiv").text("Unable to process order at the moment");
                setTimeout(() => {
                    $("#notifDiv").fadeOut();
                }, 3000);
            }
        });
    });

    $(document).on("click", ".viewOrderSheet", function () {
        let batch = $(this).attr("batch-code") ?
            $(this).attr("batch-code") :
            null;
        $("#dynamicRowProductsOrderModal").empty();
        $("#orderModalId").text("Loading..");
        $("#orderModalInv").text("Loading..");
        $("#orderModalCompany").text("Loading..");
        $("#orderModalOrderPrice").html(
            `<span>Total Amount (PKR)</span>Loading..`
        );
        $("#orderModalPoc").text("Loading..");
        $("#orderModalPo").text("Loading..");
        $("#orderModalCountry").text("Loading..");
        $("#orderModalRegion").text("Loading..");
        $("#orderModalDate").html("Loading..");
        $("#orderModalTtlCtns").html("Loading..");
        $("#order_discount_modal").text("Loading..");
        $("#downloadOrderSheetPDF").attr(
            "href",
            `/fpdf/order_sheet.php?oid=${$(this).attr("id")}${
                batch ? `&batch=${$(this).attr("batch-code")}` : ""
            }`
        );
        $.ajax({
            type: "GET",
            url: `/OrderManagement/invoice/${$(this).attr("id")}/${$(this).attr(
                "batch-code"
            )}`,
            success: function (response) {
                var data = JSON.parse(response);
                $("#orderModalDate").text(data["basic_info"].issue_date);
                $("#orderModalPo").text(
                    data["basic_info"].po_num ? data["basic_info"].po_num : "NA"
                );
                $("#orderModalInv").text(data["basic_info"].invoice_num);
                $("#order_discount_modal").text(
                    data["basic_info"].order_discount + "%"
                );
                $("#orderModalCompany").text(data["basic_info"].company);
                $("#orderModalOrderPrice").html(
                    `<span>Total Amount (${
                        data["basic_info"].currency
                    })</span>${data["basic_info"].currency} ${addCommas(
                        parseFloat(data["basic_info"].total_amount) -
                            parseFloat(data["basic_info"].discount_value)
                    )}`
                );
                $("#orderModalPoc").text(data["basic_info"].poc);
                $("#orderModalCountry").text(
                    data["basic_info"].country.toUpperCase()
                );
                $("#orderModalRegion").text(
                    data["basic_info"].city ? data["basic_info"].city : "NA"
                );
                $("#dynamicRowProductsOrderModal").empty();
                let ttlCtns = 0;
                data.contents.forEach(element => {
                    let itmFnd = null;
                    if (batch) {
                        itmFnd = allAssignments
                            .find(x => x.batch == batch)
                            .items.find(y => y.item_id == element.item_id);
                        if (!itmFnd) return;
                    }
                    let itmDetailFnd = data.items.find(i => i.id == itmFnd.item_id);
                    let itmName = `${itmDetailFnd.unit_weight} Gm/${itmDetailFnd.unit_name},
            ${itmDetailFnd.unit_quantity} ${itmDetailFnd.unit_name}s/${itmDetailFnd.variant_name},
            ${ (itmDetailFnd.variant_2_name ? (itmDetailFnd.variant_quantity_2 + ' ' + itmDetailFnd.variant_name+'s/'+itmDetailFnd.variant_2_name+',') : '') }
            ${ (itmDetailFnd.variant_3_name ? (itmDetailFnd.variant_quantity_3 + ' ' + itmDetailFnd.variant_2_name+'s/'+itmDetailFnd.variant_3_name+',') : '') }
            ${ (itmDetailFnd.variant_3_name ? (itmDetailFnd.unit_variant_quantity + " "+itmDetailFnd.variant_3_name) : (itmDetailFnd.variant_2_name ? (itmDetailFnd.unit_variant_quantity+" "+itmDetailFnd.variant_2_name) : (itmDetailFnd.unit_variant_quantity+" "+itmDetailFnd.variant_name))) }s/Carton`;
                    $("#dynamicRowProductsOrderModal")
                        .append(`<div class="row _row-product">
                    <div class="col-12 p-0">
                        <div class="addItemCell PL-5" style="width: 250px !important">
                            <strong>${
                                batch ? itmFnd.assigned_qty : element.qty
                            }</strong>
                        </div>
                        <div class="addItemCell2 _h25"
                            style="width: 300px !important; text-align: left !important;">
                            ${itmName}</div>
                        <div class="addItemCelWEIGHT _h25"
                            style="width: 300px !important; text-align: left !important;">
                            ${
                                element.product_desc ? element.product_desc : ""
                            }</div>
                    </div>
                    <div class="col-12 p-0">
                        <div class="row m-0 mt-5">
                            <div class="itemCellpDes"></div>
                        </div>
                    </div>
                </div>`);
                    ttlCtns += batch ? itmFnd.assigned_qty : element.qty;
                });
                $("#orderModalTtlCtns").html(ttlCtns);
            }
        });
    });

    $(document).on("click", ".viewInvoice", function () {
        $("#dateOfIssue").text("Loading..");
        $("#poNum").text("Loading..");
        $("#invoiceNum").text("Loading..");
        $("#companyName").text("Loading..");
        $("._order-price").html(`<span>Total Amount (PKR)</span>Loading..`);
        $("#poc").text("Loading..");
        $("#country").text("Loading..");
        $("#region").text("Loading..");
        $(".totalCtns").html("Loading..");
        $(".totalAmModal").html("Loading..");
        $("#notes").text("Loading..");
        $("#terms").text("Loading..");
        $("#editPerformaFromInvoice").attr(
            "href",
            `/Orders/${$(this).attr("id")}/edit`
        );
        $("#downloadInvoicePDF").attr(
            "href",
            "/invoice-pdf/?performa=" + $(this).attr("id")
        );
        $.ajax({
            type: "GET",
            url: `/Orders/invoice/${$(this).attr("id")}`,
            success: function (response) {
                var data = JSON.parse(response);
                $("#dateOfIssue").text(data["basic_info"].issue_date);
                $("#poNum").text(data["basic_info"].po_num);
                $("#invoiceNum").text(data["basic_info"].invoice_num);
                $("#companyName").text(data["basic_info"].company);
                $("._order-price").html(
                    `<span>Total Amount (${
                        data["basic_info"].currency
                    })</span>${data["basic_info"].currency} ${addCommas(
                        data["basic_info"].total_amount
                    )}`
                );
                $("#poc").text(data["basic_info"].poc);
                $("#country").text(data["basic_info"].country);
                $("#region").text(data["basic_info"].city);
                $(".totalAmModal").html(
                    `${data["basic_info"].currency} ${addCommas(
                        data["basic_info"].total_amount
                    )}`
                );
                $("#notes").text(data["basic_info"].notes);
                $("#terms").text(data["basic_info"].terms);
                $("#dynamicRowProducts").empty();
                let ttlCtns = 0;
                data.contents.forEach(element => {
                    $("#dynamicRowProducts")
                        .append(`<div class="row _row-product">
                    <div class="col-12 p-0">
                        <div class="addItemCell PL-5">
                            <strong>${element.product}</strong><br>
                            ${
                                element.product_description
                                    ? element.product_description
                                    : ""
                            }
                        </div>
                        <div class="addItemCell2 _h25">${element.qty}</div>
                        <div class="addItemCelWEIGHT _h25">${element.weight_per_unit.toFixed(
                            2
                        )} Grams</div>
                        <div class="addItemCelWEIGHT _h25">${element.weight_per_ctn.toFixed(
                            2
                        )} KG</div>
                        <div class="addItemCellcbm _h25">${element.cbm.toFixed(
                            4
                        )}</div>
                        <div class="addItemCellcbm _h25">${element.total_cbm.toFixed(
                            4
                        )}</div>
                        <div class="addItemCell2 _h25">${
                            data["basic_info"].currency
                        } ${addCommas(element.unit_price.toFixed(2))}</div>
                        <div class="addItemCell3 _h25">${
                            data["basic_info"].currency
                        } ${addCommas(element.amount.toFixed(2))}</div>
                    </div>
                    <div class="col-12 p-0">
                        <div class="row m-0 mt-5">
                            <div class="itemCellpDes">${
                                element.product_desc
                            }</div>
                        </div>
                    </div>
                </div>`);
                    ttlCtns += element.qty;
                });
                $(".totalCtns").html(ttlCtns);
            }
        });
    });

    $(document).on("keydown", 'input[name="cbm_value_label"]', function () {
        oldCbm = $(this).val();
    });

    $(document).on("input", 'input[name="cbm_value_label"]', function () {
        $(this).val(oldCbm);
    });

    $(document).on("keydown", ".totalQty", function (e) {
        oldQty = $(this).val();
        var code = e.keyCode || e.which;
        if (code == "9") {
            $(this)
                .parent()
                .parent()
                .find(".totalItemCbm")
                .focus();
        }
    });

    $(document).on("blur", ".totalQty", function () {
        if (
            $(this).attr("min-qty") &&
            parseInt($(this).val()) < parseInt($(this).attr("min-qty"))
        ) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text(
                "You can not reduce quantity of left-over stock"
            );
            $(this).val($(this).attr("min-qty"));
            oldQty = $(this).attr("min-qty");
            $(this).trigger("input");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 5000);
            return;
        }
        oldQty = $(this).val();
    });

    $(document).on("keydown", ".unitPrice", function () {
        oldUp = $(this)
            .val()
            .replace(currencySelected, "");
    });

    $(document).on("input", ".unitPrice", function () {
        if (
            $(this).val() ==
            currencySelected.substring(0, currencySelected.length - 1) ||
            $(this).val() == currencySelected
        ) {
            $(this).val("");
        }
        if (
            !$(this)
            .parent()
            .parent()
            .find(".totalQty")
            .val()
        ) {
            $(this)
                .parent()
                .parent()
                .find(".totalQty")
                .focus();
            $(this).val(currencySelected + oldUp);
            return;
        }
        var originalUp = $(this)
            .val()
            .replace(currencySelected, "");
        if (isNaN(originalUp)) {
            $(this).val();
            $(this).val(currencySelected + oldUp);
            $(this)
                .parent()
                .parent()
                .find(".totalItemAmount")
                .val(
                    currencySelected +
                    addCommas(
                        (
                            parseFloat(
                                $(this)
                                .parent()
                                .parent()
                                .find(".totalQty")
                                .val()
                            ) * parseFloat(oldUp)
                        ).toFixed(2)
                    )
                );
            return;
        }
        let resultPrice =
            parseFloat(
                $(this)
                .parent()
                .parent()
                .find(".totalQty")
                .val()
            ) * originalUp;

        $(this)
            .parent()
            .parent()
            .find(".totalItemAmount")
            .val(currencySelected + addCommas(resultPrice.toFixed(2)));
        $(this).val(currencySelected + originalUp);
        updateTotalAmount();
        $("#order_discount").val("");
    });

    $(document).on("input", ".totalQty", function () {
        var originalQty = $(this).val();
        if (isNaN(originalQty)) {
            $(this).val(oldQty);
            return;
        }

        if (
            !$(".dynamicallyAddedProductsDD").val() ||
            !$(".dynamicallyAddedItemsDD").val()
        ) {
            $(this).val("");
            $(this).blur();
            return;
        }

        if (!originalQty) originalQty = 0;

        if (
            $(this)
            .parent()
            .parent()
            .find(".unitPrice")
            .val()
        ) {
            $(this)
                .parent()
                .parent()
                .find(".totalItemAmount")
                .val(
                    currencySelected +
                    addCommas(
                        originalQty *
                        parseFloat(
                            $(this)
                            .parent()
                            .parent()
                            .find(".unitPrice")
                            .val()
                            .replace(currencySelected, "")
                        ).toFixed(2)
                    )
                );
            updateTotalAmount();
        }

        let totalCbmVal = (
            parseFloat(
                $(this)
                .parent()
                .parent()
                .find(".itemCbm")
                .val()
            ) * parseFloat(originalQty)
        ).toFixed(4);

        if (originalQty == 0) originalQty = "";

        $(this)
            .parent()
            .parent()
            .find(".totalItemCbm")
            .val(totalCbmVal);
        $(this).val(originalQty);
        updateTotalCartansQty();
        updateContainer20Ft();
    });

    $(document).on("keydown", ".totalItemAmount", function () {
        oldIprice = $(this).val();
    });

    $(document).on("input", ".totalItemAmount", function () {
        $(this).val(oldIprice);
    });
    $(document).on("keydown", 'input[name="cbm_value"]', function () {
        oldCbm = $(this).val();
    });

    $(document).on("input", 'input[name="cbm_value"]', function () {
        $(this).val(oldCbm);
    });

    $(document).on("keydown", 'input[name="length"]', function () {
        oldLength = $(this).val();
    });

    $(document).on("input", 'input[name="length"]', function () {
        if (isNaN($(this).val())) {
            $(this).val(oldLength);
            return;
        }
        if ($('input[name="width"]').val() && $('input[name="height"]').val()) {
            var cbmCalc =
                (parseInt($('input[name="width"]').val()) *
                    parseInt($('input[name="height"]').val()) *
                    parseInt($(this).val()) *
                    16.39) /
                1000000;
            $('input[name="cbm_value_label"]').val(cbmCalc.toFixed(4));
            $('input[name="cbm_value"]').val(cbmCalc.toFixed(4));
        }
    });

    $(document).on("keydown", 'input[name="width"]', function () {
        oldWidth = $(this).val();
    });

    $(document).on("input", 'input[name="width"]', function () {
        if (isNaN($(this).val())) {
            $(this).val(oldWidth);
            return;
        }
        if (
            $('input[name="length"]').val() &&
            $('input[name="height"]').val()
        ) {
            var cbmCalc =
                (parseInt($('input[name="length"]').val()) *
                    parseInt($('input[name="height"]').val()) *
                    parseInt($(this).val()) *
                    16.39) /
                1000000;
            $('input[name="cbm_value_label"]').val(cbmCalc.toFixed(4));
            $('input[name="cbm_value"]').val(cbmCalc.toFixed(4));
        }
    });

    $(document).on("keydown", 'input[name="height"]', function () {
        oldHeight = $(this).val();
    });

    $(document).on("input", 'input[name="height"]', function () {
        if (isNaN($(this).val())) {
            $(this).val(oldHeight);
            return;
        }
        if ($('input[name="length"]').val() && $('input[name="width"]').val()) {
            var cbmCalc =
                (parseInt($('input[name="length"]').val()) *
                    parseInt($('input[name="width"]').val()) *
                    parseInt($(this).val()) *
                    16.39) /
                1000000;
            $('input[name="cbm_value_label"]').val(cbmCalc.toFixed(4));
            $('input[name="cbm_value"]').val(cbmCalc.toFixed(4));
        }
    });

    $(document).on("click", ".openDataSidebarForAddingCustomer", function () {
        $("#prospectDataDiv").css("display", "none");
        $("#dropifyImgDiv").empty();
        $("#dropifyImgDiv").append(
            '<input type="file" name="compPicture" id="companyPic" class="dropify" />'
        );
        $("#cardFrontDiv").append(
            '<div class="upload-pic font12 pb-1">Card Front</div><input type="file" name="card_front" id="card_front"/>'
        );
        $("#cardBackDiv").append(
            '<div class="upload-pic font12 pb-1">Card Front</div><input type="file" name="card_back" id="card_back"/>'
        );
        $("#companyPic").dropify();
        $("#card_front").dropify();
        $("#card_back").dropify();
    });

    $(document).on("click", ".openDataSidebarForAddingItem", function () {
        addItemPrefsRef = $(this);
        if (
            !$(this)
            .parent()
            .find("select")
            .val()
        ) {
            return;
        }
        openSidebar("#product-add");
        $(".itemContentFooter").show();
        $(".paymentContentFooter").hide();
        $(".saveContentFooter").hide();
        $("#product-add")
            .find("input, textarea")
            .val("");
        $("#product-add")
            .find("select")
            .val(0)
            .trigger("change");
    });

    $(document).on("click", "#saveCustomer", function () {
        $(".required_cust").css("border", "0px");
        $(".select2-container").css("border", "0px");

        let dirty = false;
        $(".required_cust").each(function () {
            if (!$(this).val() || $(this).val() == 0) {
                dirty = true;
                if (
                    $(this).hasClass("formselect") ||
                    $(this).hasClass("sd-type")
                ) {
                    $(this)
                        .parent()
                        .find(".select2-container")
                        .css("border", "1px solid red");
                } else {
                    $(this).css("border", "1px solid red");
                }
            }
        });

        if (dirty) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text(
                "Please provide all the required information (*)"
            );
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }

        multiple_cust_phone_nums = [];

        $(".div_parent").each(function () {
            if (
                $(this)
                .find(".cust_phone_type option:selected")
                .val() != null &&
                $(this)
                .find(".cust_phone_number")
                .val() != ""
            ) {
                multiple_cust_phone_nums.push({
                    type: $(this)
                        .find(".cust_phone_type option:selected")
                        .val(),
                    number: $(this)
                        .find(".cust_phone_number")
                        .val()
                });
            }
        });

        // if (!multiple_cust_phone_nums.length) {
        //     $("#notifDiv").fadeIn();
        //     $("#notifDiv").css("background", "red");
        //     $("#notifDiv").text("Please Add Phone Numbers.");
        //     setTimeout(() => {
        //         $("#notifDiv").fadeOut();
        //     }, 3000);
        //     return;
        // }

        cust_address_array = [];
        $(".address_customer").each(function () {
            cust_address_array.push({
                type: $(this).attr("type"),
                street: $(this)
                    .find(".address")
                    .val(),
                city: $(this)
                    .find(".city")
                    .val(),
                postalcode: $(this)
                    .find(".code")
                    .val(),
                country: $(this)
                    .find(".country")
                    .val(),
                state: $(this)
                    .find(".state")
                    .val()
            });
        });

        $("#saveCustomer").attr("disabled", "disabled");
        $("#cancelCustomer").attr("disabled", "disabled");
        $("#saveCustomer").text("Processing..");

        $('input[name="document_types"]').val(
            $('select[name="documentTypes"]').val()
        );
        $('input[name="delivery_ports"]').val(
            $('select[name="deliveryPorts"]').val()
        );

        $('input[name="interestedInProduct"]').val(
            $('select[name="interested_in_product"]').val()
        );
        $('input[name="interestedInCategory"]').val(
            $('select[name="interested_in_category"]').val()
        );

        var ajaxUrl = "/Customer";
        $("#saveCustomerForm").ajaxSubmit({
            type: "POST",
            url: ajaxUrl,
            cache: false,
            data: {
                multiple_cust_phone_nums: multiple_cust_phone_nums,
                cust_address_array: cust_address_array
            },
            success: function (response) {
                $("#saveCustomer").removeAttr("disabled");
                $("#cancelCustomer").removeAttr("disabled");
                $("#saveCustomer").text("Save");
                if (JSON.parse(response).code == 200) {
                    fetchCustomers();
                    $(".open_poc_modal").click();
                    $(".added_customer").text(
                        $('input[name="compName"]').val()
                    );
                    $(".save_poc_against_cust").attr(
                        "id",
                        JSON.parse(response).customer_id
                    );
                    $("#saveCustomerForm")
                        .find("input[type=text], textarea")
                        .val("");
                    $("#saveCustomerForm")
                        .find("select")
                        .val("0")
                        .trigger("change");
                    $(
                            'select[name="deliveryPorts"], select[name="documentTypes"]'
                        )
                        .val("")
                        .trigger("change");
                    $(".dropify-clear").click();

                    $("#notifDiv").fadeIn();
                    $("#notifDiv").css("background", "green");
                    $("#notifDiv").text(
                        "Customer have been added successfully"
                    );
                    setTimeout(() => {
                        $("#notifDiv").fadeOut();
                    }, 3000);
                    callForDzReset = true;
                    myDropzone.removeAllFiles(true);
                    closeSidebar();
                } else {
                    $("#notifDiv").fadeIn();
                    $("#notifDiv").css("background", "red");
                    $("#notifDiv").text("Failed to add customer at the moment");
                    setTimeout(() => {
                        $("#notifDiv").fadeOut();
                    }, 3000);
                }
            },
            error: function (err) {
                if (err.status == 422) {
                    $.each(err.responseJSON.errors, function (i, error) {
                        var el = $(document).find('[name="' + i + '"]');
                        el.after(
                            $(
                                '<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' +
                                error[0] +
                                "</small>"
                            )
                        );
                    });
                }
            }
        });
    });

    $(document).on("click", ".save_poc_against_cust", function () {
        var thisRef = $(this);
        if (
            $(".already_added_poc_for_customer").val() == "0" ||
            $(".already_added_poc_for_customer").val() == null
        ) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please Select POC first!");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
        thisRef.attr("disabled", "disabled");
        thisRef.text("Processing...");
        $.ajax({
            type: "POST",
            url: "/savePOCAgainstCust/" + thisRef.attr("id"),
            data: {
                _token: $('input[name="_token"]').val(),
                poc_id: $(".already_added_poc_for_customer").val()
            },
            success: function (response) {
                thisRef.removeAttr("disabled");
                thisRef.text("Save");
                if (JSON.parse(response) == "success") {
                    $("#notifDiv").fadeIn();
                    $("#notifDiv").css("background", "green");
                    $("#notifDiv").text("Saved Successfully");
                    setTimeout(() => {
                        $("#notifDiv").fadeOut();
                    }, 3000);
                    fetchCustomers();
                    $(".close").click();
                } else {
                    $("#notifDiv").fadeIn();
                    $("#notifDiv").css("background", "red");
                    $("#notifDiv").text("Unable to save at the moment");
                    setTimeout(() => {
                        $("#notifDiv").fadeOut();
                    }, 3000);
                }
            }
        });
    });

    $(document).on("change", 'select[name="existing_brand_id"]', function () {
        $('select[name="existing_product_id"]').attr("disabled", "disabled");
        $('select[name="existing_product_id"]').append(
            '<option value="-1">Loading..</option>'
        );
        $.ajax({
            type: "GET",
            url: "/GetProductsForBrand/" +
                $('select[name="existing_brand_id"]').val(),
            success: function (response) {
                $('select[name="existing_product_id"]').empty();
                var response = JSON.parse(response);
                response.forEach(element => {
                    $('select[name="existing_product_id"]').append(
                        '<option value="' +
                        element["id"] +
                        '">' +
                        element["name"] +
                        "</option>"
                    );
                });
                $('select[name="existing_product_id"]').removeAttr("disabled");
            }
        });
    });

    let orderLayout = false;

    $(document).on("change", "#selectCustomerDD", function () {
        var custId = $(this).val();
        var objs = ["poc_name", "company_name", "country", "city"];
        var custFound = customersInfo.find(x => x.id == custId);
        objs.forEach(element => {
            if (element == 'city') {
                if (JSON.parse(custFound.address)[0] && JSON.parse(custFound.address)[0].city)
                    $("span#" + element).text(JSON.parse(custFound.address)[0]['city']);
                else
                    $("span#" + element).text('NA');
            } else
                $("span#" + element).text(custFound[element]);
        });
        let stockFnd = leftOverStock.filter(x => x.customer_id == custId);
        !$("#addStockTh").length ?
            $("#leftOverStockTable thead tr").append(
                '<th id="addStockTh">Add Stock</th>'
            ) :
            "";
        if (stockFnd.length) {
            $("#stockMsg").text(
                "Below is the left over stock from previous orders. Would you like to add the stock to this order?"
            );
            $("#leftOverStockTable tbody").empty();
            $("#prodQtyLeftOverStock").remove();
            stockFnd.forEach(elem => {
                let alreadyAdjustedStock = leftOverStockAdjusted.find(
                    x => x.item_id == elem.item_id
                );
                let leftOverQty = alreadyAdjustedStock ?
                    elem.left_over_qty - alreadyAdjustedStock.assigned_qty :
                    elem.left_over_qty;
                $("#leftOverStockTable tbody").append(`<tr>
                <td>${elem.product} <small style="display: block">${
                    elem.item
                }</small></td>
                <td><span class="qty">${elem.stock_qty}</span></td>
                <td>${parseFloat(elem.stock_qty) -
                    parseFloat(elem.left_over_qty)}</td>
                <td><span class="rem">${elem.left_over_qty}</span></td>
                <td>${elem.expiry_date ? elem.expiry_date : "NA"}</td>
                <td><input value="${leftOverQty}" style="padding-left: 6px;
                height: 30px;" class="form-control stockToAdd" order-id="${
                    elem.order_id
                }" u-price="${elem.stock_unit_price}" product-id="${
                    elem.product_id
                }" item-id="${elem.item_id}" max-qty="${leftOverQty}" /></td>
                </tr>`);
            });
            $("#saveLeftOverStock").text("Add Stock");
            $(".openOrderCompletionModal").click();
            orderLayout = true;
        }
    });

    $(document).on("input", ".stockToAdd", function () {
        if (!$(this).val()) $(this).val(0);

        if (parseInt($(this).val()) > parseInt($(this).attr("max-qty")))
            $(this).val($(this).attr("max-qty"));
    });

    $(document).on("select2:open", ".dynamicallyAddedItemsDD", function () {
        oldSelectedItem = $(this).val();
    });

    $(document).on("input", '[name="additional_weight_ctn"]', function () {
        if (!$(this).val()) {
            $('[name="net_weight"]').val(0);
            return;
        }

        var totalWeight =
            typeof orderData !== "undefined" && orderData.contents ?
            orderData.contents.reduce(
                (sum, val) => sum + val.net_weight,
                0
            ) :
            0;
        var totalCtns =
            typeof orderData !== "undefined" && orderData.contents ?
            orderData.contents.reduce((sum, val) => sum + val.qty, 0) :
            0;

        if (!totalCtns || !totalWeight) {
            $("._row-product").each(function () {
                totalCtns += $(this)
                    .find(".totalQty")
                    .val() ?
                    parseFloat(
                        $(this)
                        .find(".totalQty")
                        .val()
                    ) :
                    0;
                totalWeight += $(this)
                    .find(".totalQty")
                    .val() ?
                    parseFloat(
                        $(this)
                        .find(".weightPerCtn")
                        .val()
                    ) *
                    parseFloat(
                        $(this)
                        .find(".totalQty")
                        .val()
                    ) :
                    0;
            });
        }

        if (!totalCtns || !totalWeight) return;

        let netWeight =
            parseFloat($(this).val()) * parseFloat(totalCtns) + totalWeight;
        $('[name="net_weight"]').val(netWeight.toFixed(2));

        updateContainer20Ft();
    });

    $(document).on("change", ".dynamicallyAddedItemsDD", function () {
        var productId = $(this)
            .parent()
            .parent()
            .parent()
            .find(".dynamicallyAddedProductsDD")
            .val();
        var itemId = $(this).val();
        var itemFound = allProducts
            .find(x => x.id == productId)
            .items.find(x => x.id == itemId);
        $(this)
            .parent()
            .parent()
            .parent()
            .find("#description")
            .html(
                `${itemFound.unit_weight} Gm/${itemFound.unit_name},
                ${ (itemFound.unit_quantity ? (itemFound.unit_quantity + ' ' + itemFound.unit_name+'s/'+itemFound.variant_name+',') : '') }
                ${ (itemFound.variant_2_name ? (itemFound.variant_quantity_2 + ' ' + itemFound.variant_name+'s/'+itemFound.variant_2_name+',') : '') }
                ${ (itemFound.variant_3_name ? (itemFound.variant_quantity_3 + ' ' + itemFound.variant_2_name+'s/'+itemFound.variant_3_name+',') : '') }
                ${ (itemFound.variant_3_name ? (itemFound.unit_variant_quantity + " "+itemFound.variant_3_name) : (itemFound.variant_2_name ? (itemFound.unit_variant_quantity+" "+itemFound.variant_2_name) : (itemFound.unit_variant_quantity+" "+(itemFound.variant_name ? itemFound.variant_name : itemFound.unit_name)))) }s/Carton`
            );

        oldCbm = itemFound.cbm_value;
        $(this)
            .parent()
            .parent()
            .parent()
            .find(".weightPerUnit")
            .val(itemFound.unit_weight + " Grams");
        var ctnWeight =
            (parseInt((itemFound.unit_quantity ? itemFound.unit_quantity : 1)) *
                parseInt(itemFound.unit_variant_quantity) *
                (itemFound.variant_quantity_2 ? parseInt(itemFound.variant_quantity_2) : 1) *
                (itemFound.variant_quantity_3 ? parseInt(itemFound.variant_quantity_3) : 1) *
                parseFloat(itemFound.unit_weight)) /
            1000;
        $(this)
            .parent()
            .parent()
            .parent()
            .find(".weightPerCtn")
            .val(ctnWeight.toFixed(2) + " KG(s)");
        $(this)
            .parent()
            .parent()
            .parent()
            .find(".itemCbm")
            .val(itemFound.cbm_value ? itemFound.cbm_value.toFixed(4) : 0);
        $(this)
            .parent()
            .parent()
            .parent()
            .find(".totalQty")
            .val("");
        $(this)
            .parent()
            .parent()
            .parent()
            .find(".totalItemCbm")
            .val("");
        $(this)
            .parent()
            .parent()
            .parent()
            .find(".unitPrice")
            .val("");
        $(this)
            .parent()
            .parent()
            .parent()
            .find(".totalItemAmount")
            .val("");

        if ($("#selectCustomerDD").val()) {
            let existingPrice = allContents.find(
                x =>
                x.item_id == $(this).val() &&
                x.customer_id == $("#selectCustomerDD").val()
            );
            if (existingPrice)
                $(this)
                .parent()
                .parent()
                .parent()
                .find(".unitPrice")
                .val(currencySelected + existingPrice.unit_price);
            else if (
                itemFound.standrad_unit_price &&
                itemFound.standrad_unit_price > 0
            )
                $(this)
                .parent()
                .parent()
                .parent()
                .find(".unitPrice")
                .val(currencySelected + itemFound.standrad_unit_price);
        }

        if (!updateInProgress) updateTotalAmount();
    });

    $(document).on("click", "._order-del", function () {
        if (
            !$(this)
            .parent()
            .parent()
            .find(".totalQty")
            .val() &&
            !$(this)
            .parent()
            .parent()
            .find(".totalItemAmount")
            .val()
            .replace(currencySelected, "")
            .replace(/,/g, "")
        ) {
            $(this)
                .parent()
                .parent()
                .remove();
            return;
        }
        if (
            $(this)
            .parent()
            .parent()
            .find(".totalQty")
            .val() &&
            !$(this)
            .parent()
            .parent()
            .find(".totalItemAmount")
            .val()
            .replace(currencySelected, "")
            .replace(/,/g, "")
        ) {
            var ctnsToDeduct = parseFloat(
                $(this)
                .parent()
                .parent()
                .find(".totalQty")
                .val()
            );
            var currCtns = $(".totalCtns")
                .html()
                .replace("CTNS", "")
                .replace(/,/g, "");
            $(".totalCtns").html(addCommas(currCtns - ctnsToDeduct) + "CTNS");
            $(this)
                .parent()
                .parent()
                .remove();
            return;
        }
        if (
            !$(this)
            .parent()
            .parent()
            .find(".totalQty")
            .val() &&
            $(this)
            .parent()
            .parent()
            .find(".totalItemAmount")
            .val()
            .replace(currencySelected, "")
            .replace(/,/g, "")
        ) {
            var amountToDeduct = parseFloat(
                $(this)
                .parent()
                .parent()
                .find(".totalItemAmount")
                .val()
                .replace(currencySelected, "")
                .replace(/,/g, "")
            );
            var currAm = parseFloat(
                $(".totalAm")
                .html()
                .replace(currencySelected, "")
                .replace(/,/g, "")
            );

            $("._order-price").html(
                `<span>Amount Due (${currencySelected})</span> ${currencySelected}${addCommas(
                    (currAm - amountToDeduct).toFixed(2)
                )}`
            );

            $(".totalAm").html(
                currencySelected +
                addCommas((currAm - amountToDeduct).toFixed(2))
            );
            $(this)
                .parent()
                .parent()
                .remove();
            return;
        }
        var amountToDeduct = parseFloat(
            $(this)
            .parent()
            .parent()
            .find(".totalItemAmount")
            .val()
            .replace(currencySelected, "")
            .replace(/,/g, "")
        );
        var currAm = parseFloat(
            $(".totalAm")
            .html()
            .replace(currencySelected, "")
            .replace(/,/g, "")
        );
        $(".totalAm").html(
            currencySelected + addCommas((currAm - amountToDeduct).toFixed(2))
        );
        //Saif Work
        if ($("#order_discount").val()) {
            var new_val = (
                currAm -
                amountToDeduct -
                (parseFloat($("#order_discount").val()) / 100) *
                (currAm - amountToDeduct)
            ).toFixed(2);
            $(".amount_after_discount").html("PKR " + new_val);
        } else {
            $(".amount_after_discount").html(
                "PKR " +
                currencySelected +
                addCommas((currAm - amountToDeduct).toFixed(2))
            );
        }

        $("._order-price").html(
            `<span>Amount Due (${currencySelected})</span> ${currencySelected}${addCommas(
                (currAm - amountToDeduct).toFixed(2)
            )}`
        );

        var ctnsToDeduct = parseFloat(
            $(this)
            .parent()
            .parent()
            .find(".totalQty")
            .val()
        );
        var currCtns = $(".totalCtns")
            .html()
            .replace("CTNS", "")
            .replace(/,/g, "");
        $(".totalCtns").html(addCommas(currCtns - ctnsToDeduct) + "CTNS");

        removed_items.push(
            $(this)
            .parent()
            .parent()
            .find(".contentId")
            .attr("id")
        );

        let itemId = $(this)
            .parent()
            .parent()
            .find(".dynamicallyAddedItemsDD")
            .val();
        leftOverStockAdjusted = leftOverStockAdjusted.filter(
            x => x.item_id != itemId
        );
        $(this)
            .parent()
            .parent()
            .remove();
        updateContainer20Ft();
        updateTotalAmount();
    });

    $(document).on("click", "#addAnotherPayment", function () {
        if (
            !parseFloat(
                $("#paymAmLeft")
                .text()
                .replace(/,/g, "")
            )
        ) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("All amount has been paid in full");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
        if (totalPayments > 0) {
            let dirty = false;
            $(".paymAmount").each(function () {
                if (
                    !$(this).val() ||
                    !$(this)
                    .parent()
                    .parent()
                    .find(".paymentDueDate")
                    .val()
                )
                    dirty = true;
            });
            if (dirty) {
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "red");
                $("#notifDiv").text(
                    "Please provide all the required information in above payment"
                );
                setTimeout(() => {
                    $("#notifDiv").fadeOut();
                }, 5000);
                return;
            }
        }
        totalPayments++;
        $("#dynamicPayments").append(
            '<div class="row m-0"><div class="_schedulecol1 paymentDiv' +
            totalPayments +
            '">Payment (<span class="thisPaymentLabel">' +
            totalPayments +
            '</span> of <span class="totalPaymentsLabel"></span>)<input type="text" class="paymAmount" placeholder="1" style="font-size: 13px"></div><div class="_schedulecol2"><div class="form-group">Due Date<div class="form-group" style="height: auto"><input type="text" class="datepicker paymentDueDate paymDueDate' +
            totalPayments +
            '" placeholder=""></div></div></div><div class="_schedulecol3"><a class="btn deletePayment" title="Delete"><i class="fa fa-trash"></i></a></div></div>'
        );
        $(".totalPaymentsLabel").text(totalPayments);
        $(".paymDueDate" + totalPayments)
            .datepicker({
                format: "yyyy-mm-dd",
                startDate: "+0d"
            })
            .on("changeDate", function (e) {
                $(this).datepicker("hide");
            });
        rows_counts++;
    });

    $(document).on("keydown", ".paymAmount", function () {
        oldPaymAmount = $(this).val();
    });

    $(document).on("click", "#resetPayments", function () {
        $("#dynamicPayments").empty();
        //Saif Work
        $('select[name = "payment_type"]')
            .val("ADV")
            .trigger("change");
        $("#paymAmLeft").text(addCommas(orderValue));
        $("#totalPaymentAm").text(addCommas(orderValue));
        $("#advPmt").val(0);
        totalPayments = 0;
        rows_counts = 0;
    });

    $(document).on("input", ".paymAmount", function () {
        let amLeftToPay = 0;
        let newOrderValue = orderValue;
        newOrderValue -= $("#advPmt").val() ?
            parseFloat($("#advPmt").val()) :
            0;
        if (paymCriteriaSelected !== "flat") {
            if ($(this).val() > 100 || isNaN($(this).val())) {
                $(this).val(100);
            }
            var totalPercentAdded = 0;
            $(".paymAmount").each(function () {
                if ($(this).val()) {
                    totalPercentAdded += parseFloat($(this).val());
                }
            });
            if (totalPercentAdded > 100) {
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "red");
                $("#notifDiv").text(
                    "Kindly commulate sum to total payments of 100%"
                );
                setTimeout(() => {
                    $("#notifDiv").fadeOut();
                }, 3000);
                $(this).val(oldPaymAmount);
                return;
            }
            totalPercentAdded = totalPercentAdded.toFixed(2);
            amLeftToPay =
                newOrderValue - (totalPercentAdded / 100) * newOrderValue;
        } else {
            if (isNaN($(this).val())) {
                $(this).val(oldPaymAmount);
            }
            var totalAmountAdded = 0;
            $(".paymAmount").each(function () {
                if ($(this).val()) {
                    totalAmountAdded += parseFloat($(this).val());
                }
            });
            if (totalAmountAdded > newOrderValue) {
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "red");
                $("#notifDiv").text("Kindly commulate sum to total amount");
                setTimeout(() => {
                    $("#notifDiv").fadeOut();
                }, 3000);
                $(this).val(oldPaymAmount);
                return;
            }
            totalAmountAdded = totalAmountAdded.toFixed(2);
            amLeftToPay = newOrderValue - totalAmountAdded;
        }
        $("#paymAmLeft").text(addCommas(amLeftToPay.toFixed(2)));
    });

    $(document).on("change", '[name="paymentCriteria"]', function () {
        if ($(".paymAmount").length > 1) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text(
                "Kindly remove previously added payments to follow the new criteria"
            );
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 5000);
            if ($(this).val() !== "flat") {
                paymCriteriaSelected = "flat";
                $("[name=paymentCriteria][value='flat']").prop("checked", true);
            } else {
                paymCriteriaSelected = "percentage";
                $("[name=paymentCriteria][value='percentage']").prop(
                    "checked",
                    true
                );
            }
            return;
        } else if ($(".paymAmount").length == 1) {
            if ($(".paymAmount").val()) {
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "red");
                $("#notifDiv").text(
                    "Kindly remove previously added payments to follow the new criteria"
                );
                setTimeout(() => {
                    $("#notifDiv").fadeOut();
                }, 5000);
                if ($(this).val() !== "flat") {
                    paymCriteriaSelected = "flat";
                    $("[name=paymentCriteria][value='flat']").prop(
                        "checked",
                        true
                    );
                } else {
                    paymCriteriaSelected = "percentage";
                    $("[name=paymentCriteria][value='percentage']").prop(
                        "checked",
                        true
                    );
                }
                return;
            }
        }
        paymCriteriaSelected = $(this).val();
    });

    $(document).on("click", ".deletePayment", function () {
        $(this)
            .parent()
            .parent()
            .remove();
        totalPayments--;
        rows_counts--;
        $(".totalPaymentsLabel").text(totalPayments);
        var counter = 1;
        $(".thisPaymentLabel").each(function () {
            $(this).text(counter);
            counter++;
        });
        let newOrderValue =
            orderValue -
            ($("#advPmt").val() ? parseFloat($("#advPmt").val()) : 0);
        var leftAmountWas = parseFloat(
            $("#paymAmLeft")
            .text()
            .replace(/,/g, "")
        );
        if (paymCriteriaSelected !== "flat") {
            //Percentage amount
            var amountReverted = $(this)
                .parent()
                .parent()
                .find(".paymAmount")
                .val() ?
                (parseFloat(
                        $(this)
                        .parent()
                        .parent()
                        .find(".paymAmount")
                        .val()
                    ) /
                    100) *
                newOrderValue :
                0;
            $("#paymAmLeft").text(
                addCommas((leftAmountWas + amountReverted).toFixed(2))
            );
        } else {
            //Flat amount
            var amountReverted = $(this)
                .parent()
                .parent()
                .find(".paymAmount")
                .val() ?
                parseFloat(
                    $(this)
                    .parent()
                    .parent()
                    .find(".paymAmount")
                    .val()
                ) :
                0;
            $("#paymAmLeft").text(
                addCommas((leftAmountWas + amountReverted).toFixed(2))
            );
        }
    });

    $(document).on("change", ".dynamicallyAddedProductsDD", function () {
        let productSelected = $(this).val();
        let itemsList = allProducts.find(x => x.id == productSelected).items;
        let elem = $(this)
            .parent()
            .parent()
            .parent()
            .find(".dynamicallyAddedItemsDD");
        elem.empty();
        itemsList.forEach(element => {
            let itmName = `${element.unit_weight} Gm/${element.unit_name},
            ${ (element.unit_quantity ? (element.unit_quantity + ' ' + element.unit_name+'s/'+element.variant_name+',') : '') }
            ${ (element.variant_2_name ? (element.variant_quantity_2 + ' ' + element.variant_name+'s/'+element.variant_2_name+',') : '') }
            ${ (element.variant_3_name ? (element.variant_quantity_3 + ' ' + element.variant_2_name+'s/'+element.variant_3_name+',') : '') }
            ${ (element.variant_3_name ? (element.unit_variant_quantity + " "+element.variant_3_name) : (element.variant_2_name ? (element.unit_variant_quantity+" "+element.variant_2_name) : (element.unit_variant_quantity+" "+(element.unit_quantity ? element.variant_name : element.unit_name)))) }s/Carton`;
            var newOption = new Option(itmName, element.id, false, false);
            elem.append(newOption);
        });

        var itemFound = itemsList.find(x => x.id == elem.val());

        $(this)
            .parent()
            .parent()
            .find("div#description")
            .html(
                `${itemFound.unit_weight} Gm/${itemFound.unit_name},
                ${ (itemFound.unit_quantity ? (itemFound.unit_quantity + ' ' + itemFound.unit_name+'s/'+itemFound.variant_name+',') : '') }
                ${ (itemFound.variant_2_name ? (itemFound.variant_quantity_2 + ' ' + itemFound.variant_name+'s/'+itemFound.variant_2_name+',') : '') }
                ${ (itemFound.variant_3_name ? (itemFound.variant_quantity_3 + ' ' + itemFound.variant_2_name+'s/'+itemFound.variant_3_name+',') : '') }
                ${ (itemFound.variant_3_name ? (itemFound.unit_variant_quantity + " "+itemFound.variant_3_name) : (itemFound.variant_2_name ? (itemFound.unit_variant_quantity+" "+itemFound.variant_2_name) : (itemFound.unit_variant_quantity+" "+(itemFound.variant_name ? itemFound.variant_name : itemFound.unit_name)))) }s/Carton`
            );

        oldCbm = itemFound.cbm_value;

        elem.parent()
            .parent()
            .parent()
            .find(".weightPerUnit")
            .val(itemFound.unit_weight + " Grams");

        var ctnWeight =
            (parseInt((itemFound.unit_quantity ? itemFound.unit_quantity : 1)) *
                parseInt(itemFound.unit_variant_quantity) *
                (itemFound.variant_quantity_2 ? parseInt(itemFound.variant_quantity_2) : 1) *
                (itemFound.variant_quantity_3 ? parseInt(itemFound.variant_quantity_3) : 1) *
                parseFloat(itemFound.unit_weight)) /
            1000;

        elem.parent()
            .parent()
            .parent()
            .find(".weightPerCtn")
            .val(ctnWeight.toFixed(2) + " KG(s)");
        elem.parent()
            .parent()
            .parent()
            .find(".itemCbm")
            .val(itemFound.cbm_value ? itemFound.cbm_value.toFixed(3) : 0);
        elem.parent()
            .parent()
            .parent()
            .find(".totalQty")
            .val("");
        elem.parent()
            .parent()
            .parent()
            .find(".totalItemCbm")
            .val("");
        elem.parent()
            .parent()
            .parent()
            .find(".unitPrice")
            .val("");
        elem.parent()
            .parent()
            .parent()
            .find(".totalItemAmount")
            .val("");
        if ($("#selectCustomerDD").val()) {
            let existingPrice = allContents.find(
                x =>
                x.item_id == elem.val() &&
                x.customer_id == $("#selectCustomerDD").val()
            );
            if (existingPrice)
                $(this)
                .parent()
                .parent()
                .parent()
                .find(".unitPrice")
                .val(currencySelected + existingPrice.unit_price);
            else if (
                itemsList.standrad_unit_price &&
                itemsList.standrad_unit_price > 0
            )
                $(this)
                .parent()
                .parent()
                .parent()
                .find(".unitPrice")
                .val(currencySelected + itemsList.standrad_unit_price);
        }
    });

    $(document).on("click", "#addMoreProductsInOrder", function () {
        let invalidEntry = false;
        $("._row-product").each(function () {
            if (
                !$(this)
                .find(".totalQty")
                .val() ||
                !$(this)
                .find(".dynamicallyAddedProductsDD")
                .val() ||
                !$(this)
                .find(".dynamicallyAddedItemsDD")
                .val() ||
                !$(this)
                .find(".unitPrice")
                .val()
                .replace(currencySelected, "")
            )
                invalidEntry = true;
        });

        if (invalidEntry) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text(
                "Please complete previously added products information"
            );
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }

        $("#productsContainer").append(
            `<div class="row _row-product product${totalProducts}"> <a class="dd-handle dd3-handle swap-div"></a> <div class="col-12 p-0"><div class="addItemCell"><div class="_emp-sele _addProduct"><select class="form-control formselect dynamicallyAddedProductsDD" id="productsListDD${totalProducts}" placeholder="select Product" data-allow_clear="1"><option disabled selected>Select Product</option></select></div> <div class="_Packinfo" id="description"></div> </div><div class="addItemCell PL-5"> <div class="_emp-sele _addProduct"> <select class="form-control dynamicallyAddedItemsDD formselect" id="prodItemsListDD${totalProducts}" placeholder="select Item" data-allow_clear="${totalProducts}"> <option selected disabled>Select item</option> </select> <a class="btn plus_button productadd openDataSidebarForAddingItem"><i style="padding-top: 4px !important;" class="fa fa-plus"></i></a> </div></div> <div class="addItemCell2 _h25"><input type="text" class="totalQty" placeholder="" style="font-size: 13px"></div> <div class="addItemCelWEIGHT _h25"><input type="text" class="weightPerUnit" readonly placeholder="" style="font-size: 13px"></div> <div class="addItemCelWEIGHT _h25"><input type="text" class="weightPerCtn" readonly placeholder="" style="font-size: 13px"></div> <div class="addItemCellcbm _h25"><input type="text" class="itemCbm" readonly placeholder="" style="font-size: 13px"></div> <div class="addItemCellcbm _h25"><input type="text" class="totalItemCbm" readonly placeholder="" style="font-size: 13px"></div> <div class="addItemCell2 _h25"><input type="text" class="unitPrice" placeholder="" style="font-size: 13px"></div> <div class="addItemCell3 _h25"><input type="text" class="totalItemAmount" readonly placeholder="" style="font-size: 13px"> </div> </div> <div class="col-12 p-0"> <div class="row m-0 mt-5"> <div class="itemCellpDes"> <textarea class="textarea-HA" rows="1" placeholder="Enter Product Description" style="font-size: 13px"></textarea></div> </div> <a class="btn _order-del" title="Delete"><i class="fa fa-trash"></i></a> </div> <input type="text" class="contentId" id=""></div>`
        );

        $(`#productsListDD${totalProducts}`).select2({
            closeOnSelect: false
        });
        $(`#prodItemsListDD${totalProducts}`).select2({
            closeOnSelect: false
        });

        allProducts.forEach(element => {
            var newOption = new Option(element.name, element.id, false, false);
            $(`#productsListDD${totalProducts}`).append(newOption);
        });

        var textarea = document.querySelector(".textarea-HA");
        textarea ? textarea.addEventListener("keydown", autosize) : null;

        totalProducts++;
    });

    $(document).on('click', '.deletePerforma', function () {
        var id = $(this).attr('id');
        glob_type = $(this).attr('name');
        $('.confirm_delete').attr('id', id);
        deleteRef = $(this);
        $('#hidden_btn_to_open_modal').click();
    })

    $(document).on("click", ".confirm_delete", function () {
        var performaId = $(this).attr("id");
        var thisRef = $(this);
        deleteRef.attr("disabled", "disabled");
        deleteRef.text("Deleting..");
        deleteRef.parent().ajaxSubmit({
            type: "GET",
            url: "/DeletePerforma/" + performaId,
            success: function (response) {
                if (JSON.parse(response) == "success") {
                    $("#notifDiv").fadeIn();
                    $("#notifDiv").css("background", "green");
                    $("#notifDiv").text("Performa have been deleted");
                    setTimeout(() => {
                        $("#notifDiv").fadeOut();
                    }, 3000);
                    deleteRef.parent().parent().parent().remove();
                    $('.cancel_delete_modal').click();
                } else {
                    $("#notifDiv").fadeIn();
                    $("#notifDiv").css("background", "red");
                    $("#notifDiv").text(
                        "Unable to delete the Performa at this moment"
                    );
                    setTimeout(() => {
                        deleteRef.removeAttr("disabled");
                        $("#notifDiv").fadeOut();
                    }, 3000);
                }
            }
        });
    });

    $(document).on("click", "#addSchedule", function () {
        if (segments[4] && segments[4] === "create") {
            if (!orderId || !orderValue) {
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "red");
                $("#notifDiv").text("Kindly create an order first");
                setTimeout(() => {
                    $("#notifDiv").fadeOut();
                }, 3000);
                return;
            }
        }

        if (!$("._schedulecol1").length) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Kindly add payment schedules first");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }

        if (
            $('select[name="payment_type"]').val() == 0 ||
            !$('select[name="payment_type"]').val()
        ) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Kindly Select Payment Type first");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }

        var paymData = [];
        $("._schedulecol1").each(function () {
            paymData.push({
                payment: $(this)
                    .find(".paymAmount")
                    .val(),
                due_date: $(this)
                    .parent()
                    .find(".paymentDueDate")
                    .val()
            });
        });

        if (paymData.find(x => !x.due_date) || paymData.find(x => !x.payment)) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text(
                "Kindly provide all the required information to schedule the payments"
            );
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }

        $("#addSchedule").css("pointer-events", "none");
        $("#addSchedule").text("Saving..");

        var ajaxUrl = "/AddPaymentSchedule";
        if (segments[5] && segments[5] === "edit")
            ajaxUrl = "/UpdatePaymentSchedule";

        $.ajax({
            type: "POST",
            url: ajaxUrl,
            data: {
                _token: $('meta[name="csrf_token"]').attr("content"),
                payment_criteria: $('[name="paymentCriteria"]:checked').val(),
                order_id: orderId,
                payment_data: paymData,
                payment_type: $('select[name="payment_type"]').val()
            },
            success: function (response) {
                if (!JSON.parse(response).length) {
                    $("#notifDiv").fadeIn();
                    $("#notifDiv").css("background", "green");
                    $("#notifDiv").text("Payments were successfully scheduled");
                    $("#addSchedule").text("Saved");
                    setTimeout(() => {
                        window.location.href = "/OrderManagement";
                        $("#notifDiv").fadeOut();
                    }, 3000);
                    return;
                }
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "red");
                $("#notifDiv").text(
                    "Unable to schedule the payments at this moment"
                );
                setTimeout(() => {
                    $("#notifDiv").fadeOut();
                }, 3000);
            }
        });
    });

    $(document).on("click", "#saveOrderBtn", function () {
        saveOrder();
    });

    $(document).on("click", "#saveDraft", function () {
        saveOrder("draft");
    });

    $(document).on("click", "#saveAsPerforma", function () {
        saveOrder("performa");
    });

    $(document).on("click", "#markAsSent", function () {
        saveOrder("sent");
    });

    $(document).on("click", "#addProduct", function () {
        saveProduct($(this));
    });

    $(".productlist01").on("click", function () {
        openSidebar();
    });

    $(document).on("click", "#sendPdfEmail", function () {
        var thisRef = $(this);
        sendingEmail = true;
        if (orderId) {
            $("#saveOrderBtn").text("Sending Email..");
            $("#saveOrderBtn").css("pointer-events", "none");
            thisRef.css("pointer-events", "none");
            $.ajax({
                type: "GET",
                url: `/PerformaEmail/${orderId}`,
                success: function (response) {
                    $(".open_confirmation_modal").click();
                    setTimeout(() => {
                        $("#dismissConfirmationModal").click();
                    }, 2000);
                    $("#saveOrderBtn").text("Save");
                    $("#saveOrderBtn").css("pointer-events", "");
                    thisRef.css("pointer-events", "");
                }
            });
        } else {
            alert("Kindly save the order first");
        }
    });

    $(document).on("click", "#downloadPdf", function () {
        if (orderId) {
            window.open(`/invoice-pdf?performa=${orderId}`, "_blank");
        } else {
            alert("Kindly save the order first");
        }
    });

    $(document).on("click", ".preview_pdf_btn", function () {
        var params = [];
        $(this)
            .parent()
            .parent()
            .find(".pramas_check_box")
            .each(function () {
                if ($(this).prop("checked")) params.push($(this).attr("id"));
            });
        window.open(
            $(this).attr("id") + "&params=" + params.join(","),
            "_blank"
        );
    });

    $(document).on("click", ".without_params_pdf", function () {
        window.open($(this).attr("id"), "_blank");
    });

    $(document).on("change", '[name="payment_type"]', function () {
        $("#advPmtDiv").hide();
        $("#advPmt").val(0);
        if ($(this).val() == "ADVDIF") $("#advPmtDiv").show();
        else {
            $("#advPmt").trigger("input");
        }
    });

    let oldAdvPmt = 0;
    $(document).on("keydown", "#advPmt", function () {
        oldAdvPmt = $(this).val();
    });

    $(document).on("input", "#advPmt", function () {
        if (isNaN($(this).val())) $(this).val(oldAdvPmt);
        let advance = $(this).val() ? parseFloat($(this).val()) : 0;
        if (advance > parseFloat(orderValue)) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text(
                "You can not pay advance more than the order amount"
            );
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            $(this).val(oldAdvPmt);
            return;
        }
        let amLeftToPay = orderValue - advance;
        if ($(".paymAmount").length && $(".paymAmount:first").val()) {
            let ttlPaym = 0;
            $(".paymAmount").each(function () {
                if (
                    $('[name="paymentCriteria"]:checked').val() == "percentage"
                ) {
                    let percent = parseFloat($(this).val());
                    let paymVal = (percent / 100) * amLeftToPay;
                    ttlPaym += paymVal;
                } else ttlPaym += parseFloat($(this).val());
            });
            if (ttlPaym > amLeftToPay) {
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "red");
                $("#notifDiv").text(
                    "You can not pay advance more than the order amount"
                );
                setTimeout(() => {
                    $("#notifDiv").fadeOut();
                }, 3000);
                $(this).val(oldAdvPmt);
                return;
            }
            $(".paymAmount:last").trigger("input");
            return;
        }
        $("#paymAmLeft").text(addCommas(amLeftToPay.toFixed(2)));
    });

    //Payment Modal
    $(document).on("change", "#payment_type_modal", function () {
        if ($(this).val() == 1) {
            $("#bank_name_modal").val("");
            $("#checque_num_modal").val("");
            $("#datepicker-modal").val("");
            $("#payment_modal").val("");
            $(".bank_div").hide();
        } else {
            $("#payment_modal").val("");
            $("#transaction_date_cash").val("");
            $(".bank_div").show();
        }
    });
    let advPaid = 0;
    let custBalance = 0;
    let dedFromBal = 0;

    $(document).on("input", "#amountFromBalance", function () {
        if (isNaN($(this).val()))
            $(this).val(0)

        dedFromBal = parseInt($(this).val());
        if (dedFromBal > custBalance)
            $(this).val(custBalance)
    });

    $(document).on("change", "#advAmtPmtType", function () {
        if ($(this).val() == 1)
            $(".bank_div").hide();
        else
            $(".bank_div").show();
    });

    $(document).on("click", ".receiveAllPayments", function () {
        advPaid = $(this).attr('adv-pmt') ? parseFloat($(this).attr('adv-pmt')) : 0;
        custBalance = $(this).attr('balance') ? parseFloat($(this).attr('balance')) : 0;
        order_id_for_payment = $(this).attr("order-id");
        pending_inv_amt = $(this).attr("due");
        order_currency_symbol = $(this).attr("symbol");
        if (custBalance != "0") {
            $('#custBalanceDiv').show();
            $('#custBalance').text(`(${custBalance})`);
        } else {
            $('#custBalanceDiv').hide();
            $('#custBalance').text(`0`);
        }
        $(".ttl_payment_modal").text(
            `${order_currency_symbol + " " + addCommas((parseFloat(pending_inv_amt)-advPaid).toFixed(2))}`
        );
        $(".remaining_amt").text(
            `${order_currency_symbol + " " + addCommas((parseFloat(pending_inv_amt)-advPaid).toFixed(2))}`
        );
        $(".ttl_payment_modal").attr("name", (parseFloat(pending_inv_amt) - advPaid).toFixed(2));
        receive_payment_ref = $(this);
        $("#payment_type_modal")
            .val("1")
            .trigger("change");
        $("#payment_modal").val("");
        $("#bank_name_modal").val("");
        $("#checque_num_modal").val("");
        $("#datepicker-modal").val("");
        $("#transaction_date_cash").val("");
        $("#exchange_rate_payment_rec").val("");

        $('.advPaidAmt').html(order_currency_symbol + " " + addCommas(advPaid));

        if ($("#currencyInPaymentRec").val() == "PKR")
            $("#exchange_rate_payment_rec").attr("readonly", true);
        else $("#exchange_rate_payment_rec").attr("readonly");
        $("#select_account")
            .val("0")
            .trigger("change");
    });

    $(document).on("click", ".recieve_payment", function () {
        order_id_for_payment = $(this)
            .attr("id")
            .split("/")[0];
        pending_inv_amt = $(this)
            .attr("id")
            .split("/")[1];
        order_currency_symbol = $(this)
            .attr("id")
            .split("/")[2];
        $(".ttl_payment_modal").text(
            `${order_currency_symbol + " " + (addCommas(pending_inv_amt)).toFixed(2)}`
        );
        $(".remaining_amt").text(
            `${order_currency_symbol + " " + (addCommas(pending_inv_amt)).toFixed(2)}`
        );
        $(".ttl_payment_modal").attr("name", pending_inv_amt);
        receive_payment_ref = $(this);
        $("#payment_type_modal")
            .val("1")
            .trigger("change");
        $("#payment_modal").val("");
        $("#bank_name_modal").val("");
        $("#checque_num_modal").val("");
        $("#datepicker-modal").val("");
        $("#transaction_date_cash").val("");
        $("#exchange_rate_payment_rec").val("");
        if ($("#currencyInPaymentRec").val() == "PKR")
            $("#exchange_rate_payment_rec").attr("readonly", true);
        else $("#exchange_rate_payment_rec").attr("readonly");
        $("#select_account")
            .val("0")
            .trigger("change");
    });

    $(document).on("keyup", "#payment_modal", function () {
        var val = $(this).val();
        if (
            parseFloat(val) > parseFloat($(".ttl_payment_modal").attr("name"))
        ) {
            val = val.toString();
            $(this).val(val.substr(0, val.length - 1));
        } else {
            $(".remaining_amt").text(
                `${order_currency_symbol +
                    " " +
                    (parseFloat($(".ttl_payment_modal").attr("name")) -
                        parseFloat($(this).val() == "" ? 0 : $(this).val())).toFixed(2)}`
            );
        }
    });

    $(document).on("change", "#currencyInPaymentRec", function () {
        if ($(this).val() == "PKR") {
            $("#exchange_rate_payment_rec").val("");
            $("#exchange_rate_payment_rec").attr("readonly", true);
        } else {
            $("#exchange_rate_payment_rec").removeAttr("readonly");
        }
    });

    $(document).on('click', '.saveAdvAmt', function () {
        if (!$('#advAmtTransDate').val() || !$('#advanceAmount').val()) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please provide all of the required information");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
        if ($('#advAmtPmtType').val() == "2") {
            if (!$('#advAmtBank').val() || !$('#advAmtTransNum').val() || !$('#advAmtAccount').val()) {
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "red");
                $("#notifDiv").text("Please provide all of the required information");
                setTimeout(() => {
                    $("#notifDiv").fadeOut();
                }, 3000);
                return;
            }
        }
        $(this).attr('disabled', true)
        $(this).text('Please Wait');
        ajaxer("/saveAdvPmt", "POST", {
            _token: $('meta[name="csrf_token"]').attr("content"),
            transDate: $('#advAmtTransDate').val(),
            amount: $('#advanceAmount').val(),
            transType: $('#advAmtPmtType').val(),
            bank: $('#advAmtBank').val(),
            transNum: $('#advAmtTransNum').val(),
            account: $('#advAmtAccount').val(),
            customer_id: $('#advPmtCustomer').val()
        }).then(x => {
            if (parseInt(x) == 200) {
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "green");
                $("#notifDiv").text("Advance has been saved.");
                setTimeout(() => {
                    $("#notifDiv").fadeOut();
                }, 3000);
                location.reload();
                $(this).text("Saved")
                return;
            }
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("A problem occured.");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            $(this).removeAttr('disabled')
            $(this).text("Save")
        })
    })

    $(document).on("click", ".add_payment_from_modal", function () {
        var all_ok = 0;
        $("#exchange_rate_payment_rec").css("border", "0px");
        $("#payment_modal").css("border", "0px");
        $("#transaction_date_cash").css("border", "0px");

        if (
            !$("#exchange_rate_payment_rec").val() &&
            order_currency_symbol !== "Rs"
        ) {
            $("#exchange_rate_payment_rec").css("border", "1px solid red");
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please enter exchange rate.");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
        if (
            $("#payment_type_modal").val() == 0 ||
            $("#payment_type_modal").val() == null
        ) {
            $("#payment_type_modal")
                .parent()
                .css("border", "1px solid red");
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Please Select Payment Type.");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            all_ok = 0;
        } else {
            $("#payment_type_modal")
                .parent()
                .css("border", "0px");
            if ($("#payment_type_modal").val() == 1) {
                if ($("#payment_modal").val() == "") {
                    $("#payment_modal").css("border", "1px solid red");
                    $("#notifDiv").fadeIn();
                    $("#notifDiv").css("background", "red");
                    $("#notifDiv").text("Please Enter Payment.");
                    setTimeout(() => {
                        $("#notifDiv").fadeOut();
                    }, 3000);
                    all_ok = 0;
                } else if ($("#transaction_date_cash").val() == "") {
                    $("#transaction_date_cash").css("border", "1px solid red");
                    $("#notifDiv").fadeIn();
                    $("#notifDiv").css("background", "red");
                    $("#notifDiv").text("Please Enter Payment.");
                    setTimeout(() => {
                        $("#notifDiv").fadeOut();
                    }, 3000);
                    all_ok = 0;
                } else {
                    $("#payment_modal").css("border", "0px");
                    all_ok = 1;
                }
            } else {
                var verif = [];
                $(".required_modal").each(function () {
                    if ($(this).val() == "") {
                        $(this).css("border", "1px solid red");
                        verif.push(false);
                        $("#notifDiv").fadeIn();
                        $("#notifDiv").css("background", "red");
                        $("#notifDiv").text(
                            "Please Fill all required fields(*)."
                        );
                        setTimeout(() => {
                            $("#notifDiv").fadeOut();
                        }, 3000);
                        return;
                    } else if ($(this).val() == 0 || $(this).val() == null) {
                        $(this)
                            .parent()
                            .css("border", "1px solid red");
                        verif.push(false);
                        $("#notifDiv").fadeIn();
                        $("#notifDiv").css("background", "red");
                        $("#notifDiv").text(
                            "Please provide all the required information (*)"
                        );
                        setTimeout(() => {
                            $("#notifDiv").fadeOut();
                        }, 3000);
                        return;
                    } else {
                        verif.push(true);
                    }
                });
                if (jQuery.inArray(false, verif) != -1) {
                    //return;
                    all_ok = 0;
                } else {
                    $("#bank_name_modal").css("border", "0px");
                    $("#checque_num_modal").css("border", "0px");
                    $("#datepicker-modal").css("border", "0px");
                    $("#transaction_date_cash").css("border", "0px");
                    $("#payment_modal").css("border", "0px");
                    $("#select_account")
                        .parent()
                        .css("border", "0px");
                    all_ok = 1;
                }
            }
        }

        var all_payment_paid = 0;
        if (
            parseFloat($(".ttl_payment_modal").attr("name")) ==
            $("#payment_modal").val()
        ) {
            all_payment_paid = 1;
        }

        if (dedFromBal > parseFloat($('#payment_modal').val())) {
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            $("#notifDiv").text("Amount to pay is less than your balance deduction.");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }

        if (all_ok == 1) {
            var thisRef = $(this);
            thisRef.attr("disabled", "disabled");
            $(".cancel_modal").attr("disabled", "disabled");
            thisRef.text("Processing...");
            $.ajax({
                type: "POST",
                url: "/save_payment_from_OrderListing",
                data: {
                    _token: $('meta[name="csrf_token"]').attr("content"),
                    order_id: order_id_for_payment,
                    type: $("#payment_type_modal").val(),
                    all_payment_paid: all_payment_paid,
                    amount: $("#payment_modal").val(),
                    bank_name: $("#bank_name_modal").val(),
                    cheque_num: $("#checque_num_modal").val(),
                    cheque_date: $("#datepicker-modal").val(),
                    transaction_date_cash: $("#transaction_date_cash").val(),
                    exchange_rate: $("#exchange_rate_payment_rec").val(),
                    currency: $("#currencyInPaymentRec").val(),
                    currency_symbol: order_currency_symbol,
                    account_num: $("#select_account").val(),
                    advance_paid: advPaid != "0" ? 1 : 0,
                    customer_balance: dedFromBal
                },
                success: function (response) {
                    var response = JSON.parse(response);
                    thisRef.text("Add");
                    thisRef.removeAttr("disabled");
                    $(".cancel_modal").removeAttr("disabled");
                    if (response == "failed") {
                        $("#notifDiv").fadeIn();
                        $("#notifDiv").css("background", "red");
                        $("#notifDiv").text(
                            "Failed to add payment at the moment"
                        );
                        setTimeout(() => {
                            $("#notifDiv").fadeOut();
                        }, 3000);
                    } else {
                        $("#notifDiv").fadeIn();
                        $("#notifDiv").css("background", "green");
                        $("#notifDiv").text("Saved Successfully");
                        setTimeout(() => {
                            $("#notifDiv").fadeOut();
                        }, 3000);
                        receive_payment_ref.attr(
                            "id",
                            order_id_for_payment +
                            "/" +
                            (pending_inv_amt - $("#payment_modal").val()) +
                            "/" +
                            order_currency_symbol
                        );
                        //fetchInvoicePayment(segments[4]);
                        $(".cancel_modal").click();
                        $("#payment_modal").val("");
                        $("#bank_name_modal").val("");
                        $("#checque_num_modal").val("");
                        $("#datepicker-modal").val("");
                        $("#payment_type_modal")
                            .val("1")
                            .trigger("change");
                        $("#select_account")
                            .val("0")
                            .trigger("change");
                        if (all_payment_paid == 1) {
                            receive_payment_ref.hide();
                        }
                    }
                }
            });
        }
    });

    $(document).on("input", "#order_discount", function () {
        updateTotalAmount($(this).val());
    });

    $(document).on("click", ".view_production_modal", function () {
        var thisRef = $(this);
        $(".production_table_modal tbody").html(
            `<tr><td colspan=6 style="text-align: center">Loading..</td></tr>`
        );
        ajaxer("/GetAssignmentsAgainstBatch", "POST", {
            _token: $('meta[name="csrf_token"]').attr("content"),
            batch: thisRef.attr("batch")
        }).then(response => {
            $(".production_table_modal tbody").empty();

            allAssignments = JSON.parse(response);
            activeBatchForFollowup = thisRef.attr("batch");
            $(".production_table_modal tbody").empty();
            let batchFnd = allAssignments.find(
                x => x.batch == activeBatchForFollowup
            );

            $(".assigned_emp_modal")
                .val(batchFnd.assigned_employees)
                .trigger("change");
            $(".delivery_date_modal").val(batchFnd.expected_delivery_date);
            $(".follow_date_modal").val(batchFnd.follow_up_date);
            allAssignments.forEach(x => {
                $(".production_table_modal tbody").append(`
                    <tr>
                        <td>${x.product_name}</td>
                        <td>${x.item_name}</td>
                        <td class="ass_qty_modal">${x.item_quantity}</td>
                        <td class="producted_qty_modal">${
                            x.production_quantity
                        }</td>
                        <td>
                        <input type="text" class="CN-st-end new_produce_qty_modal" ass-id="${
                            x.id
                        }" ass-qty="${x.item_quantity}" item-id="${
                    x.item_id
                }" batch-code="${x.batch}" value="${
                    x.production_quantity ? x.production_quantity : ""
                }" placeholder="0">
                        </td>
                        <td>
                        <button class="btn btn-default mb-0 add_production_btn_modal" disabled>Add</button>
                        </td>
                    </tr>`);
            });
        });
    });

    $(document).on("input", ".new_produce_qty_modal", function () {
        var assigned_qty = $(this)
            .parent()
            .parent()
            .find(".ass_qty_modal")
            .text();
        var producted_qty_modal = $(this)
            .parent()
            .parent()
            .find(".producted_qty_modal")
            .text();
        if (parseFloat($(this).val()) > parseFloat(assigned_qty)) {
            $(this).val(
                $(this)
                .val()
                .substr(0, $(this).val().length - 1)
            );
            $(this)
                .parent()
                .parent()
                .find(".add_production_btn_modal")
                .attr("disabled", true);
        } else {
            $(this)
                .parent()
                .parent()
                .find(".add_production_btn_modal")
                .removeAttr("disabled");
        }
    });

    $(document).on("click", ".add_production_btn_modal", function () {
        if (
            !$(this)
            .parent()
            .parent()
            .find(".new_produce_qty_modal")
            .val()
        ) {
            alert("Please provide valid quantity");
            return;
        }
        $(this).text("Added");
        $(this).attr("disabled", true);
        $(this)
            .parent()
            .parent()
            .find(".new_produce_qty_modal")
            .attr("disabled", true);

        productionItemsData = [];
        $(".new_produce_qty_modal").each(function () {
            if (!$(this).val()) return;
            productionItemsData.push({
                assignment_id: $(this).attr("ass-id"),
                production_quantity: $(this).val(),
                assigned_qty: $(this).attr("ass-qty")
            });
        });
    });

    $(document).on("click", ".add_production_follow_up", function () {
        if (!productionItemsData.length) {
            alert("Please add items to production");
            return;
        }
        if (!$(".production_remarks_modal").val()) {
            alert("Please provide remarks for this production information");
            return;
        }
        $(".add_production_follow_up").text("Saving");
        $(".add_production_follow_up").attr("disabled", true);
        ajaxer("/SaveProductionQty", "POST", {
            _token: $('meta[name="csrf_token"]').attr("content"),
            data: productionItemsData,
            remarks: $(".production_remarks_modal").val(),
            follow_up_date: $(".follow_date_modal").val()
        }).then(response => {
            if (response.code == 200) {
                $(".add_production_follow_up").text("Saved");
                location.reload();
            } else {
                $(".add_production_follow_up").text("Save");
                $(".add_production_follow_up").attr("disabled", true);
            }
        });
    });

    $(document).on('click', '.open_modal', function () {
        $('.order_file_input').val(null);
        $('.orderItem_file_input').val(null);
        $('.file_name').text('Choose File');
        $('.error_message_div').hide();
        $('.not_uploadable_orders_table').empty();
    });

    //Excel Sheet Input Change Action
    $(document).on('change', '.order_file_input', function () {
        var file = $('.order_file_input')[0].files[0]
        if (file) {
            $('.file_name').text(file.name);
        }
    });

    $(document).on('change', '.orderItem_file_input', function () {
        var file = $('.orderItem_file_input')[0].files[0]
        if (file) {
            $('.file_name_items').text(file.name);
        }
    });

    //Save Excel Sheet
    $(document).on('click', '.upload_order_file_btn', function () {
        if (!$('.select_currency_bulkUpload').val()) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please select all required fields(*)');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }

        if ($('.order_file_input').get(0).files.length === 0) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Upload File');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        var thisRef = $(this);
        thisRef.text('Processing...');
        thisRef.attr('disabled', 'disabled');
        $('#upload_orderExcel_form').ajaxSubmit({
            type: "POST",
            url: '/upload_orders_bulk',
            data: {
                currency: $('.select_currency_bulkUpload').val(),
                currency_symbol: $('.select_currency_bulkUpload').find('option:selected').attr("sign")
            },
            cache: false,
            success: function (response) {
                thisRef.removeAttr('disabled');
                thisRef.text('Upload');
                $('.file_name').text('Choose File');
                $('.order_file_input').val('');
                $('.select_currency_bulkUpload').val(0).trigger('change');
                $('.error_message_div').hide();
                $('.not_uploadable_orders_table').empty();

                var response = JSON.parse(response);
                if (response.status == 'failed') {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add Orders at the moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Added Successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);

                }

                if (response.not_upload_able.length > 0) {
                    $('.error_message_div').show();
                    $('.not_uploadable_orders_table').append('<table class="table table-hover dt-responsive nowrap" id="not_uploadable_orders" style="width:100%;"><thead><tr><th>Order ID</th><th>Customer ID</th><th>Reason</th></tr></thead><tbody></tbody></table>');
                    $('#not_uploadable_orders tbody').empty();
                    jQuery.each(response.not_upload_able, function (i, val) {
                        $('#not_uploadable_orders tbody').append(`<tr><td>${val.order_id}</td><td>${val.customer_id}</td><td>${val.reason}</td></tr>`);
                    });
                    $('#not_uploadable_orders').DataTable();
                } else {
                    $('.error_message_div').hide();
                    $('.not_uploadable_orders_table').empty();
                    //location.reload();
                }

            }
        });
    });

    $(document).on('click', '.upload_orderItems_file_btn', function () {
        if ($('.orderItem_file_input').get(0).files.length === 0) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Please Upload File');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        var thisRef = $(this);
        thisRef.text('Processing...');
        thisRef.attr('disabled', 'disabled');
        $('#upload_orderItemsExcel_form').ajaxSubmit({
            type: "POST",
            url: '/upload_ordersItems_bulk',
            cache: false,
            success: function (response) {
                thisRef.removeAttr('disabled');
                thisRef.text('Upload');
                $('.file_name_items').text('Choose File');
                $('.orderItem_file_input').val('');

                var response = JSON.parse(response);
                if (response.status == 'failed') {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Failed to add Orders Items at the moment');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Added Successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    //location.reload();
                }

            }
        });
    });

    $(document).on('click', '.save_paragraph', function () {
        var thisRef = $(this);
        var type = thisRef.attr('detail-type');
        var paragraph = $((type == 'health' ? '#health_detail' : (type == 'quality' ? '#quality_detail' : '#conformity_detail'))).val();
        if (!paragraph) {
            $('#notifDiv').fadeIn();
            $('#notifDiv').css('background', 'red');
            $('#notifDiv').text('Detail is empty!');
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        thisRef.attr('disabled', 'disabled');
        thisRef.text('Processing...');
        $.ajax({
            type: 'POST',
            url: '/save_certificate_detail',
            data: {
                _token: $('input[name="_token"]').val(),
                type: type,
                paragraph: paragraph,
                order_id: segments[4],
                batch: segments[5]
            },
            success: function (response) {
                thisRef.removeAttr('disabled');
                thisRef.text('Save');

                if (JSON.parse(response) == "success") {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'green');
                    $('#notifDiv').text('Saved Successfully');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    $((type == 'health' ? '#health_detail' : (type == 'quality' ? '#quality_detail' : '#conformity_detail'))).val('')
                } else {
                    $('#notifDiv').fadeIn();
                    $('#notifDiv').css('background', 'red');
                    $('#notifDiv').text('Unable to save at the moment!');
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                }

            }
        });
    });

    $(document).on('click', '.multi_complete_docs', function () {
        $('.docs_display_div').empty();
        $('.docs_display_div').show();
        $('.main_docs_heading_div').hide();
        $('.back_document_div').show();
        var docuemnts = JSON.parse($(this).attr('document'));
        var base_url = $(this).attr('url');
        docuemnts.forEach(element => {
            $('.docs_display_div').append(`<ul><li class="PB-5"><a target="_blank" href="${base_url+element['file']}"><i class="fa fa-file"></i>${element['filename']}</a></li></ul>`);
        })
    });

    $(document).on('click', '.back_document_div', function () {
        $('.docs_display_div').hide();
        $('.main_docs_heading_div').show();
        $('.back_document_div').hide();
    })


});

function saveOrder(status = "pending") {
    if (segments[4] && segments[4] === "create") {
        if (orderId) {
            return;
        }
    }

    if (!$("#selectCustomerDD").val() && status != "draft") {
        $("#notifDiv").fadeIn();
        $("#notifDiv").css("background", "red");
        $("#notifDiv").text("Please select company");
        setTimeout(() => {
            $("#notifDiv").fadeOut();
        }, 5000);
        return;
    }

    if (!$("._orderType select").val() && status != "draft") {
        $("#notifDiv").fadeIn();
        $("#notifDiv").css("background", "red");
        $("#notifDiv").text("Please select order type");
        setTimeout(() => {
            $("#notifDiv").fadeOut();
        }, 5000);
        return;
    }

    var invalidEntry = [];
    var duplicateEntry = [];
    var itemsAdded = [];

    // if (!$('[name="additional_weight_ctn"]').val() && status != 'draft') {
    //     $('#notifDiv').fadeIn();
    //     $('#notifDiv').css('background', 'red');
    //     $('#notifDiv').text('Please provide additional weight per carton');
    //     setTimeout(() => {
    //         $('#notifDiv').fadeOut();
    //     }, 5000);
    //     return;
    // }

    if (!$("#poNumForm").val() && status != "draft") {
        $("#notifDiv").fadeIn();
        $("#notifDiv").css("background", "red");
        $("#notifDiv").text("Please provide PO number");
        setTimeout(() => {
            $("#notifDiv").fadeOut();
        }, 5000);
        return;
    }

    if (!$("._row-product").length) {
        $("#notifDiv").fadeIn();
        $("#notifDiv").css("background", "red");
        $("#notifDiv").text(`Kindly add items before saving ${status}`);
        setTimeout(() => {
            $("#notifDiv").fadeOut();
        }, 5000);
        return;
    }

    var paymData = [];
    $("._schedulecol1").each(function () {
        paymData.push({
            payment_criteria: $('[name="paymentCriteria"]:checked').val(),
            payment: $(this)
                .find(".paymAmount")
                .val(),
            due_date: $(this)
                .parent()
                .find(".paymentDueDate")
                .val()
        });
    });

    if (paymData.find(x => !x.due_date) || paymData.find(x => !x.payment)) {
        $("#notifDiv").fadeIn();
        $("#notifDiv").css("background", "red");
        $("#notifDiv").text(
            "Kindly provide all the required information to schedule the payments"
        );
        setTimeout(() => {
            $("#notifDiv").fadeOut();
        }, 3000);
        return;
    }

    $("._row-product").each(function () {
        if (
            !$(this)
            .find(".totalQty")
            .val() ||
            !$(this)
            .find(".unitPrice")
            .val()
            .replace(currencySelected, "")
        )
            invalidEntry.push(true);

        var idToFind = $(this)
            .find(".dynamicallyAddedItemsDD")
            .val();
        if (itemsAdded.find(x => x.item_id == idToFind))
            duplicateEntry.push(true);

        itemsAdded.push({
            custom_desc: $(this)
                .find(".textarea-HA")
                .val(),
            item_id: $(this)
                .find(".dynamicallyAddedItemsDD")
                .val(),
            product_id: $(this)
                .find(".dynamicallyAddedProductsDD")
                .val(),
            qty: $(this)
                .find(".totalQty")
                .val(),
            weight_per_unit: $(this)
                .find(".weightPerUnit")
                .val()
                .replace("Grams", ""),
            weight_per_ctn: $(this)
                .find(".weightPerCtn")
                .val()
                .replace(" KG(s)", ""),
            cbm: $(this)
                .find(".itemCbm")
                .val(),
            total_cbm: $(this)
                .find(".totalItemCbm")
                .val(),
            unit_price: $(this)
                .find(".unitPrice")
                .val()
                .replace(currencySelected, ""),
            total_amount: $(this)
                .find(".totalItemAmount")
                .val()
                .replace(currencySelected, "")
                .replace(/,/g, ""),
            contentId: $(this)
                .find(".contentId")
                .attr("id")
        });
    });

    if (invalidEntry.includes(true) && status != "draft") {
        $("#notifDiv").fadeIn();
        $("#notifDiv").css("background", "red");
        $("#notifDiv").text(
            "Please provide unit price and CTN quantity for all the selected items"
        );
        setTimeout(() => {
            $("#notifDiv").fadeOut();
        }, 5000);
        return;
    }

    // if (duplicateEntry.includes(true)) {
    //     $("#notifDiv").fadeIn();
    //     $("#notifDiv").css("background", "red");
    //     $("#notifDiv").text("Kindly select unique items");
    //     setTimeout(() => {
    //         $("#notifDiv").fadeOut();
    //     }, 3000);
    //     return;
    // }

    var order_contents_info = itemsAdded;
    var orderInfo = {
        order_id: $('[name="order_id"]').val(),
        customer_id: $("#selectCustomerDD").val(),
        order_type: $("._orderType select").val(),
        issue_date: $("#issueDate").val(),
        po_number: $("#poNumForm").val(),
        //invoice_number: $("#invNumber").val(),
        notes: $(".textarea-NOTES").val(),
        terms: $(".textarea-TERMS").val(),
        net_weight: $('[name="net_weight"]').val(),
        actual_net_weight: $('[name="actual_net_weight"]').val(),
        additional_weight_ctn: $('[name="additional_weight_ctn"]').val(),
        country_of_origin: $('[name="country_of_origin"]').val(),
        expected_delivery_date: $('[name="expected_delivery_date"]').val(),
        port_of_loading: $('[name="port_of_loading"]').val(),
        port_of_discharge: $('[name="port_of_discharge"]').val(),
        mode_of_shipment: $('[name="mode_of_shipment"]').val(),
        shipment_route: $('[name="shipping_route"]').val(),
        shipment_company: $('[name="shipment_company"]').val(),
        order_type: $('[name="order_type"]').val(),
        quoted_freight_charges: $('[name="quoted_freight_charges"]').val(),
        actual_freight_charges: $('[name="actual_freight_charges"]').val(),
        insurance_charges: $('[name="insurance_charges"]').val(),
        currency: currencySelected,
        currency_symbol: $("#currencySelector option:selected").attr("sign"),
        order_discount: $("#order_discount").val() ?
            $("#order_discount").val() : 0,
        payment_type: $('select[name="payment_type"]').val(),
        advance: $("#advPmt").val(),
        status: status
    };

    $("#saveOrderBtn")
        .parent()
        .parent()
        .find("button:eq(0)")
        .css("pointer-events", "none");
    $("#saveOrderBtn")
        .parent()
        .parent()
        .find("button:eq(0)")
        .text("Saving..");

    var ajaxUrl = "/Performa";
    var callMethod = "POST";
    if (segments[5] && segments[5] === "edit") {
        ajaxUrl = "/Performa/" + $('[name="order_id"]').val();
        callMethod = "PUT";
    }
    $.ajax({
        type: "POST",
        url: ajaxUrl,
        data: {
            _token: $('meta[name="csrf_token"]').attr("content"),
            _method: callMethod,
            content: JSON.stringify(order_contents_info),
            order: JSON.stringify(orderInfo),
            leftOverStock: leftOverStockAdjusted,
            paymData: paymData,
            removed_items: JSON.stringify(removed_items),
            historical_order: segments[5] ? segments[5] : ''
        },
        success: function (response) {

            var response = JSON.parse(response);
            if (response.code == 200) {
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "green");
                if (status == "pending")
                    $("#notifDiv").text("Performa has been saved successfully");
                else
                    $("#notifDiv").text(
                        "Performa has been saved" +
                        (status !== "order" ? " as " + status : "")
                    );
                setTimeout(() => {
                    $("#notifDiv").fadeOut();

                    if (segments[5] && segments[5] == 'historical')
                        return location.href = '/historicOrders'

                    window.location.href = "/Performas/";
                    //location.href = ((segments[6] && (segments[6] === "historic") ? '/historicOrders' : (segments[5] && segments[5] === "edit" ? '/OrderManagement' : "/OrderDetails/" + response.message)));
                    return;

                    if (status == "pending") {
                        response.suppliers.forEach(element => {
                            $("#supplierIdforAssignment").append(
                                `<option value="${element.id}">${element.company_name}</option>`
                            );
                        });
                        $(".openAssignmentModal").click();
                        return;
                    }

                    window.location.href = "/Performas/" + response.message;
                    return;
                }, 1500);

                $("#saveOrderBtn")
                    .parent()
                    .parent()
                    .find("button:eq(0)")
                    .text("Performa Saved");
                orderId = response.message;
                orderValue = parseFloat(response.total).toFixed(2);
                $("#paymAmLeft").text(addCommas(orderValue));
                $("#totalPaymentAm").text(addCommas(orderValue));
            } else {
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "red");
                $("#notifDiv").text("There was a problem saving this order.");
                setTimeout(() => {
                    $("#notifDiv").fadeOut();
                }, 3000);
                $("#saveOrderBtn")
                    .parent()
                    .parent()
                    .find("button:eq(0)")
                    .css("pointer-events", "");
                $("#saveOrderBtn")
                    .parent()
                    .parent()
                    .find("button:eq(0)")
                    .text("Save");
            }
        }
    });
}

function saveProduct(thisRef) {
    let productId = addItemPrefsRef
        .parent()
        .parent()
        .parent()
        .find(".dynamicallyAddedProductsDD")
        .val();
    if (
        !$('input[name="unit_weight"]').val() ||
        !$('select[name="unit_id"]').val() ||
        !$('input[name="unit_variant_quantity"]').val() ||
        !$('input[name="length"]').val() ||
        !$('input[name="width"]').val() ||
        !$('input[name="height"]').val()
    ) {
        $("#notifDiv").fadeIn();
        $("#notifDiv").css("background", "red");
        $("#notifDiv").text("Please provide all the required information (*)");
        setTimeout(() => {
            $("#notifDiv").fadeOut();
        }, 3000);
        return;
    }

    if ($('[name="variant_id_2"]').val() == '0' && $('[name="variant_id_3"]').val() != '0') {
        $("#notifDiv").fadeIn();
        $("#notifDiv").css("background", "red");
        $("#notifDiv").text("Please select variants carefully");
        setTimeout(() => {
            $("#notifDiv").fadeOut();
        }, 3000);
        return;
    }

    if (!$('[name="variant_quantity_2"]').val() && $('[name="variant_id_2"]').val() != '0') {
        $("#notifDiv").fadeIn();
        $("#notifDiv").css("background", "red");
        $("#notifDiv").text("Please select variants carefully");
        setTimeout(() => {
            $("#notifDiv").fadeOut();
        }, 3000);
        return;
    } else if ($('[name="variant_quantity_2"]').val() && $('[name="variant_id_2"]').val() == "0") {
        $("#notifDiv").fadeIn();
        $("#notifDiv").css("background", "red");
        $("#notifDiv").text("Please select variants carefully");
        setTimeout(() => {
            $("#notifDiv").fadeOut();
        }, 3000);
        return;
    } else if (!$('[name="variant_quantity_3"]').val() && $('[name="variant_id_3"]').val() != '0') {
        $("#notifDiv").fadeIn();
        $("#notifDiv").css("background", "red");
        $("#notifDiv").text("Please select variants carefully");
        setTimeout(() => {
            $("#notifDiv").fadeOut();
        }, 3000);
        return;
    } else if ($('[name="variant_quantity_3"]').val() && $('[name="variant_id_3"]').val() == "0") {
        $("#notifDiv").fadeIn();
        $("#notifDiv").css("background", "red");
        $("#notifDiv").text("Please select variants carefully");
        setTimeout(() => {
            $("#notifDiv").fadeOut();
        }, 3000);
        return;
    }

    thisRef.attr("disabled", "disabled");
    thisRef.text("Processing..");

    var ajaxUrl = "/Products";

    var postData = {
        existing_brand_id: allProducts.find(x => x.id == productId).brand_id,
        existing_product_id: productId,
        item_description: $('[name="item_description"]').val(),
        unit_id: $('[name="unit_id"]').val(),
        unit_weight: $('[name="unit_weight"]').val(),
        variant_id: $('[name="variant_id"]').val(),
        unit_quantity: $('[name="unit_quantity"]').val(),
        variant_id_2: $('[name="variant_id_2"]').val(),
        variant_quantity_2: $('[name="variant_quantity_2"]').val(),
        variant_id_3: $('[name="variant_id_3"]').val(),
        variant_quantity_3: $('[name="variant_quantity_3"]').val(),
        unit_variant_quantity: $('[name="unit_variant_quantity"]').val(),
        length: $('[name="length"]').val(),
        width: $('[name="width"]').val(),
        height: $('[name="height"]').val(),
        cbm_value: $('[name="cbm_value"]').val(),
        actual_cbm: $('[name="actual_cbm"]').val(),
        standrad_unit_price: $('[name="standrad_unit_price"]').val(),
        _token: $('meta[name="csrf_token"]').attr("content")
    };
    $.ajax({
        type: "POST",
        url: ajaxUrl,
        data: postData,
        cache: false,
        success: function (response) {
            var response = JSON.parse(response);
            if (response["status"] == "success") {

                fetchProducts().then(x => {
                    thisRef.removeAttr("disabled");
                    thisRef.text("Add Item");
                    $("#product-cl-sec")
                        .find("input")
                        .val("");
                    $("#product-cl-sec")
                        .find("input[type=text], textarea")
                        .val("");
                    $("#product-cl-sec")
                        .find("select")
                        .val("0")
                        .trigger("change");
                    $("#notifDiv").fadeIn();
                    $("#notifDiv").css("background", "green");
                    $("#notifDiv").text("Item added successfully");
                    setTimeout(() => {
                        $("#notifDiv").fadeOut();
                    }, 3000);
                    var newOption = new Option(
                        response.data.name,
                        response.data.id,
                        false,
                        false
                    );
                    addItemPrefsRef
                        .parent()
                        .find(".dynamicallyAddedItemsDD")
                        .append(newOption);
                    addItemPrefsRef
                        .parent()
                        .find(".dynamicallyAddedItemsDD")
                        .val(response.data.id);
                    addItemPrefsRef
                        .parent()
                        .find(".dynamicallyAddedItemsDD")
                        .trigger("change");
                    closeSidebar();
                })
            } else {
                thisRef.removeAttr("disabled");
                thisRef.text("Add Item");
                $("#notifDiv").fadeIn();
                $("#notifDiv").css("background", "red");
                $("#notifDiv").text("Failed to add item at this moment");
                setTimeout(() => {
                    $("#notifDiv").fadeOut();
                }, 3000);
            }
        },
        error: function (err) {
            if (err.status == 422) {
                $.each(err.responseJSON.errors, function (i, error) {
                    var el = $(document).find('[name="' + i + '"]');
                    el.after(
                        $(
                            '<small style="color: red; position: absolute; width:100%; text-align: right; margin-left: -30px">' +
                            error[0] +
                            "</small>"
                        )
                    );
                });
            }
        }
    });
}

function fetchCustomers() {
    var random_string = makeid(50);
    $("#selectCustomerDD").attr("disabled", "disabled");
    $("#selectCustomerDD").append(
        "<option selected disabled>Loading..</option>"
    );
    var selectedCustomer = parseInt($('[name="customer_id"]').val());
    $.ajax({
        type: "GET",
        url: "/GetCustomersList",
        data: {
            random_string: random_string
        },
        success: function (response) {
            $(".doc_key").val(random_string);
            $(".operation_docs").val(random_string);
            $("#selectCustomerDD").empty();
            var response = JSON.parse(response);
            customersInfo = response.customer;
            if (segments[3] == "PendingPayments") {
                $('#advPmtCustomer').empty();
                customersInfo.forEach(e => {
                    $('#advPmtCustomer').append(`<option value="${e.id}">${e.company_name}</option>`);
                });
            }
            leftOverStock = response.left_over_stock;
            $("#selectCustomerDD").append(
                "<option selected disabled>Select Company</option>"
            );
            response.customer.forEach((element, i) => {
                if (element.life_cycle_stage !== "customer") return;
                $("#selectCustomerDD").append(
                    '<option value="' +
                    element["id"] +
                    '" ' +
                    (selectedCustomer == element["id"] ?
                        "selected" :
                        null) +
                    " >" +
                    element["company_name"] +
                    "</option>"
                );
            });
            $("#selectCustomerDD").removeAttr("disabled");
            if (selectedCustomer) {
                var objs = ["poc_name", "company_name", "country", "city"];
                var custFound = customersInfo.find(
                    x => x.id == $("#selectCustomerDD").val()
                );
                objs.forEach(element => {
                    if (element == 'city')
                        $("span#" + element).text(JSON.parse(custFound.address)[0]['city']);
                    else
                        $("span#" + element).text(custFound[element]);
                });
            }
            response.poc.forEach(element => {
                $(".already_added_poc_for_customer").append(
                    `<option value="${element["id"]}">${element["first_name"] +
                        " " +
                        element["last_name"]}</option>`
                );
            });
        }
    });
}

function addCommas(nStr) {
    nStr += "";
    x = nStr.split(".");
    x1 = x[0];
    x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
}

function fetchProducts() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: "/GetProductsList",
            success: function (response) {
                allProducts = response.products;
                allContents = response.items;
                resolve(allProducts);
            }
        });
    });
}

$(function () {
    $(".expectedDeliveryDate").datepicker({
        format: "yyyy-mm-dd",
        startDate: "+0d"
    });
    $(".dp3")
        .datepicker()
        .on("changeDate", function (e) {
            $(this).datepicker("hide");
        });
    // var checkout = $('#dpd3').datepicker({
    //     onRender: function (date) {
    //         return date.valueOf() <= checkin.date.valueOf() ? 'disabled' : '';
    //     }
    // }).on('changeDate', function (ev) {
    //     checkout.hide();
    // }).data('datepicker');
});

function openNav1() {
    document.getElementById("mysidenav1").style.display = "block";
}

function closeNav1() {
    document.getElementById("mysidenav1").style.display = "none";
}

function openNav2() {
    document.getElementById("mysidenav2").style.display = "block";
}

function closeNav2() {
    document.getElementById("mysidenav2").style.display = "none";
}

function openNav3() {
    document.getElementById("mysidenav3").style.display = "block";
}

function closeNav3() {
    document.getElementById("mysidenav3").style.display = "none";
}

function openNav4() {
    document.getElementById("mysidenav4").style.display = "block";
}

function closeNav4() {
    document.getElementById("mysidenav4").style.display = "none";
}

function openNav5() {
    document.getElementById("mysidenav5").style.display = "block";
}

function closeNav5() {
    document.getElementById("mysidenav5").style.display = "none";
}

function openNav6() {
    document.getElementById("mysidenav6").style.display = "block";
}

function closeNav6() {
    document.getElementById("mysidenav6").style.display = "none";
}

function autosize() {
    var el = this;
    setTimeout(function () {
        el.style.cssText = "height:30px; padding:0";
        el.style.cssText = "height:" + el.scrollHeight + "px";
    }, 0);
}

var textarea = document.querySelector(".textarea-NOTES");
textarea ? textarea.addEventListener("keydown", autosize) : null;

function autosize() {
    var el = this;
    setTimeout(function () {
        el.style.cssText = "height:30px; padding:0";
        el.style.cssText = "height:" + el.scrollHeight + "px";
    }, 0);
}

var textarea = document.querySelector(".textarea-TERMS");
textarea ? textarea.addEventListener("keydown", autosize) : null;

function autosize() {
    var el = this;
    setTimeout(function () {
        el.style.cssText = "height:30px; padding:0";
        el.style.cssText = "height:" + el.scrollHeight + "px";
    }, 0);
}
var textarea = document.querySelector(".textarea-PMessage");
textarea ? textarea.addEventListener("keydown", autosize) : null;

function autosize() {
    var el = this;
    setTimeout(function () {
        el.style.cssText = "height:30px; padding:0";
        el.style.cssText = "height:" + el.scrollHeight + "px";
    }, 0);
}

function updateTotalAmount(discount = null) {
    if (!discount)
        discount = $("#order_discount").val() ?
        $("#order_discount").val() :
        null;
    var totalAm = 0;
    $(".totalItemAmount").each(function () {
        var total = $(this)
            .val()
            .replace(currencySelected, "")
            .replace(/,/g, "");
        if (total) totalAm += parseFloat(total.replace(",", ""));
    });
    $(".totalAm").html(currencySelected + addCommas(totalAm.toFixed(2)));
    $(".totalAm").html(currencySelected + addCommas(totalAm.toFixed(2)));
    if (discount) {
        $("._order-price").html(
            `<span>Amount Due (${currencySelected})</span> ${currencySelected}${addCommas(
                (totalAm - (discount / 100) * totalAm).toFixed(2)
            )}`
        );
        $(".amount_after_discount").html(
            `${currencySelected}${addCommas(
                (totalAm - (discount / 100) * totalAm).toFixed(2)
            )}`
        );
        $("#totalPaymentAm").text(
            `${addCommas((totalAm - (discount / 100) * totalAm).toFixed(2))}`
        );
        orderValue = (totalAm - (discount / 100) * totalAm).toFixed(2);
        if (rows_counts == 0) {
            $("#paymAmLeft").text(
                `${addCommas(
                    (totalAm - (discount / 100) * totalAm).toFixed(2)
                )}`
            );
        } else {
            // updateAmountSchedule();
        }
    } else {
        $("._order-price").html(
            `<span>Amount Due (${currencySelected})</span> ${currencySelected}${addCommas(
                totalAm.toFixed(2)
            )}`
        );
        $(".amount_after_discount").html(
            `${currencySelected}${addCommas(totalAm.toFixed(2))}`
        );
        $(`#totalPaymentAm`).text(`${addCommas(totalAm.toFixed(2))}`);
        orderValue = totalAm.toFixed(2);
        if (rows_counts == 0) {
            $("#paymAmLeft").text(`${addCommas(totalAm.toFixed(2))}`);
        } else {
            // updateAmountSchedule();
        }
    }

    let ttlPaym = 0;
    $(".paymAmount").each(function () {
        ttlPaym += parseFloat($(this).val());
        if (ttlPaym > orderValue) {
            $(this)
                .parent()
                .parent()
                .remove();
            totalPayments--;
            rows_counts--;
            if (!$(".paymAmount").length) $("#paymAmLeft").text(orderValue);
        }
    });

    if ($(".paymAmount").length) $(".paymAmount:last").trigger("input");
}

function updateTotalCartansQty() {
    var totalCtns = 0;
    $(".totalQty").each(function () {
        if ($(this).val()) totalCtns += parseFloat($(this).val());
    });
    $(".totalCtns").html(addCommas(totalCtns) + "CTNS");
}

function updateContainer20Ft(toFillContainerCalc = true) {
    if (typeof orderData !== "undefined") toFillContainerCalc = false;
    var totalCbm =
        typeof orderData !== "undefined" && orderData.contents ?
        orderData.contents.reduce((sum, val) => sum + val.total_cbm, 0) :
        0;
    var totalWeight =
        typeof orderData !== "undefined" && orderData.contents ?
        orderData.contents.reduce((sum, val) => sum + val.net_weight, 0) :
        0;
    var totalCtns =
        typeof orderData !== "undefined" && orderData.contents ?
        orderData.contents.reduce((sum, val) => sum + val.qty, 0) :
        0;
    var productWiseCbmForFullContainer = [];
    if (!totalCbm || !totalWeight || !totalCtns) {
        $("._row-product").each(function () {
            totalCtns += $(this)
                .find(".totalQty")
                .val() ?
                parseFloat(
                    $(this)
                    .find(".totalQty")
                    .val()
                ) :
                0;
            totalCbm += $(this)
                .find(".totalItemCbm")
                .val() ?
                parseFloat(
                    $(this)
                    .find(".totalItemCbm")
                    .val()
                ) :
                0;
            totalWeight += $(this)
                .find(".totalQty")
                .val() ?
                parseFloat(
                    $(this)
                    .find(".weightPerCtn")
                    .val()
                ) *
                parseFloat(
                    $(this)
                    .find(".totalQty")
                    .val()
                ) :
                0;
        });
    }

    if ($('[name="additional_weight_ctn"]').val()) {
        totalWeight +=
            parseFloat($('[name="additional_weight_ctn"]').val()) * totalCtns;
    }

    $('[name="net_weight"]').val(totalWeight.toFixed(2));
    $('[name="total_cbm_value_shipment_calculation"]').val(totalCbm.toFixed(3));

    var percent20Ft =
        Math.round((totalCbm / container20FtCbmLimit) * 100) + "%";

    var containersNeeded = totalCbm / container20FtCbmLimit;
    var containersNeededForWeight = totalWeight / 28000;

    if (toFillContainerCalc) {
        $("._row-product").each(function () {
            let totalCtnsRequiredToFillContainer =
                (Math.ceil(containersNeeded) * container20FtCbmLimit -
                    totalCbm) /
                parseFloat(
                    $(this)
                    .find(".itemCbm")
                    .val()
                );

            productWiseCbmForFullContainer.push({
                product: $(this)
                    .find(".dynamicallyAddedItemsDD option:selected")
                    .text(),
                more_cartans_capacity: totalCtnsRequiredToFillContainer < 0 ?
                    0 : Math.round(totalCtnsRequiredToFillContainer - 1)
            });
        });
    }

    if (containersNeededForWeight >= 1 && containersNeeded >= 1) {
        if (containersNeeded > containersNeededForWeight) {
            var flooredContainers = Math.floor(containersNeeded);
            var newContainers = Math.ceil(containersNeeded);
            $("#pill-20 .contDiv").remove();
            $("#pill-20").append('<div id="extra20Ft"></div>');
            // for (var i = 0; i < newContainers; i++) {
            //     if (i <= flooredContainers - 1) {
            $("#extra20Ft").append(
                `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: 100%"></div><div class="ProgNO SM-PNO"  style="top: 45%">100%</div><span style="font-size: 15px; position: absolute; z-index: 10; float: left; top: 60%; left: 40%; color: white;" >x${flooredContainers}</span></div>`
            );
            // } else {
            var lastPercent = Math.round(
                (containersNeeded.toFixed(2) - flooredContainers) * 100
            );
            $("#extra20Ft").append(
                `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: ${lastPercent}%"></div><div class="ProgNO SM-PNO">${lastPercent}%</div></div>`
            );
            //     }
            // }
        } else {
            var flooredContainers = Math.floor(containersNeededForWeight);
            var newContainers = Math.ceil(containersNeededForWeight);
            $("#pill-20 .contDiv").remove();
            $("#pill-20").append('<div id="extra20Ft"></div>');
            // for (var i = 0; i < newContainers; i++) {
            //     if (i <= flooredContainers - 1) {
            $("#extra20Ft").append(
                `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: 100%"></div><div class="ProgNO SM-PNO"  style="top: 45%">100%</div><span style="font-size: 15px; position: absolute; z-index: 10; float: left; top: 60%; left: 40%; color: white;" >x${flooredContainers}</span></div>`
            );
            // } else {
            var lastPercent = Math.round(
                (containersNeededForWeight.toFixed(2) -
                    flooredContainers) *
                100
            );
            $("#extra20Ft").append(
                `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: ${lastPercent}%"></div><div class="ProgNO SM-PNO">${lastPercent}%</div></div>`
            );
            //     }
            // }
        }
    } else if (containersNeededForWeight >= 1 && containersNeeded < 1) {
        var flooredContainers = Math.floor(containersNeededForWeight);
        var newContainers = Math.ceil(containersNeededForWeight);
        $("#pill-20 .contDiv").remove();
        $("#pill-20").append('<div id="extra20Ft"></div>');
        // for (var i = 0; i < newContainers; i++) {
        //     if (i <= flooredContainers - 1) {
        $("#extra20Ft").append(
            `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: 100%"></div><div class="ProgNO SM-PNO"  style="top: 45%">100%</div><span style="font-size: 15px; position: absolute; z-index: 10; float: left; top: 60%; left: 40%; color: white;" >x${flooredContainers}</span></div>`
        );
        // } else {
        var lastPercent = Math.round(
            (containersNeededForWeight.toFixed(2) - flooredContainers) *
            100
        );
        $("#extra20Ft").append(
            `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: ${lastPercent}%"></div><div class="ProgNO SM-PNO">${lastPercent}%</div></div>`
        );
        //     }
        // }
    } else if (containersNeeded >= 1 && containersNeededForWeight < 1) {
        var flooredContainers = Math.floor(containersNeeded);
        var newContainers = Math.ceil(containersNeeded);
        $("#pill-20 .contDiv").remove();
        $("#pill-20").append('<div id="extra20Ft"></div>');
        // for (var i = 0; i < newContainers; i++) {
        //     if (i <= flooredContainers - 1) {
        $("#extra20Ft").append(
            `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: 100%"></div><div class="ProgNO SM-PNO"  style="top: 45%">100%</div><span style="font-size: 15px; position: absolute; z-index: 10; float: left; top: 60%; left: 40%; color: white;" >x${flooredContainers}</span></div>`
        );
        // } else {
        var lastPercent = Math.round(
            (containersNeeded.toFixed(2) - flooredContainers) * 100
        );
        $("#extra20Ft").append(
            `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: ${lastPercent}%"></div><div class="ProgNO SM-PNO">${lastPercent}%</div></div>`
        );
        //     }
        // }
    } else {
        $("#pill-20").empty();
        $("#pill-20").append(
            `<div class="contDiv"><div class="contProgress" style="width: ${percent20Ft}%"></div><div class="ProgNO">${percent20Ft}</div></div>`
        );
    }

    if (toFillContainerCalc) {
        $("#pill-20 table").remove();
        $("#pill-20").append(
            `<div class="row" style="display: block"><div class="col-12"><table style="width: 100%"><thead><tr><th>Product</th><th>Space left (Ctns)</th></tr></thead><tbody></table></div></div>`
        );
        productWiseCbmForFullContainer.forEach(element => {
            $("#pill-20 table tbody").append(
                `<tr><td>${element.product}</td><td>${element.more_cartans_capacity}</td></tr>`
            );
        });
    }
    updateContainer40Ft(totalCbm, totalWeight, toFillContainerCalc);
}

function updateContainer40Ft(
    totalCbm,
    totalWeight,
    toFillContainerCalc = true
) {
    var percent40Ft =
        Math.round((totalCbm / container40FtCbmLimit) * 100) + "%";

    var containersNeeded = totalCbm / container40FtCbmLimit;
    var containersNeededForWeight = totalWeight / 28000;
    var productWiseCbmForFullContainer = [];

    if (toFillContainerCalc) {
        $("._row-product").each(function () {
            let totalCtnsRequiredToFillContainer =
                (Math.ceil(containersNeeded) * container40FtCbmLimit -
                    totalCbm) /
                parseFloat(
                    $(this)
                    .find(".itemCbm")
                    .val()
                );

            productWiseCbmForFullContainer.push({
                product: $(this)
                    .find(".dynamicallyAddedItemsDD option:selected")
                    .text(),
                more_cartans_capacity: totalCtnsRequiredToFillContainer < 0 ?
                    0 : Math.round(totalCtnsRequiredToFillContainer - 1)
            });
        });
    }

    if (containersNeededForWeight >= 1 && containersNeeded >= 1) {
        if (containersNeeded > containersNeededForWeight) {
            var flooredContainers = Math.floor(containersNeeded);
            var newContainers = Math.ceil(containersNeeded);
            $("#pills-40 .contDiv").remove();
            $("#pills-40").append('<div id="extra40Ft"></div>');
            // for (var i = 0; i < newContainers; i++) {
            //     if (i <= flooredContainers - 1) {
            $("#extra40Ft").append(
                `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: 100%"></div><div class="ProgNO SM-PNO"  style="top: 45%">100%</div><span style="font-size: 15px; position: absolute; z-index: 10; float: left; top: 60%; left: 40%; color: white;" >x${flooredContainers}</span></div>`
            );
            // } else {
            var lastPercent = Math.round(
                (containersNeeded.toFixed(2) - flooredContainers) * 100
            );
            $("#extra40Ft").append(
                `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: ${lastPercent}%"></div><div class="ProgNO SM-PNO">${lastPercent}%</div></div>`
            );
            //     }
            // }
        } else {
            var flooredContainers = Math.floor(containersNeededForWeight);
            var newContainers = Math.ceil(containersNeededForWeight);
            $("#pills-40 .contDiv").remove();
            $("#pills-40").append('<div id="extra40Ft"></div>');
            // for (var i = 0; i < newContainers; i++) {
            //     if (i <= flooredContainers - 1) {
            $("#extra40Ft").append(
                `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: 100%"></div><div class="ProgNO SM-PNO"  style="top: 45%">100%</div><span style="font-size: 15px; position: absolute; z-index: 10; float: left; top: 60%; left: 40%; color: white;" >x${flooredContainers}</span></div>`
            );
            // } else {
            var lastPercent = Math.round(
                (containersNeededForWeight.toFixed(2) -
                    flooredContainers) *
                100
            );
            $("#extra40Ft").append(
                `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: ${lastPercent}%"></div><div class="ProgNO SM-PNO">${lastPercent}%</div></div>`
            );
            //     }
            // }
        }
    } else if (containersNeededForWeight >= 1 && containersNeeded < 1) {
        var flooredContainers = Math.floor(containersNeededForWeight);
        var newContainers = Math.ceil(containersNeededForWeight);
        $("#pills-40 .contDiv").remove();
        $("#pills-40").append('<div id="extra40Ft"></div>');
        // for (var i = 0; i < newContainers; i++) {
        //     if (i <= flooredContainers - 1) {
        $("#extra40Ft").append(
            `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: 100%"></div><div class="ProgNO SM-PNO"  style="top: 45%">100%</div><span style="font-size: 15px; position: absolute; z-index: 10; float: left; top: 60%; left: 40%; color: white;" >x${flooredContainers}</span></div>`
        );
        // } else {
        var lastPercent = Math.round(
            (containersNeededForWeight.toFixed(2) - flooredContainers) *
            100
        );
        $("#extra40Ft").append(
            `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: ${lastPercent}%"></div><div class="ProgNO SM-PNO">${lastPercent}%</div></div>`
        );
        //     }
        // }
    } else if (containersNeeded >= 1 && containersNeededForWeight < 1) {
        var flooredContainers = Math.floor(containersNeeded);
        var newContainers = Math.ceil(containersNeeded);
        $("#pills-40 .contDiv").remove();
        $("#pills-40").append('<div id="extra40Ft"></div>');
        // for (var i = 0; i < newContainers; i++) {
        //     if (i <= flooredContainers - 1) {
        $("#extra40Ft").append(
            `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: 100%"></div><div class="ProgNO SM-PNO"  style="top: 45%">100%</div><span style="font-size: 15px; position: absolute; z-index: 10; float: left; top: 60%; left: 40%; color: white;" >x${flooredContainers}</span></div>`
        );
        // } else {
        var lastPercent = Math.round(
            (containersNeeded.toFixed(2) - flooredContainers) * 100
        );
        $("#extra40Ft").append(
            `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: ${lastPercent}%"></div><div class="ProgNO SM-PNO">${lastPercent}%</div></div>`
        );
        //     }
        // }
    } else {
        $("#pills-40").empty();
        $("#pills-40").append(
            `<div class="contDiv"><div class="contProgress" style="width: ${percent40Ft}%"></div><div class="ProgNO">${percent40Ft}</div></div>`
        );
    }

    if (toFillContainerCalc) {
        $("#pills-40 table").remove();
        $("#pills-40").append(
            `<div class="row" style="display: block"><div class="col-12"><table style="width: 100%"><thead><tr><th>Product</th><th>Space left (Ctns)</th></tr></thead><tbody></table></div></div>`
        );
        productWiseCbmForFullContainer.forEach(element => {
            $("#pills-40 table tbody").append(
                `<tr><td>${element.product}</td><td>${element.more_cartans_capacity}</td></tr>`
            );
        });
    }
    updateContainer40FtHc(totalCbm, totalWeight, toFillContainerCalc);
}

function updateContainer40FtHc(
    totalCbm,
    totalWeight,
    toFillContainerCalc = true
) {
    var percent40FtHc =
        Math.round((totalCbm / container40FtHcCbmLimit) * 100) + "%";

    var containersNeeded = totalCbm / container40FtHcCbmLimit;
    var containersNeededForWeight = totalWeight / 28000;
    var productWiseCbmForFullContainer = [];
    if (toFillContainerCalc) {
        $("._row-product").each(function () {
            let totalCtnsRequiredToFillContainer =
                (Math.ceil(containersNeeded) * container40FtHcCbmLimit -
                    totalCbm) /
                parseFloat(
                    $(this)
                    .find(".itemCbm")
                    .val()
                );

            productWiseCbmForFullContainer.push({
                product: $(this)
                    .find(".dynamicallyAddedItemsDD option:selected")
                    .text(),
                more_cartans_capacity: totalCtnsRequiredToFillContainer < 0 ?
                    0 : Math.round(totalCtnsRequiredToFillContainer - 1)
            });
        });
    }

    if (containersNeededForWeight >= 1 && containersNeeded >= 1) {
        if (containersNeeded > containersNeededForWeight) {
            var flooredContainers = Math.floor(containersNeeded);
            var newContainers = Math.ceil(containersNeeded);
            $("#pills-hc .contDiv").remove();
            $("#pills-hc").append('<div id="extra40FtHc"></div>');
            // for (var i = 0; i < newContainers; i++) {
            //     if (i <= flooredContainers - 1) {
            $("#extra40FtHc").append(
                `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: 100%"></div><div class="ProgNO SM-PNO"  style="top: 45%">100%</div><span style="font-size: 15px; position: absolute; z-index: 10; float: left; top: 60%; left: 40%; color: white;" >x${flooredContainers}</span></div>`
            );
            // } else {
            var lastPercent = Math.round(
                (containersNeeded.toFixed(2) - flooredContainers) * 100
            );
            $("#extra40FtHc").append(
                `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: ${lastPercent}%"></div><div class="ProgNO SM-PNO">${lastPercent}%</div></div>`
            );
            //     }
            // }
        } else {
            var flooredContainers = Math.floor(containersNeededForWeight);
            var newContainers = Math.ceil(containersNeededForWeight);
            $("#pills-hc .contDiv").remove();
            $("#pills-hc").append('<div id="extra40FtHc"></div>');
            // for (var i = 0; i < newContainers; i++) {
            //     if (i <= flooredContainers - 1) {
            $("#extra40FtHc").append(
                `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: 100%"></div><div class="ProgNO SM-PNO"  style="top: 45%">100%</div><span style="font-size: 15px; position: absolute; z-index: 10; float: left; top: 60%; left: 40%; color: white;" >x${flooredContainers}</span></div>`
            );
            // } else {
            var lastPercent = Math.round(
                (containersNeededForWeight.toFixed(2) -
                    flooredContainers) *
                100
            );
            $("#extra40FtHc").append(
                `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: ${lastPercent}%"></div><div class="ProgNO SM-PNO">${lastPercent}%</div></div>`
            );
            //     }
            // }
        }
    } else if (containersNeededForWeight >= 1 && containersNeeded < 1) {
        var flooredContainers = Math.floor(containersNeededForWeight);
        var newContainers = Math.ceil(containersNeededForWeight);
        $("#pills-hc .contDiv").remove();
        $("#pills-hc").append('<div id="extra40FtHc"></div>');
        // for (var i = 0; i < newContainers; i++) {
        //     if (i <= flooredContainers - 1) {
        $("#extra40FtHc").append(
            `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: 100%"></div><div class="ProgNO SM-PNO"  style="top: 45%">100%</div><span style="font-size: 15px; position: absolute; z-index: 10; float: left; top: 60%; left: 40%; color: white;" >x${flooredContainers}</span></div>`
        );
        // } else {
        var lastPercent = Math.round(
            (containersNeededForWeight.toFixed(2) - flooredContainers) *
            100
        );
        $("#extra40FtHc").append(
            `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: ${lastPercent}%"></div><div class="ProgNO SM-PNO">${lastPercent}%</div></div>`
        );
        //     }
        // }
    } else if (containersNeeded >= 1 && containersNeededForWeight < 1) {
        var flooredContainers = Math.floor(containersNeeded);
        var newContainers = Math.ceil(containersNeeded);
        $("#pills-hc .contDiv").remove();
        $("#pills-hc").append('<div id="extra40FtHc"></div>');
        // for (var i = 0; i < newContainers; i++) {
        //     if (i <= flooredContainers - 1) {
        $("#extra40FtHc").append(
            `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: 100%"></div><div class="ProgNO SM-PNO"  style="top: 45%">100%</div><span style="font-size: 15px; position: absolute; z-index: 10; float: left; top: 60%; left: 40%; color: white;" >x${flooredContainers}</span></div>`
        );
        // } else {
        var lastPercent = Math.round(
            (containersNeeded.toFixed(2) - flooredContainers) * 100
        );
        $("#extra40FtHc").append(
            `<div class="contDiv SM-cont"><div class="contProgress SM-CP" style="width: ${lastPercent}%"></div><div class="ProgNO SM-PNO">${lastPercent}%</div></div>`
        );
        //     }
        // }
    } else {
        $("#pills-hc").empty();
        $("#pills-hc").append(
            `<div class="contDiv"><div class="contProgress" style="width: ${percent40FtHc}%"></div><div class="ProgNO">${percent40FtHc}</div></div>`
        );
    }
    if (toFillContainerCalc) {
        $("#pills-hc table").remove();
        $("#pills-hc").append(
            `<div class="row" style="display: block"><div class="col-12"><table style="width: 100%"><thead><tr><th>Product</th><th>Space left (Ctns)</th></tr></thead><tbody></table></div></div>`
        );
        productWiseCbmForFullContainer.forEach(element => {
            $("#pills-hc table tbody").append(
                `<tr><td>${element.product}</td><td>${element.more_cartans_capacity}</td></tr>`
            );
        });
    }
}

function printDiv() {
    var printContents = document.getElementById("printThis").innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
}

function initMultipleDropzones(dzElements) {
    dzElements.forEach(element => {
        // if(dzElements.type == "all")
        dropzoneReferences[element.type] = new Dropzone(
            "#" + element["elem"].attr("id"), {
                url: element["elem"].attr("action"),
                addRemoveLinks: true,
                acceptedFiles: "image/*,.pdf,.doc,.docx,.xlsx",
                maxFilesize: 5,
                init: function () {
                    this.on("success", function (file, serverFileName) {
                        if (serverFileName.code != 200) {
                            $("#notifDiv").fadeIn();
                            $("#notifDiv").css("background", "red");
                            $("#notifDiv").text("Please select document first");
                            setTimeout(() => {
                                $("#notifDiv").fadeOut();
                            }, 3000);
                            this.removeFile(file);
                        } else {
                            if (serverFileName.data) {
                                file.serverFn = serverFileName.data.file;
                                if (
                                    !orderData.all_documents ||
                                    !orderData.all_documents[
                                        serverFileName.data.document_type
                                    ]
                                ) {
                                    if (!orderData.all_documents)
                                        orderData.all_documents = [];
                                    orderData.all_documents[
                                        serverFileName.data.document_type
                                    ] = [];
                                }
                                orderData.all_documents[
                                    serverFileName.data.document_type
                                ].push(serverFileName.data);
                                renderAllDocs();
                                return;
                            }
                            file.serverFn = serverFileName.name;
                        }
                    });
                },
                removedfile: function (file) {
                    $.ajax({
                        type: "POST",
                        url: "/DeleteDispatchOrderDocuments/" +
                            element["elem"].attr("action").split("/")[2] +
                            "/" +
                            segments[4] +
                            "/" +
                            dispatchBatch,
                        data: {
                            _token: $('[name="csrf_token"]').attr("content"),
                            file: file.serverFn ? file.serverFn : file.name
                        },
                        success: function (data) {}
                    });
                    var _ref;
                    return (_ref = file.previewElement) != null ?
                        _ref.parentNode.removeChild(file.previewElement) :
                        void 0;
                }
            }
        );

        setTimeout(() => {
            $(".dz-image img").each(function () {
                let filename = $(this).attr("alt");
                let fileFnd = orderData["eform_documents"] ?
                    orderData["eform_documents"].find(
                        x => x.stored_as == filename
                    ) :
                    false;
                if (!fileFnd)
                    fileFnd = orderData["shipping_documents"] ?
                    orderData["shipping_documents"].find(
                        x => x.stored_as == filename
                    ) :
                    false;

                if (!fileFnd) return;

                if (fileFnd.ext == "pdf") {
                    $(this).attr("src", "/images/pdf-icon-dz.png");
                } else if (fileFnd.ext == "xls" || fileFnd.ext == "xlsx") {
                    $(this).attr("src", "/images/xls-icon-dz.png");
                } else if (fileFnd.ext == "doc" || fileFnd.ext == "docx") {
                    $(this).attr("src", "/images/doc-icon-dz.png");
                }
            });
        }, 500);

        if (element.data) {
            element.data.forEach(file => {
                var mockFile = {
                    name: file.stored_as
                };
                dropzoneReferences[element.type].emit("addedfile", mockFile);
                dropzoneReferences[element.type].emit(
                    "thumbnail",
                    mockFile,
                    "/storage/orders/" + file.stored_as
                );
            });
        }
    });
}

function renderAllDocs(docsInDetailsBlade = null) {
    $("#allDocsContainer").empty();
    let data = [];
    if (docsInDetailsBlade) data = docsInDetailsBlade;
    else data = orderData.all_documents;

    if (!data) {
        $("#noDocsAttached").show();
    }

    $("#all_documents option").each(function () {
        if (!$(this).index() || !data) return;

        if (data && data[$(this).val()]) {
            data[$(this).val()].forEach(element => {
                let divId = $(this)
                    .val()
                    .toLowerCase()
                    .replace(/ /g, "-");
                if ($("#" + divId).length) {
                    $("#" + divId + " .Up-DocList")
                        .append(`<a target="_blank" href="/storage/orders/${element.file}"><i
                class="fa fa-file"></i>${element.filename} </a>`);
                } else {
                    $("#allDocsContainer").append(`
            <div id="${divId}" class="col-md-12 PT-20">
                <h2 class="_head04">${$(this).val()}</h2>
                <div class="Up-DocList"> <a target="_blank" href="/storage/orders/${
                    element.file
                }"><i
                            class="fa fa-file"></i>${
                                element.filename
                            } </a> </div>
            </div>`);
                }
            });
        }
    });
}

function fetch_bank_accounts(elem = "#select_account") {
    $.ajax({
        type: "GET",
        url: "/GetBankAccounts",
        success: function (response) {
            var response = JSON.parse(response);
            $(elem).empty();
            $(elem).append(
                `<option value="0" selected disabled>Select Account</option>`
            );
            response.forEach(element => {
                $(elem).append(
                    `<option value="${element["id"]}">${element["bank_name"]}(${element["account_num"]})</option>`
                );
            });
        }
    });
}

function addLeftoverStockToOrder() {
    let alreadyAddedItems = [];

    $("._row-product").each(function () {
        if (
            !$(this)
            .find(".dynamicallyAddedProductsDD")
            .val() ||
            !$(this)
            .find(".dynamicallyAddedItemsDD")
            .val()
        ) {
            $(this).remove();
            totalProducts--;
        }
        alreadyAddedItems.push({
            item_id: $(this)
                .find(".dynamicallyAddedItemsDD")
                .val(),
            product_id: $(this)
                .find(".dynamicallyAddedProductsDD")
                .val(),
            qty: parseInt(
                $(this)
                .find(".totalQty")
                .val()
            ),
            unit_price: $(this)
                .find(".unitPrice")
                .val()
                .replace(currencySelected, "") ?
                parseFloat(
                    $(this)
                    .find(".unitPrice")
                    .val()
                    .replace(currencySelected, "")
                ) : 0
        });
    });

    $(".stockToAdd").each(function () {
        if (!$(this).val() || $(this).val() == "0") return;

        let itmFnd = leftOverStockAdjusted.find(
            x => x.item_id == $(this).attr("item-id")
        );
        if (itmFnd) itmFnd.assigned_qty += parseInt($(this).val());
        else
            leftOverStockAdjusted.push({
                item_id: $(this).attr("item-id"),
                order_id: $(this).attr("order-id"),
                assigned_qty: parseInt($(this).val())
            });

        let itm = alreadyAddedItems.find(
            x => x.item_id == $(this).attr("item-id")
        );
        if (itm) {
            itm.qty += parseInt($(this).val());
            let uPrice = $(this).attr("u-price");
            $("._row-product").each(function () {
                if (
                    $(this)
                    .find(".dynamicallyAddedItemsDD")
                    .val() == itm.item_id
                ) {
                    $(this)
                        .find(".totalQty")
                        .attr(
                            "min-qty",
                            leftOverStockAdjusted.find(
                                x => x.item_id == itm.item_id
                            ).assigned_qty
                        );
                    $(this)
                        .find(".totalQty")
                        .val(itm.qty);
                    $(this)
                        .find(".totalQty")
                        .trigger("input");
                    $(this)
                        .find(".unitPrice")
                        .val(itm.unit_price ? itm.unit_price : uPrice);
                    $(this)
                        .find(".unitPrice")
                        .trigger("input");
                }
            });
        } else {
            itm = {
                qty: $(this).val(),
                unit_price: $(this).attr("u-price")
            };

            $("#productsContainer").append(
                `<div class="row _row-product product${totalProducts}"> <a class="dd-handle dd3-handle swap-div"></a> <div class="col-12 p-0"><div class="addItemCell"><div class="_emp-sele _addProduct"><select class="form-control formselect dynamicallyAddedProductsDD" id="productsListDD${totalProducts}" placeholder="select Product" data-allow_clear="1"><option disabled selected>Select Product</option></select></div> <div class="_Packinfo" id="description"></div> </div><div class="addItemCell PL-5"> <div class="_emp-sele _addProduct"> <select class="form-control dynamicallyAddedItemsDD formselect" id="prodItemsListDD${totalProducts}" placeholder="select Item" data-allow_clear="${totalProducts}"> <option selected disabled>Select item</option> </select> <a class="btn plus_button productadd openDataSidebarForAddingItem"><i style="padding-top: 4px !important;" class="fa fa-plus"></i></a> </div></div> <div class="addItemCell2 _h25"><input type="text" class="totalQty" min-qty="${itm.qty}" placeholder="" style="font-size: 13px"></div> <div class="addItemCelWEIGHT _h25"><input type="text" class="weightPerUnit" readonly placeholder="" style="font-size: 13px"></div> <div class="addItemCelWEIGHT _h25"><input type="text" class="weightPerCtn" readonly placeholder="" style="font-size: 13px"></div> <div class="addItemCellcbm _h25"><input type="text" class="itemCbm" readonly placeholder="" style="font-size: 13px"></div> <div class="addItemCellcbm _h25"><input type="text" class="totalItemCbm" readonly placeholder="" style="font-size: 13px"></div> <div class="addItemCell2 _h25"><input type="text" class="unitPrice" placeholder="" style="font-size: 13px"></div> <div class="addItemCell3 _h25"><input type="text" class="totalItemAmount" readonly placeholder="" style="font-size: 13px"> </div> </div> <div class="col-12 p-0"> <div class="row m-0 mt-5"> <div class="itemCellpDes"> <textarea class="textarea-HA" rows="1" placeholder="Enter Product Description" style="font-size: 13px"></textarea></div> </div> <a class="btn _order-del" title="Delete"><i class="fa fa-trash"></i></a> </div> <input type="text" class="contentId" id=""></div>`
            );

            $(`#productsListDD${totalProducts}`).select2({
                closeOnSelect: false
            });
            $(`#prodItemsListDD${totalProducts}`).select2({
                closeOnSelect: false
            });

            allProducts.forEach(element => {
                var newOption = new Option(
                    element.name,
                    element.id,
                    false,
                    false
                );
                $(`#productsListDD${totalProducts}`).append(newOption);
            });

            $(`#productsListDD${totalProducts}`).val(
                $(this).attr("product-id")
            );
            $(`#productsListDD${totalProducts}`).trigger("change");

            $(`#prodItemsListDD${totalProducts}`).val($(this).attr("item-id"));
            $(`#prodItemsListDD${totalProducts}`).trigger("change");

            $(`#prodItemsListDD${totalProducts}`)
                .parent()
                .parent()
                .parent()
                .find(".totalQty")
                .val(itm.qty);
            $(`#prodItemsListDD${totalProducts}`)
                .parent()
                .parent()
                .parent()
                .find(".totalQty")
                .trigger("input");
            $(`#prodItemsListDD${totalProducts}`)
                .parent()
                .parent()
                .parent()
                .find(".unitPrice")
                .val(itm.unit_price);
            $(`#prodItemsListDD${totalProducts}`)
                .parent()
                .parent()
                .parent()
                .find(".unitPrice")
                .trigger("input");
        }

        var textarea = document.querySelector(".textarea-HA");
        textarea ? textarea.addEventListener("keydown", autosize) : null;

        totalProducts++;
    });

    $(".close").click();
}

function makeid(length) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}

(function ($) {
    $(window).on("load", function () {
        $("._activityMD, .left_Info").mCustomScrollbar({
            theme: "dark-2"
        });
    });
})(jQuery);

function openSupplierAssignmentModal() {
    if (orderData.payment_type == "ADV" && !advPaymentReceived) {
        $('.openWarningModal').click();
        return;
    }

    $(".assignSupplierModal #exampleModalLongTitle").html(
        "Assign <span>Supplier</span>"
    );
    $("#completeSupplierAssignment").show();
    $("#completeSupplierReAssignment").hide();

    $("#selectSupplierForAssignment").val(0);
    $("#selectSupplierForAssignment").trigger("change");
    $("#assignEmpsToSupplierAssignmentDD")
        .val([])
        .trigger("change");
    $("#assignSuppRemarks").val("");
    $("#productsToAssignToSupplierTable tbody").empty();

    $("#edtDp")
        .datepicker({
            format: "yyyy-mm-dd"
        })
        .on("changeDate", function (e) {
            $(this).datepicker("hide");
        });

    allItemsInOrder.forEach(x => {
        if (x.qty - x.assigned_qty == 0) return;
        $("#productsToAssignToSupplierTable tbody").append(`
            <tr>
                <td>${x.product_name}</td>
                <td>${x.item_name}</td>
                <td>${x.qty}</td>
                <td>${x.qty - x.assigned_qty}</td>
                <td>
                <input type="text" class="CN-st-end inputQtyToSupplier" item-id="${
                    x.item_id
                }" content-id="${x.id}" placeholder="0" ${
    x.qty - x.assigned_qty <= 0 ? "disabled" : ""
} >
                </td>
                <td>
                <input type="text" style="width: 100%" class="CN-st-end inputSpecialNote" placeholder="Special Note" />
                </td>
                <td><button class="btn btn-default mb-0 assignQty" disabled>Assign</button></td>
            </tr>`);
    });
    $('.openAssignmentModal').click();
}
