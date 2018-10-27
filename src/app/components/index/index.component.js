"use strict";

let index_controller = function indexController($http, $state, GlobalConfigFactory, d3Factory, d3CloudFactory, $element) {
  let self = this;
  self.url = GlobalConfigFactory.url_back;
  self.tags = [];

  $http.get("http://localhost:3005/tagcloud/").then((response) => {
      self.tags = response.data
  });
};

index_controller.$inject = ['$http', '$state', 'GlobalConfigFactory', 'd3Factory', 'd3CloudFactory', '$element'];

let index = {
    templateUrl: 'app/components/index/index.html',
    controllerAs: "iwc",
    controller: index_controller
};

module.exports = index;