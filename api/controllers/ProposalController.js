/**
 * ProposalController
 *
 * @description :: Server-side logic for managing proposals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var redpack = require('../services/redpack');

module.exports = {

	  preCalTips : function  (req, res) {
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
				    			return Poster
				    			.findOne ( proposal.poster )
					    		.then (function (poster) {
					    			posterTipAmount = Number( poster.tipAmount );
					    			return Node.findOne ( proposal.node );
					    		})
					    		.then (function (node) {
					    			node.path.push (node.id);
					    			if(node.path.length != 1) {
					    				node.path.shift();
					    			}
					    			return Node.find ({id: node.path});
					    		})
					    		.then (function (nodes) {
					          var tipAmount = posterTipAmount / nodes.length;
					    			var pretips = nodes.map (function (node) {
					    				return {poster: node.poster, user: node.createdBy, amount: tipAmount};
					    			});
					    			return Promise.all(pretips);
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

  commitProposal : function  (req, res) {
    Proposal
	    .findOne (req.params.id)
	    .then (function (proposal) {
	    	if(proposal.authowner != req.user.id) {
	    		res.forbidden ("Not authorized to commit proposal!");
	    		return;
	    	}

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
				    		var tipsToBeDistributed = {};
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
					    			if(node.path.length != 1) {
					    				node.path.shift();
					    			}
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
					    			tipsToBeDistributed = tips;
					    			//Call Redpack service to distribute redpack
					    			var distributedTips = tips.map( function (tip) {
					    				var userToTip = {};
					    				return User.
					    				findOne(tip.user).
					    				then (function (user) {
					    					userToTip = user;
					    					return Poster.findOne(tip.poster);
					    				})
					    				.then (function (poster) {
					    					redpack({re_openid: userToTip.openid, act_name: poster.subject + " redpack"});
					    				})
					    			});
					    			return Promise.all(distributedTips);
					    		})
					    		.then (function (distributedTips) {
					    			res.ok(tipsToBeDistributed);
					    		});	    		  		
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

  	
  },

  subscribe: function (req, res) {

		Proposal.findOne(req.params.id)
		.then(function (proposal) {
			if(req.user.id == proposal.owner || req.user.id == proposal.authowner) {
        Proposal.subscribe(req, proposal.id, ['message']); 
        res.ok('Subscribe Succesfully!'); 
			}
			else {
				res.forbidden('Not authorized to subscribe to the proposal');
			}
		  
		})
		.catch(function (err) {
			sails.error.log(err);
			res.json (400, {errcode: 999});
		});
  }	
};

