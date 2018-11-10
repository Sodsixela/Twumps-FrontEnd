'use strict';

let topojsonFactory = function( $document, $q, $rootScope, $window ) {
  let deferred = $q.defer();

  let scriptTag = $document[0].createElement('script');

  scriptTag.type               = 'text/javascript';
  scriptTag.async              = true;
  scriptTag.src                = 'http://d3js.org/topojson.v0.min.js';
  scriptTag.onreadystatechange = onReadyStateChange;
  scriptTag.onload             = onScriptLoad;

  let s = $document[0].getElementsByTagName('body')[0];
  s.appendChild(scriptTag);

  return {
    topojson: function() {return deferred.promise; }
  };

  function onScriptLoad () {
    $rootScope.$apply(function () { deferred.resolve($window.topojson); })
  }
  function onReadyStateChange () {
    if (this.readyState == 'complete') {
      onScriptLoad();
    }
  }
};

topojsonFactory.$inject = ['$document', '$q', '$rootScope', '$window' ];

module.exports = topojsonFactory;



