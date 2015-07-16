var request = require('supertest');

describe('PosterController', function() {

  describe('#post() without localpassport', function() {
    it('should redirect to /auth/weixin', function (done) {
      request(sails.hooks.http.app)
        .post('/poster')
        .send({ subject: 'testsubject', body: 'testbody', tipAmount: "100" })
        .expect(302)
        .expect('location','/auth/weixin', done);
    });
  });

  describe('#post() with localpassport', function() {
    it('should post succesfully', function (done) {
      request(sails.hooks.http.app)
        .post('/poster')
        .set('Authorization', 'Basic YWRtaW46YWRtaW4xMjM0')
        .send({ subject: 'testsubject', body: 'testbody', tipAmount: "100" })
        .expect(403, done);
    });
  });

  //How to test various action with weixin oauth2 passport
});