/**
* Node.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
module.exports = {

  attributes: {
    "poster" : {
      model: 'poster',
      unique: true,
      required: true
    },
    "parentNode" : {
      model : "node"
    },
    "path" : {
      type: 'array'
    },
    "childNodes" : {
      collection : 'node',
      via: 'parentNode'
    }    
  },

	/**
	* Set Node Owner automatically
	*/
  afterCreate: [
    function setOwner (node, next) {
      sails.log('Node.afterCreate.setOwner', node);
      Node
        .update({ id: node.id }, { owner: node.createdBy})
        .then(function (node) {
          next();
        })
        .catch(sails.error);
    },
  ]

};
