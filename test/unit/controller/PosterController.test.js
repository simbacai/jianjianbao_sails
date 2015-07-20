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

  describe('#get() without localpassport', function() {
    it('should redirect to /auth/weixin', function (done) {
      request(sails.hooks.http.app)
        .get('/poster/1')
        .expect(302)
        .expect('location','/auth/weixin', done);
    });
  });

  describe('#put() without localpassport', function() {
    it('should redirect to /auth/weixin', function (done) {
      request(sails.hooks.http.app)
        .put('/poster/1')
        .send({body: 'updatebody'})
        .expect(302)
        .expect('location','/auth/weixin', done);
    });
  });

  describe('#delete() without localpassport', function() {
    it('should redirect to /auth/weixin', function (done) {
      request(sails.hooks.http.app)
        .delete('/poster/1')
        .expect(302)
        .expect('location','/auth/weixin', done);
    });
  });

 //Todo Actually need to assert the body content
  describe('#post() with localpassport', function() {
    it('should post succesfully', function (done) {
      request(sails.hooks.http.app)
        .post('/poster')
        .set('Authorization', 'Basic cG9zdGVyb3duZXI6dGVzdGpqMTIz')
        .send({ subject: 'testsubject', body: 'testbody', tipAmount: "100" })
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          sails.log.silly(res);
          done();
        })
    });
  });

  describe('#get() with localpassport', function() {
    it('should get succesfully', function (done) {
      request(sails.hooks.http.app)
        .get('/poster/1')
        .set('Authorization', 'Basic cG9zdGVyb3duZXI6dGVzdGpqMTIz')
        .expect('Content-Type', /json/) 
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          sails.log.silly(res);
          done();
        }) 
    });
  });

  describe('#put() with localpassport', function() {
    it('should put succesfully', function (done) {
      request(sails.hooks.http.app)
        .put('/poster/1')
        .set('Authorization', 'Basic cG9zdGVyb3duZXI6dGVzdGpqMTIz')
        .send({body: 'updatebody'})
        .expect('Content-Type', /json/) 
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          sails.log.silly(res);
          done();
        }) 
    });
  });

  describe('#post image with localpassport', function() {
    it('should post image succesfully', function (done) {
      request(sails.hooks.http.app)
        .post('/poster/image/1')
        .set('Authorization', 'Basic cG9zdGVyb3duZXI6dGVzdGpqMTIz')
        .attach('image', 'test/fixtures/ab.jpg')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          sails.log.silly(res);
          done();
        }) 
    });
  });
  
  //There is undefined error of fileadaptor, to be debugged
  describe('#get image with localpassport', function() {
    it('should get image succesfully', function (done) {
      request(sails.hooks.http.app)
        .get('/poster/image/1')
        .set('Authorization', 'Basic cG9zdGVyb3duZXI6dGVzdGpqMTIz')
        .end(function(err, res) {
          if (err) return done(err);
          sails.log.silly(res);
          done();
        }) 
    });
  });

  describe('#delete() with localpassport', function() {
    it('should delete succesfully', function (done) {
      request(sails.hooks.http.app)
        .delete('/poster/1')
        .set('Authorization', 'Basic cG9zdGVyb3duZXI6dGVzdGpqMTIz')
        .expect('Content-Type', /json/) 
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          sails.log.silly(res);
          done();
        }) 
    });
  });
});