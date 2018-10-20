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

/*let tag_emotion = function(d3Factory){
	return {
		link: link,
		restrict: 'E',
		scope: {
			tags: '='
			}	
		};
	function link(scope, element, attrs) {
   		 d3Factory.d3().then(function(d3) {
var histGenerator = d3.histogram()
  .domain([0,1])    // Set the domain to cover the entire intervall [0;]
  .thresholds(6);  // number of thresholds; 

var bins = histGenerator(scope.emotion);
console.log(bins);

}}*/
index_directive.$inject = ['d3Factory'];
module.exports = index_directive;