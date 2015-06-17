angular.module('app.controllers', [])

.controller('AppMainCtrl', function($rootScope, $http, $location, $scope
                                       , dateUtil, userContextSrvStub, userContextSrv){
    $rootScope.poster = {};
        
    $scope.changeUserContext = function() {
        
        userContextSrvStub.changeUserContext();
        $scope.currentUser = userContextSrvStub.currentUser().nickname;
        
        console.log("currentNode=" + userContextSrvStub.currentNode()._id);
    }

    $rootScope.refresh = function() {
        userContextSrv.loadPosterAndFloors(function(currentPoster, posterOwner, floors, floorOwnerCashe) {

            $rootScope.posterOwner = posterOwner;
            $rootScope.poster = currentPoster;
            $rootScope.floors = floors.reverse();
            $rootScope.floorOwnerCashe = floorOwnerCashe;

            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        }, null);
    }
    
    /**
     * 被调用，情况1: index.html使用ng-init调用
     * 被调用，情况2: PosterCreationCtrl中创建一张新Poster后
     */
    $rootScope.initUsercontext = function(nodeId) {
        userContextSrv.prepareContext(nodeId, function(currentPoster, posterOwner, floors, floorOwnerCashe) {
            //console.log("AppMainCtrl: posterOwner=" + angular.toJson(userContextSrv.posterOwner()));
            console.log("AppMainCtrl: isCurrentUserThePosterOwner=" + userContextSrv.isCurrentUserThePosterOwner());
            
            $rootScope.posterOwner = posterOwner;
            $rootScope.poster = currentPoster;
            $rootScope.floors = floors.reverse();
            $rootScope.floorOwnerCashe = floorOwnerCashe;
            
            //不刷新跳转
            $rootScope.posterMainPath = "/node/" + nodeId;
            $location.path($rootScope.posterMainPath);
            //document.title = $rootScope.poster.subject;
            var prefix = "";
            if ($rootScope.poster.tip.tip_amount > 0) {
                prefix = "悬赏" + $rootScope.poster.tip.tip_amount + "元：";
            }
            document.title = prefix + $rootScope.poster.subject;
        });
    }
    
    $scope.createContact = function(u) {        
      $scope.contacts.push({ name: u.firstName + ' ' + u.lastName });
      $scope.modal.hide();
    };

    
    //TODO 可以用Filter实现
    $rootScope.timeDiff = function(dateTimeStamp) {
        return dateUtil.timeDiff(dateTimeStamp);
    }
    
})

.controller("PosterMainCtrl", function($scope, $rootScope
    , userContextSrv, posterSrv
    , $ionicModal, $ionicPopover){
    console.log("PosterMainCtrl: BEGIN................");

    $rootScope.myNewPoster = {"tip" : {"tip_amount" : 0}};

    $ionicModal.fromTemplateUrl('/static/www/templates/proposal_creation.html', {
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

    
    $ionicModal.fromTemplateUrl('/static/www/templates/poster_creation.html', {
      scope: $scope
    }).then(function(modal) {
        $scope.posterCreationModal = modal;

        //TODO 上线前删除
        //$scope.posterCreationModal.show();
    });



    $ionicPopover.fromTemplateUrl('/static/www/templates/main_menu.html', {
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
            , "tip" : {
                "method" : "现金红包"
                , "tip_amount" : $rootScope.myNewPoster.tip.tip_amount
            }
        };
        
        var successCallBack = function(data) {
            
            console.log("PosterCreationCtrl createPoster:" + angular.toJson(data));
            
            if (!data || !data["currentNode"]) {
                console.log("Error in PosterCreationCtrl createPoster: !data || !data[currentNode]");
                //TODO ERROR
            }
            var newNodeId = data["currentNode"];

            $rootScope.myNewPoster = {"tip" : {"tip_amount" : 0}};
            $scope.posterCreationModal.hide();
            $rootScope.initUsercontext(newNodeId);
        }
        posterSrv.add(newPoster, successCallBack, null);
    };


})

.controller("ProposeCtrl", function($scope, $rootScope, userContextSrv){
    console.log("ProposeCtrl: BEGIN................");

})

;
