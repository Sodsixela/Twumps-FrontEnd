'use strict';

let d3CloudFactory = function($document, $q, $rootScope, $window, d3) {
  let deferred = $q.defer();

  let scriptTag = $document[0].createElement('script');

  scriptTag.type = 'text/javascript';
  scriptTag.async = true;
  scriptTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3-cloud/1.2.5/d3.layout.cloud.js';
  scriptTag.onreadystatechange = onReadyStateChange;
  scriptTag.onload = onScriptLoad;

  let s = $document[0].getElementsByTagName('body')[0];
  s.appendChild(scriptTag);

  return {
    d3: function() {
      return deferred.promise;
    }
  };

  function onScriptLoad() {
    $rootScope.$apply(function() {
      deferred.resolve($window.d3);
    })
  }

  function onReadyStateChange() {
    if (this.readyState == 'complete') {
      onScriptLoad();
    }
  }
};

d3CloudFactory.$inject = ['$document', '$q', '$rootScope', '$window', 'd3Factory'];

module.exports = d3CloudFactory;