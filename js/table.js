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
    var corr_scatter_vals = [];
    var polydist_scatter_vals = [];
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
}

function createTable(tableData){
    var screen_height = screen.height/2;
    var table = new Tabulator("#example-table", {
        // layout:"fitDataFill",
        layout:"fitDataTable",
        // layout:"fitDataStretch",
        // layout:"fitColumns",
        height:screen_height+"px",

    columns:[
    {title:"Index", field:"id", sorter: "number", frozen:true},
    {title:"Ordering", field:"ordering", sorter:"string"}, // frozen:true
    {title:"Total OFD", field:"qfd", sorter:"number"},
    {title:"Mean correlation", field:"correlation", sorter:"number"},
    {title:"Mean polyline distance", field:"linedist", sorter:"number"},
    ]
    });

    // table.addData([{id:1, "ordering":[0,1,2,3], qfd:345, correlation:2.3, linedist:0.6},
    //                 {id:2, "ordering":[0,1,3,2], qfd:45, correlation:12.3, linedist:0.62}], true);   

    table.addData(tableData, true);
}


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


function saveAsSVG() {
    var svgString = getSVGString();
    var svg_text = new Blob([svgString],
        { type: "image/svg+xml;charset=utf-8" }); // type:"text/svg;charset=utf-8"
    saveAs(svg_text, "test.svg");

}

// https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
function getSVGString(){
    const xmlns = "http://www.w3.org/2000/xmlns/";
    const xlinkns = "http://www.w3.org/1999/xlink";
    const svgns = "http://www.w3.org/2000/svg";
    // var svgString = d3.select("#stringcharter").node().innerHTML; // inner or outer html? svg
    var svgString = document.getElementById("contentDiv").innerHTML;

    //add name spaces.
    svgString = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" >" + svgString + "</svg>";
    return svgString;
}