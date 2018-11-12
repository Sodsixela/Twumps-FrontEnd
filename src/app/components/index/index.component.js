"use strict";

let index_controller = function indexController($sce, $http, $scope, $rootScope, $anchorScroll, $location, $state, GlobalConfigFactory, d3Factory, d3CloudFactory, $element) {
  let self = this;
  self.api = GlobalConfigFactory.url_back + 'api/';
  self.url = GlobalConfigFactory.url_back;
  self.collapsed = true
  // Word cloud
  self.tags = [];
  // Emotion
  self.emotion = [];
  // Search functionality
  self.tweets = {};
  // Map
  self.map = [];
  // Timeline
  self.retweet = [];
  self.timeline = [];
  self.years = [{
    "year": "2012",
    "created": new Date("2012")
  }, {
    "year": "2013",
    "created": new Date("2013")
  }, {
    "year": "2014",
    "created": new Date("2014")
  }, {
    "year": "2015",
    "created": new Date("2015")
  }, {
    "year": "2016",
    "created": new Date("2016")
  }, {
    "year": "2017",
    "created": new Date("2017")
  }, {
    "year": "2018",
    "created": new Date("2018")
  }, {
    "year": "2019",
    "created": new Date("2019")
  }]
  self.staticElements = [{
    "data": "Trump annonce sa candidature pour les présidentiels",
    "created": new Date("2016", "06", "16")
  }, {
    "data": "Trump est élu président des états-unis d'amérique!",
    "created": new Date("2016", "11", "08")
  }, {
    "data": "Trump prête serment sur la bible",
    "created": new Date("2017", "01", "20")
  }, {
    "data": "Polémique de Stormy Daniels",
    "created": new Date("2018", "01", "12")
  }];

  $http.get(self.api + "tagcloud/").then((response) => {
    self.tags = response.data
  });

  $http.get(self.api + "emotion/").then((response) => {
    self.emotion = response.data
    let globalEmotion = {
      "id": 0,
      "year": "Global",
      "pos": 0,
      "neutral": 0,
      "neg": 0
    }
    self.emotion.forEach(function(element) {
      globalEmotion.pos += element.pos
      globalEmotion.neutral += element.neutral
      globalEmotion.neg += element.neg
    })
    globalEmotion.pos /= self.emotion.length
    globalEmotion.neutral /= self.emotion.length
    globalEmotion.neg /= self.emotion.length
    self.emotion = self.emotion.concat(globalEmotion)
  });

  $http.get(self.api + "timeline/").then((response) => {
    self.retweet = response.data
    self.retweet.forEach(function(element) {
      element.created = new Date(element.created.substr(0, 4), element.created.substr(4, 2), element.created.substr(6, 2), element.created.substr(9, 2), element.created.substr(12, 2), element.created.substr(15, 2))
    });
    self.timeline = self.retweet
    self.timeline = self.timeline.concat(self.years, self.staticElements)
    self.timeline.sort(function(a, b) {
      return new Date(a.created) - new Date(b.created);
    });

    let odd = 0
    let previous = null
    for (let i = self.timeline.length - 1; i >= 0; i--) {
      if (self.timeline[i].year && previous && previous.year) {
        self.timeline.splice(i, 1);
      }

      if (!self.timeline[i].year) {
        if (odd === 1) {
          self.timeline[i].odd = "yes"
        }
        odd = (odd + 1) % 2
      }

      previous = self.timeline[i]
    };
  });

  $http.get(self.api + "nouns/").then((response) => {
    self.map = response.data
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
      method: 'POST',
      url: self.api + 'search/',
      data: {
        keyword: keyword
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      if (response.status === 200) {
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