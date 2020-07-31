function submitFile() {
    $('#basic-result-csv-upload').submit(function (event) {
        // l`et formData = new FormData();
        // formData.append('inputBasicCSV', $('input[type=file]')[0].files[0]);`
        // formData.append('budget', $('input[type=number]')[0].valueAsNumber);
        // for(var pair of formData.entries()) {
        //     console.log(pair[0]+', '+pair[1]);
        // }
        $.ajax({
            url: "http://localhost:3000/basic/uploadComputeCSV",
            type: "POST",
            data: new FormData(this),
            processData: false,
            contentType: false
            });
        return false;
    });
}

function fileName(){
    $('input[type="file"]').change(function(e){
        var fileName = e.target.files[0].name;
        $("#displayfilename").text(fileName);
    });
}

$(document).ready(function () {
    fileName();
    submitFile();
});

$(function () {
    $(document).scroll(function () {
        var $nav = $(".navbar");
        $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
    });
});
