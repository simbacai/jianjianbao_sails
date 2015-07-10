/**
 * JssdkController
 *
 * @description :: Server-side logic for managing jssdks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var weixin = require('weixin-node');
var co = require('co'); 

module.exports = {
	getsign : function (req, res) {

		co(function *() {
    var token = yield weixin.getToken('wxcd3e2f8024ba7f49', 'e90587f697dade57be212bec97da173d');
    console.log('token:', token);

    var ticket = yield weixin.getTicket(token.access_token);
    console.log('ticket:', ticket);
    //return ticket;

     var sign = yield weixin.sign(ticket.ticket, req.query.url);
     console.log('sign:', sign);

     return sign;
	  })
	  .then (function (sign) {
	    //console.log(sign);
	    res.ok(sign);
	  })
	  .catch (function (err) {
	  	sails.log.error(err);
	  	res.serverError(err);
	  });

	}
};

