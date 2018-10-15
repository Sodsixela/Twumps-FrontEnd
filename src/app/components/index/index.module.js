const index = require("./index.component");
const indexDir = require("./index.directives")

angular.module('IndexModule', [])
    .component("index", index)
    .directive('d3Bars', indexDir)