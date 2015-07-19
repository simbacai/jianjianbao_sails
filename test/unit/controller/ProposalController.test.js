var request = require('supertest');

describe('ProposalController', function() {

  describe('#Create Poster for ProposalController testing', function() {
    it('should create succesfully', function (done) {
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

  describe('#post() without localpassport', function() {
    it('should redirect to /auth/weixin', function (done) {
      request(sails.hooks.http.app)
        .post('/proposal')
        .send({ poster: '2', content: 'testproposal'})
        .expect(302)
        .expect('location','/auth/weixin', done);
    });
  });

  describe('#get() without localpassport', function() {
    it('should redirect to /auth/weixin', function (done) {
      request(sails.hooks.http.app)
        .get('/proposal?poster=2')
        .expect(302)
        .expect('location','/auth/weixin', done);
    });
  });
    
  describe('#put() without localpassport', function() {
    it('should redirect to /auth/weixin', function (done) {
      request(sails.hooks.http.app)
        .put('/proposal/1')
        .send({content: 'updateProposal'})
        .expect(302)
        .expect('location','/auth/weixin', done);
    });
  });

/*
  describe('#delete() without localpassport', function() {
    it('should redirect to /auth/weixin', function (done) {
      request(sails.hooks.http.app)
        .delete('/proposal/1')
        .expect(302, done);
        //.expect('location','/auth/weixin', done);  //To Debug
    });
  });
*/

  //Testing Poster Owner's proposal Actions
  describe('#post() with localpassport', function() {
    it('should post successfully', function (done) {
      request(sails.hooks.http.app)
        .post('/proposal')
        .set('Authorization', 'Basic cG9zdGVyb3duZXI6dGVzdGpqMTIz')
        .send({ poster: '2', content: 'testproposal'})
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          sails.log.silly(res);
          done();
        })

    });
  });

  describe('#get() with localpassport', function() {
    it('should get successfully', function (done) {
      request(sails.hooks.http.app)
        .get('/proposal/1')
        .set('Authorization', 'Basic cG9zdGVyb3duZXI6dGVzdGpqMTIz')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          sails.log.silly(res);
          done();
        })

    });
  });

  describe('#put() with localpassport', function() {
    it('should put successfully', function (done) {
      request(sails.hooks.http.app)
        .put('/proposal/1')
        .set('Authorization', 'Basic cG9zdGVyb3duZXI6dGVzdGpqMTIz')
        .send({content: 'testproposal'})
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          sails.log.silly(res);
          done();
        })

    });
  });

  describe('#delete() with localpassport', function() {
    it('should delete successfully', function (done) {
      request(sails.hooks.http.app)
        .delete('/proposal/1')
        .set('Authorization', 'Basic cG9zdGVyb3duZXI6dGVzdGpqMTIz')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          sails.log.silly(res);
          done();
        })

    });
  });

  
  //Testing Poster Non-owner's proposal Actions



});