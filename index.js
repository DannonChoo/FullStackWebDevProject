const basicDataQuery = {
    companyId: null,
    audienceCount: null,
    page: 0,
    pageSize: 5,
};

const basicDataPaginationFunction = {
    gotoFirstPage: function () {
        basicDataQuery['page'] = 0;
        console.log(`PageNo: ${basicDataQuery['page']}`);
    },
    changePage: function (delta) {
        console.log(delta);
        basicDataQuery['page'] += parseInt(delta);
        console.log(`PageNo: ${basicDataQuery['page']}`);
    },
    changePageSize: function (newPageSize) {
        console.log(newPageSize);
        basicDataQuery['pageSize'] = newPageSize;
    }
};

const basicDataUrl = 'http://localhost:3000/basic/data';

function populateBasicDataTable(data) {
    console.log(data);
    const dataTableHtml = data.map(
        ({ id, optionid, companyid, audiencecount, cost }) => `
            <tr>
                <th scope="row">${id}</th>
                <td>${optionid}</td>
                <td>${companyid}</td>
                <td>${audiencecount}</td>
                <td>${cost}</td>
            </tr>
    `,
    );
    $('#basic-data-tbody').html(dataTableHtml);
}

function getBasicDataFromBackEnd(callback) {
    $.get(basicDataUrl, basicDataQuery)
        .done((result) => callback(null, result))
        .fail((message) => callback(message, null));
}

function refreshBasicDataTable() {
    getBasicDataFromBackEnd(function (err, data) {
        if (data.length == 0) {
            basicDataQuery['page'] -= 1
            return alert('You have reached the end of the page.');
        }
        if (err) return alert(err);
        populateBasicDataTable(data);
    });
}

function filterBasicData(event) {
    // This is for selecting those that are not input type submit.
    // console.log($('#basic-data-filter-form input').not(':input[type=submit]')); 
    $('#basic-data-filter-form input')
        .not(':input[type=submit]')
        .each((idx, input) => {
            basicDataQuery[$(input).attr('key')] = $(input).val();
        });
    refreshBasicDataTable();
    return false;
}

function registerBasicDataFilterForm() {
    $('#basic-data-filter-form').submit(filterBasicData);
}

function paginateBasicData(event) {
    const fn = $(this).attr('fn');
    const value = $(this).attr('value') || $(this).val();
    basicDataPaginationFunction[fn](value);
    refreshBasicDataTable();
}

function registerBasicDataPaginationForm() {
    $('#basic-data-first-page').click(paginateBasicData);
    $('#basic-data-previous-page').click(paginateBasicData);
    $('#basic-data-next-page').click(paginateBasicData);
    $('#basic-data-page-size-select').change(paginateBasicData);
}

$(document).ready(function () {
    registerBasicDataFilterForm();
    registerBasicDataPaginationForm();
});