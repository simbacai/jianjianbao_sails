/**
 * JssdkController
 *
 * @description :: Server-side logic for managing jssdks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var sign = require('../services/jssign');

module.exports = {
	getsign : function (req, res) {
		var ret = sign(req.query.url);
		sails.log(ret);
		res.ok(ret);
	}
};

