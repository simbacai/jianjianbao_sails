app

.controller('AppMainCtrl', function($rootScope, $http, $location, $scope
                                       , dateUtil, userContextSrv, $q){
    $rootScope.poster = {};

    $rootScope.refresh = function() {
        userContextSrv.reloadPosterAndFloors().then(function() {
            $rootScope.poster = userContextSrv.currentPoster();

            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    
    /**
     * 调用: index.html使用ng-init调用
     */
    $rootScope.initUsercontext = function(currentNodeId, currentPosterId, currentUserId) {
        //console.log("current: node=" + currentNodeId + ", poster=" + currentPosterId + ", user=" + currentUserId);

        return userContextSrv.prepareContext(currentNodeId, currentPosterId, currentUserId).then(function() {
            return $rootScope.populateUI();
        });
    }

    /**
     * 调用:
     * 情况1: index.html使用ng-init调用
     * 情况2: PosterCreationCtrl中创建一张新Poster后
     */
    $rootScope.populateUI = function() {

        console.log("################# $rootScope.populateUI 开始");

        $rootScope.poster = userContextSrv.currentPoster();
        //console.log("$rootScope.poster=" + angular.toJson($rootScope.poster));

        /*
        $rootScope.posterOwner = posterOwner;
        $rootScope.floors = floors.reverse();
        $rootScope.floorOwnerCashe = floorOwnerCashe;
        */

        //不刷新跳转
        $rootScope.posterMainPath = "/node/" + userContextSrv.currentNodeId();
        $location.path($rootScope.posterMainPath);
        //document.title = $rootScope.poster.subject;
        var prefix = "";
        if ($rootScope.poster.tipAmount && $rootScope.poster.tipAmount > 0) {
            prefix = "悬赏" + $rootScope.poster.tipAmount + "元：";
        }
        document.title = prefix + $rootScope.poster.subject;

        console.log("################# $rootScope.populateUI 完成");
    }
    
    //TODO 可以用Filter实现
    $rootScope.timeDiff = function(dateTimeStamp) {
        return dateUtil.timeDiff(dateTimeStamp);
    }
    
})

.controller("PosterMainCtrl", function($scope, $rootScope, $q, $location
    , userContextSrv
    , $ionicModal, $ionicPopover){
    console.log("PosterMainCtrl: BEGIN................");

    $rootScope.myNewPoster = {"tipAmount" : 0};

    $ionicModal.fromTemplateUrl('/www/templates/proposal_creation.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.proposeBtnClick = function() {
      $scope.modal.show();
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
            $location.path($rootScope.posterMainPath + "/linkpath/proposal/" + proposalId);

            return;
        });
    }

    $scope.tipsCalc = function(proposalId) {
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
    
    $ionicModal.fromTemplateUrl('/www/templates/poster_creation.html', {
      scope: $scope
    }).then(function(modal) {
        $scope.posterCreationModal = modal;
    });

    $ionicPopover.fromTemplateUrl('/www/templates/main_menu.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.setTipAmount = function(amount) {
        $rootScope.myNewPoster.tipAmount = amount;
    };


    $scope.createPoster = function() {

        var newPoster = {
            "subject" : $rootScope.myNewPoster.subject 
            , "body" : $rootScope.myNewPoster.body
            , "tipAmount":  $rootScope.myNewPoster.tipAmount
        };
        
        var successCallBack = function(newPoster) {
            $rootScope.myNewPoster = {};
            $scope.posterCreationModal.hide();

            $rootScope.populateUI();
        }

        userContextSrv.createPosterAndUpdateContext(newPoster).then(function(newPoster) {
            $rootScope.myNewPoster = {};
            $scope.posterCreationModal.hide();

            $rootScope.populateUI();
        });
    };
})

.controller("ProposeCtrl", function($scope, $rootScope, userContextSrv){
    console.log("ProposeCtrl: BEGIN................");

})

.controller("LinkPathCtrl", function($scope, $rootScope, userContextSrv){
    console.log("LinkPathCtrl: BEGIN................");

})

;
