const basicResultUrl = 'http://localhost:3000/basic/result';

const basicResultQuery = {
    optionIds: [],
    budget: null,
};

const trackField = {
    counter: 3,
};

function populateBasicResultTable(data) {
    console.log(data);
    const dataTableHtml = data.result.map(
        ({ optionId, amount, audienceReached }) => `
            <tr>
                <th scope="row">${optionId}</th>
                <td>${amount}</td>
                <td>${audienceReached}</td>
            </tr>
    `,
    );
    $('#basic-data-tbody').html(dataTableHtml);
}

function getBasicResultFromBackEnd(callback) {
    $.get(basicResultUrl, basicResultQuery)
        .done((result) => callback(null, result))
        .fail((message) => callback(message, null));
    basicResultQuery['optionIds'] = [];
}

function refreshBasicResultTable() {
    getBasicResultFromBackEnd(function (err, data) {
        if (data.result.length == 0) {
            return alert('The Option IDs you have inputted do not exist.');
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
            if ($(input).attr('key') == 'optionId') {
                basicResultQuery['optionIds'].push(parseInt($(input).val()));
            }
            else if ($(input).attr('key') == 'budget'){
                basicResultQuery['budget'] = parseInt($(input).val());
            }
            resultArray.push($(input).val());
        });
    basicResultQuery['optionIds'] = basicResultQuery['optionIds'].join();
    console.log("array: "+resultArray);
    console.log("basicResultQuery: "+ JSON.stringify(basicResultQuery));
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



