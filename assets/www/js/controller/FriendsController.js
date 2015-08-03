 
app

.controller('FriendsCtrl', function($scope, $http){ 

    var url = "/poster/"  + $scope.posterId + "/users" ;
    $http.get(url)
    .then(function (data){
      $scope.friends = data.data;
    });  
})

.controller('FriendsUserCtrl', function($scope, JianJianBaoAPISrv,$stateParams, $location){ 
    var userId = $stateParams.id;

    JianJianBaoAPISrv.getUser(userId)
    .then(function(user){
      $scope.displayUser = user;
    })

    $scope.inviteChatting = function(userId) {
       //Check whether there is chatroom with userId
       var users = [Number($scope.userId), userId];
       var users_normal = users.slice();
       var users_reverse = users.reverse();
       JianJianBaoAPISrv.getChatroomByUsers(users_normal, $scope.posterId)
       .then(function(existingChatRoom) {
        if(existingChatRoom !== null && existingChatRoom.length !== 0)
        {
          //Subscribe to the chatRoom
          io.socket.get("/chatroom/" + existingChatRoom[0].id);
          //Go to the chatting room
          $location.path("/tab/friends/chatroom/" + existingChatRoom[0].id);
          return;
        } else {
          return JianJianBaoAPISrv.getChatroomByUsers(users_reverse, $scope.posterId)
        }
       })
      .then(function(existingChatRoomReverse) {
        if(existingChatRoomReverse !== null && existingChatRoomReverse.length !== 0)
        {
          //Subscribe to the chatRoom
          io.socket.get("/chatroom/" + existingChatRoomReverse[0].id);
          //Go to the chatting room
          $location.path("/tab/friends/chatroom/" + existingChatRoomReverse[0].id);
          return;
        } else {
          return JianJianBaoAPISrv.postChatroom($scope.posterId, users_normal);
        }
       })
       .then(function(newChatRoom) {
        //Subscribe to the chatRoom
        io.socket.get("/chatroom/" + newChatRoom.id);
        //Go to the chatting room
        $location.path("/tab/friends/chatroom/" + newChatRoom.id);
       })
       .catch(function(err) {
        console.log(err);
       })

    }
})

.controller('FriendsChatCtrl', function($scope, lodash, JianJianBaoAPISrv,$stateParams, $ionicScrollDelegate, $timeout){ 
    var roomId = $stateParams.id;

    JianJianBaoAPISrv.getChatroomById(roomId)
    .then(function(chatRoom){
      var index = chatRoom.users.indexOf(Number($scope.myId));
      if(index >= 0) {
        chatRoom.users.splice(index, 1);
      }
      return chatRoom.users;
    })
    .then(function(guestUser) {
      return JianJianBaoAPISrv.getUser(guestUser[0]);  
    })
    .then(function(guest) {
      $scope.friend = guest;
      return JianJianBaoAPISrv.getChatRecords(roomId);
    })
    .then(function(chatRecords) {
      if(chatRecords !== null) {
        for(var i=0; i < chatRecords.length; i++) {
            var d = new Date(chatRecords[i].createdAt);
            d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
            chatRecords[i].createdAt = d; 
            chatRecords[i].createdBy = String(chatRecords[i].createdBy);
            $scope.messages.push(chatRecords[i]);
        }  
      }
      
      return null;
    })
    .then(function() {
      //monitor the chatting
        io.socket.on('chatroom', function(msg) {
          var d = new Date(msg.data.createdAt);
          d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
          msg.data.createdAt = d; 
          msg.data.createdBy = String(msg.data.createdBy);   
          $scope.messages.push(msg.data)});
    });

    $scope.showTime = true;

    var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

    $scope.sendMessage = function() {

      var newChatRecord = {};
      newChatRecord.chatRoom = roomId;
      newChatRecord.content = $scope.data.message;

      JianJianBaoAPISrv.postChatRecord(newChatRecord);

      delete $scope.data.message;
      $ionicScrollDelegate.scrollBottom(true);
    };


    $scope.inputUp = function() {
      //Todo, keyboardHeight set according to different platform
      if(isIOS) $scope.data.keyboardHeight = 216;
      $timeout(function() {
        $ionicScrollDelegate.scrollBottom(true);
      }, 300);
    };

    $scope.inputDown = function() {
      //Todo, keyboardHeight set according to different platform
      if(isIOS) $scope.data.keyboardHeight = 0;
      $ionicScrollDelegate.resize();
    };

    $scope.closeKeyboard = function() {
      // cordova.plugins.Keyboard.close();
    };


    $scope.data = {};
    $scope.myId = $scope.userId;
    $scope.messages = [];
    
});
