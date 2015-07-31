app

.controller("HomeCtrl", 
  function ($scope, lodash, $q, $window, JianJianBaoAPISrv)  {
    console.log("HomeCtrl: BEGIN................");
    $scope.poster = {};
    $scope.proposals = [];


    $scope.refresh = function() {
      $window.location.href = "/node/" + $scope.nodeId;
    };

    //Load the Poster
    JianJianBaoAPISrv
    .getPoster($scope.posterId, $scope.userId)
    .then(function (poster) {
      $scope.poster = poster;
      return null;
    })
    //Load the proposals
    .then(function () {
      var dfd = $q.defer();
      dfd.resolve();
      promise = dfd.promise;
   
      lodash.each($scope.poster.proposals.reverse(), function(proposalId) {
          promise = promise.then(function() {
              return JianJianBaoAPISrv.getProposal(proposalId);
          }).then(function(proposal) {
              // ...
              $scope.proposals.push(proposal);
          });
      });   
    });

    //Get the proposalsummary push message
    io.socket.on('poster', function (proposalSummary) { 
      JianJianBaoAPISrv.getProposal(proposalSummary.data.proposal)
      .then(function(proposal){
        //Todo: $scope update does not update view
        $scope.proposals.unshift(proposal);
        //$scope.$apply();
      });
    });
    io.socket.get("/poster/" + $scope.posterId);
})

.controller("HomeProposalCtrl", 
  function ($scope, $location, JianJianBaoAPISrv,$controller, $window)  {
    $controller('HomeCtrl', {$scope : $scope}); //Make HomeProposalCtrl as child of HomeCtrl
    $scope.solution = "";
    $scope.propose = function() {        
        JianJianBaoAPISrv.postProposal($scope.solution, $scope.posterId, $scope.nodeId)
        .then(function(response) {
            $location.path("/tab/home");
        });   
    } ;
})

.controller("HomeShareCtrl", 
  function($scope, $q, $location, JianJianBaoAPISrv, $ionicModal, $http)  {
})

.controller("HomeProposalLinkPathCtrl", 
  function($scope, $rootScope, $q, $location, JianJianBaoAPISrv, $ionicModal, $http)  {
    $scope.tipsCalc = function(proposalId) {
        $rootScope.tips = [];

        JianJianBaoAPISrv.tipsCalc(proposalId).then(function(tips) {
            console.log("$scope.tipsCalc: tips= " + angular.toJson(tips))
            $rootScope.tips = tips;

            console.log("################# 跳转至linkpath ");
            //不刷新跳转
            $location.path($rootScope.posterMainPath + "/linkpath/proposal/" + proposalId);

            return;
        });
    }
})

.controller("HomeProposalAdoptCtrl", 
  function($scope, $rootScope, $q, $location, JianJianBaoAPISrv, $ionicModal, $http)  {
    $scope.tipsCalc = function(proposalId) {
        $rootScope.tips = [];

        JianJianBaoAPISrv.tipsCalc(proposalId).then(function(tips) {
            console.log("$scope.tipsCalc: tips= " + angular.toJson(tips))
            $rootScope.tips = tips;

            console.log("################# 跳转至linkpath ");
            //不刷新跳转
            $location.path($rootScope.posterMainPath + "/linkpath/proposal/" + proposalId);

            return;
        });
    }

    $scope.commit = function() {
        JianJianBaoAPISrv.commitProposal($stateParams.proposalid).then(function() {
            return JianJianBaoAPISrv.viewTips();
        }).then(function(tips) {
            //$rootScope.tips = tips;
            console.log("tips=" + angular.toJson(tips));

            console.log("################# 跳转首页");
            //不刷新跳转
            $location.path($rootScope.posterMainPath);

            $rootScope.refresh();

            return;
        });
    }
})

.controller("HomeCheckTipsCtrl", 
  function($scope, $rootScope, $q, $location, JianJianBaoAPISrv, $ionicModal, $http)  {
    $scope.viewTips = function(proposalId) {
        JianJianBaoAPISrv.viewTips().then(function(tips) {
            console.log("$scope.viewTips: tips= " + angular.toJson(tips))
            $rootScope.tips = tips;

            console.log("################# 跳转至linkpath ");
            //不刷新跳转
            $location.path($rootScope.posterMainPath + "/commitresult");

            return;
        });
    }
})

