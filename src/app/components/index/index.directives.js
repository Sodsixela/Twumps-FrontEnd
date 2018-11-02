"use strict";

let index_directive = function  (d3Factory) {
  return {
    link: link,
    restrict: 'EA'
  };

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

let tag_cloud = function ($window, d3Factory, d3CloudFactory) {
  return {
    link: link,
    restrict: 'E',
    scope: {
        tags: '='
    }
  };

  function link(scope, element, attrs) {
    d3Factory.d3().then(function(d3) {
      d3CloudFactory.d3().then(function(d3Cloud) {
        let tags = scope.tags;
        // let fill = d3.scale.linear().domain([0, 1]).range(["white", "black"]);
        let fill = d3.scale.category20b();
        let w = $('.main-content').width(),
            h = 450;
        let max, fontSize;

        let layout = d3Cloud.layout.cloud()
          .timeInterval(Infinity)
          .size([w, h])
          .fontSize(function (d) {
            return fontSize(d[1]);
          })
          .rotate(function() { return (Math.round(Math.random()) * 2 - 1) * (Math.floor(~~(Math.random() * 2) * 90)); })
          .text(function (d) {
            return d[0];
          })
          .on("end", draw);

        let svg = d3.select(element[0]).append("svg")
          .attr("width", w)
          .attr("height", h);

        let vis = svg.append("g").attr("transform", "translate(" + [w >> 1, h >> 1] + ")");

        update();

        $window.onresize = function (event) {
          update();
        };

        $('.btn-expand-collapse').click(function(e) {
            if (!$('.navbar-primary').hasClass('collapsed')) {
              update();
            }
        });

        $('.btn-deflate-collapse').click(function(e) {
          update();
        });

        function draw(data, bounds) {
          let w = $('.main-content').width(),
              h = 450;

          svg.attr("width", w).attr("height", h);

          let scale = bounds ? Math.min(
            w / Math.abs(bounds[1].x - w / 2),
            w / Math.abs(bounds[0].x - w / 2),
            h / Math.abs(bounds[1].y - h / 2),
            h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;

          let text = vis.selectAll("text")
            .data(data, function (d) {
              return d.text.toLowerCase();
            });

          text.transition()
            .duration(1000)
            .attr("transform", function (d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .style("font-size", function (d) {
              return d.size + "px";
            });
          text.enter().append("text")
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .style("font-size", function (d) {
              return d.size + "px";
            })
            .style("opacity", 1e-6)
            .transition()
            .duration(1000)
            .style("opacity", 1);
          text.style("font-family", function (d) {
            return d.font;
          })
            .style("fill", function (d) {
              return fill(d.text.toLowerCase());
            })
            .text(function (d) {
              return d.text;
            });

          vis.transition().attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scale + ")");
        }

        function update() {
          w = $('.main-content').width();
          h = 450;

          layout.font('impact').spiral('rectangular');
          fontSize = d3.scale['sqrt']().range([10, 100]);
          if (tags.length) {
            fontSize.domain([+tags[tags.length - 1][1] || 1, +tags[0][1]]);
          }
          layout.stop().words(tags).start();
        }
      });
    });
  }
};

let emotion = function($window, d3Factory) {
  return {
    link: link,
    restrict: 'E',
    scope: {
      data: '='
    }
  };

  function link(scope, element, attrs) {
    d3Factory.d3().then(function(d3) {
      // Setup letiables
      let data = scope.data;

      update();

      $window.onresize = function (event) {
        update();
      };

      function update() {
        if (d3.select("#emotion-svg")) {
          d3.select("#emotion-svg").remove();
        }

        let heightBar  = 50
        let margin     = {top: 100, right: 100, bottom: 100, left: 100},
            width      = $window.innerWidth - margin.left - margin.right,
            height     = (data.length * heightBar) - margin.top - margin.bottom;

        let y = d3.scale.ordinal()
            .rangeRoundBands([0, height], .3);

        let x = d3.scale.linear()
            .rangeRound([0, width]);

        let color = d3.scale.ordinal()
            .range(["#c7001e", "#cccccc", "#086fad"]);

        let xAxis = d3.svg.axis()
            .scale(x)
            .orient("top");

        let yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")

        let svg = d3.select(element[0]).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", "emotion-svg")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Type of data
        color.domain(["neg", "neutral", "pos"]);

        // Data calculations
        data.forEach(function(d) {
          let x0 = 50 - (d['neutral'] / 2) - d['neg'];
          d.boxes = color.domain().map(function(name) {
            return {name: name, x0: x0, x1: x0 += d[name], N: 0, n: Math.floor(d[name])};
          });
        });

        let min_val = d3.min(data, function(d) {
          return d.boxes["0"].x0;
        });

        let max_val = d3.max(data, function(d) {
          return d.boxes["2"].x1;
        });

        x.domain([min_val, max_val]).nice(); // Abscissa
        y.domain(data.map(function(d) { return d['year']; })); // Ordinate

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)

        let vakken = svg.selectAll(".year")
            .data(data)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function(d) { return "translate(0," + y(d['year']) + ")"; });

        let bars = vakken.selectAll("rect")
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

        let startp = svg.append("g").attr("class", "legendbox").attr("id", "mylegendbox");
        // this is not nice, we should calculate the bounding box and use that
        let legend_tabs = [0, 120, 200, 375, 450];
        let legend = startp.selectAll(".legend")
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

        // Plot data type (neg, neutral, pos)
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

        let movesize = width/2 - startp.node().getBBox().width/2;
        d3.selectAll(".legendbox").attr("transform", "translate(" + movesize  + ",0)");
      }
    })
  }
};

index_directive.$inject = ['d3Factory'];
tag_cloud.$inject       = ['$window', 'd3Factory', 'd3CloudFactory'];
emotion.$inject         = ['$window', 'd3Factory'];
module.exports          = {index_directive, tag_cloud, emotion};