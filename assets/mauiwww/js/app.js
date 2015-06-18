var app = angular.module('JApp', [
  'ngRoute',
  'mobile-angular-ui'
]);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/',
                      {templateUrl:'/static/mauiwww/templates/welcome.html',
                       controller: 'WelcomeCtrl',
                      reloadOnSearch: false});
  
  $routeProvider.when('/creation',
                      {templateUrl:'/static/mauiwww/templates/poster_create.html',
                       controller: 'PosterCreationCtrl',
                       reloadOnSearch: false});
  
  $routeProvider.when('/poster/creation',
                      {templateUrl:'/static/mauiwww/templates/poster_create.html',
                       controller: 'PosterCreationCtrl',
                       reloadOnSearch: false});
  
  $routeProvider.when('/node/:node/creation',
                      {templateUrl:'/static/mauiwww/templates/poster_create.html',
                       controller: 'PosterCreationCtrl',
                       reloadOnSearch: false});
  
  $routeProvider.when('/node/:node',
                      {templateUrl:'/static/mauiwww/templates/poster_main.html',
                       controller: 'PosterMainCtrl',
                       reloadOnSearch: false});
  
  $locationProvider.html5Mode(true);
  
  
});