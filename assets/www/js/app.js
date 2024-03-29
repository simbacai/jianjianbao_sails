
var app = angular.module('app', ['ionic', 'ngLodash']);

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

app.config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top

}]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  //router

  $stateProvider

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: '/www/templates/tabs.html'
  })  

  .state('tab.home', {
      url: '/home',
      views: {
        'tab-home': {
          templateUrl: '/www/templates/tab-home.html',
          controller: 'HomeCtrl'
        }
      }
    })
    .state('tab-home-makeproposal', {
      url: '/tab/home/makeproposal',
      templateUrl: '/www/templates/proposal_creation.html',
      controller: 'HomeProposalCtrl'
    })
    .state('tab-home-share', {
      url: '/tab/home/share',
      templateUrl: '/www/templates/share.html',
      controller: 'HomeShareCtrl'
    })
    .state('tab-home-proposal-linkparth', {
      url: '/tab/home/proposal/linkpath/:id',
      templateUrl: '/www/templates/proposal_linkpath.html',
      controller: 'HomeProposalLinkPathCtrl'
    })
    .state('tab-home-proposal-adopt', {
      url: '/tab/home/proposal/adopt/:id',      
      templateUrl: '/www/templates/proposal_adopt.html',
      controller: 'HomeProposalAdoptCtrl'
    })
    .state('tab-home-checktips', {
      url: '/tab/home/checktips/:id',
      templateUrl: '/www/templates/commit_result.html',
      controller: 'HomeCheckTipsCtrl'
    })

  .state('tab.edit', {
    url: '/edit',
    views: {
      'tab-edit': {
        templateUrl: '/www/templates/tab-edit.html',
        controller: 'EditCtrl'
      }
    }
  })

  .state('tab.messages', {
    url: '/messages',
    views: {
      'tab-messages': {
        templateUrl: '/www/templates/tab-messages.html',
        controller: 'MessagesCtrl'
      }
    }
  })

  .state('tab.friends', {
    url: '/friends',
    views: {
      'tab-friends': {
        templateUrl: '/www/templates/tab-friends.html',
        controller: 'FriendsCtrl'
      }
    }
  })
    .state('tab-friends-user', {
      url: '/tab/friends/user/:id',
      templateUrl: '/www/templates/user.html',
      controller: 'FriendsUserCtrl'      
    })
    .state('tab-friends-user-chat', {
      url: '/tab/friends/chatroom/:id',
      templateUrl: '/www/templates/chat.html',
      controller: 'FriendsChatCtrl'
    })

  .state('tab.personal', {
    url: '/personal',
    views: {
      'tab-personal': {
        templateUrl: '/www/templates/tab-personal.html',
        controller: 'PersonalCtrl'
      }
    }
  })

  $urlRouterProvider.otherwise('/tab/home');

  //html5Mode
  
  $locationProvider.html5Mode(true);
});
