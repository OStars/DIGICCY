/**
 * draw layers' labels on graph
 * @param labelsData
 * @param graphIndex
 */
function drawGraphLabels(labelsData, graphIndex) {
    d3.select("#" + "myGraph_svg_" + graphIndex)
        .select("#" + "myLabels_g_" + graphIndex)
        .remove()

    console.log(labelsData)
    let labels_g = d3.select("#" + "myGraph_svg_" + graphIndex)
        .append("g")
        .attr("id", "myLabels_g_" + graphIndex)
        // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    labels_g.selectAll("text")
        .data(labelsData)
        .enter()
        .append("text")
        .attr("id", d => ("myLabels_g_" + graphIndex + "_" + d.id))
        .style("font-size", d => (d.fontsize + "px"))
        .style("font-family", "黑体")
        .style("fill", d => d.lableColor)
        .style("fill-opacity", d => d.opacity)
        .style("top", margin.top)
        .style("left", margin.left * 2)
        .attr('label_opacity', d => d.opacity)
        .attr("x", d => d.x - d.width / 2)
        .attr("y", d => d.y)
        .text(d => d.name)
        .attr("dominant-baseline", "middle")

    return labels_g
}

/**
 * draw streamgraph
 * @param layersData
 * @param options
 */
function drawStreamGraph(layersData, options = {
    raw_layer_data: "",
    text: "",
    dom_id: "picC",
    graph_count: 1
}) {
    // append the svg object to the body of the page
    console.log(div_width)

    d3.select("#" + options.dom_id)
        .append("svg")
        .attr("id", "myGraph_svg_" + options.graph_count)
        .attr("width", div_width)
        .attr("height", 230)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("version", "1.1")
        .style("position", "absolute")
        .style("top", 12)
        .style("left", margin.left)

    let svg = d3.select("#" + "myGraph_svg_" + options.graph_count)
        .append("g")
        .attr("id", "myLayers_g_" + options.graph_count)

    // function zoomed(){
    //     d3.select("#myGraph_svg_11").attr("transform", d3.event.transform)
    // }

    //draw layers
    svg.selectAll("#myGraph_svg_11 path")
        .data(layersData)
        .enter()
        .append("path")
        // .attr("pathType", "mylayers")
        .style("fill", function (d) {
            // return rgb2hex(d.fillcolor);
            return d.fillcolor;
        })
        .style("fill-opacity", 1)
        .style("stroke", function (d) {
            return "white";
        })
        .style("stroke-width", function (d) {
            return 0;
        })
        // .style("opacity", 0.7)
        .attr("name", function (d) {
            return d.name
        })
        .attr("d", LayersArea)

    console.log(linearX.range())

    // d3.select("#" + "myGraph_svg_" + options.graph_count)
    //     .append('text')
    //     .text(options.text.replace("./data/allData/",""))
    //     .attr("x", margin.left)
    //     .attr('y', margin.top+height/30)
    //     .style('font-size', '1rem')
    //     .attr("transform",
    //         "translate(" + margin.left + "," + (margin.top) + ")");

    return svg
}
