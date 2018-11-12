'use strict'

let http_error_interceptor_factory = ($q, AlertService) => {
  return {
    // On request success
    request: function (config) {
      AlertService.clearAlerts()
      // Return the config or wrap it in a promise if blank.
      return config || $q.when(config)
    },

    // On request failure
    requestError: function (rejection) {
      AlertService.addAlert(rejection.status, rejection.data.message, rejection.data.type)
      // Return the promise rejection.
      return $q.reject(rejection)
    },

    // On response success
    response: function (response) {
      // Return the response or promise.
      return response || $q.when(response)
    },

    // On response failure
    responseError: function (rejection) {
      let status = rejection.status
      let msg = ''
      let type = ''
      if (status === -1) {
        msg = 'Server is probably down'
        type = 'Server unreachable'
      } else {
        msg = rejection.data.message
        type = rejection.data.type
      }
      AlertService.addAlert(status, msg, type)
      // Return the promise rejection.
      return $q.reject(rejection)
    }
  }
}
http_error_interceptor_factory.$inject = ['$q', 'AlertService']
module.exports = http_error_interceptor_factory
