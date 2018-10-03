"use strict";
const angular = require("angular");
require("@uirouter/angularjs");
require('angular-translate');
require('angular-translate-loader-partial');
require('ng-file-upload');

require("./components/shared/shared.module");
require("./components/twitter/twitter.module");


const global_config_factory = require("./global-config.factory");
const app_config = require("./app.config");
const http_error_interceptor_factory = require("./http-error-interceptor.factory");
const alert_service = require("./alert-service.factory");

console.log(http_error_interceptor_factory);

angular.module("App", [
    "ui.router",
    "pascalprecht.translate",
    "SharedModule",
    "TwitterModule"
    ]
)
    .factory("GlobalConfigFactory", global_config_factory)
    .factory("HttpErrorInterceptorFactory", http_error_interceptor_factory)
    .factory("AlertService", alert_service)
    .config(app_config);
