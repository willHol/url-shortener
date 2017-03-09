const chai = require('chai').should();
const chaiHttp = require('chai-http');
const server = require('../app');

chai.use(chaiHttp);

describe('id route: ', () => {
  describe('Should return an error:', () => {
    it ('123', (done) => {
      chai.request(server)
        .get('/123')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it ('12e4444', (done) => {
      chai.request(server)
        .get('/12e44')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it ('efi4', (done) => {
      chai.request(server)
        .get('/123')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});

describe('new route: ', () => {
  it ('http://www.google.com', function(done) {
    this.timeout(5000);
    chai.request(server)
      .get('/new/http://www.google.com')
      .end((err, res) => {
        let redirect = res.body['short_url'].slice(-9);
        res.should.have.status(200);
        res.body.should.have.deep.property('original_url', 'http://www.google.com');

        chai.request(server)
          .get(redirect)
          .end((err, res) => {
            res.should.have.status(200);
            res.redirects[0].should.equal('http://www.google.com/');
            done();
          });
      });
  });
  it ('http://www.youtube.com', function(done) {
    this.timeout(5000);
    chai.request(server)
      .get('/new/http://www.youtube.com')
      .end((err, res) => {
        const redirect = res.body['short_url'].slice(-9);
        res.should.have.status(200);
        res.body.should.have.deep.property('original_url', 'http://www.youtube.com');

        chai.request(server)
          .get(redirect)
          .end((err, res) => {
            res.should.have.status(200);
            res.redirects[0].should.equal('http://www.youtube.com/');
            done();
          });
      });
  });
});
