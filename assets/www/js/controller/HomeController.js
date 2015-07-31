app

.controller("HomeCtrl", 
  function ($scope, lodash, $q, $window, JianJianBaoAPISrv)  {
    console.log("HomeCtrl: BEGIN................");
    $scope.poster = {};
    $scope.proposals = [];

    loadHomePage();

    $scope.refresh = function() {
      $window.location.href = "/node/" + $scope.nodeId;
    };

    function loadHomePage() {
      //Load the Poster
      return JianJianBaoAPISrv
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
     
        var results = lodash.each($scope.poster.proposals.reverse(), function(proposalId) {
            return promise.then(function() {
                return JianJianBaoAPISrv.getProposal(proposalId);
            }).then(function(proposal) {
                // ...
                $scope.proposals.push(proposal);
                return proposal;
            });
        });

        return $q.all(results);   
      });
    }


})

.controller("HomeProposalCtrl", 
  function ($scope, $location, JianJianBaoAPISrv,$controller, $window)  {
    $controller('HomeCtrl', {$scope : $scope}); //Make HomeProposalCtrl as child of HomeCtrl
    $scope.solution = "";
    $scope.propose = function() {
        console.log("################# $scope.propose 开始");
        //Ugly jump with refresh, i need the homepage refresh automatially
        //$window.location.href = "/node/" + $scope.nodeId;

        
        JianJianBaoAPISrv.postProposal($scope.solution, $scope.posterId, $scope.nodeId)
        .then(function(response) {
            console.log("################# $scope.propose 完成");
            JianJianBaoAPISrv
            .getProposal(response.data.id)
            .then(function (proposal) {
              //To be done: How to update the Home Data model since HomeProposalCtrl is not child of HomeCtrl???
              $scope.proposals.push(proposal);
              //return to home page
              //$location.path("/tab/home");
              $window.location.href = "/node/" + $scope.nodeId;
            });
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

