"use strict";

let index_controller = function indexController($http, $state, GlobalConfigFactory, d3Factory, d3CloudFactory, $element) {
  let self = this;
  self.url = GlobalConfigFactory.url_back;
  // Word cloud
  self.tags = [];
  // Search functionality
  self.keyword          = "";
  self.tweets           = {research: "",data: {}};
  self.showSearchResult = false;
  self.count            = 0;

  $http.get("http://localhost:3005/tagcloud/").then((response) => {
      self.tags = response.data
  });

  self.submitKeyword = () => {
  	console.log("Submit")
    $http({
      method : 'POST',
      url    : self.url + 'search/',
      data   : { keyword : self.keyword},
      headers: {'Content-Type': 'application/json' }
    }).then((response) => {
      if(response.status === 200) {
		console.log(response)
		self.tweets.research  = self.keyword;
		self.keyword          = "";
		self.tweets.data      = response.data.data;
		self.showSearchResult = true;
		self.count            = response.data.count
      }
    });
  }
};

index_controller.$inject = ['$http', '$state', 'GlobalConfigFactory', 'd3Factory', 'd3CloudFactory', '$element'];

let index = {
    templateUrl: 'app/components/index/index.html',
    controllerAs: "iwc",
    controller: index_controller
};

module.exports = index;
