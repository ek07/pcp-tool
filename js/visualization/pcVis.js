/**
 * slightly altered version of the parallel coordinates visualization by Mike Bostock
 * link: https://bl.ocks.org/mbostock/7586334
 */

function pcVis(data, dataDict, classes, current_pcp_id) {
    // var numCols = 3;
    console.log("Win width(px): " + $(window).width());
    
    var m = [30, 50, 10, 10], //margin: top, right, bottom, left
        // w = 550 - m[1] - m[3], // orig: 960
        w = 650 - m[1] - m[3];
        h = 400 - m[0] - m[2], // orig: 500
        title_spacing = 40;

    var x = d3.scale.ordinal().rangePoints([0, w], 1),
        y = {},
        dragging = {};

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        background,
        foreground;

    // document.getElementById("targetPC").className = "grid";
    // document.getElementById("dim-div").className = "show";
    var dim_order;
    var dim_length = d3.keys(dataDict[classes[0]][0]).length;

    var dim_or = `dim-order${current_pcp_id}`;
    console.log(dim_or)
    var dim_order_string = document.getElementById(dim_or).value;

    if (dim_order_string == ""){
        dim_order = numberRange(0, dim_length);
        document.getElementById(dim_or).value=numberRangeToString(dim_order);
    } else{
        dim_order = stringToNumberRange(dim_order_string);

        if (!dimOrderValid(dim_order, dim_length)){
            alert("Invalid dim order.");
            return false;
        }
    }

    // clear old plots
    d3.select(`#targetPC${current_pcp_id}`).selectAll("div").remove();
    
    // Colors for different classes
    var colours = d3.scale.category10();
    var reordered_data = reorder_whole_ds(data, dim_order);

    for (i=0; i<classes.length; i++){
        class_name = classes[i];
        var dataset_orig = dataDict[class_name];

        var dataset = reorder_data(dataset_orig, dim_order);

        // Extract the list of dimensions and create a scale for each.
        // this normalizes the values
        x.domain(dimensions = d3.keys(dataset[0]).filter(function (d) {
            return d !== "class" && (y[d] = d3.scale.linear()
                .domain(d3.extent(reordered_data, function (p) {
                    return +p[d]; // the plus converts string to number
                }))
                .range([h, 0]));
        }));

        var targetPC = `#targetPC${current_pcp_id}`;

        var svg = d3.select(targetPC).append("div")
            .attr("class", "pc")
            .append("svg")
            .attr("width", w + m[1] + m[3])
            .attr("height", h + m[0] + m[2] + title_spacing)
            .append("g")
            .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

        // Add class name
        name = svg.append("g")
            .append("text")
            .text(class_name)
            .attr("x", "50%")
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .attr("font-size", 18);

        // Add grey background lines for context.
        background = svg.append("g")
            .attr("class", "background")
            .selectAll("path")
            .data(dataset)
            .enter().append("path")
            .attr("d", path)
            .attr("transform", function (d) {
                return "translate(0, " + title_spacing + ")";
            });

        // Add foreground lines for focus.
        foreground = svg.append("g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(dataset)
            .enter().append("path")
            .attr("d", path)
            .attr("stroke", colours(i%10))
            .attr("transform", function (d) {
                return "translate(0, " + title_spacing + ")";
            });

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function (d) {
                return "translate(" + x(d) + "," + title_spacing + ")";
            });
            // .call(d3.behavior.drag()
            //     .on("dragstart", function (d) {
            //         dragging[d] = this.__origin__ = x(d);
            //         background.attr("visibility", "hidden");
            //     })
            //     .on("drag", function (d) {
            //         dragging[d] = Math.min(w, Math.max(0, this.__origin__ += d3.event.dx));
            //         foreground.attr("d", path);
            //         dimensions.sort(function (a, b) {
            //             return position(a) - position(b);
            //         });
            //         x.domain(dimensions);
            //         g.attr("transform", function (d) {
            //             return "translate(" + position(d) + "," + title_spacing + ")";
            //         })
            //     })
            //     .on("dragend", function (d) {
            //         delete this.__origin__;
            //         delete dragging[d];
            //         transition(d3.select(this)).attr("transform", "translate(" + x(d) + "," + title_spacing + ")");
            //         transition(foreground)
            //             .attr("d", path);
            //         background
            //             .attr("d", path)
            //             .transition()
            //             .delay(500)
            //             .duration(0)
            //             .attr("visibility", null);
            //     }));


        // Add an axis and title.
        g.append("g")
            .attr("class", "axis")
            .each(function (d) {
                d3.select(this).call(axis.scale(y[d]));
            })
            .append("text")
            .attr("text-anchor", "middle")
            .attr("y", -9)
            .text(String);

        // // Add and store a brush for each axis.
        // g.append("g")
        //     .attr("class", "brush")
        //     .each(function (d) {
        //         d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
        //     })
        //     .selectAll("rect")
        //     .attr("x", -8)
        //     .attr("width", 16);

    }

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function (p) {
            return [position(p), y[p](d[p])];
        }));
    }

    // When brushing, don’t trigger axis dragging.
    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        var actives = dimensions.filter(function (p) {
                return !y[p].brush.empty();
            }),
            extents = actives.map(function (p) {
                return y[p].brush.extent();
            });
        foreground.style("display", function (d) {
            return actives.every(function (p, i) {
                return extents[i][0] <= d[p] && d[p] <= extents[i][1];
            }) ? null : "none";
        });
    }
    return dim_order;
}
