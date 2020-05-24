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
        basicDataQuery['page'] += parseInt(delta);
        console.log(`PageNo: ${basicDataQuery['page']}`);
    },
    changePageSize: function (newPageSize) {
        console.log(newPageSize);
        basicDataQuery['pageSize'] = newPageSize;
    }
};

const basicDataUrl = 'http://localhost:3000/basic/data';
const basicDataLength = 'http://localhost:3000/basic/dataLength';

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

function getNoRowsFromBackEnd(callback) {
    $.get(basicDataLength)
        .done((result) => callback(null, result))
        .fail((message) => callback(message, null));
}

function paginate() {
    getNoRowsFromBackEnd(function (err, data) {
        if (err) return alert(err);
        dataCount = parseInt(data.rows[0].count);
        var totalPg = (Math.ceil(dataCount/basicDataQuery['pageSize']))-1;
        if (basicDataQuery['page'] == 0) {
            $('#basic-data-previous-page').hide();
            $('#basic-data-next-page').show();
        } else if (basicDataQuery['page'] == parseInt(totalPg)) {
            $('#basic-data-previous-page').show();
            $('#basic-data-next-page').hide();
        }else {
            $('#basic-data-previous-page').show();
            $('#basic-data-next-page').show();
        } 
        console.log("total pgs: "+totalPg);
        console.log(basicDataQuery['page']);
        console.log("total rows: "+dataCount);       
    });
}

function refreshBasicDataTable() {
    getBasicDataFromBackEnd(function (err, data) {
        console.log("data"+data);
        if (data.length == 0) {
            return alert('No results');
        }
        if (err) return alert(err);
        populateBasicDataTable(data);
    });
    paginate();
}

function filterBasicData(event) {
    // This is for selecting those that are not input type submit.
    // console.log($('#basic-data-filter-form input').not(':input[type=submit]')); 
    $('#basic-data-filter-form input')
        .not(':input[type=submit]')
        .each((idx, input) => {
            if (idx == 0 && $(input).val().toString().length != 10) {
                return alert('Invalid company id')
            }
            console.log($(input).val());
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