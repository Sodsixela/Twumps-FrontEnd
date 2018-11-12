"use strict";

let about_controller = function aboutController($http, $state, GlobalConfigFactory) {
  let self = this;
  self.api = GlobalConfigFactory.url_back + 'api/';
  self.url = GlobalConfigFactory.url_back;
};

about_controller.$inject = ['$http', '$state', 'GlobalConfigFactory'];

let about = {
  templateUrl: 'app/components/about/about.html',
  controllerAs: "abc",
  controller: about_controller
};

module.exports = about;