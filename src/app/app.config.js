let app_config = function($compileProvider, $stateProvider, $urlRouterProvider, $httpProvider, GlobalConfigFactoryProvider,
    $translateProvider, $translatePartialLoaderProvider) {

    const index_state = {
        "name": "index",
        "url": "/index",
        "component": "index"
    };

    const about_state = {
    "name": "about",
    "url": "/about",
    "component": "about"
    };

    $stateProvider
        .state(index_state)
        .state(about_state)

  $urlRouterProvider.otherwise("/index");



    // Config  I18N
    $translateProvider.useSanitizeValueStrategy('escape');
    $translateProvider.useLoader("$translatePartialLoader", {
        urlTemplate: "asset/i18n/{lang}.json"
    });
    $translatePartialLoaderProvider.addPart('app');
    $translateProvider.preferredLanguage('fr');
    $translateProvider.forceAsyncReload(true);

    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push('HttpErrorInterceptorFactory');

};

app_config.$inject = ["$compileProvider", "$stateProvider", "$urlRouterProvider", "$httpProvider",
    "GlobalConfigFactoryProvider", "$translateProvider", "$translatePartialLoaderProvider"
];

module.exports = app_config;