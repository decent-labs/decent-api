import chai from 'chai';
import chaiHttp from 'chai-http';

import { testApi } from '.';

chai.use(chaiHttp);
chai.should();

describe('/ route tests', () => {
  let api;
  const url = '/';

  before(() => (api = testApi()));

  describe('GET /', () => {
    let response;

    before(() => chai.request(api).get(url).then(res => (response = res)));

    it('should have 200 status', () => {
      response.should.have.status(200);
    });

    it('should return an object', () => {
      response.body.should.be.a('object');
    });

    it('should return hello world emojis', () => {
      response.body.should.have.property('👋').eql('🌎');
    });

    it('should return project name', () => {
      response.body.should.have.property('name');
      response.body.name.should.be.a('String');
    });

    it('should return environment', () => {
      response.body.should.have.property('environment').eql('test');
    });

    it('should return version', () => {
      response.body.should.have.property('version');
      response.body.version.should.match(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(\.(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(\+[0-9a-zA-Z-]+(\.[0-9a-zA-Z-]+)*)?$/);
    });

    it('should have a list of endpoints', () => {
      response.body.should.have.property('endpoints');
      response.body.endpoints.should.be.a('Array');
    });
  });
});
