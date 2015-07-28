
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

// All this does is allow the message
// to be sent when you tap return
app.directive('input', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      'returnClose': '=',
      'onReturn': '&',
      'onFocus': '&',
      'onBlur': '&'
    },
    link: function(scope, element, attr) {
      element.bind('focus', function(e) {
        if (scope.onFocus) {
          $timeout(function() {
            scope.onFocus();
          });
        }
      });
      element.bind('blur', function(e) {
        if (scope.onBlur) {
          $timeout(function() {
            scope.onBlur();
          });
        }
      });
      element.bind('keydown', function(e) {
        if (e.which == 13) {
          if (scope.returnClose) element[0].blur();
          if (scope.onReturn) {
            $timeout(function() {
              scope.onReturn();
            });
          }
        }
      });
    }
  }
})


app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    //router

    $stateProvider

    .state('main', {
        url: '/node/:node',
        templateUrl: '/www/templates/poster.html',
        controller: 'PosterMainCtrl'
    })

    .state('linkpath', {
        url: '/node/:node/linkpath/proposal/:proposalid',
        templateUrl: '/www/templates/linkpath.html',
        controller: 'LinkPathCtrl'
    })

    .state('commitresult', {
        url: '/node/:node/commitresult',
        templateUrl: '/www/templates/commit_result.html',
        controller: 'CommitResultCtrl'
    })

    $urlRouterProvider.otherwise('/');

    //html5Mode
    
    $locationProvider.html5Mode(true);
});
