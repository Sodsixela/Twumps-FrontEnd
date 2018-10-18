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
        let fill = d3.scale.category20b();
        var w = $window.innerWidth,
            h = $window.innerHeight;
        var max, fontSize;

        var layout = d3Cloud.layout.cloud()
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

        var svg = d3.select(element[0]).append("svg")
          .attr("width", w)
          .attr("height", h);

        var vis = svg.append("g").attr("transform", "translate(" + [w >> 1, h >> 1] + ")");
        console.log(vis)

        update();

        $window.onresize = function (event) {
          update();
        };

        function draw(data, bounds) {
          var w = $window.innerWidth,
              h = $window.innerHeight;

          svg.attr("width", w).attr("height", h);

          var scale = bounds ? Math.min(
            w / Math.abs(bounds[1].x - w / 2),
            w / Math.abs(bounds[0].x - w / 2),
            h / Math.abs(bounds[1].y - h / 2),
            h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;

          var text = vis.selectAll("text")
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

index_directive.$inject = ['d3Factory'];
tag_cloud.$inject = ['$window', 'd3Factory', 'd3CloudFactory'];
module.exports = {index_directive, tag_cloud};