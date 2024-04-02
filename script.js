var nr_fature = 1;
let currentDate = new Date();
var day = currentDate.getDate().toString().padStart(2, '0'); //mbush strin me 0 deri sa te arrije 2 vlera
var month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); //muajte fillojne numerimin nga zero
var year = currentDate.getFullYear();
var hours = currentDate.getHours().toString().padStart(2, '0');
var minutes = currentDate.getMinutes().toString().padStart(2, '0');
var formattedDateTime = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
var totali_produktit_fatura = 0;
var emri_klientit;

//vendosen eventlisteners pas load
document.addEventListener("DOMContentLoaded", function () {
    // Listen for input events on all elements with class name 'sasia_produktit'
    let sasiaInputs = document.getElementsByClassName("sasia_produktit");
    for (let i = 0; i < sasiaInputs.length; i++) {
        sasiaInputs[i].addEventListener("input", vlera_produktit);
    }

    // Listen for input events on all elements with class name 'cmimi_produktit'
    let cmimiInputs = document.getElementsByClassName("cmimi_produktit");
    for (let i = 0; i < cmimiInputs.length; i++) {
        cmimiInputs[i].addEventListener("input", vlera_produktit);
        cmimiInputs[i].addEventListener("input", totali_produktit);
    }
});

//funksioni on load
function load() {
    document.getElementById("datetime").innerText = formattedDateTime;
}

//fshi duhet te fshije te gjithe <tr> aktual
function fshi_rresht(button) {
    var rreshti_prind = button.parentNode.parentNode;
    rreshti_prind.parentNode.removeChild(rreshti_prind);

    totali_produktit();
}

//+ duhet te shtoje nje <tr> tjeter me strukturen e njejte
function shto_rresht() {
    var tabela = document.getElementById("tabela");
    var rreshti = tabela.insertRow();
    var cell1 = rreshti.insertCell();
    var cell2 = rreshti.insertCell();
    var cell3 = rreshti.insertCell();
    var cell4 = rreshti.insertCell();
    var cell5 = rreshti.insertCell();

    cell1.innerHTML = '<input type="text" name="emri_produktit" placeholder="emri_produktit">';
    cell2.innerHTML = '<input type="number" class="sasia_produktit" name="sasia_produktit" placeholder="0">';
    cell3.innerHTML = '<input type="number" class="cmimi_produktit" name="cmimi_produktit" placeholder="0">';
    cell4.innerHTML = '<span class="vlera_produktit">0</span>';
    cell5.innerHTML = '<button class="fshi" onclick="fshi_rresht(this)">&#128465;</button>';

    // shton event listeners te elementet e reja
    var sasiaInput = cell2.querySelector(".sasia_produktit");
    var cmimiInput = cell3.querySelector(".cmimi_produktit");
    sasiaInput.addEventListener("input", vlera_produktit);
    cmimiInput.addEventListener("input", vlera_produktit);
    cmimiInput.addEventListener("input", totali_produktit);
}

//vlera_produktit duhet te jete sasia * cmimi ne real time
function vlera_produktit() {
    console.log("vlera_produktit() function called"); // Log a message to the console
    let sasiaInputs = document.getElementsByClassName("sasia_produktit");
    let cmimiInputs = document.getElementsByClassName("cmimi_produktit");
    let vleraSpans = document.getElementsByClassName("vlera_produktit");

    // Loop through each pair of inputs and update the corresponding span
    for (let i = 0; i < sasiaInputs.length; i++) {
        let sasia = parseFloat(sasiaInputs[i].value);
        let cmimi = parseFloat(cmimiInputs[i].value);
        let vlera = sasia * cmimi;
        vleraSpans[i].innerText = vlera.toFixed(2); // Round to 2 decimal places
    }
}

//totali duhet te jete shuma e gjithe vlerave real time
function totali_produktit() {
    let totali = 0;
    let vleraSpans = document.getElementsByClassName("vlera_produktit");

    for (let i = 0; i < vleraSpans.length; i++) {
        let vlera = parseFloat(vleraSpans[i].innerText); //merr tektin sepse value kan vetem inputet
        totali += vlera;
    }

    totali_produktit_fatura = totali;
    document.getElementById("totali").innerText = totali;

    emri_klientit = document.getElementById("emri_klientit").value;
}

//gjenero dujet te printoje nje pdf file me te dhenat e tabeles me opas reload
function gjenero_fature() {
    // Create a new jsPDF instance
    var doc = new jsPDF();

    doc.text('Fatura ' + nr_fature, 10, 10);
    doc.text('Data dhe Ora: ' + formattedDateTime, 10, 20);
    doc.text('Klienti: ' + emri_klientit, 10, 30);

    var table = document.getElementById('tabela');
    var columns = [];
    for (var i = 0; i < table.rows[0].cells.length - 1; i++) {
        columns.push(table.rows[0].cells[i].textContent);
    }
    var rows = [];
    for (var i = 1; i < table.rows.length; i++) {
        var row = [];
        // Get values from input elements for the first three columns
        for (var j = 0; j < 3; j++) {
            var inputElement = table.rows[i].cells[j].querySelector('input');
            if (inputElement) {
                row.push(inputElement.value);
            } else {
                row.push('');
            }
        }
        // Get text content for the last column
        var lastColumnText = table.rows[i].cells[3].textContent;
        row.push(lastColumnText);
        rows.push(row);
    }

    // Add the table to the PDF
    doc.autoTable({
        head: [columns],
        body: rows,
        startX: 10,
        startY: 40
    });

    doc.text('Totali: ' + totali_produktit_fatura, 10, doc.autoTable.previous.finalY + 10);

    // Save the PDF with a filename "fatura.pdf"
    doc.save('Fatura_' + parseInt(nr_fature) + '.pdf');
    nr_fature++;
}
