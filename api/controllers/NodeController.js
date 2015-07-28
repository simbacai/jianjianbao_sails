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
      .then(function (visitNode) {
    		if (visitNode.createdBy == req.user.id) {
    			res.render('index', {currentNode:visitNode});
    			return;
    		} else {
    			//Fix the issue that user create multiple nodes under single parent node
    			var childNodes = [];
    			if(visitNode.childNodes !== undefined && visitNode.childNodes !== null) {
	    			childNodes = visitNode.childNodes.map(function (childNode) {
	    				return Node.findOne({id: childNode});
	    			})
    			}

    			return Promise.
    			all(childNodes)
    			.then(function (childNodes) {
    				for(var i=0; i< childNodes.length; i++) {
    					if (childNodes[i].createdBy == req.user.id) {
    						res.render('index', {currentNode: childNodes[i]});
    						return;
    					}
    				}

    				//To guarantee there is only one node for each user in the chain
	    			var parentNodes = visitNode.path.map (function (node) {
						  return Node.findOne({id: node});
						});

						return Promise.all(parentNodes)
						.then (function (parentNodes) {
	            //If there is existing node which belongs to req.user, return directly
							for (var i=0; i < parentNodes.length; i++) {
								if (parentNodes[i].createdBy == req.user.id) {
									res.render('index', {currentNode:parentNodes[i]});
									return;
								}
							}

							//There is no existing node which belongs to req.user, so create a new child node
	            var childNode = {};
	      		  return Node
		            .create({ poster: visitNode.poster, parentNode: visitNode.id, createdBy: req.user.id , path: visitNode.path.concat(visitNode.id)})
		            //Updates poster nodes field
	              .then (function (node) {
		              childNode = node;
		              return Poster.findOne({ id: visitNode.poster });
		            })
		            .then (function (poster) {
		    	        poster.nodes = poster.nodes || [];
		    	        poster.nodes.push(childNode.id);
		    	        return Poster.update({id: poster.id}, {nodes: poster.nodes});
		            })
	              //Update parentnode childeNodes field
	              .then (function (){
	                visitNode.childNodes = visitNode.childNodes || [];
	                visitNode.childNodes.push(childNode.id);
	                return Node.update({id: visitNode.id}, {childNodes: visitNode.childNodes});
	              })
		            .then (function () {
		              res.render('index', {currentNode:childNode});
		            })
							})

    			})
    	  }
      })
      .catch (function (error) {
        res.serverError(error);
      })
  },
  
};
