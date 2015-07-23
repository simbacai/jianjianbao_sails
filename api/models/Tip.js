/**
* Tip.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	"poster" : {
  		model:'poster'
  	},
  	"user" : {
  		model:'poster'
  	},
  	"amount" : {
  		type: 'string'
  	},
    "action" : {
      type: 'string'
    },
    "actionTime" : {
      type: 'datetime'
    },
  }
};

