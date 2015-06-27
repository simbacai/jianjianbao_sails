/**
 * NodeController
 *
 * @description :: Server-side logic for managing nodes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  getOneNode : function (req, res) {
    Node
      .findOne(req.params.id)
      .populate('childNodes')
      .then(function (visitNode) {
    		if (visitNode.createdBy == req.user.id) {
    			res.render('index', {currentNode:visitNode});
    			return;
    		} else {
    			for (var i = 0; i < visitNode.childNodes.length; i++) {
    				if (visitNode.childNodes[i].createdBy == req.user.id) {
    					res.render('index', {currentNode:visitNode.childNodes[i]});
    					return;
    				}
    			}
    	
      		//Create a new child node
          var childNode = {};
      		return Node
            .create({ poster: visitNode.poster, parentNode: visitNode.id, createdBy: req.user.id , path: visitNode.path.concat(visitNode.id)})
            .then (function (node) {
              childNode = node;
              return Poster.findOne({ id: visitNode.poster });
            })
            .then (function (poster) {
    	        poster.nodes = poster.nodes || [];
    	        poster.nodes.push(childNode.id);
    	        return Poster.update({id: poster.id}, {nodes: poster.nodes});
            })
            .then (function (poster) {
              res.render('index', {currentNode:childNode});
            })
    	  }
      })
      .catch (function (error) {
        sails.log.error (error);
        res.json (400, {errcode: 999});
      })
  },
  
};
