    {{-- Print  modal --}}
    <div class="modal fade" id="print-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content top-borderRed" style="border-top:3px solid #131d2a">
                <div class="modal-header" style="padding:15px">
                    <h5 class="modal-title" id="exampleModalLabel">Cash Detail <span></span></h5>
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

                            .value_input {
                                padding: 2px;
                                margin: 0 !important;
                                font-size: 12px;
                                box-shadow: none;
                                height: 20px;
                                width: 100px;
                            }

                            .odd td span,
                            #grandTotal {
                                font-family: 'Rationale', sans-serif !important;
                                font-size: 18px;
                            }
                        </style>
                        <div class="row">

                            <div class="col-md-12" id="printModal">
                                <!-- Print Modal -->

                                <table class="table dataTable no-footer" id="assign-to-table" style="width: 100%;" role="grid" aria-describedby="assign-to-table_info">
                                    <thead>
                                        <tr role="row">
                                            <th class="sorting" tabindex="0" aria-controls="assign-to-table" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending" style="width: 333px;">Cash</th>
                                            <th class="sorting" tabindex="0" aria-controls="assign-to-table" rowspan="1" colspan="1" aria-label="QTY: activate to sort column ascending" style="width: 302px;">Count</th>
                                            <th class="sorting" tabindex="0" aria-controls="assign-to-table" rowspan="1" colspan="1" aria-label="Action: activate to sort column ascending" style="width: 183px;">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr role="row" class="odd">
                                            <td><b>5000 X</b></td>
                                            <td><input type="text" class="form-control value_input only_numerics value-1" id="val5000" value="" oninput="calculate(this,5000)"></td>
                                            <td><span id="result5000">____</span></td>
                                        </tr>
                                        <tr role="row" class="odd">
                                            <td>1000 X</td>
                                            <td><input type="text" class="form-control value_input only_numerics value-1" id="val1000" value="" oninput="calculate(this,1000)"></td>
                                            <td><span id="result1000">____</span></td>
                                        </tr>
                                        <tr role="row" class="odd">
                                            <td>500 X</td>
                                            <td><input type="text" class="form-control value_input only_numerics value-1" id="val500" value="" oninput="calculate(this,500)"></td>
                                            <td><span id="result500">____</span></td>
                                        </tr>
                                        <tr role="row" class="odd">
                                            <td>100 X</td>
                                            <td><input type="text" class="form-control value_input only_numerics value-1" id="val100" value="" oninput="calculate(this,100)"></td>
                                            <td><span id="result100">____</span></td>
                                        </tr>
                                        <tr role="row" class="odd">
                                            <td>50 X</td>
                                            <td><input type="text" class="form-control value_input only_numerics value-1" id="val50" value="" oninput="calculate(this,50)"></td>
                                            <td><span id="result50">____</span></td>
                                        </tr>
                                        <tr role="row" class="odd">
                                            <td>20 X</td>
                                            <td><input type="text" class="form-control value_input only_numerics value-1" id="val20" value="" oninput="calculate(this,20)"></td>
                                            <td><span id="result20">____</span></td>
                                        </tr>
                                        <tr role="row" class="odd">
                                            <td>10 X</td>
                                            <td><input type="text" class="form-control value_input only_numerics value-1" id="val10" value="" oninput="calculate(this,10)"></td>
                                            <td><span id="result10">____</span></td>
                                        </tr>
                                        <tr style="color: white;background: #132a46;font-family:'Rationale', sans-serif !important">
                                            <td colspan="2"><strong style="float: right;font-family: 'Rationale', sans-serif !important;font-size: 18px;">Total:</strong></td>
                                            <td><strong><span id="grandTotal">0</span></strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0" style="padding-top:7px;padding-bottom:7px ">
                    <button type="button" class="btn btn-primary" onclick="printSection()">Print </button>
                    <button type="button" class="btn btn-cancel cancel_sale_close_modal" data-dismiss="modal" aria-label="Close">Cancel</button>
                </div>
            </div>
        </div>
        <button hidden data-toggle="modal" data-target="#print-modal" id="hidden_btn_to_open_sale_close_modal"></button>
    </div>
