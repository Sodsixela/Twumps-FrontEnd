"use strict";

let index_controller = function indexController($http, $scope, $rootScope, $anchorScroll, $location, $state, GlobalConfigFactory, d3Factory, d3CloudFactory, $element) {
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
  self.timeline = "";
  self.years=[
                2012,2013,2014,2015,2016,2017,2018,2019
            ]
  self.staticElements=[
                        {"data":"Candidature pour les présidentiels", "created": new Date("2016","06","16")},
                        {"data":"Elu!", "created": new Date("2016","11","08")},
                        {"data":"Serment", "created": new Date("2017","01","20")},
                        {"data":"Polémique de Stormy Daniels", "created": new Date("2018","01","12")}
                      ];
  $http.get("http://localhost:3005/tagcloud/").then((response) => {
      self.tags = response.data
  });

  $http.get("http://localhost:3005/emotion/").then((response) => {
      self.emotion = response.data
  });

  $http.get("http://localhost:3005/timeline/").then((response) => {
    console.log(response.data)
    self.retweet = response.data
    
    
    self.retweet.forEach(function(element)
    {
        element.created = new Date(element.created.substr(0,4), element.created.substr(4,2), element.created.substr(6,2), element.created.substr(9,2), element.created.substr(12,2), element.created.substr(15,2))
    });
    self.retweet.sort(function(a,b){
        return new Date(a.created) - new Date(b.created);
    });
    let ret = self.retweet;
    let stat = self.staticElements;
    let odd = 0;
    self.years.forEach(function(year)
    {
      self.timeline = self.timeline + "<li><div class='tldate'>" + year + "</div></li>"
        for (let i=0; i < self.staticElements.length; i++)
        {
          let firstTurn = true
          let staticE = self.staticElements[i]
            if(firstTurn === true){
              firstTurn = false
              for (let j = i; j < self.retweet.length; j++)
              {
                  let tTweet = self.retweet[j]
                  if(year === tTweet.created.getFullYear() && tTweet.created < staticE.created && (year === staticE.created.getFullYear() || staticE === self.staticElements[0]))
                  {
                    
                      if(odd === 1)
                        self.timeline= self.timeline + "<li class='timeline-inverted'>"
                      else
                         self.timeline= self.timeline + "<li>"
                      self.timeline= self.timeline +  '<div class="tl-circ"></div>'+
                        '<div class="timeline-panel">'+
                          '<div class="tl-heading">'+'<p>'+tTweet.id_str+'</p>'+
                            `<twitter-widget twitter-widget-id=`+tTweet.id_str+` twitter-widget-options="{'cards': 'hidden', 'align': 'right'}"></twitter-widget>`+
                          '</div>'+
                        '</div>'
                      odd = (odd +1)%2
                      self.timeline= self.timeline + "</li>"
                      ret.splice(j,1);
                      j--;
                  }
              };
            }
            if( year === staticE.created.getFullYear() )
            {
              if(odd === 1)
                self.timeline= self.timeline + "<li class='timeline-inverted'>"
              else
                self.timeline= self.timeline + "<li>"
              self.timeline= self.timeline + 
              '<div class="tl-circ"></div>'+
              '<div class="timeline-panel">'+
                '<div class="tl-heading">'+
                  '<h4>' + staticE.data + '</h4>'+
                  '<p><small class="text-muted"><i class="glyphicon glyphicon-time"></i>' + staticE.created + '</small></p>'+
                '</div>'+
              '</div>'
                   
              odd = (odd +1)%2
              self.timeline= self.timeline + "</li>"
            }
            for (let j = 0; j < self.retweet.length; j++)
            {
                let tTweet = self.retweet[j]
                if(year === tTweet.created.getFullYear() && tTweet.created > staticE.created && (year === staticE.created.getFullYear() || staticE === self.staticElements[self.staticElements.length-1]))
                {
                    if(odd === 1)
                      self.timeline= self.timeline + "<li class='timeline-inverted'>"
                    else
                       self.timeline= self.timeline + "<li>"
                    self.timeline= self.timeline +'<div class="tl-circ"></div>'+
                      '<div class="timeline-panel">'+
                        '<div class="tl-heading">'+'<p>'+tTweet.id_str+'</p>'+
                          `<twitter-widget twitter-widget-id=`+tTweet.id_str+` twitter-widget-options="{'cards': 'hidden', 'align': 'right'}"></twitter-widget>`+
                        '</div>'+
                      '</div>'
                    odd = (odd +1)%2
                    self.timeline= self.timeline + "</li>"
                    ret.splice(j,1);
                    j--;
                }
            }
            
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



index_controller.$inject = ['$http', '$scope', '$rootScope', '$anchorScroll', '$location', '$state', 'GlobalConfigFactory', 'd3Factory', 'd3CloudFactory', '$element'];

let index = {
    templateUrl: 'app/components/index/index.html',
    controllerAs: "iwc",
    controller: index_controller
};



module.exports = index;
