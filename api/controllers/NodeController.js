/**
 * NodeController
 *
 * @description :: Server-side logic for managing nodes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

getOneNode : function  (req, res) {

  Node
    .findOne(req.params.id)
    .populate ('childNodes')
    .exec (function (err, visitNode) {
    	if (err) {
    		sails.error(err);
    		res.json( 400, { errcode:999 });
    	} else {
    		if (visitNode.createdBy == req.user.id) {
    			res.ok(visitNode);
    			return;
    		} else {
    			for (var i = 0; i < visitNode.childNodes; i++) {
    				if (visitNode.childNodes[i].createdBy == req.user.id) {
    					res.ok(visitNode.childNodes[i]);
    					return;
    				}
    			}
    		}

    		//Create a new childe node
    		Node
		        .create({ poster: visitNode.poster, parentNode: visitNode.id, createdBy: req.user.id , path: visitNode.path.concat(visitNode.id)})
		        .then(function (node) {
	                Poster.findOne({ id: visitNode.poster }).exec(function (err,poster) {
			        poster.nodes = poster.nodes || [];
			        poster.nodes.push(node.id);
			        poster.save(function (err) {			          
		          	  res.ok(node);
			        });	
		          })
	             })   
		        .catch(sails.error);
    	}
    });


  },
  
};
