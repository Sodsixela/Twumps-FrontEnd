"use strict";

let index_controller = function indexController($http, $anchorScroll, $location, $state, GlobalConfigFactory, d3Factory, d3CloudFactory, $element) {
  let self = this;
  self.url = GlobalConfigFactory.url_back;
  // Word cloud
  self.tags = [];
  // Emotion
  self.emotion = [];
  // Search functionality
  self.keyword          = "";
  self.tweets           = {research: "",data: {}};
  self.showSearchResult = false;
  self.count            = 0;

  $http.get("http://localhost:3005/tagcloud/").then((response) => {
      self.tags = response.data
  });

  $http.get("http://localhost:3005/emotion/").then((response) => {
      self.emotion = response.data
      console.log(self.emotion)
  });

  self.scrollTo = function(id) {
    $location.hash(id);
    $anchorScroll();
   }

  self.submitKeyword = () => {
    if (self.keyword.trim().length > 0) {
      $http({
        method : 'POST',
        url    : self.url + 'search/',
        data   : { keyword : self.keyword},
        headers: {'Content-Type': 'application/json' }
      }).then((response) => {
        if(response.status === 200) {
          $('.navbar-primary').removeClass('collapsed');

          self.tweets.research  = self.keyword;
          self.keyword          = "";
          self.tweets.data      = response.data.data;
          self.showSearchResult = true;
          self.count            = response.data.data.length;
          console.log("Tweets : ", self.tweets.data)
        }
      });
    }
  }
};

index_controller.$inject = ['$http', '$anchorScroll', '$location', '$state', 'GlobalConfigFactory', 'd3Factory', 'd3CloudFactory', '$element'];

let index = {
    templateUrl: 'app/components/index/index.html',
    controllerAs: "iwc",
    controller: index_controller
};

module.exports = index;
