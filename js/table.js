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

// Compute 
function computeTable(results){
    var startTime = performance.now();

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
        dist_type = document.getElementById("feature-vector-dist").value;
    } 
    else if (featureVectorType=="histogram"){
        featureVector = histFV(classDict, classes);
        dist_type = document.getElementById("feature-vector-dist").value;
    }

    // Calculate distances between feature vectors
    var fv_dists = classDistances(featureVector, dist_type);

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
        // partition are all of size 6
        // var max_partition_size = 6;
        // var number_partitions = Math.ceil(numDimensions/max_partition_size);

        var num_partitions;
        if (numDimensions <= 9){
            number_partitions = 2;
        }
        else if (numDimensions <= 11){
            number_partitions = 3;
        }
        else{
            number_partitions = 4;
        }

        var partition_sizes = getPartitionSizes(numDimensions, number_partitions);
        var partition_range_perms = {};

        var curr_dim = 0;
        for (var i=0; i<partition_sizes.length; i++){
            // partition_ranges.push(numberRange(curr_dim, curr_dim+partition_sizes[i]));
            var dim_range = numberRange(curr_dim, curr_dim+partition_sizes[i]);
            partition_range_perms[i]= permutator(dim_range);
            curr_dim += partition_sizes[i];
        }

        var partition_orderings = permutator(numberRange(0, number_partitions));

        ordering_generator = partition_ordering_generator(partition_range_perms, partition_orderings);
    }

    // Example of how to use perm gen //
    var done = false;
    var id = 1;
    var corr_scatter_vals = [];
    var polydist_scatter_vals = [];
    while (!done){
        var perm = ordering_generator.next();
        var ordering = perm.value;

        done = perm.done;

        if (!done){
            var table_row = {};
            table_row["id"] = id;
            id += 1;

            table_row["ordering"] = ordering;

            // var qfd = getQFD(featureVector, dimDistMatrix, classDict, dataArray.length, ordering, dist_type);
            var qfd = getQFDFast(fv_dists, dimDistMatrix, classDict, dataArray.length, ordering, classes) // ~0.8 sec faster on wine_sub.csv
            table_row["qfd"] = qfd.toFixed(4);
            
            var corr = getCorrFromCorrMats(corrMats, classes, ordering);
            table_row["correlation"] = corr.toFixed(4);
            corr_scatter_vals.push({'x':qfd, 'y':corr});

            var mean_line_length = computeDistFromMat(plcMat, ordering);
            table_row["linedist"] = mean_line_length.toFixed(4);
            polydist_scatter_vals.push({'x':qfd, 'y':mean_line_length});

            table_values.push(table_row);
        }
    }

    createTable(table_values);
    plotScatter(corr_scatter_vals, "#corr_scatter", "#0000FF", "Mean correlation"); // blue
    plotScatter(polydist_scatter_vals, "#poly_scatter", "#FF0000", "Mean polyline distance"); // red


    document.getElementById("download-corr-graph").className = "show";
    // document.getElementById("download-corr-graph").onclick = saveAsSVG;

    document.getElementById("download-poly-graph").className = "show";
    // document.getElementById("download-poly-graph").onclick = saveAsSVG;

    // time
    var endTime = performance.now();
    var timeDiff = endTime - startTime; //in ms 
    // strip the ms 
    timeDiff /= 1000; 

    console.log(timeDiff + " seconds");
}

function createTable(tableData){
    document.getElementById("download-csv").className = "show";

    var screen_height = screen.height/2;
    var table = new Tabulator("#example-table", {
        // layout:"fitDataFill",
        // layout:"fitDataTable",
        // layout:"fitDataStretch",
        layout:"fitColumns",
        height:screen_height+"px",

    columns:[
    {title:"Index", field:"id", sorter: "number", headerFilter:"input", frozen:true},
    {title:"Ordering", field:"ordering", sorter:"string", headerFilter:"input"}, // frozen:true
    {title:"Total OFD", field:"qfd", sorter:"number"},
    {title:"Mean correlation", field:"correlation", sorter:"number"},
    {title:"Mean polyline distance", field:"linedist", sorter:"number"},
    ]
    });

    // table.addData([{id:1, "ordering":[0,1,2,3], qfd:345, correlation:2.3, linedist:0.6},
    //                 {id:2, "ordering":[0,1,3,2], qfd:45, correlation:12.3, linedist:0.62}], true);   

    table.addData(tableData, true);

    //trigger download of data.csv file
    document.getElementById("download-csv").addEventListener("click", function(){
        var fname = file_name.split(".")[0] + "_metrics.csv"
        table.download("csv", fname);
    });
}

// Plot relationship between QFD and QMs
function plotScatter(data, fig_id, scatter_color, y_label){
    d3.select(fig_id).selectAll("svg").remove();

    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 40, bottom: 45, left: 60},
        // width = 460 - margin.left - margin.right,
        // height = 400 - margin.top - margin.bottom;
        width = screen.width/3 - margin.left - margin.right,
        height = screen.height/2 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(fig_id)
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");


    // Add X axis
    var x_dom = d3.extent(data, function (d) {
                    return d.x; // the plus converts string to number
                })
    var x_scale = (x_dom[1]-x_dom[0])*0.1;
    x_dom = [x_dom[0]-x_scale, x_dom[1]+x_scale];

    var x = d3.scaleLinear()
    .domain(x_dom)
    .range([ 0, width ]);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    // Add Y axis
    var y_dom = d3.extent(data, function (d) {
                return d.y; // the plus converts string to number
            })
    var y_scale = (y_dom[1]-y_dom[0])*0.1;
    y_dom = [y_dom[0]-y_scale, y_dom[1]+y_scale];

    var y = d3.scaleLinear()
    .domain(y_dom)
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    // Add dots
    svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.x); } )
      .attr("cy", function (d) { return y(d.y); } )
      .attr("r", 2)
      .style("fill", scatter_color)

    // Plot regression line
    // modified and renames linearregression library from d3 to d3reg to prevent overlap with d3v4
    var linearRegression = d3reg.regressionLinear()
   .x(d => d.x)
   .y(d => d.y);

    var res = linearRegression(data)
    let line = d3.line()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]));

    svg.append("path")
      .datum(res)
      .attr("d", line)
      .style("stroke", "black")
      .style("stroke-width", "2.5px");

    //Create Title 
    svg.append("text")
    .attr("x", width / 2 )
    .attr("y", 0)
    .style("text-anchor", "middle")
    .text(y_label + " vs QFD");

 // Add X axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width/2 + margin.left -20)
      .attr("y", height + margin.top + 20)
      .text("QFD");

  // Y axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -margin.top - height/2 + 90)
      .text(y_label)
}

// Generator for orderings
// Always has 3 or 4 partitions
function* partition_ordering_generator(partition_range_perms, partition_orderings) {
    // partition_orderings: [[0,1,2], [0,2,1], ...]
    // partition_range_perms: {0: [[0,1,2,3], [0,1,3,2], ..], 1: [[4,5,6,7], ..], 2: [[8,9,10], ...]}
    var num_partitions = Object.keys(partition_range_perms).length;

    // var number_of_orderings = Math.pow(partition_range_perms[0].length, Object.keys(partition_range_perms).length) * partition_orderings.length;
    var dim_orderings_per_partition_order = Math.pow(partition_range_perms[0].length, num_partitions);

    var partition_pos;
    var part_perm;

    partition_pos = 0;
    part_perm = [];

    if (num_partitions==2){
        for (var a=0; a<partition_orderings.length; a++){
            var partition_order = partition_orderings[a];
            var partition1 = partition_range_perms[partition_order[0]];
            var partition2 = partition_range_perms[partition_order[1]];

            // partition 1
            for (var i=0; i<partition1.length; i++){
                // Partition 2
                for (var j=0; j<partition2.length; j++){
                    yield partition1[i].concat(partition2[j]);
                }
            }
        }
    }

    else if (num_partitions==3){
        for (var a=0; a<partition_orderings.length; a++){
            var partition_order = partition_orderings[a];
            var partition1 = partition_range_perms[partition_order[0]];
            var partition2 = partition_range_perms[partition_order[1]];
            var partition3 = partition_range_perms[partition_order[2]];

            // partition 1
            for (var i=0; i<partition1.length; i++){
                // Partition 2
                for (var j=0; j<partition2.length; j++){
                    // Partition 3
                    for (var k=0; k<partition3.length; k++){
                        yield partition1[i].concat(partition2[j].concat(partition3[k]));
                    }
                }
            }
        }
    }
    // 4 partitions
    else if (num_partitions==4) {
        for (var a=0; a<partition_orderings.length; a++){
            var partition_order = partition_orderings[a];
            var partition1 = partition_range_perms[partition_order[0]];
            var partition2 = partition_range_perms[partition_order[1]];
            var partition3 = partition_range_perms[partition_order[2]];
            var partition4 = partition_range_perms[partition_order[3]];

            // partition 1
            for (var i=0; i<partition1.length; i++){
                // Partition 2
                for (var j=0; j<partition2.length; j++){
                    // Partition 3
                    for (var k=0; k<partition3.length; k++){
                        // Partition 4
                        for (var l=0; l<partition4.length; l++){
                            yield partition1[i].concat(partition2[j].concat(partition3[k].concat(partition4[l])));
                        }
                    }
                }
            }
        }
    }

// CRAPPY ATTEMPT AT RECURSION LUL
    // function* recursive(partition_pos){
    //     if (partition_pos == num_partitions){
    //         yield part_perm;
    //     }
    //     else{
    //         part_perm.push(partition_pos);
    //         yield* recursive(partition_pos+1);
    //     }
    // }
    // return recursive(partition_pos);

    // function* backtracking(partition_pos, part_perm, partition_order, partition_range_perms){
    //     if (partition_pos==num_partitions){
    //         // console.log(part_perm);
    //         yield part_perm;
    //     }
    //     else {
    //         for (var i=0; i<partition_range_perms[partition_order[partition_pos]].length; i++){
    //             var temp = part_perm.concat(partition_range_perms[partition_order[partition_pos]][i]);
    //             // console.log(partition_range_perms[partition_order[partition_pos]][i]);
    //             yield* backtracking(partition_pos+1, temp, partition_order, partition_range_perms);
    //         }
    //     }
    // }        

    // for (var a=0; a<partition_orderings.length; a++){
    //     var partition_order = partition_orderings[a];

    //     partition_pos = 0;
    //     part_perm = [];
    //     var done = false;
    //     var bt_val;
    //     while (!done){
    //         bt_val =  backtracking(partition_pos, part_perm, partition_order, partition_range_perms).next();
    //         done = bt_val.done;
    //         yield bt_val.value;
    //     }
    // };

    // for (var a=0; a<partition_orderings.length; a++){
    //     var partition_order = partition_orderings[a];
    //     console.log("A")
    //     console.log(partition_range_perms[partition_order[0]][0])
    //     partition_pos = 0;
    //     part_perm = [];
    //     return function* backtracking(partition_pos){
    //         if (partition_pos==num_partitions-1){
    //             for (var j=0; j<partition_range_perms[partition_order[partition_pos]].length; j++){
    //                 yield part_perm.concat(partition_range_perms[partition_order[partition_pos]][j]);
    //             }
    //         }
    //         else {
    //             for (var i=0; i<partition_range_perms[partition_order[partition_pos]].length; i++){
    //                 part_perm.concat(partition_range_perms[partition_order[partition_pos]][i]);
    //                 yield* backtracking(partition_pos+1);
    //             }
    //         }
    //     }
    // }(0);

}

// function save_as_svg(svg_id){
//     // fetch('path/../assets/chart.css')
//     // .then(response => response.text())
//     // .then(text => {
//         var svg_data = document.getElementById(svg_id).innerHTML
//         var head = '<svg title="graph" version="1.1" xmlns="http://www.w3.org/2000/svg">'
//         var style = "<style>" + text + "</style>"
//         var full_svg = head +  style + svg_data + "</svg>"
//         var blob = new Blob([full_svg], {type: "image/svg+xml"});  
//         saveAs(blob, "graph.svg");
//     // })
// };


// Taken from InfoViz project
function saveAsSVG(svg_id) {
    var svgString = getSVGString(svg_id);
    var svg_text = new Blob([svgString],
        { type: "image/svg+xml;charset=utf-8" }); // type:"text/svg;charset=utf-8"

    var fname = file_name.split(".")[0] + "_" + svg_id.split("_")[0] + ".svg";
    saveAs(svg_text, fname);

}

// https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
function getSVGString(svg_id){
    const xmlns = "http://www.w3.org/2000/xmlns/";
    const xlinkns = "http://www.w3.org/1999/xlink";
    const svgns = "http://www.w3.org/2000/svg";
    // var svgString = d3.select("#stringcharter").node().innerHTML; // inner or outer html? svg
    var svgString = document.getElementById(svg_id).innerHTML;

    //add name spaces.
    svgString = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" >" + svgString + "</svg>";
    return svgString;
}