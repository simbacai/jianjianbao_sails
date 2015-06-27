app

.controller('AppMainCtrl', function($rootScope, $http, $location, $scope
                                       , dateUtil, userContextSrv, $q){
    $rootScope.poster = {};

    $rootScope.refresh = function() {
        userContextSrv.reloadPosterAndFloors(function() {

            $rootScope.poster = userContextSrv.currentPoster();
            //$rootScope.floors = floors.reverse();

            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    
    /**
     * 被调用，情况1: index.html使用ng-init调用
     */
    $rootScope.initUsercontext = function(currentNodeId, currentPosterId, currentUserId) {
        //console.log("current: node=" + currentNodeId + ", poster=" + currentPosterId + ", user=" + currentUserId);

        return userContextSrv.prepareContext(currentNodeId, currentPosterId, currentUserId).then(function() {
            return $rootScope.populateUI();
        });
    }

    $rootScope.initUsercontext_1 = function(currentNodeId, currentPosterId, currentUserId) {
        console.log("############# 1");

        var feachPoster = function(currentPosterId) {
            console.log("############# 2.1");

            var promise =  
                $http.get("/poster/" + "558a92f511e92001882d58f0")
                .then(function(response) {
                    console.log(angular.toJson(response));
                    console.log("############# 2.2");
                }); 
            return promise;
        };

        var feachProposals = function() {
            console.log("############# 3.1");

            var proposals = [
                "558aae0111e92001882d58fa",
                "558ab19511e92001882d5901",
                "558ab19511e92001882d5903",
                "558ab1b911e92001882d5905"
            ];

            var promises = proposals.map(function(proposalId) {
                console.log("############# 3.2." + proposalId + " 开始");

                return $http({
                    url   : "/proposal/" + proposalId,
                    method: 'GET'
                }).success(function() {
                    console.log("############# 3.2." + proposalId + " 完成")
                });
            });

            return $q.all(promises);
        };

        var feachUsers = function() {
            console.log("############# 4");
        };

        feachPoster(currentNodeId).then(function() {
            return feachProposals();
        }).then(function() {
            return feachUsers();
        }).then(function() {
            return $rootScope.populateUI();
        });
    }

    /**
     * 被调用，情况1: index.html使用ng-init调用
     * 被调用，情况2: PosterCreationCtrl中创建一张新Poster后
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
            prefix = "悬赏" + $rootScope.poster.tip.tip_amount + "元：";
        }
        document.title = prefix + $rootScope.poster.subject;

        console.log("################# $rootScope.populateUI 完成");
    }
    
    $scope.HeaderUrlOfuser = function(userId) {
        return
    };

    
    //TODO 可以用Filter实现
    $rootScope.timeDiff = function(dateTimeStamp) {
        return dateUtil.timeDiff(dateTimeStamp);
    }
    
})

.controller("PosterMainCtrl", function($scope, $rootScope
    , userContextSrv
    , $ionicModal, $ionicPopover){
    console.log("PosterMainCtrl: BEGIN................");

    $rootScope.myNewPoster = {"tip" : {"tip_amount" : 0}};

    $ionicModal.fromTemplateUrl('/www/templates/proposal_creation.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.proposeBtnClick = function() {
      $scope.modal.show();
    }

    $scope.propose = function() {

        userContextSrv.proposeAtCurrentNode($rootScope.solution, function(data) {
            console.log("proposeAtCurrentNode:" + angular.toJson(data));
            $rootScope.solution = "";
            $scope.modal.hide();
            $rootScope.refresh();
        }, null);
    }

    
    $ionicModal.fromTemplateUrl('/www/templates/poster_creation.html', {
      scope: $scope
    }).then(function(modal) {
        $scope.posterCreationModal = modal;

        //TODO 上线前删除
        //$scope.posterCreationModal.show();
    });



    $ionicPopover.fromTemplateUrl('/www/templates/main_menu.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.setTipAmount = function(amount) {
        $rootScope.myNewPoster.tip.tip_amount = amount;
    };


    $scope.createPoster = function() {

        var newPoster = {
            "subject" : $rootScope.myNewPoster.subject 
            , "body" : $rootScope.myNewPoster.body
        };
        
        var successCallBack = function(newPoster) {

            $rootScope.myNewPoster = {};
            $scope.posterCreationModal.hide();

            $rootScope.populateUI();
        }

        userContextSrv.createPosterAndUpdateContext(newPoster, successCallBack);
    };


})

.controller("ProposeCtrl", function($scope, $rootScope, userContextSrv){
    console.log("ProposeCtrl: BEGIN................");

})

;
