/**
 * PosterController
 *
 * @description :: Server-side logic for managing posters
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var skipperAliyunOSS = require('skipper-aliyunoss');
var skipperMemory = require('skipper-memory');

var fileAdapter = {};
if(process.env.NODE_ENV !== 'development') {
  fileAdapter = skipperAliyunOSS(sails.config.skippeross);
} else {
  fileAdapter = skipperMemory();
}

module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: true
  },
  
  subscribe: function (req, res) {

		Poster.findOne(req.params.id)
		.then(function (poster) {
		  Poster.subscribe(req, poster.id, ['message']);
		})
		.catch(function (err) {
      res.serverError(err);
		});
  },

  /**
   * Upload Image for specific poster
   *
   * (POST /poster/image/:id)
   */
  uploadImage: function (req, res) {
    req.file('image').upload({
      // don't allow the total upload size to exceed ~10MB
      adapter: fileAdapter,
      maxBytes: 10000000,
    },function whenDone(err, uploadedFiles) {
      if (err) {
        return res.negotiate(err);
      }

      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0){
        return res.badRequest('No file was uploaded');
      }


      // Save the "fd" and the url where the image for a Poster can be accessed
      Poster.update(req.params.id, {

        // Generate a unique URL where the image can be downloaded.
        imageUrl: require('util').format('%s/poster/image/%s', sails.getBaseUrl(), req.params.id),

        // Grab the first file and use it's `fd` (file descriptor)
        imageFd: uploadedFiles[0].fd,

        //Save the file name
        imageName: uploadedFiles[0].filename
      })
      .exec(function (err){
        if (err) return res.negotiate(err);
        return res.ok();
      });
    });
  },


  /**
   * Download image of the poster with the specified id
   *
   * (GET /poster/image/:id)
   */
  downloadImage: function (req, res){

    req.validate({
      id: 'string'
    });

    Poster.findOne(req.param('id')).exec(function (err, poster){
      if (err) return res.negotiate(err);
      if (!poster) return res.notFound();

      // Poster has no image uploaded.
      // (should have never have hit this endpoint and used the default image)
      if (!poster.imageFd) {
        return res.notFound();
      }

      var fileFd = {};
      if (process.env.NODE_ENV === 'development') {
        fileFd = '/' + poster.imageName
      } else {
        fileFd = poster.imageFd;
      }
      // Stream the file down
      fileAdapter.read(fileFd, 
        function (err, data){
          if(err) {
            return res.serverError(err);
          } else {
            return res.ok(data);
          }
      });
    });
  },

  /**
   * Get the users of the poster with the specified id
   * The users includes 1) Who ever forward this poster
   *                    2) who ever comment this poster
   *                    3) who ever make proposal of this poster
   * (GET /poster/users/:id)
   */
  getRelateUsers: function (req, res) {
    req.validate({
      id: 'string'
    });

    var relatedUsers = []; 
    var queryPoster = {};
    Poster.findOne(req.params.id)
    .then(function (poster) {
      queryPoster = poster;
      //Firstly find who ever forwarded this poster
      return Node.find({poster: queryPoster.id, childNodes: { '!': null}})
    })
    .then(function (forwardedNodes) {
      //Findout the fowaredNodes owner
      var forwardedUsers = forwardedNodes.map(function (forwardedNode) {
        return User.findOne(forwardedNode.createdBy);
      });
      return Promise.all(forwardedUsers);
    })
    .then(function (forwardedUsers) {
      var unifiedForwardedUsers = _.unique(forwardedUsers, 'openid');
      return relatedUsers.push(unifiedForwardedUsers);
    })
    .then(function (){
      //Find out the user who is the end node user
      return Node.find({poster: queryPoster.id});
    })
    .then(function (endNodes) {
      var endUsers = endNodes.map(function (endNode) {
        if(endNode.childNodes !== null)
        {
        } else {
          return User.findOne(endNode.createdBy);  
        }
      });
      return Promise.all(endUsers);
    })
    .then(function (endUsers) {
      _.remove(endUsers, function(n) {
        return n === undefined;
      })
      var unifiedEndUsers = _.unique(endUsers, 'openid');
      var activeUsers = unifiedEndUsers.map(function (endUser) {
        return Proposal
              .find({poster: queryPoster.id, createdBy: endUser.id})
              .then(function (proposals) {
                if(proposals.length) {
                  return endUser;
                } 
              });    
      });
      return Promise.all(activeUsers);
    })
    .then(function (activeUsers) {
      _.remove(activeUsers, function(n) {
        return n === undefined;
      });
      relatedUsers.push(activeUsers);
      res.ok(_.flatten(relatedUsers, true));
    })
    .catch(function (err) {
      res.serverError(err);
    });
  }
};

