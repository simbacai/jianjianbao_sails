/**
 * PosterController
 *
 * @description :: Server-side logic for managing posters
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var wxpay = require('../services/wxpay');

module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: true
  },
  
  subscribe: function (req, res) {

		Poster.findOne(req.params.id)
		.then(function (poster) {
		  Poster.subscribe(req, poster.id, ['message']);
		})
		.catch(function (err) {
			sails.error.log(err);
			res.json (400, {errcode: 999});
		});
  },

  wxPay: function (req, res) {
  	var posterToPay = {};
		Poster.findOne(req.params.id)
		.then(function (poster) {
			posterToPay = poster;
		  return User.findOne(poster.createdBy);
		})
		.then(function (user) {
			wxpay({body: poster.subject, total_fee: 1, openid: user.openid}, res);
		})
		.catch(function (err) {
			sails.error.log(err);
			res.json (400, {errcode: 999});
		});
  },


  wxPayCallback: function (req, res) {

  },

};

