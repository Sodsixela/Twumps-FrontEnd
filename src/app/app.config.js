let app_config = function($compileProvider, $stateProvider, $urlRouterProvider, $httpProvider, GlobalConfigFactoryProvider, 
    $translateProvider, $translatePartialLoaderProvider) {

    const twitter_state = {
        "name": "twitter",
        "url": "/twitter",
        "component": "twitter"
    };

    $stateProvider
        .state(twitter_state)

    $urlRouterProvider.otherwise("/twitter");



    // Config  I18N
    $translateProvider.useSanitizeValueStrategy('escape');
    $translateProvider.useLoader("$translatePartialLoader",{
        urlTemplate: "asset/i18n/{lang}.json"
    });
    $translatePartialLoaderProvider.addPart('app');
    $translateProvider.preferredLanguage('fr'); 
    $translateProvider.forceAsyncReload(true);

    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push('HttpErrorInterceptorFactory');

};

app_config.$inject = ["$compileProvider", "$stateProvider", "$urlRouterProvider","$httpProvider",
    "GlobalConfigFactoryProvider", "$translateProvider", "$translatePartialLoaderProvider"];

module.exports = app_config;
