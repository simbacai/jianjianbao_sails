// api/services/jssign.js

//var jsSHA = require('jssha');

var createNonceStr = function () {
  return Math.random().toString(36).substr(2, 15);
};

var createTimestamp = function () {
  return parseInt(new Date().getTime() / 1000) + '';
};

var raw = function (args) {
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
};

/**
* @synopsis Ç©ÃûËã·¨ 
*
* @param jsapi_ticket ÓÃÓÚÇ©ÃûµÄ jsapi_ticket
* @param url ÓÃÓÚÇ©ÃûµÄ url £¬×¢Òâ±ØÐë¶¯Ì¬»ñÈ¡£¬²»ÄÜ hardcode
*
* @returns
*/
var sign = function (url) {
  var ret = {
    jsapi_ticket: "asdfasdfasdfasdf",
    nonceStr: createNonceStr(),
    timestamp: createTimestamp(),
    url: url
  };
  var string = raw(ret);
      jsSHA = require('jssha');
      shaObj = new jsSHA(string, 'TEXT');
  ret.signature = shaObj.getHash('SHA-1', 'HEX');

  return ret;
}

module.exports = sign;