/**
 * ChatRoomController
 *
 * @description :: Server-side logic for managing Chatrooms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	_config: {
    actions: false,
    shortcuts: false,
    rest: true
  },
  
  subscribe: function (req, res) {

    ChatRoom.findOne(req.params.id)
    .then(function (chatRoom) {
      ChatRoom.subscribe(req, chatRoom.id, ['message']);
      res.ok();
    })
    .catch(function (err) {
      sails.error.log(err);
      res.serverError(err);
    });
  },
};

