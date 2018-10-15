"use strict";

let index_controller = function indexController($http, $state, GlobalConfigFactory, d3Factory, $element) {
  let self = this;
  self.url = GlobalConfigFactory.url_back;
  self.createChart = createChart;
  createChart();

  function createChart() {
    d3Factory.d3().then(function(d3) {

      let color   = d3.scale.category10(),
        data    = [10, 20, 30],
        width   = 100,
        height  = 100,
        min     = Math.min(width, height),
        //svg     = d3.select('.chart-container').append('svg'),
        svg     = d3.select($element[0]).append('svg'),
        pie     = d3.layout.pie().sort(null),
        arc     = d3.svg.arc()
          .outerRadius(min / 2 * 0.9)
          .innerRadius(min / 2 * 0.5);

      svg.attr({width: width, height: height});
      let g = svg.append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

      g.selectAll('path').data(pie(data))
        .enter().append('path')
        .style('stroke', 'white')
        .attr('d', arc)
        .attr('fill', function(d, i) { return color(i); });

    });
  };
};

index_controller.$inject = ['$http', '$state', 'GlobalConfigFactory', 'd3Factory', '$element'];

let index = {
    templateUrl: 'app/components/index/index.html',
    controllerAs: "iwc",
    controller: index_controller
};

module.exports = index;