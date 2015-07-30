 
app

.controller('FriendsCtrl', function($rootScope, $http, $location, $scope
                                       , dateUtil, userContextSrv, $q){   
    $scope.userEntryClick = function(index) {

        $ionicModal.fromTemplateUrl('/www/templates/user.html', {
          scope: $scope
        }).then(function(modal) {
            $scope.displayUser = $scope.poster.users[index];
            $scope.userModal = modal;
            modal.show();
        });
    }

        $scope.chatClick = function(friend) {

        $ionicModal.fromTemplateUrl('/www/templates/chat.html', {
          scope: $scope
        }).then(function(modal) {
            $scope.friend = friend;
            $scope.chatModal = modal;
            modal.show();
        });
    }
});