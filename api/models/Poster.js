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
    "tipAmount" : {
      type: 'number',
    }
  	"comments": {
  		type: 'array',
  	},
  	"proposals": {
  		type: 'array',
  	},
    "nodes": {
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
    /**
    * Create RootNode automatically
    */
    function createRootNode (poster, next) {
      sails.log('Poster.afterCreate.createRootNode');
      Node
        .create({ poster: poster.id, createdBy: poster.createdBy })
        .then(function (node) {
          poster.nodes = poster.nodes || [];
          poster.nodes.push(node.id);
          Poster
          .update({ id: poster.id }, { nodes: poster.nodes})
          .then(function (poster) {
            next();
          })
          .catch(sails.error);
          })
        .catch(sails.error);
    },
  ]

  //Todo implement delete node before delete poster
};

