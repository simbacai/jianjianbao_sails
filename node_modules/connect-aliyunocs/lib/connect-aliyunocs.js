/*!
 * Connect - aliyunocs
 * Copyright(c) 2015 Simba Cai <simba.cai@ericsson.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var ALY = require('aliyun-sdk-js')
  , debug = require('debug')('connect:aliyunocs');

/**
 * One day in seconds.
 */

var oneDay = 86400;

/**
 * Return the `AliyunocsStore` extending `connect`'s session Store.
 *
 * @param {object} connect
 * @return {Function}
 * @api public
 */

module.exports = function(connect){

  /**
   * Connect's Store.
   */

  var Store = connect.session.Store;

  /**
   * Initialize AliyunocsStore with the given `options`.
   *
   * @param {Object} options
   * @api public
   */

  function AliyunocsStore(options) {
    var self = this;

    options = options || {};
    Store.call(this, options);
    this.prefix = null == options.prefix
      ? 'sess:'
      : options.prefix;

    if(!options.host) {
        throw new Error("invalid aliyun host");
    }

    if(!options.ocsKey) {
        throw new Error("invalid aliyun ocsKey");
    }

    if(!options.ocsSecret) {
        throw new Error("invalid aliyun ocsSecret");
    }

    this.client = options.client || new ALY.MEMCACHED.createClient(11211, options.host, {username:options.ocsKey, password:options.ocsSecret});
  
    this.ttl =  options.ttl;
  };

  /**
   * Inherit from `Store`.
   */

  AliyunocsStore.prototype.__proto__ = Store.prototype;

  /**
   * Attempt to fetch session by the given `sid`.
   *
   * @param {String} sid
   * @param {Function} fn
   * @api public
   */

  AliyunocsStore.prototype.get = function(sid, fn){
    sid = this.prefix + sid;
    debug('GET "%s"', sid);
    this.client.get(sid, function(err, data){
      if (err) return fn(err);
      if (!data) return fn();
      var result;
      data = data.toString();
      debug('GOT %s', data);
      try {
        result = JSON.parse(data); 
      } catch (err) {
        return fn(err);
      }
      return fn(null, result);
    });
  };

  /**
   * Commit the given `sess` object associated with the given `sid`.
   *
   * @param {String} sid
   * @param {Session} sess
   * @param {Function} fn
   * @api public
   */

  AliyunocsStore.prototype.set = function(sid, sess, fn){
    sid = this.prefix + sid;
    try {
      var maxAge = sess.cookie.maxAge
        , ttl = this.ttl
        , sess = JSON.stringify(sess);

      ttl = ttl || ('number' == typeof maxAge
          ? maxAge / 1000 | 0
          : oneDay);

      debug('SET "%s" ttl:%s %s', sid, ttl, sess);
      this.client.set(sid, sess, ttl, function(err){
        err || debug('SET complete');
        fn && fn.apply(this, arguments);
      });
    } catch (err) {
      fn && fn(err);
    } 
  };

  /**
   * Destroy the session associated with the given `sid`.
   *
   * @param {String} sid
   * @api public
   */

  AliyunocsStore.prototype.destroy = function(sid, fn){
    sid = this.prefix + sid;
    this.client.delete(sid, fn);
  };

  return AliyunocsStore;
};
