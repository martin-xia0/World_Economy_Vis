function draw_world_map()
{
    console.log("draw_world_map");
    var svg = d3.select("svg#world_map"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

    // Map and projection
    var path = d3.geoPath();
    var projection = d3.geoMercator()
      .scale(150)
      .center([0,60])
      .translate([width / 2, height / 4]);

    // Data and color scale
    var data = d3.map();
    var colorScale = d3.scaleThreshold()
      .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
      .range(d3.schemeBlues[7]);

    // Load external data and boot
    d3.queue()
      .defer(d3.json, "china.geo.json")
      .await(ready);

    function ready(error, topo) {
      console.log(topo.features);
      // Draw the map
      svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        .attr("country_code", function(d) {return d.id;})
          // draw each country
        .attr("d", d3.geoPath()
        .projection(projection)
          )
          // set the color of each country
        .attr("fill", function (d) {
            d.total = data.get(d.id) || 0;
            return colorScale(d.total);
        })
        .on("mouseover", function () {
            console.log("dianji");
            var code = d3.select(this).attr("country_code");
            var year = d3.select("#year").text();
            console.log(code);
            $.getJSON("/country/detail/"+year+"/"+code, function(result) {
                console.log(result['data']);
                draw_info(result['data'], result['country']);
                draw_bar_map(result['data'].slice(3,7));
            })
        });
    }
}

function draw_info(data, country)
{
    console.log("draw info");
    d3.select("#country_info").selectAll("h1").remove();
    d3.select("#country_info").selectAll("h4").remove();
    var text = d3.select("#country_info")
        .append("h1").text(country);
    var div = d3.select("#country_info");
    div.append("h4").text("总人口: " + data[0]['val'] + " 人");
    div.append("h4").text("国家生产总值: "+ data[1]['val'] + " 美元");
    div.append("h4").text("人均GDP: "+ data[2]['val'] + " 美元/人");
    div.append("h4").text("互联网普及率: "+ data[3]['val'] + " %");
    div.append("h4").text("女性劳动参与率: "+ data[4]['val'] + " %");
    div.append("h4").text("失业率: "+ data[5]['val'] + " %");
    div.append("h4").text("耕地比例: "+ data[6]['val'] + " %");
}

function draw_bar_map(data)
{
    console.log("draw bar_map");
    d3.select("svg#bar_map").selectAll("g").remove();
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 30, bottom: 40, left: 90},
        width = 460 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;
    // append the svg object to the body of the page

    var svg = d3.select("svg#bar_map")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    var y = d3.scaleBand()
        .range([0, height])
        .domain(data.map(function (d) {
            return d.key;
        }))
        .padding(.2);
    svg.append("g")
        .call(d3.axisLeft(y));

    //Bars
    svg.selectAll("myRect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", x(0))
        .attr("y", function (d) {
            return y(d.key);
        })
        .attr("width", function (d) {
            return x(d.val);
        })
        .attr("height", y.bandwidth())
        .attr("fill", "#9A32CD")
}

function getColor(idx) {
    var palette = [
        '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
        '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
        '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
        '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'];
    return palette[idx % palette.length];
}

function draw_pie_map(data)
{
    console.log("draw_pie");
    const oriData = data;
    const [width, height] = [300, 300];
    // 初始化一个svg元素
    let svg = d3.select("#pie_map")
        .attr("width", width)
        .attr("height", height);
    // 画图
    let pie = d3.pie().value(d => d.y);
    let drawData = pie(oriData);
    console.log(drawData);
    // 根据画布大小算一个合适的半径
    let radius = Math.min(width, height) * 0.8 / 2;
    // 准备一个弧生成器，用于根据角度生产弧路径
    let arc = d3.arc().innerRadius(0).outerRadius(radius);
    let pathParent = svg.append("g");

    // 开始着色
    let colorScale = d3.scaleOrdinal().domain(d3.range(0, oriData.length)).range(d3.schemeCategory20c);
    pathParent.selectAll("path")
        .data(drawData)
        .enter()
        .append("path")
        .attr("fill", function (d) {
            return colorScale(d.index);
        })
        .attr("d", oneData => arc(oneData));// 调用弧生成器得到路径
    pathParent.attr("transform", `translate(${width / 2}, ${height / 2})`);

    // 先算一个总数
    let sum = d3.sum(oriData, d => d.y);
    // 同样，搞一个g来承载文字标签
    let textParent = svg.append("g");
    textParent.attr("transform", `translate(${width / 2}, ${height / 2})`);
    // 生产每一个文字标签的容器
    let texts = textParent.selectAll("text")
         .data(drawData)
         .enter()
         .append("text")
         .attr("transform", function(d) {return "translate(" + arc.centroid(d) + ")";})
         .attr("text-anchor", "middle")
         .attr("font-size", "12px")
         .text(function(d) {return d.data.x+":"+(d.data.y / sum * 100).toFixed(2) + "%";})
}

function draw_pie_map2(data)
{
    console.log("draw_pie2");
    const oriData = data;
    const [width, height] = [300, 300];
    // 初始化一个svg元素
    let svg = d3.select("#pie_map2")
        .attr("width", width)
        .attr("height", height);
    // 画图

    let pie = d3.pie().value(d => d.y);
    let drawData = pie(oriData);
    console.log(drawData);
    // 根据画布大小算一个合适的半径
    let radius = Math.min(width, height) * 0.8 / 2;
    // 准备一个弧生成器，用于根据角度生产弧路径
    let arc = d3.arc().innerRadius(0).outerRadius(radius);
    let pathParent = svg.append("g");
    // 开始着色
    let colorScale = d3.scaleOrdinal().domain(d3.range(0, oriData.length)).range(d3.schemeCategory20c);
    pathParent.selectAll("path")
        .data(drawData)
        .enter()
        .append("path")
        .attr("fill", function (d) {
            return colorScale(d.index);
        })
        .attr("d", oneData => arc(oneData));// 调用弧生成器得到路径
    pathParent.attr("transform", `translate(${width / 2}, ${height / 2})`);

    // 先算一个总数
    let sum = d3.sum(oriData, d => d.y);
    // 同样，搞一个g来承载文字标签
    let textParent = svg.append("g");
    textParent.attr("transform", `translate(${width / 2}, ${height / 2})`);
    // 生产每一个文字标签的容器
    let texts = textParent.selectAll("text")
         .data(drawData)
         .enter()
         .append("text")
         .attr("transform", function(d) {return "translate(" + arc.centroid(d) + ")";})
         .attr("text-anchor", "middle")
         .attr("font-size", "12px")
         .text(function(d) {return d.data.x+":"+(d.data.y / sum * 100).toFixed(2) + "%";})
}

function refresh(year)
{
    d3.select("button").select("#year").text(year);
    $.getJSON("/global/income/"+year, function(result)
    {
        console.log(result['data']);
        draw_pie_map(result['data']);
    });
    $.getJSON("/global/pop/"+year, function(result)
    {
        console.log(result['data']);
        draw_pie_map2(result['data']);
    });
    $.getJSON("/country/detail/"+year+"/CHN", function(result)
    {
        console.log(result['data']);
        draw_bar_map(result['data'].slice(3,7));
        draw_info(result['data'], "China");
    });
}

$(document).ready(function(){
    var year = 2010;
    draw_world_map();
    // draw_bubble_map();
    // draw_pie_map();
    // draw_bar_map();
    // $.getJSON("/country_list", function(result)
    // {
    //     console.log(result)
    // });
    $.getJSON("/global/income/2013", function(result)
    {
        console.log(result['data']);
        draw_pie_map(result['data']);
    });
    $.getJSON("/global/pop/2013", function(result)
    {
        console.log(result['data']);
        draw_pie_map2(result['data']);
    });
    $.getJSON("/country/detail/2013/CHN", function(result)
    {
        console.log(result['data']);
        draw_bar_map(result['data'].slice(3,7));
        draw_info(result['data'], "China");
    });
    d3.selectAll('a').on('click', function() {
        if(year !== d3.select(this).text()){
            year = d3.select(this).text();
            console.log(year);
            refresh(year);
        }
    });
    // draw_pie_map();
    // draw_bubble_map();
    // draw_scatter_map();
});
