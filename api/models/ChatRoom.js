/**
* ChatRoom.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    "poster" : {
      model:'poster'
    },
    "users" : {
      type:'array'
    },
    "chatRecords" : {
      type:'array'
    }, 
  },


  afterCreate: [
    /**
    * Set ChatRoom Owner automatically
    */
    function setOwner (chatRoom, next) {
      sails.log.silly('ChatRoom.afterCreate.setOwner', chatRoom);
      ChatRoom
        .update({ id: chatRoom.id }, { owner: chatRoom.createdBy})
        .then(function (chatRoom) {
          next();
        })
        .catch(next);
    },
    /**
    * Connect to related Poster automatically
    */    
    function connectPoster (chatRoom, next) {
      sails.log('ChatRoom.afterCreate.connectPoster');
      Poster.findOne({ id: chatRoom.poster })
      .then(function (poster) {
        poster.chatRooms = poster.chatRooms || [];
        poster.chatRooms.push(chatRoom.id);
        return Poster.update({id: poster.id}, {chatRooms: poster.chatRooms});
      })
      .then (function (poster) {
        Poster.message(poster[0].id, _.merge(chatRoom, {msgType: "ChatRoom"}));
        next();
      })
      .catch(next);
    },
  ],

  beforeDestroy: [
    /**
    * disconnect to related Poster automatically
    */    
    function disconnectPoster (criteria, next) {
      sails.log('ChatRoom.afterDestroy.disconnectPoster', criteria);
      ChatRoom.findOne({ id : criteria.where.id})
      .then(function(chatRoom) {
        return Poster.findOne({ id: chatRoom.poster})
      })
      .then(function (poster) {
          poster.chatRooms = poster.chatRooms || [];
          var index = poster.chatRooms.indexOf(criteria.where.id);
          if (index > -1) {
            poster.chatRooms.splice(index, 1);
          }
          return Poster.update({id: poster.id}, {chatRooms: poster.chatRooms});
      })
      .then (function (poster) {
        next();
      })
      .catch(next);
    },
  ]
};

