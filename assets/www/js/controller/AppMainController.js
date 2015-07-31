app

.controller('AppMainCtrl', function($http, $location, $scope,
                                       JianJianBaoAPISrv, $q){

    $scope.initialize = function(node, poster, user) {
        //console.log("current: node=" + currentNodeId + ", poster=" + currentPosterId + ", user=" + currentUserId);
        $scope.nodeId = node;
        $scope.posterId = poster;
        $scope.userId = user;
    };

    //TODO 可以用Filter实现
    $scope.timeDiff = function(dateTimeStamp) {
        return dateUtil.timeDiff(dateTimeStamp);
    };
    
});
