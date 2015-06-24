require('should');

describe('Poster', function() {
it ('should not be empty', function(done) {
  Poster.find().exec(function(err, posters) {
    posters.length.should.be.eql(fixtures['poster'].length);
    done();
  });
});
});