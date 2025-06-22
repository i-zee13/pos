<div class="col-md-4 report" style="direction: rtl;">
<div class="c-address-info ">
    <div class="mutafariq_udhar_banam_div" style="display: none;">
        <span>متفرق ادھار : </span>
        <strong class="digit"></strong>
        <strong class="digit mutafariq_udhar_banam">Loading...</strong>
    </div>
      @php
        $vendors = json_decode($organization->vendors, true) ?? [];
    @endphp
    @foreach($vendors as $vendor_id => $column_name)
     <div class="{{str_replace(['&', ' ', '.'], ['_and_', '_', '_'], $column_name)}}_div" style="display: none;">
        <span>{{$column_name}}</span>
        <strong class="digit"></strong>
        <strong class="digit {{str_replace(['&', ' ', '.'], ['_and_', '_', '_'], $column_name)}}">Loading...</strong>
    </div>
    @endforeach
    <!-- <div class="ubl_waqas_div" style="display: none;">
        <span>UBL وقاص : </span>
        <strong class="digit"></strong>

        <strong class="digit ubl_waqas">Loading...</strong>
    </div> -->
    <!-- <div class="petrol_khata_div" style="display: none;">
        <span>پٹرول : </span>
        <strong class="digit"></strong>

        <strong class="digit petrol_khata">Loading...</strong>
    </div> -->
    <div class="fazul_qadir_banam_div" style="display: none;">
        <span>فضل القادر : </span>
        <strong class="digit"></strong>

        <strong class="digit fazul_qadir_banam">Loading...</strong>
    </div>
    <div class="shafiq_karyana_banam_div" style="display: none;">
        <span>شفیق کریانہ : </span>
        <strong class="digit"></strong>

        <strong class="digit shafiq_karyana_banam">Loading...</strong>
    </div>
    <div class="abdul_ghaffar_ghar_banam_div" style="display: none;">
        <span>عبدالغفار گھر : </span>
        <strong class="digit"></strong>

        <strong class="digit abdul_ghaffar_ghar_banam">Loading...</strong>
    </div>
    <div class="ammar_abdullah_ghar_banam_div" style="display: none;">
        <span>عمار عبداللہ گھر : </span>
        <strong class="digit"></strong>

        <strong class="digit ammar_abdullah_ghar_banam">Loading...</strong>
    </div>
    <div class="imdad_khata_banam_div" style="display: none;">
        <span>امداد کھاتہ : </span>
        <strong class="digit"></strong>

        <strong class="digit imdad_khata_banam">Loading...</strong>
    </div>
    <div class="imran_niazi_banam_div" style="display: none;">
        <span>عمران نیازی : </span>
        <strong class="digit"></strong>

        <strong class="digit imran_niazi_banam">Loading...</strong>
    </div>
    <div class="salries_banam_div" style="display: none;">
        <span>تنخواہ ملازمین</span>
        <strong class="digit"></strong>

        <strong class="digit salries_banam">Loading...</strong>
    </div>
    <div class="sir_murtaza_sahib_banam_div" style="display: none;">
        <span>سر مرتضیٰ صاحب </span>
        <strong class="digit"></strong>

        <strong class="digit sir_murtaza_sahib_banam">Loading...</strong>
    </div>
    <div class="master_khalid_faroq_shah_banam_div" style="display: none;">
        <span>ماسٹر خالد فاروق شاہ : </span>
        <strong class="digit"></strong>

        <strong class="digit master_khalid_faroq_shah_banam">Loading...</strong>
    </div>
    <!-- All Vendor Names -->

    <!-- <div class="fouji_fertilizer_div" style="display: none;">
        <span>فوجی فرٹیلائزرز</span>
        <strong class="digit"></strong>

        <strong class="digit fouji_fertilizer">Loading...</strong>
    </div> -->
    <!-- <div class="angro_fertilizer_div" style="display: none;">
        <span>اینگرو کھاد : </span>
        <strong class="digit"></strong>

        <strong class="digit angro_fertilizer">Loading...</strong>
    </div> -->
    <!-- <div class="np_khareed_div" style="display: none;">
      <span>خرید NP</span>
        <strong class="digit"></strong>

        <strong class="digit np_khareed">Loading...</strong>
    </div> -->
    <!-- <div class="gandum_khareed_khata_div" style="display: none;">
       <span>گندم خرید کھاتہ</span>
        <strong class="digit"></strong>

        <strong class="digit gandum_khareed_khata">Loading...</strong>
    </div> -->
  
    <!-- <div class="abdul_shakoor_exchange_div" style="display: none;">
        <span>نقد رقم شہر دکان </span>
        <strong class="digit"></strong>

        <strong class="digit abdul_shakoor_exchange">Loading...</strong>
    </div> -->
    <!-- <div class="habib_bank_abdul_shakoor_div" style="display: none;">
        <span>حبیب بینک عبدالشکور : </span>
        <strong class="digit"></strong>

        <strong class="digit habib_bank_abdul_shakoor">Loading...</strong>
    </div> -->
    <!-- <div class="bop_bank_div" style="display: none;">
        <span>BOP الیاس : </span>
        <strong class="digit"></strong>

        <strong class="digit bop_bank">Loading...</strong>
    </div>
      <div class="bop_waqas_div" style="display: none;">
        <span>BOP وقاص : </span>
        <strong class="digit"></strong>

        <strong class="digit bop_waqas">Loading...</strong>
    </div>
    <div class="hbl_m_waqas_div" style="display: none;">
        <span>HBL وقاص : </span>
        <strong class="digit"></strong>

        <strong class="digit hbl_m_waqas">Loading...</strong>
    </div> -->
    <!-- <div class="mcb_ka_div" style="display: none;">
        <span>MCB کوٹ ادو : </span>
        <strong class="digit"></strong>

        <strong class="digit mcb_ka">Loading...</strong>
    </div> -->
    <!-- <div class="abl_ka_div" style="display: none;">
        <span>ABL کوٹ ادو : </span>
        <strong class="digit"></strong>

        <strong class="digit abl_ka">Loading...</strong>
    </div>
    <div class="bank_al_habib_ka_div" style="display: none;">
        <span>بینک الحبیب : </span>
        <strong class="digit"></strong>
        <strong class="digit bank_al_habib_ka">Loading...</strong>
    </div>
    <div class="sonehri_bank_div" style="display: none;">
        <span>سنہری بینک :</span>
        <strong class="digit"></strong>

        <strong class="digit sonehri_bank">Loading...</strong>
    </div>
    <div class="kisan_card_bop_div" style="display: none;">
        <span>کسان کارڈ BOP :</span>
        <strong class="digit"></strong>

        <strong class="digit kisan_card_bop">Loading...</strong>
    </div>
    <div class="tameerat_khata_div" style="display: none;">
        <span>تعمیرات کھاتہ</span>
        <strong class="digit"></strong>

        <strong class="digit tameerat_khata">Loading...</strong>
    </div>
    <div class="wilkan_chemicals_div" style="display: none;">
        <span>ویلکان کیمیکلز : </span>
        <strong class="digit"></strong>

        <strong class="digit wilkan_chemicals">Loading...</strong>
    </div>
    <div class="gawara_khata_div" style="display: none;">
        <span> گوارا خرید کھاتہ  </span>
        <strong class="digit"></strong>

        <strong class="digit gawara_khata">Loading...</strong>
    </div>
    <div class="swat_agro_chemicals_div" style="display: none;">
        <span>سوات ایگرو کیمیکلز : </span>
        <strong class="digit"></strong>

        <strong class="digit swat_agro_chemicals">Loading...</strong>
    </div>
    <div class="agro_lux_div" style="display: none;">
        <span>ایگرو لکس : </span>
        <strong class="digit"></strong>

        <strong class="digit agro_lux">Loading...</strong>
    </div>
    <div class="kenzo_ag_div" style="display: none;">
        <span>کینزو اے جی : </span>
        <strong class="digit"></strong>

        <strong class="digit kenzo_ag">Loading...</strong>
    </div>
    <div class="leader_ag_div" style="display: none;">
        <span>لیڈر اے جی : </span>
        <strong class="digit"></strong>

        <strong class="digit leader_ag">Loading...</strong>
    </div>
    <div class="bayer_div" style="display: none;">
        <span>Bayer : </span>
        <strong class="digit"></strong>

        <strong class="digit bayer">Loading...</strong>
    </div>
    <div class="fmc_div" style="display: none;">
        <span>FMC : </span>
        <strong class="digit"></strong>

        <strong class="digit fmc">Loading...</strong>
    </div>
    <div class="agro_mark_div" style="display: none;">
        <span>ایگرو مارک : </span>
        <strong class="digit"></strong>

        <strong class="digit agro_mark">Loading...</strong>
    </div>
    <div class="beej_khareed_div" style="display: none;">
        <span>بیج : </span>
        <strong class="digit"></strong>

        <strong class="digit beej_khareed">Loading...</strong>
    </div>

      <div class="karaya_dokan_banam_div" style="display: none;">
        <span>کرایہ دکان: </span>
        <strong class="digit"></strong> 
        <strong class="digit karaya_dokan_banam">Loading...</strong>
    </div>
    
    -->
    <div class="sody_khareed_div" style="display: none;">
        <span><b> سودے خرید : </b> </span>
        <strong class="digit"></strong>

        <strong class="digit sody_khareed">Loading...</strong>
    </div>
    <div class="bank_payments_div" style="display: none;">
        <span>بینک :</span>
        <strong class="digit"></strong>

        <strong class="digit bank_payments">Loading...</strong>
    </div>
    <div class="expense_div" style="border-bottom: 1px solid #f4f4f4;display:none">
        <span>دکان خرچہ : </span>
        <strong class="digit"></strong>

        <strong class="digit expense">Loading...</strong>
    </div>
   
    <div style="border-bottom: 1px solid #f4f4f4;color: white; border-bottom: 1px solid #f4f4f4;background: #152e4d;">
        <span> کل نکاس : </span>
        <strong class="digit"></strong>

        <strong class="digit ttl_out f-17"></strong>
    </div>
</div>
</div>
<div class="col-md-4 report" style="direction: rtl;">
<div class="c-address-info">
    <div class="openning_balance_div" style="display: none;">
        <span> نقد دکان : </span>
        <strong class="digit">--</strong>
        <strong class="digit openning_balance">Loading...</strong>
    </div>
       <div class="karaya_dokan_receive_div" style="display: none;">
        <span>کرایہ دکان: </span>
        <strong class="digit"></strong> 
        <strong class="digit karaya_dokan_receive">Loading...</strong>
    </div>
    <div class="mutafirq_udhar_receive_div" style="display: none;">
        <span>متفرق ادھار : </span>
        <strong class="digit">--</strong>
        <strong class="digit mutafirq_udhar_receive">Loading...</strong>
    </div>
  
    <div class="mcb_ka_jama_div" style="display: none;">
        <span>MCB کوٹ ادو: </span>
        <strong class="digit"></strong>

        <strong class="digit mcb_ka_jama">Loading...</strong>
    </div>
    <!-- <div class="hbl_m_waqas_jama_div" style="display: none;">
        <span>HBL وقاص : </span>
        <strong class="digit"></strong>

        <strong class="digit hbl_m_waqas_jama">Loading...</strong>
    </div> -->
    <!-- <div class="ubl_m_waqas_jama_div" style="display: none;">
        <span>UBL وقاص : </span>
        <strong class="digit"></strong>

        <strong class="digit ubl_m_waqas_jama">Loading...</strong>
    </div> -->
    <div class="ilyas_bakhtawar_div" style="display: none;">
        <span>الیاس بختاور : </span>
        <strong class="digit">--</strong>
        <strong class="digit ilyas_bakhtawar">Loading...</strong>
    </div>
    <div class="fazul_qadir_recive_div" style="display: none;">
        <span>فضل القادر : </span>
        <strong class="digit">--</strong>
        <strong class="digit fazul_qadir_recive">Loading...</strong>
    </div>
    <div class="shafiq_karyana_receive_div" style="display: none;">
        <span>شفیق کریانہ : </span>
        <strong class="digit">--</strong>
        <strong class="digit shafiq_karyana_receive">Loading...</strong>
    </div>
    <div class="abdul_ghaffar_ghar_receive_div" style="display: none;">
        <span>عبدالغفار گھر : </span>
        <strong class="digit">--</strong>
        <strong class="digit abdul_ghaffar_ghar_receive">Loading...</strong>
    </div>
    <div class="ammar_abdullah_ghar_receive_div" style="display: none;">
        <span>عمار عبداللہ گھر : </span>
        <strong class="digit">--</strong>
        <strong class="digit ammar_abdullah_ghar_receive">Loading...</strong>
    </div>
    <div class="imdad_khata_receive_div" style="display: none;">
        <span>امداد کھاتہ : </span>
        <strong class="digit">--</strong>
        <strong class="digit imdad_khata_receive">Loading...</strong>
    </div>
    <div class="imran_niazi_receive_div" style="display: none;">
        <span>عمران نیازی : </span>
        <strong class="digit">--</strong>
        <strong class="digit imran_niazi_receive">Loading...</strong>
    </div>
    <div class="sir_murtaza_sahib_receive_div" style="display: none;">
        <span>سر مرتضیٰ صاحب : </span>
        <strong class="digit">--</strong>
        <strong class="digit sir_murtaza_sahib_receive">Loading...</strong>
    </div>
    <div class="master_khalid_faroq_shah_receive_div" style="display: none;">
        <span>ماسٹر خالد فاروق شاہ : </span>
        <strong class="digit">--</strong>
        <strong class="digit master_khalid_faroq_shah_receive">Loading...</strong>
    </div>

    <div class="mutafirq_sody_div" style="display: none;">
        <span>متفرق سودے</span>
        <strong class="digit">--</strong>
        <strong class="digit mutafirq_sody">Loading...</strong>
    </div>
    <div class="dawai_div" style="display: none;">

        <span> دوائی: </span>
        <strong class="digit dawai_qty">Loading...</strong>
        <strong class="digit dawai">Loading...</strong>
    </div>
    <div class="beej_div" style="display: none;">
        <span> بیج: </span>
        <strong class="digit beej_qty">Loading...</strong>
        <strong class="digit beej">Loading...</strong>
    </div>
    <div class="gandom_div" style="display: none;">
        <span>گندم : </span>
        <strong class="digit gandom_qty">Loading...</strong>
        <strong class="digit gandom">Loading...</strong>
    </div>
    <!-- <div class="gandum_khareed_khata_receive_div" style="display: none;">
        <span>گندم خرید کھاتہ : </span>
        <strong class="digit"></strong>
        <strong class="digit gandum_khareed_khata_receive">Loading...</strong>
    </div> -->
    <div class="kapas_div" style="display: none;">
        <span>بنولہ </span>
        <strong class="digit kapas_qty">Loading...</strong>
        <strong class="digit kapas">Loading...</strong>
    </div>
    <div class="dhaan_div" style="display: none;">
        <span>دھان : </span>
        <strong class="digit dhaan_qty">Loading...</strong>
        <strong class="digit dhaan">Loading...</strong>
    </div>
    <div class="dap_25kg_div" style="display: none;">
        <span>ڈی اے پی 25 کلو :</span>
        <strong class="digit dap_25kg_qty">Loading...</strong>
        <strong class="digit dap_25kg">Loading...</strong>
    </div>
    <div class="dap_div" style="display: none;">
        <span>ڈی اے پی :</span>
        <strong class="digit dap_qty">Loading...</strong>
        <strong class="digit dap">Loading...</strong>
    </div>
    <div class="urea_div" style="display: none;">
        <span>یوریا : </span>
        <strong class="digit urea_qty">Loading...</strong>
        <strong class="digit urea">Loading...</strong>
    </div>
    <div class="can_div" style="display: none;">
        <span>گوارہ : </span>
        <strong class="digit can_qty">Loading...</strong>
        <strong class="digit can">Loading...</strong>
    </div>
    <div class="np_div" style="display: none;">
        <span>نائیڑوفاس : </span>
        <strong class="digit np_qty">Loading...</strong>
        <strong class="digit np">Loading...</strong>
    </div>
    <div class="ssp_div" style="display: none;">
        <span>ایس ایس پی :</span>
        <strong class="digit ssp_qty">Loading...</strong>
        <strong class="digit ssp">Loading...</strong>
    </div>
    <div class="zarkhez_div" style="display: none;">
        <span>زرخیز : </span>
        <strong class="digit zarkhez_qty">Loading...</strong>
        <strong class="digit zarkhez">Loading...</strong>
    </div>
    <div class="sop_div" style="display: none;">
        <span>ایس او پی : </span>
        <strong class="digit sop_qty">Loading...</strong>
        <strong class="digit sop">Loading...</strong>
    </div>
    <div class="jimsam_div" style="display: none;">
        <span>جپسم : </span>
        <strong class="digit jimsam_qty">Loading...</strong>
        <strong class="digit jimsam">Loading...</strong>
    </div>
    <div class="mop_div" style="display: none;">
        <span>ایم او پی : </span>
        <strong class="digit mop_qty">Loading...</strong>
        <strong class="digit mop">Loading...</strong>
    </div>
 
    <div style="border-bottom: 1px solid #f4f4f4;color: white; border-bottom: 1px solid #f4f4f4;background: #152e4d;">
        <span> <b> کل آمد : </b> </span>
        <strong class="digit"></strong>
        <strong class="digit ttl_in f-17"></strong>
    </div>
    <div>
        <span> <b> کل نکاس : </b> </span>
        <strong class="digit"></strong>

        <strong class="digit ttl_out f-17"></strong>
    </div>

    <div class="total_meezan_div" style="border-bottom: 1px solid #f4f4f4;color: white; border-bottom: 1px solid #f4f4f4;background: #152e4d;">
        <span> کل میزان : </span>
        <strong class="digit"></strong>
        <strong class="digit total_meezan f-17"></strong>
    </div>
</div>



</div>