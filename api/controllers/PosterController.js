/**
 * PosterController
 *
 * @description :: Server-side logic for managing posters
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var wxpay = require('../services/wxpay');

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
			sails.error.log(err);
			res.json (400, {errcode: 999});
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
    maxBytes: 10000000
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
      imageFd: uploadedFiles[0].fd
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

    var SkipperDisk = require('skipper-disk');
    var fileAdapter = SkipperDisk(/* optional opts */);

    // Stream the file down
    fileAdapter.read(poster.imageFd)
    .on('error', function (err){
      return res.serverError(err);
    })
    .pipe(res);
  });
}
};

