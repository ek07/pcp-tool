/**
 * Read csv data
 */
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
                if (e.target.id=="submit"){
                    document.getElementById("dim-order").value = "";
                }
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

// /**
//  * Read csv data
//  */
// $(document).ready(function(){
//     $('#reorder').click(function (e) {
//         // console.log($('#files'))
//         e.preventDefault();
//         e.stopPropagation();

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
//             // complete: function (file, e) {
//             //     e.stopPropagation();
//             //     return false;
//             // }
//         });
//         return false;
//     });
// });

// Compute QFD
$(document).ready(function () {
    $('#compute-dist').on("click", function (e) {
        e.preventDefault();
        // If there is no data input
        if (!$('#files')[0].files.length) {
            alert("Please choose at least one file to read the data.");
        }

        $('#files').parse({
            config: {
                delimiter: "auto",
                complete: computeDist
            },
            before: function (file, inputElem) {
            },
            error: function (err, file) {
                console.log("ERROR:", err, file);
            }
        });
        e.stopPropagation();
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
 * Main Function to visualize pcp
 * @param results
 */
function visualization(results) {
    var fileName = document.getElementById('files').files[0].name.slice(0, -4);

    //disableButton(document.getElementById("submit"));
    // $("div.wrapper").remove();

    d3.select("#targetPC").selectAll("div").remove();
    var dataArray = rawDataToDataArray(results.data);

    if (dataArray !== undefined) {
        dataArray[0][0] = "class";
        var visArr = deepCopy(dataArray);
        var classes = getClasses(visArr);
        var objArray = convertToArrayOfObjects(visArr); // better way to do this?
        var classDict = convertToClassDict(visArr, classes);

        // console.log(classDict);
        pcVis(objArray, classDict, classes);
        computeDistSingle(dataArray);
    }
}

/**
 * Compute and create table with dist results
 * @param results
 */
function computeDist(results) {
    var fileName = document.getElementById('files').files[0].name.slice(0, -4);
    var dataArray = rawDataToDataArray(results.data);

    if (dataArray !== undefined) {
        dataArray[0][0] = "class";
        var normalizedArr = getNormalizedArr(dataArray);
        // var visArr = deepCopy(dataArray);
        var classes = getClasses(normalizedArr);
        var objArray = convertToArrayOfObjects(normalizedArr); // better way to do this?
        var classDict = convertToClassDict(normalizedArr, classes);
        var numDimensions = d3.keys(classDict[classes[0]][0]).length;
        console.log(classDict)
        var featureVectorType = document.getElementById("feature-vector").value;

        var featureVector, dist_type;

        if (featureVectorType=="mean") {
            featureVector = meanFV(classDict, classes);
            dist_type = "minus"
            console.log(featureVector[classes[0]])
            console.log(featureVector[classes[1]])
            var dist = fvDist(featureVector[classes[0]], featureVector[classes[1]], dist_type);
            console.log(dist)
        } 
        else if (featureVectorType=="mean_std"){
            featureVector = meanStdFV(classDict, classes);
            dist_type = "euclidean2d"
            console.log(featureVector[classes[0]])
            console.log(featureVector[classes[1]])
            var dist = fvDist(featureVector[classes[0]], featureVector[classes[1]], dist_type);
            console.log(dist)
        } 
        else if (featureVectorType=="hist"){
            featureVector = histFV(classDict, classes);
            dist_type = "euclidean2d"
        }

        var dimDistMatrix = dimensionDistMatrix(numDimensions);

        var permutation_generator = permute(numberRange(0, classes.length));
        
        // Example of how to use perm gen //
        // done = false;
        // while (!done){
        //     res = permutation_generator.next()
        //     val = res.value
        //     done = res.done
        //     console.log(val);
        // }
        
    }
}
