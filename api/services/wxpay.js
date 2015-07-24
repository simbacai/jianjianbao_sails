// api/services/wxpay.js

var WXPay = require('weixin-pay');

var wxpay = WXPay(sails.config.wxpay.wxpayconfig);

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
  console.log(sails.config.wxpay);
	opts["out_trade_no"] = sails.config.wxpay.wxpayconfig.mch_id + getNowFormatDate() + Math.random().toString().substr(2,10);
	opts["notify_url"] = sails.config.wxpay.unifiedOrderConfig.notify_url;
	opts["spbill_create_ip"] = sails.config.wxpay.unifiedOrderConfig.spbill_create_ip;
	wxpay.getBrandWCPayRequestParams(opts, function(err, result){
	    // in express
	    if(err) {
        res.serverError(err);
	    } else {
        //Here should create a order record
        result["out_trade_no"] = opts["out_trade_no"];
        result["poster"] = posterToPay.id;
        result["payer"] = posterToPay.createdBy;
	    	sails.log(result);
        Payrecord.create (result)
        .then(function(payrecord) {
          sails.log.silly("Created payrecord" + payrecord);
          res.ok({payargs: payrecord});
        })
        .catch(function(err) {
          res.serverError(err);
          //create record fail, so need to close the order
          //closeOrder(result.out_trade_no);
        })	
	    }	    
	  });  
}

exports.queryorder = function(req, res) {
  Payrecord.findOne({out_trade_no: req.query.order})
  .then(function(payorder) {
    if(payorder.result_code !== undefined || payorder.trade_state !== undefined) {
      res.ok({order:payorder});
    } else {
      wxpay.queryOrder({out_trade_no: req.query.order}, function(err, queryresult) {
          if(err) {
            res.serverError(err);
          } else {
            //Here needs to update the payrecord
            sails.log(queryresult);
            if(queryresult.return_code == "FAIL") {
              res.serverError(queryresult);
             } 

            if(queryresult.return_code == "SUCCESS") {
              Payrecord.update({id: payorder.id}, queryresult)
              .then(function (payrecords) {
                res.ok({order: payrecords[0]});
              })
              .catch(function (error) {
                res.serverError(error);
              })
            }
          }
        })
    }
  })
  .catch(function (err) {
    res.serverError(err);
  })
}

//close order API should be called if some order has not been payed for quite a long time
function closeOrder(orderNumber) {
  wxpay.closeOrder({out_trade_no: orderNumber}, function(err, result) {
    if(err) {
      sails.log.error(err);
    } else {
      sails.log.silly(result);
    }
  })
}