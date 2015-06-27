/**
 * ProposalController
 *
 * @description :: Server-side logic for managing proposals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  commitProposal : function  (req, res) {
    Proposal
	    .findOne (req.params.id)
	    .then (function (proposal) {
	    	if(proposal.status == "closed") {
	    		res.forbidden ("Proposal has already been commited!");
	    		return;
	    	} else {
	    		return Poster
	    		  .findOne ( proposal.poster)
	    		  .then (function (poster) {
	    		  	if (poster.status === 'closed') {
	    		  		res.forbidden ("Poster has already been closed!");
	    		  	} else {
				    		var posterTipAmount = 0;
				    		proposal.status = 'closed';
				    		return Proposal
					    		.update ({id: proposal.id}, {status: proposal.status})
					    		.then (function (updatedProposal) {
					    			return Poster.findOne ( proposal.poster );
					    		})
					    		.then (function (poster) {
					    			posterTipAmount = Number( poster.tipAmount );
					    			poster.status = 'closed';
					    			return Poster.update ({id: poster.id}, {status: poster.status});
					    		})
					    		.then (function (poster) {
					    			return Node.findOne ( proposal.node );
					    		})
					    		.then (function (node) {
					    			node.path.push (node.id);
					    			return Node.find ({id: node.path});
					    		})
					    		.then (function (nodes) {
					          var tipAmount = posterTipAmount / nodes.length;
					    			var createdTips = nodes.map (function (node) {
					    				return Tip.create ({poster: node.poster, user: node.createdBy, amount: tipAmount});
					    			});
					    			return Promise.all(createdTips);
					    		})
					    		.then (function (tips) {
					    			res.ok(tips);
					    		})	    		  		
	    		  	}
	    		  })
	    	}
	    })
			.catch (function (err) {
				sails.log.error (err);
		    res.json (400, {errcode: 999});
			})

  },   

  openProposal : function  (req, res) { 

  	
  }	
};

