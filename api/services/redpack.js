// api/services/redpack.js

var Redpack = require('weixin-redpack').Redpack;
var fs = require('fs');

var redpack = Redpack({
    mch_id: '1247772901',
    partner_key: 'JianJian35398841JianJian35398841',
    pfx: fs.readFileSync('./apiclient_cert.p12'),
    wxappid: 'wxcd3e2f8024ba7f49',
    send_name: 'JianJianBao',
    nick_name: 'JianJianBao',
    client_ip: '121.41.75.11',
    total_amount: 100,
    total_num: 1,
    remark: 'RedPack from JianJianBao!',
    wishing: "Thanks for useing JianJianBao!"
});

function sendRedpack (opts) {
	opts["mch_billno"] = '1247772901' + getNowFormatDate() + Math.random().toString().substr(2,10);
	redpack.send(opts, function(err, result){
    if(err) {
    	sails.log.error (err);
    } else {
    	sails.log.info(result);
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

/*
redpack.send({
    mch_billno: '1247772901'+Date.now()+Math.random().toString().substr(1,10),
    wishing: 'ÊÕºÃ²»Ð»£¡',
    re_openid: 'ºì°ü½ÓÊÕÈËopenid',
    act_name: '·¢²âÊÔºì°ü',
}, function(err,l result){
    if(err) {
    	sails.log.error (err);
    } else {
    	sails.log.info(result);
    }
});
*/

module.exports = sendRedpack;