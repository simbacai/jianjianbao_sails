/**
* Node.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
module.exports = {

  attributes: {
	"poster" : {
		type:'string',
		unique: true
	},
	"parentNode" : {
		model : "node"
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
        .catch(next);
    },
  ]

};
