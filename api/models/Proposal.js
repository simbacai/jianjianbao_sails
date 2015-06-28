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
  	"privatetalks" : {
  		type: 'array',
  	},
    "status" : {
      type: 'string',
      enum: ['created', 'openned', 'closed'],
      defaultsTo: 'created'
    }
  },

  beforeCreate: [
    /**
    * Check whether poster has been closed
    */
    function checkPosterStatus (values, next) {
      sails.log('Proposal.beforeCreate.checkPosterStatus', values);
      Poster
        .findOne ({id: values.poster})
        .then (function (poster) {
          if (poster.status === 'closed') {
            var err = new Error("Poster has already been closed!");
            return next(err);
          } else {
            next();
          }
        })
        .catch(next);
      },  
  ],

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
      Poster.findOne({ id: proposal.poster })
      .then(function (poster) {
          return Proposal
          .update({ id: proposal.id }, { authowner: poster.createdBy});
        })
      .then(function (proposal) {
        next();
      })
      .catch(next);  
    },
    /**
    * Connect to related Poster automatically
    */    
    function connectPoster (proposal, next) {
      sails.log('Proposal.afterCreate.connectPoster');
      Poster.findOne({ id: proposal.poster })
      .then(function (poster) {
        poster.proposals = poster.proposals || [];
        poster.proposals.push(proposal.id);
        return Poster.update({id: poster.id}, {proposals: poster.proposals});
      })
      .then (function (poster) {
        next();
      })
      .catch(next);
    },
    /**
    * Create ProposalSummary automatically
    */    
    function createProposalSummary (proposal, next) {
      sails.log('Proposal.afterCreate.createProposalSummary');
      ProposalSummary.create({ poster: proposal.poster, proposal: proposal.id, createdBy: proposal.createdBy, createdAt: proposal.createdAt, updatedAt: proposal.updatedAt})
      .then(function (proposalsummary) {   
          Poster.message(proposalsummary.poster, proposalsummary);
          next();
        })
      .catch(next);
      },  
  ],

  beforeDestroy: [
    /**
    * disconnect to related Poster automatically
    */    
    function disconnectPoster (criteria, next) {
      sails.log('Proposal.afterDestroy.disconnectPoster', criteria);
      Proposal.findOne({ id : criteria.where.id})
      .then(function(proposal) {
        return Poster.findOne({ id: proposal.poster})
      })
      .then(function (poster) {
          poster.proposals = poster.proposals || [];
          var index = poster.proposals.indexOf(criteria.where.id);
          if (index > -1) {
            poster.proposals.splice(index, 1);
          }
          return Poster.update({id: poster.id}, {proposals: poster.proposals});
      })
      .then (function (poster) {
        next();
      })
      .catch(next);
    },
    /**
    * delete ProposalSummary automatically
    */    
    function deleteProposalSummary (criteria, next) {
      sails.log('Proposal.afterDestroy.deleteProposalSummary');
      ProposalSummary.destroy({ proposal: criteria.where.id})
      .then(function (proposalsummary) {
          next();
        })
      .catch(next);
    },     
  ]
};

