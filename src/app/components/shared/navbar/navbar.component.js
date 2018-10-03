"use strict";

let navbar_controller =  function navbarController($scope, $location) {
    let self = this;
    self.getClass = (path) => {
        return ($location.path().substr(0, path.length) === path) ? 'active' : '';
    }
};

navbar_controller.$inject = ['$scope', '$location'];

let navbar = {
    templateUrl: 'app/components/shared/navbar/navbar.html',
    controllerAs: "nbc",
    controller: navbar_controller
};

module.exports = navbar;