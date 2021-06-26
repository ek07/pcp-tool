/**
 * Read csv data
 */
// $(document).ready(function () {
//     $('#submit, #reorder').on("click", function (e) {
//         // console.log($('#files'))
//         e.preventDefault();
//         // If there is no data input
//         if (!$('#files')[0].files.length) {
//             alert("Please choose at least one file to read the data.");
//         }

//         $('#files').parse({
//             config: {
//                 delimiter: "auto",
//                 complete: visualization
//             },
//             before: function (file, inputElem) {
//             },
//             error: function (err, file) {
//                 console.log("ERROR:", err, file);
//             }
//         });
//         e.stopPropagation();
//         return false;
//     });
// });

$(document).ready(function(){
    $('#submit, #reorder').click(function (e) {
        // console.log($('#files'))
        e.preventDefault();
        e.stopPropagation();

        // If there is no data input
        if (!$('#files')[0].files.length) {
            alert("Please choose at least one file to read the data.");
        }

        $('#files').parse({
            config: {
                delimiter: "auto",
                complete: visualization
            },
            before: function (file, inputElem) {
            },
            error: function (err, file) {
                console.log("ERROR:", err, file);
            }
            // complete: function (file, e) {
            //     e.stopPropagation();
            //     return false;
            // }
        });
        return false;
    });
});

// function load_data(e){
//     e.preventDefault();
//     e.stopPropagation();

//     // If there is no data input
//     if (!$('#files')[0].files.length) {
//         alert("Please choose at least one file to read the data.");
//     }

//     $('#files').parse({
//         config: {
//             delimiter: "auto",
//             complete: visualization
//         },
//         before: function (file, inputElem) {
//         },
//         error: function (err, file) {
//             console.log("ERROR:", err, file);
//         }
//         // complete: function (file, e) {
//         //     e.stopPropagation();
//         //     return false;
//         // }
//     });
//     return false;
// }

/**
 * Main Function
 * @param results
 */
function visualization(results) {

    var fileName = document.getElementById('files').files[0].name.slice(0, -4);

    //disableButton(document.getElementById("submit"));
    d3.select("#targetPC").selectAll("div").remove();
    // $("div.wrapper").remove();


    var data = results.data;

    var dataArray = [[]];
    // var simMeasure = document.getElementById("similarity").value;
    var hasNullValue = [];

    //construct the data array
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        dataArray[i] = row;
        var cells = row.join(",").split(",");
        for (var j = 0; j < cells.length; j++) {
            dataArray[i][j] = cells[j];
        }
    }

    // delete rows with null value(s)
    for (var a = 1; a < dataArray.length; a++) {
        for (var b = 0; b < dataArray[0].length; b++) {
            if (dataArray[a][b] === "") {
                hasNullValue.push(a);
                break;
            }
        }
    }
    var deleted = 0;
    for (var index = 0; index < hasNullValue.length; index++) {
        dataArray.splice(hasNullValue[index] - deleted, 1);
        deleted++;
    }

    //get feature vector type
    var featureVectorType = document.getElementById("feature-vector").value;
    // var normArr = getNormalizedArr(dataArray);

    // switch (selectedMethod) {
    //     // Mean
    //     case "0":
    //         console.log("you have chosen " + document.getElementById("0").innerHTML + ".");
    //         featureVectorType = "Mean";
    //         break;

    //     // Mean +- std
    //     case "1":
    //         console.log("you have chosen " + document.getElementById("1").innerHTML + ".");
    //         featureVectorType = "Mean +- Std";
    //         break;

    //     // Histogram feature vector
    //     case "2":
    //         console.log("you have chosen " + document.getElementById("2").innerHTML + ".");
    //         featureVectorType = "Histogram";
    //         break;
    // }

    if (dataArray !== undefined) {
        dataArray[0][0] = "class";
        var visArr = deepCopy(dataArray);
        var classes = getClasses(visArr);
        var objArray = convertToArrayOfObjects(visArr); // better way to do this?
        var classDict = convertToClassDict(visArr, classes);

        // console.log(classDict);

        pcVis(objArray, classDict, classes);
    }
}





