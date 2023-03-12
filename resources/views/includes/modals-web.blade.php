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
            <div class="row">
                <div class="col-12">
                <strong>Are you sure you want to delete?</strong>
                </div>
            </div>
            </div>
            <div class="modal-footer border-0">
            <button type="button" class="btn w-btn confirm_delete">Yes</button>
            <button type="submit" class="btn w-btn btn-cancel cancel_delete_modal" data-dismiss="modal"
                aria-label="Close">No</button>
            </div>
        </div>
    </div>
    <button hidden data-toggle="modal" data-target="#deleteModal" id="hidden_btn_to_open_modal"></button>
</div>
{{-- Thank You Modal --}}
<div class="modal fade" id="thankyou-confirm" tabindex="-1" role="dialog" aria-labelledby="thankyou-confirmTitle"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content top_border">
            <div class="modal-header">
                <h3 class="modal-title" id="thankyou-confirmTitle">Thank You For Filling Out Your Information</h3>
                <button type="button" class="close fade close-thankyou-modal" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body confir_pay">
                <div class="col-12">
                    <div class="check_mark">
                        <div class="sa-icon sa-success animate">
                            <span class="sa-line sa-tip animateSuccessTip"></span>
                            <span class="sa-line sa-long animateSuccessLong"></span>
                            <div class="sa-placeholder"></div>
                            <div class="sa-fix"></div>
                        </div>
                    </div>
                </div>
                <div class="signup-option">
                    <h3>Data Successfully Submitted, We Review Your Details and Contact Back Soon.</h3>
                    {{-- <button class="btn w-btn">Create an account <i class="fa alt-fa-arrow-right"></i></button> --}}
                </div>
            </div>
        </div>
    </div>
</div>