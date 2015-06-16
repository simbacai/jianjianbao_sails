/**
 * PosterActionController
 *
 * @description :: Server-side logic for managing Posteractions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function iterateOverChain (proposal) {

  //Todo How to effectively iterate over proposal chain?
     

}

module.exports = {

  commitProposal : function  (req, res) { 

    Proposal
      .findOne(req.params.id)
      .exec (function (err, proposal){
      	if (err) {
      		sails.error (err);
      		res.json(400, {errcode:999});
      	} else {
      		//To find out the node chain
      		iterateOverChain ();
      	}
      });

  },

  openProposal : function  (req, res) { 

  	
  }
	
};

