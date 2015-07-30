app

.controller("HomeCtrl", 
  function($scope, $rootScope, $q, $location, userContextSrv, $ionicModal, $http)  {

    console.log("HomeCtrl: BEGIN................");

    $ionicModal.fromTemplateUrl('/www/templates/proposal_creation.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.proposalModal = modal;
    });


    $ionicModal.fromTemplateUrl('/www/templates/share.html', {
      scope: $scope
    }).then(function(modal) {
        $scope.shareModal = modal;
    });


    $scope.proposeBtnClick = function() {
        $scope.proposalModal.show();
    }

    $scope.commit = function(proposalId) {
        userContextSrv.commitProposal(proposalId).then(function() {
            return userContextSrv.viewTips();
        }).then(function(tips) {
            $rootScope.tips = tips;

            console.log("################# 跳转至linkpath ");
            //不刷新跳转
            $location.path($rootScope.posterMainPath + "/linkpath/proposal/" + proposalId);

            return;
        });
    }

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

    $scope.propose = function() {
        console.log("################# $scope.propose 开始");

        userContextSrv.proposeAtCurrentNode($rootScope.solution).then(function() {
            console.log("################# $scope.propose 完成");
            $rootScope.solution = "";
            $scope.modal.hide();
            $rootScope.refresh();
        });
    }  

    //Load the data
    userContextSrv.
    prepareContext($rootScope.node, $rootScope.poster, $rootScope.user)
    .then(function(){
      $scope.poster = userContextSrv.currentPoster();
    })
    
})

.controller("LinkPathCtrl", function($scope, $rootScope, userContextSrv, $stateParams, $location){
    // + $routeParams.proposalid
    console.log("LinkPathCtrl: BEGIN................$routeParams.proposalId=" + $stateParams.proposalid);

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

});
