"use strict";

let index_controller = function indexController($sce ,$http, $scope, $rootScope, $anchorScroll, $location, $state, GlobalConfigFactory, d3Factory, d3CloudFactory, $element) {
  let self = this;
  self.url = GlobalConfigFactory.url_back;
  self.collapsed = true
  // Word cloud
  self.tags = [];
  // Emotion
  self.emotion = [];
  // Search functionality
  self.tweets = {};
  // Timeline
  self.retweet = [];
  self.timeline = [];
  self.years=[
                {"year":"2012", "created": new Date("2012")},
                {"year":"2013", "created": new Date("2013")},
                {"year":"2014", "created": new Date("2014")},
                {"year":"2015", "created": new Date("2015")},
                {"year":"2016", "created": new Date("2016")},
                {"year":"2017", "created": new Date("2017")},
                {"year":"2018", "created": new Date("2018")},
                {"year":"2019", "created": new Date("2019")}
            ]
  self.staticElements=[
                        {"data":"Candidature pour les présidentiels", "created": new Date("2016","06","16")},
                        {"data":"Elu!", "created": new Date("2016","11","08")},
                        {"data":"Serment", "created": new Date("2017","01","20")},
                        {"data":"Polémique de Stormy Daniels", "created": new Date("2018","01","12")}
                      ];
  self.map = [
    {city : "PARIS", country : "FRANCE", lat : "48.86", lon : "2.33" },
    {city : "ZANZIBAR", country : "TANZANIA", lat : "-6.13", lon : "39.31" },
    {city : "TOKYO", country : "JAPAN", lat : "35.68", lon : "139.76" },
    {city : "AUCKLAND", country : "NEW ZEALAND", lat : "-36.85", lon : "174.78" },
    {city : "BANGKOK", country : "THAILAND", lat : "13.75", lon : "100.48" },
    {city : "DELHI", country : "INDIA", lat : "29.01", lon : "77.38" },
    {city : "SINGAPORE", country : "SINGAPOR", lat : "1.36", lon : "103.75" },
    {city : "BRASILIA", country : "BRAZIL", lat : "-15.67", lon : "-47.43" },
    {city : "RIO DE JANEIRO", country : "BRAZIL", lat : "-22.90", lon : "-43.24" },
    {city : "TORONTO", country : "CANADA", lat : "43.64", lon : "-79.40" },
    {city : "EASTER ISLAND", country : "CHILE", lat : "-27.11", lon : "-109.36" },
    {city : "SEATTLE", country : "USA", lat : "47.61", lon : "-122.33" },
  ];

  $http.get("http://localhost:3005/tagcloud/").then((response) => {
      self.tags = response.data
  });

  $http.get("http://localhost:3005/emotion/").then((response) => {
      self.emotion = response.data
  });

  $http.get("http://localhost:3005/timeline/").then((response) => {
    self.retweet = response.data
    self.retweet.forEach(function(element)
    {
        element.created = new Date(element.created.substr(0,4), element.created.substr(4,2), element.created.substr(6,2), element.created.substr(9,2), element.created.substr(12,2), element.created.substr(15,2))
    });
    self.timeline = self.retweet
    self.timeline = self.timeline.concat(self.years,self.staticElements)
    self.timeline.sort(function(a,b){
        return new Date(a.created) - new Date(b.created);
    });
    let odd = 0
    self.timeline.forEach(function(element)
    {
      if(!element.year)
      {
        if(odd === 1)
        {
          element.odd = "yes"
        }
        odd = (odd + 1) %2  
      }
    });
  });

  self.scrollTo = function(id) {
    $location.hash(id);
    $anchorScroll();
  }

  self.collapse = () => {
    self.collapsed = true;
  }

  self.wordClicked = (keyword) => {
    $http({
      method : 'POST',
      url    : self.url + 'search/',
      data   : { keyword : keyword},
      headers: {'Content-Type': 'application/json' }
    }).then((response) => {
      if(response.status === 200) {
        self.collapsed = false;
        self.tweets = response.data.data;
      }
    });
  }
};

index_controller.$inject = ['$sce', '$http', '$scope', '$rootScope', '$anchorScroll', '$location', '$state', 'GlobalConfigFactory', 'd3Factory', 'd3CloudFactory', '$element'];

let index = {
    templateUrl: 'app/components/index/index.html',
    controllerAs: "iwc",
    controller: index_controller
};

module.exports = index;
