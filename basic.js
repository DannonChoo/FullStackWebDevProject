const basicResultUrl = 'http://localhost:3000/basic/result';

const basicResultQuery = {
    optionId: [],
    amount: null,
    audienceReached: null,
};

const trackField = {
    counter: 3,
};

function getBasicResultFromBackEnd(data) {
    console.log(data);
    // const dataTableHtml = data.map(
    //     ({ id, optionid, companyid, audiencecount, cost }) => `
    //         <tr>
    //             <th scope="row">${id}</th>
    //             <td>${optionid}</td>
    //             <td>${companyid}</td>
    //             <td>${audiencecount}</td>
    //             <td>${cost}</td>
    //         </tr>
    // `,
    // );
    // $('#basic-data-tbody').html(dataTableHtml);
}

function populateBasicResultTable(callback) {
    $.get(basicResultUrl, basicResultQuery)
        .done((result) => callback(null, result))
        .fail((message) => callback(message, null));
}

function refreshBasicResultTable() {
    getBasicResultFromBackEnd(function (err, data) {
        if (data.length == 0) {
            return alert('No results');
        }

        console.log("data" + JSON.stringify(data));

        if (err) return alert(err);
        populateBasicResultTable(data);
    });
}

function compute() {
    let resultArray = [];
    $('#basic-result-input-form input')
        .not(':input[type=submit]')
        .each((_, input) => {
            console.log($(input).val());
            basicResultQuery[$(input).attr('key')] = $(input).val();
            resultArray.push(basicResultQuery[$(input).attr('key')]);
        });
    console.log("array: "+resultArray);
    if (resultArray.length < 3) {
        return alert('Requires at least 2 Option IDs');
    }
    refreshBasicResultTable();
    return false;
}

function registerBasicResultInput() {
    $('#basic-result-input-form').submit(compute);
}

function addDeleteButton() {
    
    $('#add').click(function () {
        // $('#optionTemplate').empty();
        let fieldAddHTML = `<div class="form-group text-white text-center" id="field${trackField['counter']}"> <input required type="number" class="form-control text-center" key="optionId" placeholder="Option Id">`;
        fieldAddHTML += `<button type="button" class="btn btn-danger remove" id="remove${trackField['counter']}">Remove</button></div>`;
        $('#options').append(fieldAddHTML);
        trackField['counter']++;
    });

    $('body').on('click', '.remove', (function(event) {
        deleteField = event.target.id;
        console.log(deleteField);
        $("#" + deleteField).closest('div').remove();
    }));
}

$(document).ready(function () {
    addDeleteButton();
    registerBasicResultInput();
    
});



