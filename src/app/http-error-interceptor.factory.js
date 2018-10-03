"use strict";

let http_error_interceptor_factory = ($q, AlertService) => {
    return {
        // On request success
        request: function (config) {
            console.log(config); // Contains the data about the request before it is sent.
            AlertService.clearAlerts();
            // Return the config or wrap it in a promise if blank.
            return config || $q.when(config);
        },

        // On request failure
        requestError: function (rejection) {
            console.log(rejection); // Contains the data about the error on the request.
            AlertService.addAlert(rejection.status, rejection.data.message, rejection.data.type);
            // Return the promise rejection.
            return $q.reject(rejection);
        },

        // On response success
        response: function (response) {
            console.log(response); // Contains the data from the response.
            // Return the response or promise.
            return response || $q.when(response);
        },

        // On response failure
        responseError: function (rejection) {
            console.log("responseError " + rejection.status);
            let status = rejection.status;
            let msg = "";
            let type = "";
            if (status === -1){
                msg = "Server is probably down";
                type = "Server unreachable";
            } else {
                msg = rejection.data.message;
                type = rejection.data.type;
            }
            AlertService.addAlert(status, msg, type);

            console.log(rejection); // Contains the data about the error.
            // Return the promise rejection.
            return $q.reject(rejection);
        }
    };
};
http_error_interceptor_factory.$inject = ['$q', 'AlertService'];
module.exports = http_error_interceptor_factory;