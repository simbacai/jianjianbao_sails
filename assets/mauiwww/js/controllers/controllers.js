
app.controller('AppMainCtrl', function($rootScope, $http, $location, $scope
                                       , dateUtil, userContextSrvStub, userContextSrv){
    $rootScope.poster = {};
        
    $scope.changeUserContext = function() {
        
        userContextSrvStub.changeUserContext();
        $scope.currentUser = userContextSrvStub.currentUser().nickname;
        
        console.log("currentNode=" + userContextSrvStub.currentNode()._id);
    }
    
    $rootScope.refreshFlooar = function() {
        userContextSrv.getFloors(function(floors, floorOwnerCashe) {
            $rootScope.floors = floors;
            $rootScope.floorOwnerCashe = floorOwnerCashe;
            //console.log(angular.toJson($rootScope.floors));
            console.log("$rootScope.refresh() done, $scope.floors.length=" + $rootScope.floors.length);
        }, null);
    }
    
    /**
     * 被调用，情况1: index.html使用ng-init调用
     * 被调用，情况2: PosterCreationCtrl中创建一张新Poster后
     */
    $rootScope.initUsercontext = function(nodeId) {
        userContextSrv.prepareContext(nodeId, function() {
            //console.log("AppMainCtrl: posterOwner=" + angular.toJson(userContextSrv.posterOwner()));
            console.log("AppMainCtrl: isCurrentUserThePosterOwner=" + userContextSrv.isCurrentUserThePosterOwner());
            
            $rootScope.refreshFlooar();
            
            $rootScope.posterOwner = userContextSrv.posterOwner();
            $rootScope.poster = userContextSrv.currentPoster();
            
            //不刷新跳转
            $rootScope.posterMainPath = "/node/" + nodeId;
            $location.path($rootScope.posterMainPath);
            document.title = $rootScope.poster.subject;
        });
    }
    
    //TODO 可以用Filter实现
    $rootScope.timeDiff = function(dateTimeStamp) {
        return dateUtil.timeDiff(dateTimeStamp);
    }
    
});

app.controller('WelcomeCtrl', function($rootScope, $http) {
    document.title = "荐荐宝";
    $rootScope.posterMainPath = "/poster";
});

app.controller('PosterMainCtrl', function($scope, $rootScope, $routeParams, $location, userContextSrv){
    console.log("PosterMainCtrl BEGIN: node=" + $routeParams.node
                + ", $rootScope.poster.subject=" + $rootScope.poster.subject);
    document.title = $rootScope.poster.subject;
    
    
    $scope.floorsCount = function() {
        if ($scope.floors) {
            return $scope.floors.length + 1;
        } else {
            return 1;
        }
    };
    
    $scope.floorSeclected = function(index) {
        $scope.floorIndexSeclected = index;
    };
    
    $scope.isCurrentUserThePosterOwner = userContextSrv.isCurrentUserThePosterOwner;
    
    $scope.testRefresh = function() {
        console.log("testRefresh");
    }
    
    
    
});

app.controller('PosterCreationCtrl', function($scope, $rootScope, $location, $http, $routeParams
                                              , posterSrv, userContextSrv){
    
    document.title = "发布";
    $scope.poster = {tip:{}};
    
    if ($routeParams.id && ($rootScope.poster._id == null))   {
        $rootScope.loadPoster($routeParams.id);
    }
    
    //actions
    
    $scope.createPoster = function() {
        var newPoster = {
            "subject" : $scope.poster.subject 
            , "body" : $scope.poster.body 
            , "tip" : {
                "method" : "现金红包"
                , "tip_amount" : $scope.poster.tip.tip_amount
            }
        };
        
        var successCallBack = function(data) {
            
            console.log("PosterCreationCtrl createPoster:" + angular.toJson(data));
            
            if (!data || !data["currentNode"]) {
                console.log("Error in PosterCreationCtrl createPoster: !data || !data[currentNode]");
                //TODO ERROR
            }
            
            var newNodeId = data["currentNode"];
            
            $rootScope.initUserontext(newNodeId);
        }
        posterSrv.add(newPoster, successCallBack, null);
    }
    
    //events
    
    $scope.$on('mobile-angular-ui.state.changed.activeSeagmentForAmount', function(e, newVal, oldVal) {
        $scope.poster.tip.tip_amount = newVal;
    });
    
});

app.controller("ProposeCtrl", function($scope, $rootScope, userContextSrv){
    
    $scope.solution = "";
    
    $scope.propose = function() {
        console.log("ProposeCtrl.propose()");
            
        userContextSrv.proposeAtCurrentNode($scope.solution, function(data) {
            console.log("proposeAtCurrentNode:" + angular.toJson(data));
        }, null);
    }
});
    


