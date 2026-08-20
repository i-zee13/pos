$(document).ready(function () {
    bindCloseDateAutoLoad(PurchiRecord);
});

function PurchiRecord(close_date) {
    $('.sale-close-btn-modal').attr('disabled', true);
    $.ajax({
        url: `/sale-close-record/${close_date}`,
        success: function (response) {
            renderStaticPurchi(response.records || {});
            enableSaleCloseButton(response.records || {});
        }
    });
}

function renderStaticPurchi(records) {
    var items = [
        "mutafirq_udhar_receive", "mutafirq_sody", "mutafariq_udhar_banam", "gawara_khata",
        "sody_khareed", "beej_khareed", "bank_payments", "ttl_in", "ttl_out", "total_meezan", "ilyas_bakhtawar",
        "fazul_qadir_banam", "shafiq_karyana_banam", "abdul_ghaffar_ghar_banam",
        "ammar_abdullah_ghar_banam", "imdad_khata_banam", "imran_niazi_banam",
        "sir_murtaza_sahib_banam", "master_khalid_faroq_shah_banam", "karaya_dokan_banam", "karaya_dokan_receive", "meezan_bank_jama", "ubl_aftab_jama",
        "petrol_khata", "abdul_shakoor_exchange", "habib_bank_abdul_shakoor", "hbl_m_waqas_jama", "ubl_m_waqas_jama", "gandum_khareed_khata_receive",
        "dawaj_khareed", "angro_fertilizer", "fouji_fertilizer", "np_khareed", "angro_khata", "dap_khata",
        "fatima_flink_ventilators", "wilkan_center_cotton", "tcs_tcs_wadha",
        "nmlf", "abl_ka", "ubl_waqas", "mcb_ka", "mcb_ka_jama", "bank_al_habib_ka",
        "bop_card_loss", "hbl_m_waqas", "abdul_shakoor_habib_bank",
        "sarhad_punjab_cash", "alfalah_bank_card", "tameerat_khata",
        "imported_pura_khata", "bop_bank", "meezan_bank_banam", "ubl_aftab_banam",
        "sonehri_bank", "askari_bank", "amanat_bank", "baghban_chemical", "salries_banam", "gandum_khareed_khata", "land_company", "prime_khata",
        "abdul_shakoor_exchange_jama",
        "wilkan_chemicals", "swat_agro_chemicals", "agro_lux",
        "kenzo_ag", "leader_ag", "arsta", "bayer", "fmc", "agro_mark",
        "advance_agro_tech",
        "fazul_qadir_receive", "shafiq_karyana_receive", "abdul_ghaffar_ghar_receive",
        "ammar_abdullah_ghar_receive", "imdad_khata_receive", "imran_niazi_receive",
        "sir_murtaza_sahib_receive", "master_khalid_faroq_shah_receive",
        "dawai", "dawai_qty", "beej", "beej_qty", "gandom", "gandom_qty",
        "kapas", "kapas_qty", "dhaan", "dhaan_qty", "dap_25kg", "dap_25kg_qty",
        "dap", "dap_qty", "urea", "urea_qty", "can", "can_qty", "np", "np_qty", "tsp", "tsp_qty",
        "ssp", "ssp_qty", "zarkhez", "zarkhez_qty", "sop", "sop_qty",
        "jimsam", "jimsam_qty", "sm_urea", "sm_urea_qty", "mop", "mop_qty"
    ];

    var recordsData = {};
    items.forEach(function (item) {
        recordsData[item] = records[item] || 0;
    });

    items.forEach(function (item) {
        $("." + item).text(addCommas(parseFloat(Math.round(recordsData[item]))));
        if (recordsData[item] > 0) {
            $("." + item + "_div").show();
        } else {
            $("." + item + "_div").hide();
        }
    });

    var totalMeezan = recordsData["ttl_in"] - recordsData["ttl_out"];
    $(".total_meezan").text(addCommas(Math.round(totalMeezan)));
    if (totalMeezan !== 0) {
        $(".total_meezan_div").show();
    } else {
        $(".total_meezan_div").hide();
    }

    if (records.expense > 0) {
        $(".expense").text(addCommas(parseFloat(records.expense).toFixed(2)));
        $(".expense_div").show();
    } else {
        $(".expense_div").hide();
    }

    if (records.openning_balance > 0) {
        $(".openning_balance").text(addCommas(parseFloat(records.openning_balance).toFixed(2)));
        $(".openning_balance_div").show();
    } else {
        $(".openning_balance_div").hide();
    }
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
