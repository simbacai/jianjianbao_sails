/**
* Comment.js
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
  	}
  },

  afterCreate: [
    /**
    * Set Comment Owner automatically
    */
    function setOwner (comment, next) {
      sails.log('Comment.afterCreate.setOwner', comment);
      Comment
        .update({ id: comment.id }, { owner: comment.createdBy})
        .then(function (comment) {
          next();
        })
        .catch(next);
    },
    /**
    * Connect to related Poster automatically
    */    
    function connectPoster (comment, next) {
      sails.log('Comment.afterCreate.connectPoster');
      Poster.findOne({ id: comment.poster })
      .then(function (poster) {
        poster.comments = poster.comments || [];
        poster.comments.push(comment.id);
        return Poster.update({id: poster.id}, {comments: poster.comments});
      })
      .then(function (poster) {
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
      sails.log('Comment.afterDestroy.disconnectPoster', criteria);
      Comment.findOne({ id : criteria.where.id})
      .then(function(comment) {
        return Poster.findOne({ id: comment.poster});
      })
      .then(function (poster) {
        poster.comments = poster.comments || [];
        var index = poster.comments.indexOf(criteria.where.id);
        if (index > -1) {
          poster.comments.splice(index, 1);
        }
        return Poster.update({id: poster.id}, {comments: poster.comments});
      })
      .then(function (poster) {
        next();
      })
      .catch(next);
    },
  ]  
};

