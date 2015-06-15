/**
* Poster.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	"subject" : {
  		type: 'string',
  		size: 30
  	},
  	"body" : {
  		type: 'string',
  		size: 300
  	},
  	"comments": {
  		type: 'array',
  	},
  	"proposals": {
  		type: 'array',
  	},
  	"closeStatus" : {
  		type: 'string',
  		enum: ['Yes', 'No'],
  		default: 'No'	
  	}
  },


  /**
   * Set Poster Owner automatically
   */
  afterCreate: [
    function setOwner (poster, next) {
      sails.log('Poster.afterCreate.setOwner', poster);
      Poster
        .update({ id: poster.id }, { owner: poster.createdBy})
        .then(function (poster) {
          next();
        })
        .catch(next);
    },
  ]
};

