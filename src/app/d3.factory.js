'use strict';

let d3Factory = function( $document, $q, $rootScope, $window ) {
  let deferred = $q.defer();

  let scriptTag = $document[0].createElement('script');

  scriptTag.type               = 'text/javascript';
  scriptTag.async              = true;
  scriptTag.src                = 'http://d3js.org/d3.v3.min.js';
  scriptTag.onreadystatechange = onReadyStateChange;
  scriptTag.onload             = onScriptLoad;

  let s = $document[0].getElementsByTagName('body')[0];
  s.appendChild(scriptTag);

  return {
    d3: function() {return deferred.promise; }
  };

  function onScriptLoad () {
    $rootScope.$apply(function () { deferred.resolve($window.d3); })
  }
  function onReadyStateChange () {
    if (this.readyState == 'complete') {
      onScriptLoad();
    }
  }
};

d3Factory.$inject = ['$document', '$q', '$rootScope', '$window' ];

module.exports = d3Factory;

