
var app = angular.module('app', ['ionic']);

app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleLightContent();
        }
    });
});

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    //router

    $stateProvider

    .state('main', {
        url: '/node/:node',
        templateUrl: '/www/templates/poster.html',
        controller: 'PosterMainCtrl'
    })

    .state('linkpath', {
        url: '/node/:node/linkpath',
        templateUrl: '/www/templates/linkpath.html',
        controller: 'LinkPathCtrl'
    })

    $urlRouterProvider.otherwise('/');

    //html5Mode
    
    $locationProvider.html5Mode(true);
});
