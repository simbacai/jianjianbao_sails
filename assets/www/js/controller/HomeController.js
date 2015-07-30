app

.controller("HomeCtrl", 
  function($scope, $rootScope, $q, $location, JianJianBaoAPISrv, $ionicModal, $http)  {
    console.log("HomeCtrl: BEGIN................");
    $scope.poster = {};
    $scope.proposals = [];

    //Load the Poster
    JianJianBaoAPISrv.getPoster($rootScope.poster)
    .then(function (poster) {
      $scope.poster = poster;
      return null;
    })
    //Load the proposals
    .then(function () {
      //var proposals = 
      $scope.poster.proposals.reverse().map(function (proposalId) {
        return JianJianBaoAPISrv
        .getProposal(proposalId)
        .then(function (proposal) {
          $scope.proposals.push(proposal);
        });
      })   
    });
})

.controller("HomeProposalCtrl", 
  function($scope, $rootScope, $q, $location, JianJianBaoAPISrv, $ionicModal, $http)  {
    $scope.solution = "";

    //TBD: $scope.solution not reflect the view change
    $scope.propose = function() {
        console.log("################# $scope.propose 开始");

        JianJianBaoAPISrv.proposeAtCurrentNode($scope.solution).then(function(proposal) {
            console.log("################# $scope.propose 完成");
            //return to home page
            $location.path("/tab/home");
        });
    }  
})

.controller("HomeShareCtrl", 
  function($scope, $rootScope, $q, $location, JianJianBaoAPISrv, $ionicModal, $http)  {
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

