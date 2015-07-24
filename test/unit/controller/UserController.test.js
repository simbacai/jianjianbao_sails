var request = require('supertest');
var base64 = require('base-64');

//Prepare data for testing
var admin = {username: 'admin', passwd: 'admin1234'};
var authHeaderAdmin = 'Basic ' + base64.encode(admin.username + ':' + admin.passwd);
var commonPasswd = 'testjj123';
var posterowner = {openid: 'posterowner'};
var authHeaderPosterowner = 'Basic ' + base64.encode(posterowner.openid + ':' + commonPasswd);
var forwarder1 = {openid: 'forwarder1'};
var authHeaderForwarder1 = 'Basic ' + base64.encode(forwarder1.openid + ':' + commonPasswd);
var forwarder2 = {openid: 'forwarder2'};
var authHeaderForwarder2 = 'Basic ' + base64.encode(forwarder2.openid + ':' + commonPasswd);
var forwarder3 = {openid: 'forwarder3'};
var authHeaderForwarder3 = 'Basic ' + base64.encode(forwarder3.openid + ':' + commonPasswd);

describe('UserController', function() {
/*
  describe('#Create user posterowner use admin', function() {
    it('should create succesfully', function (done) {
      request(sails.hooks.http.app)
        .get('/user')
        .set('Authorization', authHeaderAdmin)
        .send(posterowner)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          sails.log.silly(res);
          if (err) return done(err);
          sails.log.silly(res);
          done();
        })
    });
  });
*/

});