"use strict";

let index_directive = function  (d3Factory) {
  let directive = {
    link: link,
    restrict: 'EA'
  };

  return directive;

  function link(scope, element, attrs) {
    d3Factory.d3().then(function(d3) {
      let color = d3.scale.category20c(),
        data      = [10, 20, 30],
        width     = 100,
        height    = 100,
        min       = Math.min(width, height),
        svg       = d3.select(element[0]).append('svg'),
        pie       = d3.layout.pie().sort(null),
        arc       = d3.svg.arc()
          .outerRadius(min / 2 * 0.9)
          .innerRadius(min / 2 * 0.5);

      svg.attr({width: width, height: height});
      let g = svg.append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
      g.selectAll('path').data(pie(data))
        .enter().append('path')
        .style('stroke', 'white')
        .attr('d', arc)
        .attr('fill', function(d, i){ return color(i) });

    });
  }
};

let emotion = function($window, d3Factory){
  let directive = {
    link: link,
    restrict: 'E',
    scope: {
      data: '='
    }
  };

  return directive;

  function link(scope, element, attrs) {
    d3Factory.d3().then(function(d3) {
      // Setup variables
      let data = scope.data;

      var margin     = {top: 100, right: 100, bottom: 100, left: 100},
          width      = $window.innerWidth - margin.left - margin.right,
          height     = 400 - margin.top - margin.bottom;

      var y = d3.scale.ordinal()
          .rangeRoundBands([0, height], .3);

      var x = d3.scale.linear()
          .rangeRound([0, width]);

      var color = d3.scale.ordinal()
          .range(["#c7001e", "#cccccc", "#086fad"]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("top");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")

      var svg = d3.select(element[0]).append("svg")
          .attr("width", width + margin.left + margin.rigth)
          .attr("height", height + margin.top + margin.bottom)
          .attr("id", "d3-plot")
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Type of data
      color.domain(["NEG", "NEUTRAL", "POS"]);

      // Data calculations
      data.forEach(function(d) {
        var x0 = 50 - (d['NEUTRAL'] / 2) - d['NEG'];
        d.boxes = color.domain().map(function(name) {
          return {name: name, x0: x0, x1: x0 += d[name], N: 0, n: Math.floor(d[name])}; 
        });
      });

      var min_val = d3.min(data, function(d) {
        return d.boxes["0"].x0;
      });

      var max_val = d3.max(data, function(d) {
        return d.boxes["2"].x1;
      });

      x.domain([min_val, max_val]).nice(); // Abscissa
      y.domain(data.map(function(d) { return d['YEAR']; })); // Ordinate

      svg.append("g")
          .attr("class", "x axis")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)

      var vakken = svg.selectAll(".year")
          .data(data)
          .enter().append("g")
          .attr("class", "bar")
          .attr("transform", function(d) { return "translate(0," + y(d['YEAR']) + ")"; });

      var bars = vakken.selectAll("rect")
          .data(function(d) { return d.boxes; })
          .enter().append("g").attr("class", "subbar");

      bars.append("rect")
          .attr("height", y.rangeBand())
          .attr("x", function(d) { return x(d.x0); })
          .attr("width", function(d) { return x(d.x1) - x(d.x0); })
          .style("fill", function(d) { return color(d.name); });

      // Percentages
      bars.append("text")
          .attr("x", function(d) { return x(d.x0 + ((d.x1 - d.x0) / 2)) - 17; })
          .attr("y", y.rangeBand()/2)
          .attr("dy", "0.5em")
          .style("font" ,"14px sans-serif bold")
          .style("text-anchor", "begin")
          .text(function(d) { return d.n !== 0 && (d.x1-d.x0)>3 ? d.n + " %" : "" });

      // 50% vertical bar
      svg.append("g")
          .attr("class", "y axis")
          .append("line")
          .attr("x1", x(50))
          .attr("x2", x(50))
          .attr("y2", height);

      var startp = svg.append("g").attr("class", "legendbox").attr("id", "mylegendbox");
      // this is not nice, we should calculate the bounding box and use that
      var legend_tabs = [0, 120, 200, 375, 450];
      var legend = startp.selectAll(".legend")
          .data(color.domain().slice())
          .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(" + legend_tabs[i] + ",-45)"; });

      // Print square color before legends
      legend.append("rect")
          .attr("x", 0)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

      // Plot data type (NEG, NEUTRAL, POS)
      legend.append("text")
          .attr("x", 22)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "begin")
          .style("font" ,"10px sans-serif")
          .text(function(d) { return d; });

      // Lines axis
      d3.selectAll(".axis path")
          .style("fill", "none")
          .style("stroke", "#000")
          .style("shape-rendering", "crispEdges")

      d3.selectAll(".axis line")
          .style("fill", "none")
          .style("stroke", "#000")
          .style("shape-rendering", "crispEdges")

      var movesize = width/2 - startp.node().getBBox().width/2;
      d3.selectAll(".legendbox").attr("transform", "translate(" + movesize  + ",0)");
    })
  }
}

index_directive.$inject = ['d3Factory'];
emotion.$inject         = ['$window', 'd3Factory'];
module.exports          = {index_directive, emotion};