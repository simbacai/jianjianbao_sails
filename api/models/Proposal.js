/**
* Proposal.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	"poster" : {
  		model:'poster'
  	},
  	"content": {
  		type:'string'
  	},
    "node": {
      model: 'node'
    },
  	"privatetalks" :{
  		type: 'array',
  	}
  },

  
  afterCreate: [
    /**
    * Set Proposal Owner automatically
    */
    function setOwner (proposal, next) {
      sails.log('Proposal.afterCreate.setOwner', proposal);
      Proposal
        .update({ id: proposal.id }, { owner: proposal.createdBy})
        .then(function (proposal) {
          next();
        })
        .catch(next);
    },
    /**
    * Set Proposal Authorized Owner automatically
    */
    function setAuthOwner (proposal, next) {
      sails.log('Proposal.afterCreate.setAuthOwner');
      Poster.findOne({ id: proposal.poster }).exec(function (err,poster) {
        if(err) {
          next();
        } else {
          Proposal
          .update({ id: proposal.id }, { authowner: poster.createdBy})
          .then(function (proposal) {
            next();
          })
          .catch(next);
        };
      }); 
    },
    /**
    * Connect to related Poster automatically
    */    
    function connectPoster (proposal, next) {
      sails.log('Proposal.afterCreate.connectPoster');
      Poster.findOne({ id: proposal.poster }).exec(function (err,poster) {
        poster.proposals = poster.proposals || [];
        poster.proposals.push(proposal.id);
        poster.save(function (err) {
          next();
        });
      });
    },
  ],

  beforeDestroy: [
    /**
    * disconnect to related Poster automatically
    */    
    function disconnectPoster (criteria, next) {
      sails.log('Proposal.afterDestroy.disconnectPoster', criteria);
      Proposal.findOne({ id : criteria.where.id}).exec(function(err, proposal) {
        Poster.findOne({ id: proposal.poster}).exec(function (err,poster) {
          poster.proposals = poster.proposals || [];
          var index = poster.proposals.indexOf(proposal.id);
          if (index > -1) {
            poster.proposals.splice(index, 1);
          }
          poster.save(function (err) {
            next();
          });
        });
      } );
    },
  ]
};

