 
app

.controller('FriendsCtrl', function($scope, $http){ 

    var url = "/poster/"  + $scope.posterId + "/users" ;
    $http.get(url)
    .then(function (data){
      $scope.friends = data.data;
    });  
})

.controller('FriendsUserCtrl', function($scope, JianJianBaoAPISrv,$stateParams){ 
    var userId = $stateParams.id;

    JianJianBaoAPISrv.getUser(userId)
    .then(function(user){
      $scope.displayUser = user;
    })
})

.controller('FriendsChatCtrl', function($scope, JianJianBaoAPISrv,$stateParams){ 
    var userId = $stateParams.id;

    JianJianBaoAPISrv.getUser(userId)
    .then(function(user){
      $scope.friend = user;
    })

    $scope.showTime = true;

    var alternate,
      isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

    $scope.sendMessage = function() {
      alternate = !alternate;

      var d = new Date();
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

      $scope.messages.push({
        userId: alternate ? '12345' : '54321',
        text: $scope.data.message,
        time: d
      });

      delete $scope.data.message;
      $ionicScrollDelegate.scrollBottom(true);

    };


    $scope.inputUp = function() {
      if (isIOS) $scope.data.keyboardHeight = 216;
      $timeout(function() {
        $ionicScrollDelegate.scrollBottom(true);
      }, 300);

    };

    $scope.inputDown = function() {
      if (isIOS) $scope.data.keyboardHeight = 0;
      $ionicScrollDelegate.resize();
    };

    $scope.closeKeyboard = function() {
      // cordova.plugins.Keyboard.close();
    };


    $scope.data = {};
    $scope.myId = '12345';
    $scope.messages = [];
    
});