

import isos from './snippet_links.json' assert { type: "json" };
import specs from './spectral_links.json' assert { type: "json" };


function windowRespond() {


  var svgArea = d3.select("body").selectAll("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
  }

  var margin = { top: 50, right: 50, bottom: 50, left: 50 },
      outerWidth = window.innerWidth*0.75,
      outerHeight = window.innerHeight,
      width = outerWidth - margin.left - margin.right,
      height = outerHeight - margin.top - margin.bottom;

  var x = d3.time.scale()
      .range([0, width]).nice();

  var y = d3.scale.linear()
      .range([height, 0]).nice();

  var xCat = "date",
      yCat = "TV";

  // var data = []
  // d3.csv("f0_songs.csv", (d) => {
  //   data.push(d)
  // })

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





  
  d3.csv("f0_songs.csv", function(data) {
    data.forEach(function(d) {
      d.date = new Date(d.date);
      d.TV = +d.TV;
    });

    var xMax = d3.max(data, function(d) { return d[xCat]; }) * 1.01,
        xMin = d3.min(data, function(d) { return d[xCat]; }) * 0.99,
        // xMin = xMin > 0 ? 0 : xMin,
        yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05,
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
        .attr("height", height);

    svg.append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .attr("fill", "white")
      .append("text")
        .classed("label", true)
        .attr("x", width)
        .attr("y", margin.bottom - 10)
        .style("text-anchor", "end")
        .text(xCat)
        .attr("fill", "white");

    svg.append("g")
        .classed("y axis", true)
        .call(yAxis)
        .attr("fill", "white")
      .append("text")
        .classed("label", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yCat)
        .attr("fill", "white");

    var objects = svg.append("svg")
        .classed("objects", true)
        .attr("width", width)
        .attr("height", height);

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
          let artist = d.artist.replace(/ /g, "_").replace("", "").replace('.', '')
          let title = d.title.replace(/ /g, "_").replace("", "").replace('.', '')
          let song = `${title}_-_${artist}_preview.wav`.replace('(').replace(')')
          let spec_image = `${title}_-_${artist}_preview.png`.replace('(').replace(')')
          let link = isos[song]
          
          let spec_link = specs[spec_image]
          console.log(song)
          console.log(spec_link)
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

    d3.select("input").on("click", change);





    function change() {
      xCat = "Carbs";
      xMax = d3.max(data, function(d) { return d[xCat]; });
      xMin = d3.min(data, function(d) { return d[xCat]; });

      zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

      var svg = d3.select("#scatter").transition();

      svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCat);

      objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
    }

    function zoom() {
      svg.select(".x.axis").call(xAxis);
      svg.select(".y.axis").call(yAxis);

      svg.selectAll(".dot")
          .attr("transform", transform);
    }

    function transform(d) {
      return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
    }
  });
}

windowRespond();

d3.select(window).on("resize", windowRespond);
