var removeAlert = null;
var foundAlert = false;
var lastOp = "";
let addingFromCorrespondenceCreationPage = false;
let totalConcerns = 0;
let correspondencesData = null;
let correspondencesDataBackup = null;

$(document).ready(function() {
    var segments = location.href.split("/");
    var action = segments[3];
    if (action === "Mediums") {
        fetchMediums();
    } else if (action === "Stages") {
        fetchStages();
    } else {
        fetchCorrespondenceList();

        tinymce.init({
            selector: "textarea#mom",
            height: 500,
            height: "200",
            theme: "modern",
            plugins: [
                "advlist autolink lists link image charmap print preview hr anchor pagebreak",
                "searchreplace wordcount visualblocks visualchars code fullscreen",
                "insertdatetime media nonbreaking contextmenu directionality",
                "emoticons paste textcolor colorpicker textpattern"
            ],
            fontsize_formats: "8pt 10pt 12pt 14pt 16pt 18pt 21pt 24pt 26pt 36pt 40pt",
            toolbar1: "sizeselect | undo redo | styleselect | bold italic strikethrough underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | fontselect | fontsizeselect | forecolor backcolor emoticons"
        });

        removeAlert = setInterval(removeTinymceAlert, 500);

        $(".datepicker").datepicker({
            autoclose: true,
            startDate: "+0d",
            format: "dd/mm/yyyy"
        });
    }
    /**************************** Mediums Start ************************/
    $(document).on("click", ".openDataSidebarForAddingMediums", function() {
        if (lastOp == "update") {
            $('input[name="medium"]').val("");
            $('input[name="medium"]').blur();
        }
        lastOp = "add";

        if ($('#saveMediumForm input[name="_method"]').length) {
            $('#saveMediumForm input[name="_method"]').remove();
        }

        openSidebar();
        $('[name="medium_id"]').val("");
        $('input[id="operation"]').val("add");
    });

    $(document).on("click", ".openDataSidebarForUpdateMedium", function() {
        lastOp = "update";

        $('[name="medium"]').focus();
        $('[name="medium"]').val(
            $(this)
            .parent()
            .parent()
            .find("td:eq(1)")
            .text()
        );
        $('[name="medium_id"]').val($(this).attr("id"));

        $('input[id="operation"]').val("add");
        $("#product-cl-sec").addClass("active");
        $(".overlay").addClass("active");
        $(".collapse.in").toggleClass("in");
        $("a[aria-expanded=true]").attr("aria-expanded", "false");
        $("body").toggleClass("no-scroll");
    });

    $(document).on("click", "#saveMedium", function() {
        if (!$('[name="medium"]').val()) {
            $("#notifDiv").text("Please provide medium name");
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
        $(this).text("Saving..");
        $(this).attr("disabled", true);

        $("#saveMediumForm").ajaxSubmit({
            type: "POST",
            url: "/saveMedium",
            success: function(response) {
                if (JSON.parse(response).code == 200) {
                    $("#notifDiv").text("Medium saved successfully");
                    $("#notifDiv").fadeIn();
                    $("#notifDiv").css("background", "green");
                    setTimeout(() => {
                        $("#notifDiv").fadeOut();
                    }, 3000);
                    $('input[name="medium"]').val("");
                    $('input[name="medium"]').blur();
                    if (!addingFromCorrespondenceCreationPage) {
                        $("#pl-close").click();
                        fetchMediums();
                    } else {
                        var newOption = new Option(
                            JSON.parse(response).data.name,
                            JSON.parse(response).data.id,
                            false,
                            false
                        );
                        $("#mediumsSelect2").append(newOption);

                        $("#mediumsSelect2").val(JSON.parse(response).data.id);
                        $("#mediumsSelect2").trigger("change");

                        $(".AddDynamicStagesMediums .close").click();
                    }
                } else {
                    $("#notifDiv").text("Unable to save at this moment.");
                    $("#notifDiv").fadeIn();
                    $("#notifDiv").css("background", "red");
                    setTimeout(() => {
                        $("#notifDiv").fadeOut();
                    }, 3000);
                }
                $(this).text("Save");
                $(this).removeAttr("disabled");
            }.bind($(this))
        });
    });

    $(document).on("click", ".deleteMedium", function() {
        $(this).text("Deleting..");
        $(this).attr("disabled", true);
        $(this)
            .parent()
            .parent()
            .find("#deleteMediumForm")
            .ajaxSubmit({
                type: "POST",
                url: `/deleteMedium`,
                success: function(response) {
                    if (response.code == 200) {
                        $("#notifDiv").text("Medium deleted successfully");
                        $("#notifDiv").fadeIn();
                        $("#notifDiv").css("background", "green");
                        setTimeout(() => {
                            $("#notifDiv").fadeOut();
                        }, 3000);
                        $(this)
                            .parent()
                            .parent()
                            .parent()
                            .remove();
                    } else {
                        $("#notifDiv").text("Unable to delete at this moment.");
                        $("#notifDiv").fadeIn();
                        $("#notifDiv").css("background", "red");
                        setTimeout(() => {
                            $("#notifDiv").fadeOut();
                        }, 3000);
                    }
                }.bind($(this))
            });
    });

    $(document).on("click", "#addNewMedium", function() {
        $("#mediumStageTitle").text("New Medium");
        addingFromCorrespondenceCreationPage = true;
        $("#mediumStageFormDiv").html(`<form id="saveMediumForm">
            <input name="_token" value="${$('[name="csrf_token"]').attr(
                "content"
            )}" hidden/>
            <input type="text" id="operation" hidden>
            <input type="text" name="medium_id" hidden>
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label class="control-label mb-10">Medium*</label>
                        <input type="text" name="medium" class="form-control" placeholder="">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 pt-19" style="text-align: center">
                    <button class="btn btn-primary" id="saveMedium">Save</button>
                </div>
            </div>
        </form>`);
    });
    /**************************** Mediums End ************************/

    /**************************** Stages Start ************************/

    $(document).on("click", "#addNewStage", function() {
        $("#mediumStageTitle").text("New Stage");
        addingFromCorrespondenceCreationPage = true;
        $("#mediumStageFormDiv").html(`<form id="saveStageForm">
            <input name="_token" value="${$('[name="csrf_token"]').attr(
                "content"
            )}" hidden/>
            <input type="text" id="operation" hidden>
            <input type="text" name="stage_id" hidden>
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label class="control-label mb-10">Stage*</label>
                        <input type="text" name="stage" class="form-control"
                            placeholder="">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 pt-19" style="text-align: center">
                    <button class="btn btn-primary" id="saveStage">Save</button>
                </div>
            </div>
        </form>`);
    });

    $(document).on("click", ".openDataSidebarForAddingStages", function() {
        if (lastOp == "update") {
            $('input[name="stage"]').val("");
            $('input[name="stage"]').blur();
        }
        lastOp = "add";

        if ($('#saveStageForm input[name="_method"]').length) {
            $('#saveStageForm input[name="_method"]').remove();
        }

        $('[name="stage_id"]').val("");

        $("#product-cl-sec").addClass("active");
        $(".overlay").addClass("active");
        $(".collapse.in").toggleClass("in");
        $("a[aria-expanded=true]").attr("aria-expanded", "false");
        $("body").toggleClass("no-scroll");
    });

    $(document).on("click", ".openDataSidebarForUpdateStage", function() {
        lastOp = "update";

        $('[name="stage"]').focus();
        $('[name="stage"]').val(
            $(this)
            .parent()
            .parent()
            .find("td:eq(1)")
            .text()
        );
        $('[name="stage_id"]').val($(this).attr("id"));

        $("#product-cl-sec").addClass("active");
        $(".overlay").addClass("active");
        $(".collapse.in").toggleClass("in");
        $("a[aria-expanded=true]").attr("aria-expanded", "false");
        $("body").toggleClass("no-scroll");
    });

    $(document).on("click", "#saveStage", function() {
        if (!$('[name="stage"]').val()) {
            $("#notifDiv").text("Please provide stage name");
            $("#notifDiv").fadeIn();
            $("#notifDiv").css("background", "red");
            setTimeout(() => {
                $("#notifDiv").fadeOut();
            }, 3000);
            return;
        }
        $(this).text("Saving..");
        $(this).attr("disabled", true);

        $("#saveStageForm").ajaxSubmit({
            type: "POST",
            url: "/saveStage",
            success: function(response) {
                if (JSON.parse(response).code == 200) {
                    $("#notifDiv").text("Stage saved successfully");
                    $("#notifDiv").fadeIn();
                    $("#notifDiv").css("background", "green");
                    setTimeout(() => {
                        $("#notifDiv").fadeOut();
                    }, 3000);
                    $('input[name="stage"]').val("");
                    $('input[name="stage"]').blur();
                    if (!addingFromCorrespondenceCreationPage) {
                        $("#pl-close").click();
                        fetchStages();
                    } else {
                        var newOption = new Option(
                            JSON.parse(response).data.name,
                            JSON.parse(response).data.id,
                            false,
                            false
                        );
                        $("#stagesSelect2").append(newOption);
                        $("#stagesSelect2").val(JSON.parse(response).data.id);
                        $("#stagesSelect2").trigger("change");
                        $(".AddDynamicStagesMediums .close").click();
                    }
                } else {
                    $("#notifDiv").text("Unable to save at this moment.");
                    $("#notifDiv").fadeIn();
                    $("#notifDiv").css("background", "red");
                    setTimeout(() => {
                        $("#notifDiv").fadeOut();
                    }, 3000);
                }
                $(this).text("Save");
                $(this).removeAttr("disabled");
            }.bind($(this))
        });
    });

    $(document).on("click", ".deleteStage", function() {
        $(this).text("Deleting..");
        $(this).attr("disabled", true);
        $(this)
            .parent()
            .parent()
            .find("#deleteStageForm")
            .ajaxSubmit({
                type: "POST",
                url: `/deleteStage`,
                success: function(response) {
                    if (response.code == 200) {
                        $("#notifDiv").text("Stage deleted successfully");
                        $("#notifDiv").fadeIn();
                        $("#notifDiv").css("background", "green");
                        setTimeout(() => {
                            $("#notifDiv").fadeOut();
                        }, 3000);
                        $(this)
                            .parent()
                            .parent()
                            .parent()
                            .remove();
                    } else {
                        $("#notifDiv").text("Unable to delete at this moment.");
                        $("#notifDiv").fadeIn();
                        $("#notifDiv").css("background", "red");
                        setTimeout(() => {
                            $("#notifDiv").fadeOut();
                        }, 3000);
                    }
                }.bind($(this))
            });
    });
    /**************************** Stages End ************************/

    $(document).on("click", ".openSidebarToEditCorrespondence", function() {
        lastOp = "update";
        let correspondenceId = $(this).attr("id");

        $('[name="correspondence_id"]').val(correspondenceId);

        if (!correspondencesDataBackup)
            correspondencesDataBackup = correspondencesData;

        correspondencesData = {
            correspondence: correspondencesDataBackup.all_correspondences.find(
                x => x.id == correspondenceId
            ),
            concerns: correspondencesDataBackup.concerns.filter(
                x => x.correspondence_id == correspondenceId
            )
        };

        $('[name="prospect_customer"]')
            .val(correspondencesData.correspondence.prospect_customer_id)
            .trigger("change");

        $('[name="mediumDD"]')
            .val(correspondencesData.correspondence.medium_id)
            .trigger("change");

        $('[name="stageDD"]')
            .val(correspondencesData.correspondence.stage_id)
            .trigger("change");

        tinymce.activeEditor.setContent(correspondencesData.correspondence.mom);

        if (correspondencesData.correspondence.follow_up) {
            let year = moment(
                correspondencesData.correspondence.follow_up,
                "YYYY-MM-DD"
            ).format("YYYY");
            let month = moment(
                correspondencesData.correspondence.follow_up,
                "YYYY-MM-DD"
            ).format("MM");
            let day = moment(
                correspondencesData.correspondence.follow_up,
                "YYYY-MM-DD"
            ).format("DD");

            var start = moment(correspondencesData.correspondence.created_at, "YYYY-MM-DD");
            var end = moment(new Date(), "YYYY-MM-DD");

            $(".datepicker").datepicker('remove');
            $(".datepicker").datepicker({
                autoclose: true,
                format: "dd/mm/yyyy",
                startDate: Math.round(moment.duration(start.diff(end)).asDays()) + "d"
            }).datepicker("setDate", new Date(year, month - 1, day));
        }

        $("#dynamicConcerns").empty();
        totalConcerns = 0;
        correspondencesData.concerns.forEach(element => {
            $("#dynamicConcerns").append(`<div class="col-md-12 pt-19">
        <label class="font12 concernLabel">Concern ${++totalConcerns}</label>
        <div class="_sa-customer" style="padding: 0; max-width: 100%">
            <div class="form-s2 selpluse">
                <input type="text" value="${element.concerns}" name="concern_${totalConcerns}" class="form-control totalConcernInputs">
                <a style="right: 0; background: red" class="btn plus_button po-ab productlist01 _OA-disply removeConcern"><i class="fa fa-minus"></i></a>
            </div>
        </div>
        <label class="font12">Resolution</label>
        <div class="_sa-customer" style="padding: 0; max-width: 100%">
            <div class="form-s2 selpluse">
                <input type="text" value="${element.resolution}" name="resolution_${totalConcerns}" class="form-control resolutionInputs">
            </div>
        </div>
    </div>`);
        });

        $('[name="medium_id"]').val($(this).attr("id"));
        $('input[id="operation"]').val("add");
        $("#product-cl-sec").addClass("active");
        $(".overlay").addClass("active");
        $(".collapse.in").toggleClass("in");
        $("a[aria-expanded=true]").attr("aria-expanded", "false");
        $("body").toggleClass("no-scroll");
    });

    $("#addConcern").click(function() {
        $("#dynamicConcerns").append(`<div class="col-md-12 pt-19">
        <label class="font12 concernLabel">Concern ${++totalConcerns}</label>
        <div class="_sa-customer" style="padding: 0; max-width: 100%">
            <div class="form-s2 selpluse">
                <input type="text" name="concern_${totalConcerns}" class="form-control totalConcernInputs">
                <a style="right: 0; background: red" class="btn plus_button po-ab productlist01 _OA-disply removeConcern"><i class="fa fa-minus"></i></a>
            </div>
        </div>
        <label class="font12">Resolution</label>
        <div class="_sa-customer" style="padding: 0; max-width: 100%">
            <div class="form-s2 selpluse">
                <input type="text" name="resolution_${totalConcerns}" class="form-control resolutionInputs">
            </div>
        </div>
    </div>`);
    });

    $("#saveCorrespondence").click(function() {
        if (!$('[name="prospect_customer"]').val() ||
            !$('[name="mediumDD"]').val() ||
            !$('[name="stageDD"]').val() ||
            !tinyMCE.get("mom").getContent()
        ) {
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
        let concerns = [];
        $(".totalConcernInputs").each(function() {
            if ($(this).val()) {
                concerns.push({
                    concern: $(this).val(),
                    resolution: $(this)
                        .parent()
                        .parent()
                        .parent()
                        .find(".resolutionInputs")
                        .val()
                });
            }
        });
        $(this).text("Saving..");
        $(this).attr("disabled", true);
        $("#saveCorrespondenceForm").ajaxSubmit({
            type: "POST",
            url: "/Correspondence",
            data: {
                mom: tinyMCE.get("mom").getContent(),
                concerns: concerns
            },
            success: function(response) {
                if (JSON.parse(response).code == 200) {
                    $("#notifDiv").text("Correspondence saved successfully");
                    $("#notifDiv").fadeIn();
                    $("#notifDiv").css("background", "green");
                    setTimeout(() => {
                        $("#notifDiv").fadeOut();
                    }, 3000);
                    $("#pl-close").click();
                    fetchCorrespondenceList();
                    emptyFields();
                } else {
                    $("#notifDiv").text(
                        "Unable to add correspondence at this moment"
                    );
                    $("#notifDiv").fadeIn();
                    $("#notifDiv").css("background", "green");
                    setTimeout(() => {
                        $("#notifDiv").fadeOut();
                    }, 3000);
                }
                $(this).removeAttr("disabled");
                $(this).text("Save");
            }.bind($(this))
        });
    });

    $(document).on("click", ".removeConcern", function() {
        $(this)
            .parent()
            .parent()
            .parent()
            .remove();
        totalConcerns = 0;
        $(".concernLabel").each(function() {
            $(this)
                .parent()
                .find(".concernLabel")
                .text(`Concern ${++totalConcerns}`);
        });
    });

    $(document).on(
        "click",
        ".openDataSidebarForAddingCorrespondence",
        function() {
            if (lastOp == "update") {
                emptyFields();
            }
            lastOp = "add";
            $('input[id="operation"]').val("add");

            openSidebar();
        }
    );

    $(document).on("click", "#showGrouped", function() {
        correspondencesData = correspondencesDataBackup;
        $("#showGrouped").hide();
        renderCorrespondences(
            correspondencesData.grouped_correspondences,
            "grouped"
        );
    });

    $(document).on("click", ".viewCorrespondencesForThisCustomer", function() {
        if (!correspondencesDataBackup) {
            correspondencesDataBackup = correspondencesData;
        }
        let selectedCustomerId = $(this).attr("id");
        correspondencesData = correspondencesDataBackup.all_correspondences.filter(
            x => x.prospect_customer_id == selectedCustomerId
        );
        $("#showGrouped").show();
        renderCorrespondences(correspondencesData, "all");
    });
});

function fetchMediums() {
    $.ajax({
        type: "GET",
        url: "/GetMediums",
        success: function(response) {
            $(".body").empty();
            $(".body").append(
                '<table class="table table-hover dt-responsive nowrap" id="mediumsTable" style="width:100%;"><thead><tr><th>S.No</th><th>Name</th><th>Action</th></tr></thead><tbody></tbody></table>'
            );
            $("#mediumsTable tbody").empty();
            var response = JSON.parse(response);
            var sNo = 1;
            response.forEach(element => {
                $("#mediumsTable tbody").append(
                    "<tr><td>" +
                    sNo++ +
                    "</td><td>" +
                    element["name"] +
                    '</td><td><button id="' +
                    element["id"] +
                    '" class="btn btn-default btn-line openDataSidebarForUpdateMedium">Edit</button><form id="deleteMediumForm" style="display: inline-block"><input type="text" name="_token" value="' +
                    $('meta[name="csrf_token"]').attr("content") +
                    '" hidden /><input type="text" name="id" value="' +
                    element["id"] +
                    '" hidden /><button type="button" id="' +
                    element["id"] +
                    '" class="btn btn-default red-bg deleteMedium" title="Delete">Delete</button></form></td></tr>'
                );
            });
            $("#tblLoader").hide();
            $(".body").fadeIn();
            $("#mediumsTable").DataTable();
        }
    });
}

function fetchStages() {
    $.ajax({
        type: "GET",
        url: "/GetStages",
        success: function(response) {
            $(".body").empty();
            $(".body").append(
                '<table class="table table-hover dt-responsive nowrap" id="stagesTable" style="width:100%;"><thead><tr><th>S.No</th><th>Name</th><th>Action</th></tr></thead><tbody></tbody></table>'
            );
            $("#stagesTable tbody").empty();
            var response = JSON.parse(response);
            var sNo = 1;
            response.forEach(element => {
                $("#stagesTable tbody").append(
                    "<tr><td>" +
                    sNo++ +
                    "</td><td>" +
                    element["name"] +
                    '</td><td><button id="' +
                    element["id"] +
                    '" class="btn btn-default btn-line openDataSidebarForUpdateStage">Edit</button><form id="deleteStageForm" style="display: inline-block"><input type="text" name="_token" value="' +
                    $('meta[name="csrf_token"]').attr("content") +
                    '" hidden /><input type="text" name="id" value="' +
                    element["id"] +
                    '" hidden /><button type="button" id="' +
                    element["id"] +
                    '" class="btn btn-default red-bg deleteStage" title="Delete">Delete</button></form></td></tr>'
                );
            });
            $("#tblLoader").hide();
            $(".body").fadeIn();
            $("#stagesTable").DataTable();
        }
    });
}

function fetchCorrespondenceList() {
    $.ajax({
        type: "GET",
        url: "/GetCorrespondences",
        success: function(response) {
            correspondencesData = JSON.parse(response);
            correspondencesDataBackup = correspondencesData;
            renderCorrespondences(
                correspondencesData.grouped_correspondences,
                "grouped"
            );
        }
    });
}

function renderCorrespondences(data, layout) {
    $(".body").empty();
    if (layout == "grouped") {
        $(".body").append(
            '<table class="table table-hover dt-responsive nowrap" id="correspondenceTable" style="width:100%;"><thead><tr><th>S.No</th><th>Customer</th><th>Correspondences</th><th>Action</th></tr></thead><tbody></tbody></table>'
        );
        $("#correspondenceTable tbody").empty();
        var sNo = 1;
        data.forEach(element => {
            $("#correspondenceTable tbody").append(
                "<tr><td>" +
                sNo++ +
                "</td><td>" +
                element["customer"] +
                "</td><td>" +
                element["total_correspondences"] +
                '</td><td><button id="' +
                element["prospect_customer_id"] +
                '" class="btn btn-default btn-line viewCorrespondencesForThisCustomer">View All</button></td></tr>'
            );
        });
        $("#showGrouped").hide();
    } else {
        $(".body").append(
            '<table class="table table-hover dt-responsive nowrap" id="correspondenceTable" style="width:100%;"><thead><tr><th>S.No</th><th>Customer</th><th>Total Concerns</th><th>Stage</th><th>Action</th></tr></thead><tbody></tbody></table>'
        );
        $("#correspondenceTable tbody").empty();
        var sNo = 1;
        data.forEach(element => {
            $("#correspondenceTable tbody").append(
                "<tr><td>" +
                sNo++ +
                "</td><td>" +
                element["customer"] +
                "</td><td>" +
                element["total_concerns"] +
                "</td><td>" +
                element["stage"] +
                '</td><td><button id="' +
                element["id"] +
                '" class="btn btn-default btn-line openSidebarToEditCorrespondence">Edit</button></td></tr>'
            );
        });
    }
    $("#tblLoader").hide();
    $(".body").fadeIn();
    $("#correspondenceTable").DataTable();
}

function emptyFields() {
    $('[name="correspondence_id"]').val("");
    $('[name="mediumDD"]')
        .val(0)
        .trigger("change");
    $('[name="prospect_customer"]')
        .val(0)
        .trigger("change");
    $('[name="stageDD"]')
        .val(0)
        .trigger("change");
    tinymce.activeEditor.setContent("");
    $("#dynamicConcerns").empty();
    totalConcerns = 0;
}

function removeTinymceAlert() {
    if (!foundAlert) {
        if ($(".mce-notification").length) {
            $(".mce-notification").remove();
            foundAlert = !foundAlert;
        }
    } else {
        stopInterval(removeAlert);
    }
}

function stopInterval(intervalObj) {
    clearInterval(intervalObj);
}
3