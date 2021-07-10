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
                complete: computeTable
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


function computeTable(results){
    var fileName = document.getElementById('files').files[0].name.slice(0, -4);
    var dataArray = rawDataToDataArray(results.data);

    // Get user input values
    var normalizedArr = getNormalizedArr(dataArray);
    var classes = getClasses(normalizedArr);
    var objArray = convertToArrayOfObjects(normalizedArr); // better way to do this?
    var classDict = convertToClassDict(normalizedArr, classes);
    var numDimensions = d3.keys(classDict[classes[0]][0]).length;

    var featureVectorType = document.getElementById("feature-vector").value;
    var featureVector, dist_type;

    if (featureVectorType=="mean") {
        featureVector = meanFV(classDict, classes);
        dist_type = "minus"
    } 
    else if (featureVectorType=="mean_std"){
        featureVector = meanStdFV(classDict, classes);
        // dist_type = "emd"
        dist_type = document.getElementById("feature-vector-dist").value;
    } 
    else if (featureVectorType=="histogram"){
        featureVector = histFV(classDict, classes);
        // dist_type = "euclidean2d"
        // dist_type = "emd"
        dist_type = document.getElementById("feature-vector-dist").value;
    }

    // generate dist between dimensions
    var dimDistMatrix = dimensionDistMatrix(numDimensions);

    // Generate table_array
    var table_values = [];

    // correlation Matrix
    var corrMats = getCorrMats(dataArray, classes);
    // matrix to quickly compute polyline length
    var plcMat = getPlcMat(dataArray);

    // Generate all possible orderings (Partition if more than ??)
    var ordering_generator;
    if (numDimensions <=8){
        ordering_generator = permute(numberRange(0, numDimensions)); 
    }
    else{ // DO PARTITIONING HERE
        ordering_generator = permute(numberRange(0, numDimensions)); 
    }

    // Example of how to use perm gen //
    var done = false;
    var id = 1;
    while (!done){
        var perm = ordering_generator.next()
        var ordering = perm.value
        done = perm.done

        if (!done){
            var table_row = {};
            table_row["id"] = id;
            id += 1;

            table_row["ordering"] = ordering;

            var qfd = getQFD(featureVector, dimDistMatrix, classDict, dataArray.length, ordering, dist_type);
            table_row["qfd"] = qfd.toFixed(3);
            
            var corr = getCorrFromCorrMats(corrMats, classes, ordering);
            table_row["correlation"] = corr.toFixed(3);

            var mean_line_length = computeDistFromMat(plcMat, ordering);
            table_row["linedist"] = mean_line_length.toFixed(3);

            table_values.push(table_row);
        }
    }

    createTable(table_values);
}

function createTable(tableData){
    var table = new Tabulator("#example-table", {
        // layout:"fitDataFill",
        // layout:"fitDataTable",
        layout:"fitColumns",
        height:"511px",

    columns:[
    {title:"Ordering", field:"ordering", sorter:"number", frozen:true}, // frozen:true
    {title:"Total OFD", field:"qfd", sorter:"number"},
    {title:"Mean correlation", field:"correlation", sorter:"number"},
    {title:"Mean polyline distance", field:"linedist", sorter:"number"},
    ]
    });

    // table.addData([{id:1, "ordering":[0,1,2,3], qfd:345, correlation:2.3, linedist:0.6},
    //                 {id:2, "ordering":[0,1,3,2], qfd:45, correlation:12.3, linedist:0.62}], true);   

    table.addData(tableData, true);
}
