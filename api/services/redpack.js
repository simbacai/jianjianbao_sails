// api/services/redpack.js

var Redpack = require('weixin-redpack').Redpack;

var redpack = Redpack(sails.config.redpack);

function sendRedpack (opts) {
	opts["mch_billno"] = sails.config.redpack.mch_id + getNowFormatDate() + Math.random().toString().substr(2,10);
	redpack.send(opts, function(err, result){
    if(err) {
    	sails.log.error (err);
    } else {
    	sails.log.silly(result);
    }
	});
} 

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

module.exports = sendRedpack;