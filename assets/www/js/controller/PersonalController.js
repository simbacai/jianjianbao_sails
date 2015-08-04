 
app

.controller('PersonalCtrl', function($location, $scope, JianJianBaoAPISrv){  

	JianJianBaoAPISrv.getUser($scope.userId)
    .then(function(user){
      $scope.private = user;
    }) 

});