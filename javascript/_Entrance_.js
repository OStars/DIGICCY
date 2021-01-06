function run() {

    // whetherUseThicknessWeight = true
    // whetherUseLengthWeight = true
    // $("#whetherUseThicknessWeight").prop("checked", whetherUseThicknessWeight)
    // $("#whetherUseLengthWeight").prop("checked", whetherUseLengthWeight)

    // useAllCtype.forEach((d, i) => {
    //     $(`#CType_${i}`).prop("checked", d)
    // })

    // useAllThicknessType.forEach((d, i) => {
    //     if (whetherUseThicknessWeight)
    //         $(`#ThicknessWeightType_${i}`).prop("checked", d)
    //     else {
    //         $(`#ThicknessWeightType_${i}`).prop("checked", false)
    //         $(`#ThicknessWeightType_${i}`).prop("disabled", true)
    //     }
    // })

    // $('#lengthThresholdLabel').text('threshold value: 1/' + lengthWeightThresholdValue)
    // $('#lengthThreshold').attr('value', lengthWeightThresholdValue)

    //this row can adjust how many graphs will be displayed on a single row
    div_width = parseFloat(d3.select("#picC").style("width").replace("px", "")) * 0.95
    // div_width = parseFloat(d3.select("#div_streamgraph").style("width").replace("px", "")) * 0.23
    // div_width = parseFloat(d3.select("#div_streamgraph").style("width").replace("px", "")) * 0.45
    // div_width = 400

    //the margin of streamgraph in the div
    margin_k = 0.95
    width = div_width * margin_k
    // width = 300
    height = 420 * margin_k * radio
    margin.left = margin.right = div_width * (1 - margin_k) / 2
    margin.top = margin.bottom = div_width * radio * (1 - margin_k) / 2
    // readLocalData(0)
    getCData(69863)
}


function readLocalData(i) {
    // if (i === 0) {
    //     d3.selectAll('svg').remove();
    // }
    d3.json(DATA_PATH[i]).then(d => {
        console.log("读取数据： " + i)
        console.log(d);
        processData(d, i, DATA_PATH[i])
        if (i < DATA_PATH.length - 1) {
            readLocalData(i + 1)
        }
    })
}

/**
 * preprocess the data, and usually it does nothing
 * @param d
 * @param index
 * @param name
 */
function processData(d, index, name) {

    currentLayers = []
    StreamGraphLength = -1;
    LayerID = 0;
    for (let i = 0; i < d.length; i++) {
        let curSize = d[i].size.slice(0)
        // console.log(curSize)
        if (d3.sum(curSize) === 0) {
            continue
        }
        currentLayers.push(new Layer(d[i].name, curSize, d[i].fillcolor));
    }
    currentLayers.reverse()
    initialLayers.push(A_Copy_Of(currentLayers));

    console.log(currentLayers)
    drawGaph(index, currentLayers, name);

}

/**
 * draw streamgraph with different parameter
 * @param index
 * @param currentLayers
 * @param name
 */
function drawGaph(index, currentLayers, name) {
    d3.select("#myGraph_svg_11").remove()
    // let graphCount = parseInt(index)*100;
    // for (let i = 0; i < useAllThicknessType.length; i++) {
    //     if (useAllThicknessType[i]) {
    //         graphCount += (i + 1) * 10
    //         currentLayers = HierarchicalClusteringOrder(currentLayers, allThicknessType[i])
    //         for (let j = 0; j < useAllCtype.length; j++) {
    //             graphCount +=j;
    //             if (useAllCtype[j]) {
    //                 currentLayers = StreamLayout_2norm_Gauss(currentLayers, allCtype[j])
    //                 let graph_draw_data = getLayersData(currentLayers)
    //                 drawStreamGraph(graph_draw_data, {
    //                     raw_layer_data: currentLayers,
    //                     text: name,
    //                     dom_id: "rightTop",
    //                     graph_count: graphCount
    //                 })
    //                 let labelsData = getLabelsData(currentLayers, graphCount);
    //                 drawGraphLabels(labelsData, graphCount)
    //             }
    //         }
    //     }
    // }

    currentLayers = HierarchicalClusteringOrder(currentLayers, /*allThicknessType[i]*/'max')
    currentLayers = StreamLayout_2norm_Gauss(currentLayers, /*allCtype[j]*/ 'median')
    let graph_draw_data = getLayersData(currentLayers)
    // console.log(graph_draw_data)
    let svg = drawStreamGraph(graph_draw_data, {
        raw_layer_data: currentLayers,
        text: name,
        dom_id: "picC",
        graph_count: 11
    })
    console.log(graph_draw_data)
    // console.log(currentLayers)
    let labelsData = getLabelsData(currentLayers, 11);
    // console.log(labelsData)
    let labels = drawGraphLabels(labelsData, 11)
    svg.call(d3.zoom().scaleExtent([1/10, 3]).on("zoom", ()=>{
            svg.attr("transform", d3.event.transform)
            labels.attr("transform", d3.event.transform)
        }))


    let paths = document.getElementById("myLayers_g_11").getElementsByTagName("path")
    for (let i = 0; i < paths.length; i++) {
        fill_colors.push(paths[i].style.fill)
        paths[i].onmouseenter = function () {
            // this.style.fill = "#DBAE6A"
            for (let j = 0; j < paths.length; j++) {
                if (j != i){
                    paths[j].style.opacity = "0.1"
                }
            }
        }
        paths[i].onmouseleave = function (){
            // this.style.fill = fill_colors[i]
            for (let j = 0; j < paths.length; j++) {
                if (j != i){
                    paths[j].style.opacity = "1"
                    // paths[j].style.fill = fill_colors[j]
                }
            }
        }
        paths[i].onclick = function () {
            if (clickFlag==-1){
                let preWidth = document.getElementById("picC").clientWidth
                document.getElementById("picC").style.width = preWidth / 2 + "px"
                run()
                clickFlag = i
                console.log(clickFlag)
                document.getElementById("otherPicC").style.display = "block"
                document.getElementById("back").style.display = "block"
                drawOtherC(testData)
            }else if (clickFlag == i){
                let preWidth = document.getElementById("picC").clientWidth
                document.getElementById("picC").style.width = preWidth * 2 + "px"
                run()
                clickFlag = -1
                document.getElementById("otherPicC").style.display = "none"
                document.getElementById("back").style.display = "none"
            }
        }
    }

}


// /**
//  * 上传文件之后，更改input的文本内容，显示文件名
//  */
// function changeFileName() {
//     let resultFileName = document.getElementById("uploadFile").files[0].name;
//     d3.select("#uploadFileName").text(resultFileName)
// }

/**
 * 读取文件
 */
// function readFile() {
//     let resultFile = document.getElementById("uploadFile").files[0];
//     if (resultFile) {
//         let reader = new FileReader();
//         reader.readAsText(resultFile, 'UTF-8');
//         reader.onload = function (e) {
//             let urlData = this.result;
//             let data = JSON.parse(urlData)
//             initialLayers = [];
//             d3.select("#div_streamgraph").selectAll("svg").remove()
//             let resultFileName = d3.select("#uploadFileName").text()
//             let thisFile_Name = d3.select("#uploadFileName").text(resultFileName.replace(".json", ""))
//             processData(data, 0, resultFileName)
//         };
//     }
// }
//
//
// function change_WhetherUseThicknessWeight() {
//     whetherUseThicknessWeight = !whetherUseThicknessWeight
//     if (!whetherUseThicknessWeight) {
//         useAllThicknessType.forEach((d, i) => {
//             $(`#ThicknessWeightType_${i}`).prop("checked", false)
//             $(`#ThicknessWeightType_${i}`).prop("disabled", true)
//         })
//     } else {
//         useAllThicknessType.forEach((d, i) => {
//             $(`#ThicknessWeightType_${i}`).prop("disabled", false)
//             $(`#ThicknessWeightType_${i}`).prop("checked", d)
//         })
//     }
// }
//
// function change_WhetherUseLengthWeight() {
//     whetherUseLengthWeight = !whetherUseLengthWeight
//     $('#lengthThreshold').prop('disabled', !whetherUseLengthWeight)
// }
//
// function changeCType(i) {
//     useAllCtype[i] = !useAllCtype[i]
// }
//
// function changeThicknessWeightType(i) {
//     useAllThicknessType[i] = !useAllThicknessType[i]
// }
//
// function changeLengthThreshold(v) {
//     lengthWeightThresholdValue = parseInt(v)
//     $('#lengthThresholdLabel').text('threshold value: 1/' + v)
// }