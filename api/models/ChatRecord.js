/**
* ChatRecord.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    "chatRoom" : {
      model:'chatroom'
    },
    "content" : {
      type:'string'
    },
  },

  afterCreate: [
    /**
    * Set ChatRecord Owner automatically
    */
    function setOwner (chatRecord, next) {
      sails.log.silly('ChatRecord.afterCreate.setOwner', chatRecord);
      ChatRecord
        .update({ id: chatRecord.id }, { owner: chatRecord.createdBy})
        .then(function (chatRecord) {
          next();
        })
        .catch(next);
    },
    /**
    * Connect to related chatroom automatically
    */    
    function connectChatRoom (chatRecord, next) {
      sails.log.silly('ChatRecord.afterCreate.connectChatRoom');
      ChatRoom.findOne({ id: chatRecord.chatRoom })
      .then(function (chatRoom) {
        chatRoom.chatRecords = chatRoom.chatRecords || [];
        chatRoom.chatRecords.push(chatRecord.id);
        return ChatRoom.update({id: chatRoom.id}, {chatRecords: chatRoom.chatRecords});
      })
      .then (function (chatRoom) {
        //Distribute the record to all subscribed user
        ChatRoom.message(chatRoom[0].id, chatRecord);
        next();
      })
      .catch(next);
    },
  ],

   beforeDestroy: [
    /**
    * disconnect to related chatroom automatically
    */    
    function disconnectChatRoom (criteria, next) {
      sails.log.silly('ChatRecord.afterDestroy.disconnectChatRoom', criteria);
      ChatRecord.findOne({ id : criteria.where.id})
      .then(function(chatRecord) {
        return ChatRoom.findOne({ id: chatRecord.chatRoom})
      })
      .then(function (chatRoom) {
          chatRoom.chatRecords = chatRoom.chatRecords || [];
          var index = chatRoom.chatRecords.indexOf(criteria.where.id);
          if (index > -1) {
            chatRoom.chatRecords.splice(index, 1);
          }
          return ChatRoom.update({id: chatRoom.id}, {chatRecords: chatRoom.chatRecords});
      })
      .then (function (poster) {
        next();
      })
      .catch(next);
    },
  ]
};

