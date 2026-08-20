    <script>
      
        function addcoma(nStr) {
            nStr = parseFloat(nStr); // Convert to float 
            if (Number.isInteger(nStr)) {
                return nStr.toLocaleString(); // If it's a whole number, just format with commas
            } else {
                return nStr.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
        }

        function calculateTotal() {
            let total = 0;
            let values = [5000, 1000, 500, 100, 50, 20, 10]; // Denominations

            values.forEach(value => {
                let resultElement = document.getElementById(`result${value}`);
                let cleanValue = resultElement.innerText.replace(/,/g, ""); // Remove commas
                total += parseFloat(cleanValue) || 0; // Sum up all results
            });

            $("#grandTotal").html(`${addcoma(total)}`); // Update total display
        }


        // Calculate Values and Print
        function calculate(inputElement, value) {
            let inputVal = parseFloat(inputElement.value) || 0;
            $(`#result${value}`).html(`${addcoma(inputVal * value)}`)
            calculateTotal()
        }

        function printSection() {
            let grandTotal = $("#grandTotal").text();
            var v5000   = document.getElementById("val5000").value || 0;
            var v1000   = document.getElementById("val1000").value || 0;
            var v500    = document.getElementById("val500").value || 0;
            var v100    = document.getElementById("val100").value || 0;
            var v50     = document.getElementById("val50").value || 0;
            var v20     = document.getElementById("val20").value || 0;
            var v10     = document.getElementById("val10").value || 0;
            var content = document.getElementById("contentToPrint").innerHTML;
            var printWindow = window.open('', '', 'height=600,width=800');
            var today = new Date();
            var formattedDate = today.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short', // "Feb"
                year: 'numeric' // "2025"
            }).replace(',', '');
            content = content.replace(/\.\d+/g, '');

            var TopContent = `<p><b>Date : ${formattedDate} <b></p>  `;



            var bottomContent = `
                            <br>
                            <div> 
                              <table border="1" class="table table-bordered">  <thead>
                                <tr>
                                <th>Denomination</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                              ${v5000 > 0 ? `
                                    <tr>
                                    <td>5000</td>
                                    <td>${v5000}</td>
                                    <td>${addcoma(v5000 * 5000)}</td>
                                    </tr>` : ''}

                                ${v1000 > 0 ? `
                                    <tr>
                                    <td>1000</td>
                                    <td>${v1000}</td>
                                    <td>${addcoma(v1000 * 1000)}</td>
                                    </tr>` : ''}

                                ${v500 > 0 ? `
                                    <tr>
                                    <td>500</td>
                                    <td>${v500}</td>
                                    <td>${addcoma(v500 * 500)}</td>
                                    </tr>` : ''}

                                ${v100 > 0 ? `
                                    <tr>
                                    <td>100</td>
                                    <td>${v100}</td>
                                    <td>${addcoma(v100 * 100)}</td>
                                    </tr>` : ''}

                                ${v50 > 0 ? `
                                    <tr>
                                    <td>50</td>
                                    <td>${v50}</td>
                                    <td>${addcoma(v50 * 50)}</td>
                                    </tr>` : ''}

                                ${v20 > 0 ? `
                                    <tr>
                                    <td>20</td>
                                    <td>${v20}</td>
                                    <td>${addcoma(v20 * 20)}</td>
                                    </tr>` : ''}

                                ${v10 > 0 ? `
                                    <tr>
                                    <td>10</td>
                                    <td>${v10}</td>
                                    <td>${addcoma(v10 * 10)}</td>
                                    </tr>` : ''}
                            </tbody>
                            <tfoot>  <tr>
                                <td colspan="2" align="right">Total</td>  <td>${grandTotal}</td>
                                </tr>
                            </tfoot>
                            </table>
                            </div>
                        `;

            printWindow.document.write(`
                                <html>
                                <head>
                                    <title>Print</title>
                                    <style>
                                        @media print {
                                            body {
                                                margin: 20px;
                                                font-family: Arial, sans-serif;
                                            }
                                            .no-break {
                                                page-break-inside: avoid; /* Prevent breaking inside */
                                            }
                                            p, div {
                                                margin: 2px 0;  /* Reduce space between lines */
                                                padding: 0;     /* Remove padding */
                                                line-height: 1.2; /* Reduce extra spacing */
                                                font-size: 14px; /* Adjust text size */
                                                display: block;
                                                font-family : Rationale, sans-serif;
                                            }
                                        }
                                    </style>
                            `);

            // **Include all styles from the current document**
            var allStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
            allStyles.forEach(style => {
                printWindow.document.write(style.outerHTML);
            });

            printWindow.document.write(`
                    </head>
                    <body>
                        <div class="no-break">
                            ${TopContent}
                            ${content}
                            ${bottomContent}
                        </div>
                    </body>
                    </html>
                `);

            printWindow.document.close();
            printWindow.print();
        }

        (function($) {
            $(window).on("load", function() {
                $(".demo-y").mCustomScrollbar({
                    theme: "dark-2"
                });
            });
        })(jQuery);
    </script>
