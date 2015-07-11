/**
 * PayController
 *
 * @description :: Server-side logic for managing pays
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var pay = require('../services/wxpay');

module.exports = {
	wxPay: function (req, res) {
  	var posterToPay = {};
		Poster.findOne(req.query.poster)
		.then(function (poster) {
			//1) Need to check whether req.user is the owner of poster
			posterToPay = poster;
		  return User.findOne(poster.createdBy);
		})
		.then(function (user) {
			pay.wxPay({body: posterToPay.subject, total_fee: 1, openid: user.openid}, res);
		})
		.catch(function (err) {
			sails.log.error(err);
			res.json (400, {errcode: 999});
		});
  },


  wxPayNotify: function (req, res, next) {
  	pay.wxPayCallback(req, res, next);
  },

  wxQueryOrder: function (req, res) {
  	pay.queryorder(req, res);
  },
};

