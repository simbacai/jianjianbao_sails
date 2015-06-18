/**
* ProposalSummary.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	"poster" : {
      model:'poster'
  	},
  	"proposal": {
  	  model:'proposal',
  	  unique: true
  	},
    "createdBy": {
      model: 'user'
    },
    "createdAt": {
      type: 'datatime'
    },  
    "updatedAt": {
      type: 'datatime'
    },    
  }
};

