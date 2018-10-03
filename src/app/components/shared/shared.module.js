const navbar = require("./navbar/navbar.component");
const alertservice = require("./alertservice/alertservice.component");

angular.module('SharedModule', [])
    .component("navbar", navbar)
    .component("alertservice", alertservice);


