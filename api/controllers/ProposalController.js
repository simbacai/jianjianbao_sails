/**
 * ProposalController
 *
 * @description :: Server-side logic for managing proposals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
/*
  create: function (req, res) {
	
	var data = req.params.all();
	data.user = req.user.id;
	data.owner = req.user.id;

     
	// Create new instance of model using data from params
	Proposal.create(data).exec(function created (err, proposal) {

		// Differentiate between waterline-originated validation errors
		// and serious underlying issues. Respond with badRequest if a
		// validation error is encountered, w/ validation info.
		if (err) return res.negotiate(err);

		// If we have the pubsub hook, use the model class's publish method
		// to notify all subscribers about the created item
		if (req._sails.hooks.pubsub) {
			if (req.isSocket) {
				Proposal.subscribe(req, proposal);
				Proposal.introduce(proposal);
			}
			Proposal.publishCreate(proposal.toJSON(), !req.options.mirror && req);
		}

		// Send JSONP-friendly response if it's supported
		res.created(proposal);
	});
  },
  */

  commitProposal : function  (req, res) { 

  	//First need to check whther this proposal has been committed
  	Proposal
      .findOne(req.params.id)
      .exec (function (err, proposal){
      	if (err) {
      		sails.error (err);
      		res.json(400, {errcode:999});
      	} else {
      		if(proposal.status == 'closed') {
      			res.forbidden ("Proposal has already been commited!");
      			return;
      		}
      		else {
      			//Change proposal status to closed
      			//Todo: only tip distribution finished, proposal can be closed
      			proposal.status = 'closed';
      			proposal.save (function (err) {
      				if(err) {
      					sails.error (err);
      					res.json(400, {errcode:999});
      				}
      				else{
						Node
						.findOne (proposal.node)
						.exec(function(err, node) {
							if (err) {
								sails.error (err);
								res.json (400, {errcode:999});
							} else {
								node.path.push (node.id);
								Node
								  .find ({id: node.path})
								  .exec (function (err, nodes) {
								  	if (err) {
								  		sails.error (err);
								  		res.json (400, {errcode:999});
								  	} else {
								  		//Actually, here needs to launch WXTipDistribution Service
								  		//Currently only create Tip record for demo
								  		var createdTips = new Array();
								  		for (var i = 0; i < nodes.length; i++) {
								  			//For each user launch tip distribution logic
								  			//Currently temporarily just generate tip record	 
								  			Tip.create({poster: nodes[i].poster, user: nodes[i].createdBy, amount: 10})
								  			.exec (function (err, tip) {
								  				if (err) {
								  					sails.error (err);
								  					res.json (400, {errcode:999});
													  return;
								  				}
								  			}); 
								  		}
										res.ok();
								  	}
								  })
							}
						})
      				}
      			})
      		}
      	}
      });

    //After commit proposal need to set the poster status to closed ??? could poster reopen the poster?


  },

  openProposal : function  (req, res) { 

  	
  }	
};

