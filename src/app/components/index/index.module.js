const index = require("./index.component");
const indexDir = require("./index.directives")

angular.module('IndexModule', [])
    .component("index", index)
    .directive('wordCloud', indexDir.tag_cloud)
   	.directive('emotion', indexDir.emotion)
