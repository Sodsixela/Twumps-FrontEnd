"use strict";

let lut = {"200" : "success", "400" : "danger", "500" : "danger", "-1" : "danger", "default" : "warning"};

let alert_service = () => {
    let alerts = [];

    return {
        alerts,

        addAlert: function (type, msg, errorType) {
            if (errorType === undefined) errorType = "Unknown Error";
            if (errorType === "-1") errorType = "Server is down";
            alerts.push({'type': lut[type], 'msg': msg, 'errorType': errorType});
        },

        closeAlert: function (index) {
            alerts.splice(index, 1);
        },

        clearAlerts: function () {
            for(let i = alerts.length; i >= 0; i--){
                alerts.splice(i,1);
            }
        },
    };
};
alert_service.$inject = [];
module.exports = alert_service;