@php
    $is_close = isClose();
@endphp
<div class="modal fade" id="close-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content top-borderRed" style="border-top:3px solid #131d2a">
            <div class="modal-header" style="padding:15px">
                <h5 class="modal-title" id="exampleModalLabel">Admin Sale <span>@if($is_close == 1) Open @else Close @endif</span></h5>
            </div>
            <div class="modal-body" style="padding:7px 15px 15px 15px">
                <div id="col-md-12">
                    <style>
                        .cash_in_hand,
                        .closing_cash {
                            box-shadow: none !important;
                            height: 35px !important
                        }

                        textarea {
                            box-shadow: none !important;
                            height: auto;
                        }
                    </style>
                    <div class="row">
                        @if($is_close == 1)
                        <p>Are you Sure you want to open Sale</p>
                        @else
                        <div class="col-md-6">
                            <label class="font12">Cash IN Hand*</label>
                            <input type="text" autocomplete="off" class="form-control only_decimal_numerics cash_in_hand" placeholder="Cash In Hand">
                            <input type="hidden" value="" class="ttl_cash_in_hand" name="ttl_cash_in_hand">
                        </div>
                        <div class="col-md-6">
                            <label class="font12">Closing Cash*</label>
                            <input type="text" autocomplete="off" class="form-control only_decimal_numerics closing_cash" placeholder="Closing Cash">
                        </div>
                        <div class="col-md-12">
                            <label class="font12">Closing Comment</label>
                            <textarea class="form-control closing_comment" name="closing_comment" cols="20"></textarea>
                        </div>
                        @endif
                    </div>
                </div>
            </div>
            <div class="modal-footer border-0" style="padding-top:7px;padding-bottom:7px ">
                @if($is_close == 1)
                <button type="button" class="btn btn-primary sale_open">Sale Open</button>
                @else
                <button type="button" class="btn btn-primary sale_close">Sale Close</button>
                @endif
                <button type="button" class="btn btn-cancel cancel_sale_close_modal" data-dismiss="modal" aria-label="Close">Cancel</button>
            </div>
        </div>
    </div>
    <button hidden data-toggle="modal" data-target="#close-modal" id="hidden_btn_to_open_sale_close_modal"></button>
</div>
