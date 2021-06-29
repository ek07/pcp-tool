var nr_pcp_elements = 0;
var current_pcp_id = 0;

/**
 * Read csv data
 */
$(document).ready(function(){
    $('#submit').on('click', function (e) {
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
                // clear old viz if any
                d3.select("#viz").selectAll("div").remove();

                pcp_html = generate_pcp_div(current_pcp_id);
                $('#viz').append(pcp_html);

                if (e.target.id=="submit"){
                    nr_pcp_elements = 0;
                    current_pcp_id = 0;
                    // document.getElementById("dim-order").value = "";
                }    
            },
            error: function (err, file) {
                console.log("ERROR:", err, file);
            },
            complete: function (file, e) {
                nr_pcp_elements += 1;
            }
        });
        return false;
    });
});

/**
 * Reorder
 */
function reorder(e){
        var button_id = e.target.id;
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
        });
        return false;
};


/**
 * New set of pcps. onclick hide previous plus button
 */
$(document).ready(function(){
    $('#add-pcp').click(function (e) {
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
                var viz_div = document.getElementById("viz");

                // var new_div = document.createElement("div");
                // new_div.class = "show";
                // new_div.id = "dim-div";
                // viz_div.append(new_div);
                // viz_div.append(document.createElement("br"));

                // var label = document.createElement("label");
                // label.innerHTML = "Dimension order ";
                // viz_div.append(label);

                // var input = document.createElement("input");
                // input.type = "text";
                // input.id = "dim-order"

                var html = `<div class="show" id="dim-div"> 
                            <br>
                            <label>Dimension order: </label>
                            <input type="text" id="dim-order" value="">
                            <button id="reorder" type="submit">Reorder</button>
                            <button id="add-pcp" type="submit"> + </button>
                            <b id="qfd">&emsp;Total QFD:&nbsp;</b> 
                            <b id="qfd_value"> - </b>

                          </div>

                          <div class="grid" id="targetPC"></div>
                          `;
                // var innerhtml = viz_div.innerHTML;
                // var new_innerhtml = innerhtml + html;
                // viz_div.innerHtml += html;
                $("#viz").append(html);
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

    var dataArray = rawDataToDataArray(results.data);

    if (dataArray !== undefined) {
        dataArray[0][0] = "class";
        var visArr = deepCopy(dataArray);
        var classes = getClasses(visArr);
        var objArray = convertToArrayOfObjects(visArr); // better way to do this?
        var classDict = convertToClassDict(visArr, classes);

        // console.log(classDict);
        pcVis(objArray, classDict, classes, current_pcp_id);
        computeDistSingle(dataArray, current_pcp_id);
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
