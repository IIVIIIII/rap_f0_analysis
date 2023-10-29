

import isos from './snippet_links.json' assert { type: "json" };
import specs from './spectral_links.json' assert { type: "json" };

let quarterScreenWidth = window.screen.width * 0.25

let begun = false



document.getElementById("leftContainer").style.width = `${quarterScreenWidth}px`


function windowRespond() {


  var svgArea = d3.select("body").selectAll("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
  }

  var margin = { top: 50, right: 50, bottom: 75, left: 50 },
    outerWidth = window.innerWidth - quarterScreenWidth,
    outerHeight = window.innerHeight,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

  console.log(window.screen.width)

  var x = d3.time.scale()
    .range([0, width]).nice();

  var y = d3.scale.linear()
    .range([height, 0]).nice();

  var xCat = "date",
    yCat = "TV";

  // console.log(Data)






  let audio = document.getElementById("sumaudio");
  function playMusic(playStatus, file) {
    if (playStatus == '1') {
      audio.src = file;
      audio.load()
      audio.play()
    }
    else {
      audio.pause()
      audio.currentTime = 0
    }

  }

  function changeText(text, file) {
    let cap = document.getElementById("figcaption")
    cap.firstChild.data = text;
    let fig = document.getElementById("spectrogram")
    fig.src = file;

  }






  d3.csv("f0_songs.csv", function (data) {

    data.forEach(function (d) {
      d.date = new Date(d.date);
      d.TV = +d.TV;
    });

    console.log(data)

    var xMax = d3.max(data, function (d) { return d[xCat]; }) * 1.01,
      xMin = d3.min(data, function (d) { return d[xCat]; }) * 0.99,
      // xMin = xMin > 0 ? 0 : xMin,
      yMax = d3.max(data, function (d) { return d[yCat]; }) * 1.05,
      yMin = 0;
    // yMin = yMin > 0 ? 0 : yMin;

    x.domain([xMin, xMax]);
    y.domain([yMin, yMax]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height);

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width);

    var color = d3.scale.category10();

    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // var welcomeDiv = d3.select("#scatter").append("div")
    //   .attr("class", "welcome")
    //   .style("opacity", 0.5)
    //   .style("width", width)
    //   .style("height", height)
    //   .style("top", 100)
    //   .style("background-color", 'white');

    var zoomBeh = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on("zoom", zoom);

    var svg = d3.select("#scatter")
      .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoomBeh);

    svg.append("rect")
      .attr("width", width)
      .attr("height", height)

    svg.append("text")
      .classed("title", true)
      .text('TOTAL F0 VARIATION OVER TIME')
      .attr("x", width / 2)
      .attr("y", -15)
      .style("text-anchor", "middle")
      .style("fill", '#666666')
      .style("opacity", 1)
      .on('click', begin);;

    svg.append("g")
      .classed("x axis", true)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .attr("fill", "white")
      .append("text")
      .classed("label", true)
      .attr("x", width / 2)
      .attr("y", margin.bottom - 35)
      .style("text-anchor", "middle")
      .text("Release Date")
      .attr("fill", "#666666");
  

    svg.append("g")
      .classed("y axis", true)
      .call(yAxis)
      .attr("fill", "white")
      .append("text")
      .classed("label", true)
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("x", -height / 2 - margin.top)
      .attr("dy", ".71em")
      .style("text-anchor", "center")
      .text('Total F0 Variation (Cents)')
      .attr("fill", "#666666");

    var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);

    // objects.append("text")
    //   .classed("title", true)
    //   .text('Total F0 Variation Over Time')
    //   .attr("x", width / 2)
    //   .attr("y", 100)
    //   .style("text-anchor", "middle")
    //   .style("fill", 'white')
    //   .style("opacity", 1)
    //   .on('click', begin);

    objects.append("svg:line")
      .classed("axisLine hAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("transform", "translate(0," + height + ")");

    objects.append("svg:line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);


    // dots
    objects.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .classed("dot", true)
      // .attr("r", function (d) { return 6 * Math.sqrt(d[rCat] / Math.PI); })
      .attr("r", 10)
      .attr("transform", transform)
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .attr("fill-opacity", .25)
      .style("fill", 'white')
      .on('mouseover', function (d, i) {
        let title = d.title
        let artist = d.artist
        let song = `${title} - ${artist}`
        // let spec_image = `${title}_-_${artist}_preview.png`.replace('(').replace(')')
        let link = isos[song]

        let spec_link = specs[song]
        console.log(song)
        console.log(link)
        d3.select(this).transition()
          .duration('100')
          .attr("fill-opacity", 1);
        div.transition()
          .duration(100)
          .style("opacity", 1);
        div.html("Song: " + d.title + "<br>" + "Artist: " + d.artist + "<br>" + "Date: " + new Date(d.date).toLocaleString().split(',')[0] + "<br>" + "Total Variation: " + Math.round(d.TV * 1000) / 1000)
          .style("left", (d3.event.pageX + 10) + "px")
          .style("top", (d3.event.pageY - 15) + "px");
        changeText(`${d.title}, ${d.artist}`, spec_link)
        playMusic(1, link)
        // playMusic(1, d.artist+'.mp3')

      })
      .on('mouseout', function (d, i) {
        d3.select(this).transition()
          .duration('300')
          .attr("fill-opacity", .25);
        div.transition()
          .duration(300)
          .style("opacity", 0);
        playMusic(0)
      });

    // .on("mouseover", tip.show)
    // .on("mouseout", tip.hide);


    // d3.select("input").on("click", change);







    // We get back an object with m (slope) and b (y intercept). Inspect the object above if you're not sure.
    let mapping = data.map(d => [new Date(d.date).getTime(), d.TV])
    let linearRegression = ss.linearRegression(mapping)
    let linearRegressionLine = ss.linearRegressionLine(linearRegression)


    const firstX = new Date(data[0].date).getTime();
    const lastX = new Date(data.slice(-1)[0].date).getTime();
    const xCoordinates = [firstX, lastX];

    let regressionPoints = xCoordinates.map(d => ({
      x: new Date(d),
      y: linearRegressionLine(d)
    }));


    objects.append("svg:line")
      .classed("regressionLine", true)
      .attr("x1", x(new Date(regressionPoints[0].x)))
      .attr("y1", y(regressionPoints[0].y))
      .attr("x2", x(new Date(regressionPoints[1].x)))
      .attr("y2", y(regressionPoints[1].y))
      .style("stroke", 'red')
      .attr("stroke-width", 2)


    if (begun == false) {
      objects.append("svg:rect")
        .classed("welcomeRect", true)
        .attr("width", width)
        .attr("height", height)
        .style("fill", 'black')
        .style('stroke', 'white')
        .style("opacity", 0.8)
        .on('mouseover', function (d, i) {
          d3.select(this).transition()
            .duration('100')
            .style("fill", "#333333");
        })
        .on('mouseout', function (d, i) {
          d3.select(this).transition()
            .duration('200')
            .style("fill", 'black');
        })
        .on('click', begin);

      objects.append("svg:text")
        .classed("welcomeText", true)
        .text('Explore the data by zooming and dragging the scatter plot.')
        .attr("x", width / 2)
        .attr("y", height / 2 - 22)
        .style("text-anchor", "middle")
        .style("fill", 'white')
        .style("opacity", 1)
        .on('click', begin);
      objects.append("svg:text")
        .classed("welcomeText", true)
        .text('Hover over datapoints to hear a snippet of their vocal audio.')
        .attr("x", width / 2)
        .attr("y", height / 2 - 0)
        .style("text-anchor", "middle")
        .style("fill", 'white')
        .style("opacity", 1)
        .on('click', begin);
      objects.append("svg:text")
        .classed("welcomeText", true)
        .text('CLICK TO BEGIN')
        .attr("x", width / 2)
        .attr("y", height / 2 + 30)
        .style("text-anchor", "middle")
        .style("fill", 'white')
        .style("opacity", 1)
        .on('click', begin);

    }













    // function change() {
    //   xCat = "Carbs";
    //   xMax = d3.max(data, function (d) { return d[xCat]; });
    //   xMin = d3.min(data, function (d) { return d[xCat]; });

    //   zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

    //   var svg = d3.select("#scatter").transition();

    //   svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCat);

    //   objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
    // }

    function zoom() {
      svg.select(".x.axis").call(xAxis);
      svg.select(".y.axis").call(yAxis);

      svg.selectAll(".dot")
        .attr("transform", transform);

      svg.selectAll(".regressionLine")
        .attr("x1", x(new Date(regressionPoints[0].x)))
        .attr("y1", y(regressionPoints[0].y))
        .attr("x2", x(new Date(regressionPoints[1].x)))
        .attr("y2", y(regressionPoints[1].y))

    }

    function transform(d) {
      // console.log(d)
      return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
    }


    function begin() {
      d3.select("body").selectAll(".welcomeText").remove()
      d3.select("body").selectAll(".welcomeRect").remove()
      begun = true
    }



  });
}


windowRespond();

var lbdPaper = d3.select("rightContainer").append("div")
.classed('lbdPaper')

lbdPaper

function buttonFunction() {
  let buttonText = button1.firstChild.data
  d3.select("body").selectAll("#scatter").remove()
  console.log(buttonText)
}

let button1 = document.getElementById("button1")

button1.onclick = buttonFunction;

d3.select(window).on("resize", windowRespond);
