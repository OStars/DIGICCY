function drawTimeLine(){
    let padding = 15;
    let div_width = parseFloat(d3.select("#rightTop").style("width").replace("px", ""))*0.95;
    let height = 90;
    let dataset = [];
    let width = div_width*0.95
    let margin = div_width * (1-0.95) / 2
    let height_bottom = 46

    for (let i = 1; i <= 72; i++) {
        dataset.push({x: i, y: Math.random()*101})
    }

    // let color = "#31A02C";
    let color = "#394908";

    let x_max = d3.max(dataset, function (data){
        return data.x;
    })

    let y_max = 100

    let svg = d3.select("#timeLine")
        .append("svg")
        .attr("width", div_width)
        .attr("height",height)
        .style("position", "absolute")
        .style("left", margin)
        // .style("margin-left", 30)

    let svg_bottom = d3.select("#timeLineSelect")
        .append("svg")
        .attr("width", div_width)
        .attr("height", height_bottom)
        .style("position", "absolute")
        .style("left", margin)
        // .style("margin-left", 30)

    //Create scale functions
    let xScale = d3.scaleLinear()   //线性比例尺
        .domain([0, x_max])
        // .range([padding*2, width - padding * 1.5]);
        // .range([0, div_width*0.95]);
        .range([30, 785+30]);

    let xScale_bottom = d3.scaleLinear()   //线性比例尺
        .domain([0, x_max])
        // .range([padding*2, width - padding * 1.5]);
        // .range([0, div_width*0.95]);
        .range([30, 785+30]);

    let yScale = d3.scaleLinear()
        .domain([0, y_max])
        .range([height - padding * 0.9, padding * 1.1]);

    let yScale_bottom = d3.scaleLinear()
        .domain([0, y_max])
        .range([height_bottom - 15, 5]);

    //创建x轴和y轴
    let xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(x_max / 10);  //自动最优化
    let xAxis_bottom = d3.axisBottom()
        .scale(xScale_bottom)
        .ticks(x_max / 10);  //自动最优化

    let yAxis=d3.axisLeft()
        .scale(yScale)
        .ticks(5);

    svg.append("g")
        .attr("class", "x_Axis")
        .attr("transform", "translate(0," + (height - padding * 0.9) + ")")
        .style("overflow", "hidden")
        .call(xAxis); //call会取得传递过来的元素，把他交给其他函数
    svg_bottom.append("g")
        .attr("class", "x_Axis")
        .attr("transform", "translate(0," + (height_bottom - 15) + ")")
        .call(xAxis_bottom); //call会取得传递过来的元素，把他交给其他函数

    svg.append("g")
        .attr("class","y_Axis")
        // .attr("transform","translate(" + margin*2 + ",0)")
        .attr("transform","translate(30,0)")
        .call(yAxis);

    let line = d3.line()
        .x(function(d) {
            return xScale(d.x)
        })
        .y(function(d) {
            return yScale(d.y);
        });
    let line_bottom = d3.line()
        .x(function(d) {
            return xScale_bottom(d.x)
        })
        .y(function(d) {
            return yScale_bottom(d.y);
        });

    let linePic = svg.append("g")

    linePic.append('path')
        .attr('class', 'line')
        .attr('d', line(dataset))
        .attr("fill","none")
        .attr("stroke", color)
        // .attr("transform", "translate("+margin*2+", 0)")
        .attr("stroke-width","2");

    svg_bottom.append('path')
        // .attr('class', 'line')
        .attr('d', line_bottom(dataset))
        .attr("fill","none")
        .attr("stroke", color)
        // .attr("transform", "translate("+margin*2+", 0)")
        .attr("stroke-width","2");

    svg.append('text')
        .text("交易时间")
        .attr("x",div_width-margin)
        .attr("y",height-padding*1.2)
        .attr("text-anchor","middle")  //x表示文本的居中位置
        .attr("font-family", "sans-serif")
        .attr("font-size", "7px")
        .attr("fill", "black")
        .attr("font-weight","bold");
    svg_bottom.append('text')
        .text("交易时间")
        .attr("x",div_width-margin)
        .attr("y",height_bottom-5)
        .attr("text-anchor","middle")  //x表示文本的居中位置
        .attr("font-family", "sans-serif")
        .attr("font-size", "7px")
        .attr("fill", "black")
        .attr("font-weight","bold");

    svg.append('text')
        .text("洗钱值")
        .attr("x", padding*1.5)
        .attr("y", 0.7*padding)
        .attr("text-anchor","middle")  //x表示文本的居中位置
        .attr("font-family", "sans-serif")
        .attr("font-size", "7px")
        .attr("fill", "black")
        .attr("font-weight","bold");

    const brush = d3.brushX()
        // .extent([[margin, 0], [div_width-margin, height_bottom-15]])
        .extent([[30, 0], [785+30, height_bottom-15]])
        .on("brush", ()=>{
            const selection = d3.event.selection
            // let x = [selection[0][0], selection[1][0]]
            // let y = [selection[0][1], selection[1][1]]
            // console.log(selection)
            // console.log(selection.map(xScale.invert, xScale))
            // xScale.domain(x.map(xScale.invert, xScale))
            // yScale.domain(y.map(yScale.invert, yScale))
            xScale.domain(selection.map(xScale_bottom.invert, xScale_bottom))
            // line.x = (d)=>{return xScale(d.x)}
            linePic.select(".line")
                .attr("d", line(dataset))
            svg.select(".x_Axis").call(xAxis)
            // svg.select(".y_Axis").call(yAxis)
        })

    svg_bottom.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, xScale.range())
}

function drawC(){
    div_width = parseFloat(d3.select("#rightTop").style("width").replace("px", "")) * 0.95
    // div_width = parseFloat(d3.select("#div_streamgraph").style("width").replace("px", "")) * 0.23
    // div_width = parseFloat(d3.select("#div_streamgraph").style("width").replace("px", "")) * 0.45
    // div_width = 800
    console.log(div_width);

    //the margin of streamgraph in the div
    margin_k = 0.95
    width = div_width * margin_k
    height = 420 * margin_k * radio
    margin.left = margin.right = div_width * (1 - margin_k) / 2
    margin.top = margin.bottom = div_width * radio * (1 - margin_k) / 2
    readLocalData(0)
}

let testData;
function chooseMember(member_id){
    console.log(member_id)
    $.ajax({
        //访问服务器。从本地服务器跳转到远程访问的服务器
        // url: "http://182.92.122.230/whole_data/member_id=69863&create_time=80",
        // url: "http://182.92.122.230/member_id=69863&create_time=1&data_type=3_amount",
        url: "http://182.92.122.230/whole_data_for_one_member/member_id="+member_id,
        type: "get",
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "callback",
        data: {},
        success: function (data) {
            let res = []
            for (let i = 1; i <= 72; i++) {
                let ob = {'member_id': member_id, 'create_time': i}
                for (const key in data[0]) {
                    if (key != "member_id" && key != "create_time"){
                        ob[key] = 0
                    }
                }
                res.push(ob)
            }
            for (const datum of data) {
                res[datum.create_time-1] = datum;
            }
            console.log(res)
            d3.selectAll("#picB svg").remove();
            drawB(res)
            testData = res
        },
        error: function (err){
            console.log(err)
        }
        // complete: function (xhr, ts){
        //     console.log(xhr)
        //     console.log(ts)
        // }
    });
}

function drawB(dataset){
    let padding = 20;
    let width = 310;
    let height = 100;
    let colors = ["#FFCC99", "#99CCCC", "#FFCCCC", "#CCCCFF",
                "#CC99CC", "#FF9933", "#99CC99", "#993333",
                "#FFCC33", "#FF9966", "#FFFFCC", "#CC9966",
                "#663300", "#006633", "#CC6600", "#996633",
                "#7F44D6", "#65016C", "#4D54D8", "#080E73",
                "#009D91", "#A64800", "#8D003B", "#EC3B86"]

    // let color = "#31A02C"
    let color = "#394908"
    let keys = []
    for (const key in dataset[0]) {
        if (key != "member_id" && key != "create_time")
        keys.push(key)
    }

    let names = ["A", "T", "Avg", "Freq", "Diff", "Coef", "PropA", "PropT", "IntA",
            "D", "Countn", "PropT", "S", "PropS", "C2CT", "C2CP", "C2CCoin", "C2CFreq"]
    let index = 0

    let x_max = d3.max(dataset, function (data){
        return data.create_time;
    })

    for (const key of keys) {
        let arr_key = dataset.map(d => +d[key])
        let y_max = d3.max(arr_key)
        let y_min = d3.min(arr_key)

        // console.log(arr_key)
        // console.log(key + ", " + y_min + ", " +y_max)

        let svg = d3.select("#picB")
            .append("svg")
            .attr("width", width)
            .attr("height",height);

        //Create scale functions
        let xScale = d3.scaleLinear()   //线性比例尺
            .domain([0, x_max])
            .range([padding*2, width - padding * 2]);

        let yScale = d3.scaleLinear()
            .domain([y_min, y_max])
            .range([height - padding, padding]);

        //创建x轴和y轴
        let xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(x_max / 10);  //自动最优化

        let yAxis=d3.axisLeft()
            .scale(yScale)
            .ticks(5);

        svg.append("g")
            .attr("class", "x_Axis")
            .attr("transform", "translate(0," + (height - padding) + ")")
            .call(xAxis); //call会取得传递过来的元素，把他交给其他函数

        svg.append("g")
            .attr("class","y_Axis")
            .attr("transform","translate(" + padding*2 + ",0)")
            .call(yAxis);

        let line = d3.line()
            .x(function(d) {
                return xScale(d.create_time)
            })
            .y(function(d) {
                return yScale(d[key]);
            });

        svg.append('path')
            // .attr('class', 'line')
            .attr('d', line(dataset))
            .attr("fill","none")
            .attr("stroke", /*colors[Math.floor(Math.random() * 26)]*/ color)
            .attr("stroke-width","2");

        svg.append('text')
            .text("交易时间")
            .attr("x",width-1.5*padding)
            .attr("y",height-padding*1.2)
            .attr("text-anchor","middle")  //x表示文本的居中位置
            .attr("font-family", "sans-serif")
            .attr("font-size", "7px")
            .attr("fill", "black")
            .attr("font-weight","bold");

        let big = svg.append('text')
            .text(names[index])
            .attr("x", padding*1.5)
            .attr("y", 0.6*padding)
            .attr("text-anchor","middle")  //x表示文本的居中位置
            .attr("font-family", "sans-serif")
            .attr("font-size", "9px")
            .attr("fill", "black")
            .attr("font-weight","bold");

        svg.append('text')
            .text("in")
            .attr("x", padding*1.5+big._groups[0][0].getBoundingClientRect().width/2)
            .attr("y", 0.6*padding)
            // .attr("text-anchor","middle")  //x表示文本的居中位置
            .attr("font-family", "sans-serif")
            .attr("font-size", "6px")
            .attr("fill", "black")
            .attr("font-weight","bold");

        // console.log(big._groups[0][0].getBoundingClientRect())
        index++
    }
}
function drawOtherC(dataset){
    d3.select("#otherC").remove()
    let padding = 20;
    let width = document.getElementById("otherPicC").clientWidth;
    let height = document.getElementById("otherPicC").clientHeight;
    let colors = ["#FFCC99", "#99CCCC", "#FFCCCC", "#CCCCFF",
                "#CC99CC", "#FF9933", "#99CC99", "#993333",
                "#FFCC33", "#FF9966", "#FFFFCC", "#CC9966",
                "#663300", "#006633", "#CC6600", "#996633",
                "#7F44D6", "#65016C", "#4D54D8", "#080E73",
                "#009D91", "#A64800", "#8D003B", "#EC3B86"]

    let color = "#31A02C"
    let keys = []
    for (const key in dataset[0]) {
        if (key != "member_id" && key != "create_time")
        keys.push(key)
    }

    let x_max = d3.max(dataset, function (data){
        return data.create_time;
    })

    let arr_key = dataset.map(d => +d['f1'])
    let y_max = d3.max(arr_key)
    let y_min = d3.min(arr_key)

    // console.log(arr_key)
    // console.log(key + ", " + y_min + ", " +y_max)

    let svg = d3.select("#otherPicC")
        .append("svg")
        .attr("id", "otherC")
        .attr("width", width)
        .attr("height",height);

    //Create scale functions
    let xScale = d3.scaleLinear()   //线性比例尺
        .domain([0, x_max])
        .range([padding*2, width - padding * 2]);

    let yScale = d3.scaleLinear()
        .domain([y_min, y_max])
        .range([height - padding, padding]);

    //创建x轴和y轴
    let xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(x_max / 10);  //自动最优化

    let yAxis=d3.axisLeft()
        .scale(yScale)
        .ticks(5);

    svg.append("g")
        .attr("class", "x_Axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis); //call会取得传递过来的元素，把他交给其他函数


    svg.append("g")
        .attr("class","y_Axis")
        .attr("transform","translate(" + padding*2 + ",0)")
        .call(yAxis);

    let line = d3.line()
        .x(function(d) {
            return xScale(d.create_time)
        })
        .y(function(d) {
            return yScale(d['3_amount']);
        });

    svg.append('path')
        // .attr('class', 'line')
        .attr('d', line(dataset))
        .attr("fill","none")
        .attr("stroke", /*colors[Math.floor(Math.random() * 26)]*/ color)
        .attr("stroke-width","2");

    svg.append('text')
        .text("交易时间")
        .attr("x",width-1.5*padding)
        .attr("y",height-padding*1.2)
        .attr("text-anchor","middle")  //x表示文本的居中位置
        .attr("font-family", "sans-serif")
        .attr("font-size", "7px")
        .attr("fill", "black")
        .attr("font-weight","bold");

    // svg.append('text')
    //     .text("3_amount")
    //     .attr("x", padding*1.5)
    //     .attr("y", 0.6*padding)
    //     .attr("text-anchor","middle")  //x表示文本的居中位置
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", "9px")
    //     .attr("fill", "black")
    //     .attr("font-weight","bold");

    let big = svg.append('text')
        .text("USDT")
        .attr("x", padding*1.5)
        .attr("y", 0.6*padding)
        .attr("text-anchor","middle")  //x表示文本的居中位置
        .attr("font-family", "sans-serif")
        .attr("font-size", "9px")
        .attr("fill", "black")
        .attr("font-weight","bold");

    // svg.append('text')
    //     .text("in")
    //     .attr("x", padding*1.5+big._groups[0][0].getBoundingClientRect().width/2)
    //     .attr("y", 0.6*padding)
    //     // .attr("text-anchor","middle")  //x表示文本的居中位置
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", "6px")
    //     .attr("fill", "black")
    //     .attr("font-weight","bold");

}

/*
* up 是否上拨
*
* usdt 交易额
* pre 原始交易额
* time 交易时间
* pre_time
* type 交易类型
* symbol 交易币种
* count 合并的交易次数
* event 特殊事件
* symbol_new 币币交易后的币种
* */
let behaviors = []
let centers = []
function drawD(up, usdt, pre, time, pre_time, type, symbol, count, index, event=null, symbol_new) {
    let length = timeToLengthMap(time, pre_time);
    let color = symbolToColorMap(symbol)
    let item = typeToItemMap(type)
    console.log(index)

    let content = '<div class="behavior">\n' +
        '                                <div class="pole"></div>\n' +
        '                                <div class="usdt"></div>\n' +
        '                                <div class="pre"></div>\n' +
        '                                <div class="buy">\n' +
        '                                    <div class="light"></div>\n' +
        '                                </div>\n' +
        '                                <div class="charge">\n' +
        '                                    <div class="light"></div>\n' +
        '                                </div>\n' +
        '                                <div class="change">\n' +
        '                                    <div class="light"></div>\n' +
        '                                </div>\n' +
        '                                <div class="sell">\n' +
        '                                    <div class="light"></div>\n' +
        '                                </div>\n' +
        '                                <div class="withdraw">\n' +
        '                                    <div class="light"></div>\n' +
        '                                </div>\n' +
        '                            </div>'

    let obj = $(content)
    $("#picD").append(obj);
    console.log(obj)
    obj.find(".usdt").css("top", "calc(30% - 8px - "+amountToHeightMap(0)+"px)")
    obj.find(".pre").css("top", "calc(30% - 8px - "+amountToHeightMap(0)+"px)")
    let preLeft = 15
    if (index != 0) {
        preLeft = Number(document.getElementsByClassName("behavior")[index-1].style.left.replace("px", ""))
    }
    // obj.style("left", preLeft + length + "px")
    if (index != 0){
        document.getElementsByClassName("behavior")[index].style.left = preLeft + length + "px"
    }else{
        document.getElementsByClassName("behavior")[index].style.left = preLeft + "px"
    }
    document.getElementsByClassName(item)[index].style.backgroundColor = randomColor()
    if (count != 1){
        document.getElementsByClassName(item)[index].innerHTML = count
    }else{
        document.getElementsByClassName(item)[index].innerHTML = ""
    }
    let y = Number(obj.find("."+item).css("top").replace("px", ""))+15
    let x
    if (index != 0){
        x = preLeft + length + 23
    }else{
        x = preLeft + 23
    }
    let center = {
        "x": x,
        "y": y
    }
    if (event != null){
        let turn = typeTurn(type)
        if (turn!=0){
            obj.children("div").slice(3, turn+1).addClass("up not")
            // console.log(obj.children("div"))
            center['yUp'] = y - 72
        }
    }
    centers.push(center)
    if (type == 3){
        let new_color = symbolToColorMap(symbol_new)
        let child = '<div class="left" style="background-color: '+randomColor()+'"></div>\n' +
            '        <div class="right"  style="background-color: '+randomColor()+'"></div>'
        obj.find(".change").html($(child))
    }
}

// drawD(false, 0, 0,"2020, 12, 20", "2020, 12, 19", 1, "usdt", 1, 2)

function drawDLine(up){
    let canvas = document.getElementById("behaviorLine");
    canvas.width = document.getElementById("picD").scrollWidth
    canvas.height = document.getElementById("picD").scrollHeight
    let context = canvas.getContext("2d")
    context.strokeStyle = "#A7A7A7"

    if (up && centers[0].yUp){
        context.moveTo(centers[0].x, centers[0].yUp)
    }else{
        context.moveTo(centers[0].x, centers[0].y)
    }
    for (let i = 1; i < centers.length; i++) {
        if (up && centers[i].yUp){
            context.lineTo(centers[i].x, centers[i].yUp)
        }else{
            context.lineTo(centers[i].x, centers[i].y)
        }
    }
    context.stroke()
}

function amountToHeightMap(amount) {
    return Math.random()*75
}

function timeToLengthMap(time, preTime){
    let timeToLength = {
        "seconds": 23,
        "minutes": 33,
        "hour": 46,
        "day": 69,
        "week": 92,
        "month": 115,
        "season": 138,
        "year": 161,
        "other": 184
    }
    // let timeDiff = new Date(time).getTime() - new Date(preTime).getTime()
    let timeDiff = time.getTime() - preTime.getTime()
    console.log(timeDiff)
    let length = 0
    if (timeDiff < 1000){
        length = timeToLength['seconds']
    }else if (timeDiff < 1000 * 60){
        length = timeToLength['minutes']
    }else if (timeDiff < 1000 * 60 * 60){
        length = timeToLength['hour']
    }else if (timeDiff < 1000 * 60 * 60 * 24){
        length = timeToLength['day']
    }else if (timeDiff < 1000 * 60 * 60 * 24 * 7){
        length = timeToLength['week']
    }else if (timeDiff < 1000 * 60 * 60 * 24 * 7 * 4){
        length = timeToLength['month']
    }else if (timeDiff < 1000 * 60 * 60 * 24 * 7 * 4 * 3){
        length = timeToLength['season']
    }else if (timeDiff < 1000 * 60 * 60 * 24 * 7 * 4 * 3 * 4){
        length = timeToLength['year']
    }else{
        length = timeToLength['other']
    }

    return length
}

function symbolToColorMap(symbol){
    let color = "#B2E08A"

    return color
}

function typeToItemMap(type){
    if (type == 0){
        return "charge"
    }else if (type == 1){
        return "withdraw"
    }else if (type == 3){
        return "change"
    }else if (type == 4){
        return "buy"
    }else if (type == 5){
        return "sell"
    }
}

function typeTurn(type){
    switch (type){
        case 4: return 3;
        case '4': return 3;
        case 0: return 4;
        case '0': return 4;
        case 3: return 5;
        case '3': return 5;
        case 5: return 6;
        case '5': return 6;
        case 1: return 7;
        case '1': return 7;
        default: return 0
    }
}

function randomColor() {
    let colors = ["rgb(49,160,44)", "rgb(166,206,228)", "rgb(202,178,214)",
        "rgb(229,45,37)", "rgb(49,160,44)", "rgb(255,255,154)",
        "rgb(178,224,138)", "rgb(254,190,111)", "rgb(32,120,180)",
        "rgb(254,190,111)"]

    return colors[Math.floor(Math.random()*10)]
}



