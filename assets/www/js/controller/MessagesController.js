app

.controller('MessagesCtrl', function($scope, JianJianBaoAPISrv, $q, $location){    

  $scope.chatrooms = [];
  $scope.userId = Number($scope.userId);

  //Get the chatrooms
  JianJianBaoAPISrv.getChatRoomsByPosterAndUser($scope.posterId, $scope.userId)
  .then(function(chatRooms) {
    var chatRoomsWithUser = chatRooms.map(function(chatRoom) {
      if(chatRoom !== null && chatRoom !== undefined) {
        return JianJianBaoAPISrv.getUser(chatRoom.users[0])
        .then(function(user) {
          chatRoom.targetpeople = user;
          return chatRoom;
        })
        .catch(function(err){
          console.log(err);
        })    
      }
    });

    return $q.all(chatRoomsWithUser);
  })
  .then(function(chatRoomsWithUser){
    for(var i=0; i<chatRoomsWithUser.length; i++) {
      if(chatRoomsWithUser[i] !== null && chatRoomsWithUser[i] !== undefined) {
        $scope.chatrooms.push(chatRoomsWithUser[i]);
      }
    }
  }) 
  .catch(function(err){
    console.log(err);
  });

  $scope.joinRoom = function(roomId) {
    io.socket.get("/chatroom/" + roomId);
    //Go to the chatting room
    $location.path("/tab/friends/chatroom/" + roomId);
  };

});