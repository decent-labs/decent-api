import chai from 'chai';
import chaiHttp from 'chai-http';

import { testApp } from '../global.spec';

chai.use(chaiHttp);
const should = chai.should();

const url = '/notes';

describe(`${url} route tests`, () => {
  let app;

  before(() => (app = testApp()));

  describe(`POST ${url}`, () => {
    let response;

    const request = async body => {
      response = await chai.request(app).post(url).send(body);
    };

    describe('valid request', () => {
      const body = { note: 'clean the house' };

      before(() => request(body));

      it('should have 201 status', () => {
        response.should.have.status(201);
      });

      it('should return an object', () => {
        response.body.should.be.a('object');
      });

      it('should return note text', () => {
        response.body.should.have.property('note');
        response.body.note.should.be.a('String');
        response.body.note.should.eql(body.note);
      });

      it('should have a created timestamp', () => {
        response.body.should.have.property('created_at');
        response.body.created_at.should.be.a('String');
      });

      it('should not have an updated timestamp', () => {
        response.body.should.have.property('updated_at');
        should.not.exist(response.body.updated_at);
      });
    });

    describe('invalid request', () => {
      const body = {};

      before(() => request(body));

      it('should have 422 status', () => {
        response.should.have.status(422);
      });

      it('should return an object', () => {
        response.body.should.be.a('object');
      });

      it('should return an error', () => {
        response.body.should.have.property('error');
        response.body.error.should.be.a('String');
        response.body.error.should.eql('invalid input');
      });
    });
  });

  describe(`GET ${url}`, () => {
    let response;

    describe('valid request', () => {
      const notes = [
        "dust the stairs",
        "dust the mantle",
        "dust the dresser"
      ];

      before(async () => {
        for (const note of notes) {
          await chai.request(app).post(url).send({ note });
        }

        response = await chai.request(app).get(url);
      });

      it('should have 200 status', () => {
        response.should.have.status(200);
      });

      it('should return an array', () => {
        response.body.should.be.an('Array');
      });

      it('should have the right number of notes', () => {
        response.body.should.have.lengthOf.at.least(notes.length);
      });

      it('should have the notes that we just added', () => {
        notes.forEach(note => {
          response.body.map(note => note.note).includes(note).should.eql(true);
        })
      });
    });
  });

  describe(`GET ${url}/:id`, () => {
    let response;

    describe('valid request', () => {
      const body = { note: 'water the plants' };
      let id;

      before(async () => {
        const create = await chai.request(app).post(url).send(body);
        id = create.body.id;
        response = await chai.request(app).get(`${url}/${id}`);
      });

      it('should have 200 status', () => {
        response.should.have.status(200);
      });

      it('should return an object', () => {
        response.body.should.be.a('object');
      });

      it('should return note text', () => {
        response.body.should.have.property('note');
        response.body.note.should.be.a('String');
        response.body.note.should.eql(body.note);
      });

      it('should return note id', () => {
        response.body.should.have.property('id');
        response.body.id.should.be.a('Number');
        response.body.id.should.eql(id);
      });

      it('should return the created date', () => {
        response.body.should.have.property('created_at');
        response.body.created_at.should.be.a('String');
      });
    });

    describe('invalid request', () => {
      before(async () => {
        response = await chai.request(app).get(`${url}/999999999`);
      });

      it('should have 404 status', () => {
        response.should.have.status(404);
      });

      it('should return an object', () => {
        response.body.should.be.a('object');
      });

      it('should return an error', () => {
        response.body.should.have.property('error');
        response.body.error.should.be.a('String');
        response.body.error.should.eql('note does not exist');
      });
    });
  });

  describe(`PATCH ${url}/:id`, () => {
    let response;

    describe('valid request', () => {
      const body = { note: 'take out the trash' };
      const newBody = { note: 'done taking out the trash' };

      before(async () => {
        const create = await chai.request(app).post(url).send(body);
        response = await chai.request(app).patch(`${url}/${create.body.id}`).send(newBody);
      });

      it('should have 200 status', () => {
        response.should.have.status(200);
      });

      it('should return an object', () => {
        response.body.should.be.a('object');
      });

      it('should return note text', () => {
        response.body.should.have.property('note');
        response.body.note.should.be.a('String');
        response.body.note.should.eql(newBody.note);
      });

      it('should have an updated timestamp', () => {
        response.body.should.have.property('updated_at');
        response.body.updated_at.should.be.a('String');
      });
    });

    describe('invalid request', () => {
      describe('bad id', () => {
        const body = { note: 'mop the floor' };
        const newBody = { note: 'done mopping the floor' };

        before(async () => {
          await chai.request(app).post(url).send(body);
          response = await chai.request(app).patch(`${url}/99999999`).send(newBody);
        });

        it('should have 404 status', () => {
          response.should.have.status(404);
        });

        it('should return an object', () => {
          response.body.should.be.a('object');
        });

        it('should return an error', () => {
          response.body.should.have.property('error');
          response.body.error.should.be.a('String');
          response.body.error.should.eql('note does not exist');
        });
      });

      describe('bad body', () => {
        const body = { note: 'do the dishes' };
        const newBody = {};

        before(async () => {
          const create = await chai.request(app).post(url).send(body);
          response = await chai.request(app).patch(`${url}/${create.body.id}`).send(newBody);
        });

        it('should have 422 status', () => {
          response.should.have.status(422);
        });

        it('should return an object', () => {
          response.body.should.be.a('object');
        });

        it('should return an error', () => {
          response.body.should.have.property('error');
          response.body.error.should.be.a('String');
          response.body.error.should.eql('invalid input');
        });
      });
    });
  });

  describe(`DELETE ${url}/:id`, () => {
    let response;

    describe('valid request', () => {
      const body = { note: 'vaccuum the carpet' };
      let id;

      before(async () => {
        const create = await chai.request(app).post(url).send(body);
        id = create.body.id;
        response = await chai.request(app).delete(`${url}/${id}`);
      });

      it('should have 204 status', () => {
        response.should.have.status(204);
      });

      it('should not return a body', () => {
        response.body.should.eql({});
      });
    });

    describe('does not return the note after deletion', () => {
      const body = { note: 'feed the dog' };

      before(async () => {
        const create = await chai.request(app).post(url).send(body);
        await chai.request(app).delete(`${url}/${create.body.id}`);
        response = await chai.request(app).get(`${url}/${create.body.id}`);
      });

      it('should have 404 status', () => {
        response.should.have.status(404);
      });

      it('should return an object', () => {
        response.body.should.be.a('object');
      });

      it('should return an error', () => {
        response.body.should.have.property('error');
        response.body.error.should.be.a('String');
        response.body.error.should.eql('note does not exist');
      });
    });

    describe('invalid request', () => {
      describe('bad id', () => {
        const body = { note: 'mow the lawn' };

        before(async () => {
          await chai.request(app).post(url).send(body);
          response = await chai.request(app).delete(`${url}/99999999`);
        });

        it('should have 404 status', () => {
          response.should.have.status(404);
        });

        it('should return an object', () => {
          response.body.should.be.a('object');
        });

        it('should return an error', () => {
          response.body.should.have.property('error');
          response.body.error.should.be.a('String');
          response.body.error.should.eql('note does not exist');
        });
      });
    });
  });
});
