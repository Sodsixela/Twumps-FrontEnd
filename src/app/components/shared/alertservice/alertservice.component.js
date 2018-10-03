"use strict";

let alertservice_controller =  function alertserviceController($scope, $location, AlertService) {
    let self = this;
    self.getClass = (path) => {
        return ($location.path().substr(0, path.length) === path) ? 'active' : '';
    };

    self.alerts = AlertService.alerts;

    self.addAlert = function(type, msg) {
        AlertService.addAlert(type,msg);
    };

    self.closeAlert = function(index) {
        AlertService.closeAlert(index);
    };

    self.clearAlerts = function () {
        AlertService.clearAlerts();
    };

};

alertservice_controller.$inject = ['$scope', '$location', 'AlertService'];

let alertservice = {
    templateUrl: 'app/components/shared/alertservice/alertservice.html',
    controllerAs: "asc",
    controller: alertservice_controller
};

module.exports = alertservice;