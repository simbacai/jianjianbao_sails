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
	
};

