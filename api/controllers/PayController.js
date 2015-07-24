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
			if(poster.status == "payed" || poster.status == "closed") {
		  	res.forbidden("Poster status is " + poster.status);
		  	return;
		  }
		  if(req.user.id != poster.createdBy) {
		  	res.forbdiden("Not authorized to pay this poster");
		  	return;
		  }
			posterToPay = poster;
		  return User.findOne(poster.createdBy);
		})
		.then(function (user) {
			pay.wxPay({body: posterToPay.subject, total_fee: Number(posterToPay.tipAmount)*100, openid: user.openid}, posterToPay, res);
		})
		.catch(function (err) {
			res.serverError (err);
		});
  },


  wxPayNotify: function (req, res, next) {
  	if(req.body.xml.return_code == "SUCCESS") {
      //Todo: actually need to use the sign to check the msg validity 
      Payrecord.findOne({out_trade_no: req.body.xml.out_trade_no})
      .then(function (payrecord) {
        return Payrecord.update({id: payrecord.id}, req.body.xml);
      })
      .then(function (payrecords) {
        return Poster.findOne(payrecords[0].poster);
      })
      .then(function (poster) {
        if(req.body.xml.result_code == "SUCCESS") {
          return Poster.update({id: poster.id}, {status: "payed"});
        } else {
          return null;
        }
      })
      .then(function (poster) {
      	res.ok();
      })
      .catch(function (err) {
        res.serverError(err);
      })  
    } 

    if(req.body.xml.return_code == "FAIL") {
      sails.log.error(msg);
    } 
  },

  wxQueryOrder: function (req, res) {
  	//First check the internal order status

  	//If nt paye
  	pay.queryorder(req, res);
  },
};

