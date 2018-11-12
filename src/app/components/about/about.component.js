'use strict'

let about_controller = function aboutController ($window, $http, $state, GlobalConfigFactory) {
  let self = this
  self.api = GlobalConfigFactory.urlBack + 'api/'
  self.url = GlobalConfigFactory.urlBack
  self.collapsed = true
  // Search functionality
  self.tweets = {}

  self.collapse = () => {
    self.collapsed = true
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
        self.collapsed = false
        self.tweets = response.data.data
      }
    })
  }
}

about_controller.$inject = ['$http', '$state', 'GlobalConfigFactory']

let about = {
  templateUrl: 'app/components/about/about.html',
  controllerAs: 'abc',
  controller: about_controller
}

module.exports = about
