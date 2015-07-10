// api/services/wxpay.js

var WXPay = require('weixin-pay');
var fs = require('fs');


var wxpay = WXPay({
    appid: 'wxcd3e2f8024ba7f49',
    mch_id: '1247772901',
    partner_key: 'JianJian35398841JianJian35398841', 
    pfx: fs.readFileSync('./apiclient_cert.p12'), 
});

function getNowFormatDate(){
    var day = new Date();
    var Year = 0;
    var Month = 0;
    var Day = 0;
    var CurrentDate = "";
    Year= day.getFullYear();//Ö§³ÖIEºÍ»ðºüä¯ÀÀÆ÷.
    Month= day.getMonth()+1;
    Day = day.getDate();
    CurrentDate += Year;
    if (Month >= 10 ){
     CurrentDate += Month;
    }
    else{
     CurrentDate += "0" + Month;
    }
    if (Day >= 10 ){
     CurrentDate += Day ;
    }
    else{
     CurrentDate += "0" + Day ;
    }
    return CurrentDate;
  }

exports.wxPay = function(opts, res) {
	opts["out_trade_no"] = '1247772901' + getNowFormatDate() + Math.random().toString().substr(2,10);
	opts["notify_url"] = 'http://www.jianjianbao.cn/pay/wxpaynotify';
	opts["spbill_create_ip"] = '121.41.75.11';
	wxpay.getBrandWCPayRequestParams(opts, function(err, result){
	    // in express
	    if(err) {
	    	sails.log.error(err);
	    } else {
        //Here should create a order record
        result["out_trade_no"] = opts["out_trade_no"];
	    	sails.log(result);
	    	res.ok({ payargs: result});	
	    }	    
	  });  
}

var wxCallback = wxpay.useWXCallback(function(msg, req, res, next) {
    
    sails.log(msg);
    
    //Here need to check the msg content
    //check the out_trade_no and update the internal record accordingly

    res.success();
  });

exports.wxPayCallback = function(req, res, next) {
	  wxCallback(req, res, next);
}

exports.queryorder = function(req, res) {
  wxpay.queryOrder({out_trade_no: req.query.order}, function(err, order) {
    if(err) {
      sails.log.error(err);
    } else {
      sails.log(order);
      res.ok({order:order});
    }

  })
}

//close order API should be called if some order has not been payed for quite a long time
exports.closeorder = function(orderNumber) {
  wxpay.closeOrder({out_trade_no: orderNumber}, function(err, result) {
    if(err) {
      sails.log.error(err);
    } else {
      sails.log(result);
    }
  })
}