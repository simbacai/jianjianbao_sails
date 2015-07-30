app

.controller("HomeCtrl", 
  function($scope, $rootScope, $q, $location, userContextSrv, $ionicModal, $http)  {

    console.log("HomeCtrl: BEGIN................");

    //Load the data
    userContextSrv.
    prepareContext($rootScope.node, $rootScope.poster, $rootScope.user)
    .then(function(){
      $scope.poster = userContextSrv.currentPoster();
    })
})

.controller("HomeProposalCtrl", 
  function($scope, $rootScope, $q, $location, userContextSrv, $ionicModal, $http)  {
    $scope.solution = "";

    //TBD: $scope.solution not reflect the view change
    $scope.propose = function() {
        console.log("################# $scope.propose 开始");

        userContextSrv.proposeAtCurrentNode($scope.solution).then(function(proposal) {
            console.log("################# $scope.propose 完成");
            //return to home page
            $location.path("/tab/home");
        });
    }  
})

.controller("HomeShareCtrl", 
  function($scope, $rootScope, $q, $location, userContextSrv, $ionicModal, $http)  {
})

.controller("HomeProposalLinkPathCtrl", 
  function($scope, $rootScope, $q, $location, userContextSrv, $ionicModal, $http)  {
    $scope.tipsCalc = function(proposalId) {
        $rootScope.tips = [];

        userContextSrv.tipsCalc(proposalId).then(function(tips) {
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
  function($scope, $rootScope, $q, $location, userContextSrv, $ionicModal, $http)  {
    $scope.tipsCalc = function(proposalId) {
        $rootScope.tips = [];

        userContextSrv.tipsCalc(proposalId).then(function(tips) {
            console.log("$scope.tipsCalc: tips= " + angular.toJson(tips))
            $rootScope.tips = tips;

            console.log("################# 跳转至linkpath ");
            //不刷新跳转
            $location.path($rootScope.posterMainPath + "/linkpath/proposal/" + proposalId);

            return;
        });
    }

    $scope.commit = function() {
        userContextSrv.commitProposal($stateParams.proposalid).then(function() {
            return userContextSrv.viewTips();
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
  function($scope, $rootScope, $q, $location, userContextSrv, $ionicModal, $http)  {
    $scope.viewTips = function(proposalId) {
        userContextSrv.viewTips().then(function(tips) {
            console.log("$scope.viewTips: tips= " + angular.toJson(tips))
            $rootScope.tips = tips;

            console.log("################# 跳转至linkpath ");
            //不刷新跳转
            $location.path($rootScope.posterMainPath + "/commitresult");

            return;
        });
    }
})

