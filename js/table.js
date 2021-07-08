var file_name;

// Compute QFD
$(document).ready(function () {
    $('#compute-dist-table').on("click", function (e) {
        e.preventDefault();
        // If there is no data input
        if (!$('#files')[0].files.length) {
            alert("Please choose at least one file to read the data.");
        }

        $('#files').parse({
            config: {
                delimiter: "auto",
                complete: drawTable
            },
            before: function (file, inputElem) {
                file_name = file.name;
            },
            error: function (err, file) {
                console.log("ERROR:", err, file);
            }
        });
        e.stopPropagation();
        return false;
    });
});


function drawTable(results){
    var dataArray = rawDataToDataArray(results.data);
    buildQFDTable(dataArray)
}

/**
 * Draw data table if needed
 * @param dataArray
 */
function buildQFDTable(dataArray) {
    var markup = "<table id='dataTable'  class='show' style='width:100%'>";
    // markup +=  "<caption>" + file_name +   "</caption>";

    var headers = ["Ordering", "Total OFD", "Mean correlation", "Mean polyline distance"]
    markup += "<tr>";
    for (var i = 0; i < headers.length; i++) {
        markup += "<th>" + headers[i] + "</th>";
    }
    markup+="</tr>"
    markup += "</table>";

    console.log(markup)
    // $("#app").html(markup);
    $("#table").html(markup);
}

/**
 * Draw data table if needed
 * @param dataArray
 */
function buildTable(dataArray) {
    var markup = "<table id='dataTable'  class='show'>";
    for (var i = 0; i < dataArray.length; i++) {
        markup += "<tr>";
        var row = dataArray[i];

        for (var j = 0; j < dataArray[0].length; j++) {
            markup += "<td>";
            markup += row[j];
            markup += "</td>";
        }
        markup += "</tr>";
    }
    markup += "</table>";


    // $("#app").html(markup);
    $("#table").html(markup);
}