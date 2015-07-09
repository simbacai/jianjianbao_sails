// api/services/wxpay.js

var WXPay = require('weixin-pay');
var fs = require('fs');

module.exports = wxPay;

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

function wxPay (opts) {
	opts["out_trade_no"] = '1247772901' + getNowFormatDate() + Math.random().toString().substr(2,10);
	opts["notify_url"] = 'http://www.jianjianbao.cn/wxpay/notify';
	opts["spbill_create_ip"] = '121.41.75.11';
	wxpay.getBrandWCPayRequestParams(opts, function(err, result){
	    // in express
	    if(err) {
	    	sails.log.error(err);
	    } else {
	    	sails.log(result);
	    	res.render('wxpay/jsapi', { payargs: result});	
	    }	    
	  });  
}

function wxPayCallback() {
	return wxpay.useWXCallback(function(msg, req, res, next) {
		//To handle business logic

		res.success();
	})
}