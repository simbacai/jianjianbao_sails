/**
* Payrecord.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	"poster" : {
  		model:'poster'
  	},
  	"payer" : {
  		model:'user'
  	},
  	//Prepay order info
  	"appId": {
  		type: 'string',
  	},
  	"timeStamp": {
  		type: 'string',
  	},
  	"nonceStr": {
  		type: 'string',
  	},
  	"package": {
  		type: 'string',
  	},
  	"signType": {
  		type: 'string',
  	},
  	"paySign": {
  		type: 'string',
  	},
  	//Notification deatils
  	"mch_id": {
  		type: 'string',
  	},
  	"device_info": {
  		type: 'string',
  	},
  	"nonce_str": {
  		type: 'string',
  	},
  	"sign": {
  		type: 'string',
  	},
  	"result_code": {
  		type: 'string',
  	},
  	"err_code": {
  		type: 'string',
  	},
  	"err_code_des": {
  		type: 'string',
  	},
  	"openid": {
  		type: 'string',
  	},
  	"is_subscribe": {
  		type: 'string',
  	},
  	"trade_type": {
  		type: 'string',
  	},
  	"bank_type": {
  		type: 'string',
  	},
  	"total_fee": {
  		type: 'string',
  	},
  	"fee_type": {
  		type: 'string',
  	},
  	"cash_fee": {
  		type: 'string',
  	},
  	"cash_fee_type": {
  		type: 'string',
  	},
  	"transaction_id": {
  		type: 'string',
  	},
  	"out_trade_no": {
  		type: 'string',
  	},
  	"attach": {
  		type: 'string',
  	},
  	"end": {
  		type: 'string',
  	},
  	//query contents
  	"trade_state": {
  		type: 'string',
  	},
    "trade_state_desc": {
  		type: 'string',
  	},
  }
};

