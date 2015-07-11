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

exports.wxPay = function(opts, posterToPay, res) {
	opts["out_trade_no"] = '1247772901' + getNowFormatDate() + Math.random().toString().substr(2,10);
	opts["notify_url"] = 'http://www.jianjianbao.cn/pay/wxpaynotify';
	opts["spbill_create_ip"] = '121.41.75.11';
	wxpay.getBrandWCPayRequestParams(opts, function(err, result){
	    // in express
	    if(err) {
	    	sails.log.error(err);
        res.serverError(err);
	    } else {
        //Here should create a order record
        result["out_trade_no"] = opts["out_trade_no"];
        result["poster"] = posterToPay.id;
        result["payer"] = posterToPay.createdBy;
	    	sails.log(result);
        Payrecord.create (result)
        .then(function(payrecord) {
          sails.log.info("Created payrecord" + payrecord);
          res.ok({payargs: payrecord});
        })
        .catch(function(err) {
          sails.log.error(err);
          res.serverError(err);
          //create record fail, so need to close the order
          //closeOrder(result.out_trade_no);
        })	
	    }	    
	  });  
}

var wxCallback = wxpay.useWXCallback(function(msg, req, res, next) {
    //Need to check whether msg need to be transfered to Json
    sails.log.info(msg);

    //No parameter check yet, told weixin server success get the result directly
    res.success();

    if(msg.return_code == "SUCCESS") {
      //Todo: actually need to use the sign to check the msg validity 
      Payrecord.findOne({out_trade_no: msg.out_trade_no})
      .then(function (payrecord) {
        return Payrecord.update({id: payrecord.id}, msg);
      })
      .then(function (payrecords) {
        return Poster.findOne(payrecords[0].poster);
      })
      .then(function (poster) {
        if(msg.result_code == "SUCCESS") {
          return Poster.update({id: poster.id}, {status: "payed"});
        } else {
          return null;
        }
      })
      .catch(function (err) {
        sails.log.error(err);
      })  
    } 

    if(msg.return_code == "FAIL") {
      sails.log.error(msg);
    } 
  });

exports.wxPayCallback = function(req, res, next) {
	  wxCallback(req, res, next);
}

exports.queryorder = function(req, res) {
  Payrecord.findOne({out_trade_no: req.query.order})
  .then(function(payorder) {
    if(payorder.result_code !== undefined || payorder.trade_state !== undefined) {
      res.ok({order:payorder});
    } else {
      wxpay.queryOrder({out_trade_no: req.query.order}, function(err, queryresult) {
          if(err) {
            sails.log.error(err);
            res.serverError(err);
          } else {
            //Here needs to update the payrecord
            sails.log(queryresult);
            if(queryresult.return_code == "FAIL") {
              sails.log.error(queryresult);
              res.serverError(queryresult);
             } 

            if(queryresult.return_code == "SUCCESS") {
              Payrecord.update({id: payorder.id}, queryresult)
              .then(function (payrecords) {
                res.ok({order: payrecords[0]});
              })
              .catch(function (error) {
                sails.log.error(error);
                res.serverError(error);
              })
            }
          }
        })
    }
  })
  .catch(function (err) {
    sails.log.error(err);
    res.serverError(err);
  })
}

//close order API should be called if some order has not been payed for quite a long time
function closeOrder(orderNumber) {
  wxpay.closeOrder({out_trade_no: orderNumber}, function(err, result) {
    if(err) {
      sails.log.error(err);
    } else {
      sails.log(result);
    }
  })
}