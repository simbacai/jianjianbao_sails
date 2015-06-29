/**
* PrivateTalk.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	"proposal" : {
  		model:'proposal'
  	},
  	"content": {
  		type:'string'
  	},
  	"authowner" : {
  		model:'user'
  	},
  },


  afterCreate: [
    /**
    * Set PrivateTalk Owner automatically
    */
    function setOwner (privatetalk, next) {
      sails.log('PrivateTalk.afterCreate.setOwner', privatetalk);
      PrivateTalk
      .update({ id: privatetalk.id }, { owner: privatetalk.createdBy})
      .then(function (privatetalk) {
        next();
      })
      .catch(next);
    },
    /**
    * Set PrivateTalk Authorized Owner automatically
    */
    function setAuthOwner (privatetalk, next) {
      sails.log('PrivateTalk.afterCreate.setAuthOwner');
      Proposal.findOne({ id: privatetalk.proposal })
      .then(function (proposal) {
        return PrivateTalk
          .update({ id: privatetalk.id }, { authowner: proposal.createdBy});
      })
      .then(function (privatetalk) {
        next();
      })
      .catch(next); 
    },
    /**
    * Connect to related Proposal automatically
    */    
    function connectProposal (privatetalk, next) {
      sails.log('PrivateTalk.afterCreate.connectProposal');
      Proposal.findOne({ id: privatetalk.proposal })
      .then(function (proposal) {
        proposal.privatetalks = proposal.privatetalks || [];
        proposal.privatetalks.push(privatetalk.id);
        return Proposal.update({id: proposal.id}, {privatetalks: proposal.privatetalks});
      })
      .then(function (proposal) {
          next();
      })
      .catch(next);
    },
    /**
    * Notify the created privatetalks to subscriber automatically
    */    
    function notifySubscriber (privatetalk, next) {
      sails.log('PrivateTalk.afterCreate.notifySubscriber');
      Proposal.message(privatetalk.proposal, privatetalk);
      next();
    },
  ],

  beforeDestroy: [
    /**
    * disconnect to related Proposal automatically
    */    
    function disconnectProposal (criteria, next) {
      sails.log('PrivateTalk.afterDestroy.disconnectPoster', criteria);
      PrivateTalk.findOne({ id : criteria.where.id})
      .then(function(privatetalk) {
        return Proposal.findOne({ id: privatetalk.proposal});
      })
      .then(function (proposal) {
        proposal.privatetalks = proposal.privatetalks || [];
        var index = proposal.privatetalks.indexOf(criteria.where.id);
        if (index > -1) {
          proposal.privatetalks.splice(index, 1);
        }
        return Proposal.update({id: proposal.id}, {privatetalks: proposal.privatetalks});
      })
      .then(function (proposal) {
          next();
      })
      .catch(next);
    },
  ]
};

