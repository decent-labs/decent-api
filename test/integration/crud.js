import chai from 'chai';
const should = chai.should();

export const validObject = status => {
  it(`should have ${status} status`, function () {
    this.response.should.have.status(status);
  });

  it('should return an object', function () {
    this.response.body.should.be.a('object');
  });

  it('should have a created timestamp', function () {
    this.response.body.should.have.property('created_at');
    this.response.body.created_at.should.be.a('String');
  });
};

export const invalidRequest = resource => {
  it('should have 422 status', function () {
    this.response.should.have.status(422);
  });

  it('should return an object', function () {
    this.response.body.should.be.a('object');
  });

  it('should return an error', function () {
    this.response.body.should.have.property('error');
    this.response.body.error.should.be.a('String');
    this.response.body.error.should.eql(`invalid ${resource} input`);
  });
};

export const unknownResource = resource => {
  it('should have 404 status', function () {
    this.response.should.have.status(404);
  });

  it('should return an object', function () {
    this.response.body.should.be.a('object');
  });

  it('should return an error', function () {
    this.response.body.should.have.property('error');
    this.response.body.error.should.be.a('String');
    this.response.body.error.should.eql(`${resource} does not exist`);
  });
};

export const create = (api, route, resource, generateBody, aKey) => {
  describe(`POST ${route}`, () => {
    const request = function (body) {
      return chai.request(api()).post(route).send(body);
    };

    describe('valid request', () => {
      before(async function () {
        this.body = generateBody();
        this.response = await request(this.body);
      });

      validObject(201);

      it(`should return ${resource} text`, function () {
        this.response.body.should.have.property(aKey);
        this.response.body[aKey].should.be.a('String');
        this.response.body[aKey].should.eql(this.body[aKey]);
      });

      it('should not have an updated timestamp', function () {
        this.response.body.should.have.property('updated_at');
        should.not.exist(this.response.body.updated_at);
      });
    });

    describe('invalid request', () => {
      const body = {};

      before(async function () {
        this.response = await request(body);
      });

      invalidRequest(resource);
    });
  });
};

export const list = (api, route, resource, generateBody, aKey) => {
  describe(`GET ${route}`, () => {
    describe('valid request', () => {
      before(async function () {
        const existingResources = (await chai.request(api()).get(route)).body;
        for (const existingResource of existingResources) {
          await chai.request(api()).delete(`${route}/${existingResource.id}`);
        }

        this.listResources = [generateBody(), generateBody(), generateBody()];

        for (const resource of this.listResources) {
          await chai.request(api()).post(route).send(resource);
        }

        this.response = await chai.request(api()).get(route);
      });

      it('should have 200 status', function () {
        this.response.should.have.status(200);
      });

      it('should return an array', function () {
        this.response.body.should.be.an('Array');
      });

      it(`should have the right number of ${resource}s`, function () {
        this.response.body.length.should.eql(this.listResources.length);
      });

      it(`should have the ${resource}s that we just added`, function () {
        this.listResources.forEach(resource => {
          this.response.body.map(resource => resource[aKey]).includes(resource[aKey]).should.eql(true);
        })
      });
    });
  });
};

export const get = (api, route, resource, generateBody, aKey) => {
  describe(`GET ${route}/:id`, () => {
    describe('valid request', () => {
      before(async function () {
        this.body = generateBody();
        const create = await chai.request(api()).post(route).send(this.body);
        this.id = create.body.id;
        this.response = await chai.request(api()).get(`${route}/${this.id}`);
      });

      validObject(200);

      it(`should return ${resource} text`, function () {
        this.response.body.should.have.property(aKey);
        this.response.body[aKey].should.be.a('String');
        this.response.body[aKey].should.eql(this.body[aKey]);
      });

      it(`should return ${resource} id`, function () {
        this.response.body.should.have.property('id');
        this.response.body.id.should.be.a('Number');
        this.response.body.id.should.eql(this.id);
      });
    });

    describe('invalid request', () => {
      before(async function () {
        this.response = await chai.request(api()).get(`${route}/999999999`);
      });

      unknownResource(resource);
    });
  });
};

export const update = (api, route, resource, generateBody, aKey) => {
  describe(`PATCH ${route}/:id`, () => {
    describe('valid request', () => {
      before(async function () {
        this.newBody = generateBody();
        const create = await chai.request(api()).post(route).send(generateBody());
        this.response = await chai.request(api()).patch(`${route}/${create.body.id}`).send(this.newBody);
      });

      validObject(200);

      it(`should return ${resource} text`, function () {
        this.response.body.should.have.property(aKey);
        this.response.body[aKey].should.be.a('String');
        this.response.body[aKey].should.eql(this.newBody[aKey]);
      });

      it('should have an updated timestamp', function () {
        this.response.body.should.have.property('updated_at');
        this.response.body.updated_at.should.be.a('String');
      });
    });

    describe('invalid request', () => {
      describe('bad id', () => {
        before(async function () {
          await chai.request(api()).post(route).send(generateBody());
          this.response = await chai.request(api()).patch(`${route}/99999999`).send(generateBody());
        });

        unknownResource(resource);
      });

      describe('bad body', () => {
        before(async function () {
          const create = await chai.request(api()).post(route).send(generateBody());
          this.response = await chai.request(api()).patch(`${route}/${create.body.id}`).send({});
        });

        invalidRequest(resource);
      });
    });
  });
};

export const remove = (api, route, resource, generateBody) => {
  describe(`DELETE ${route}/:id`, () => {
    describe('valid request', () => {
      before(async function () {
        const create = await chai.request(api()).post(route).send(generateBody());
        const id = create.body.id;
        this.response = await chai.request(api()).delete(`${route}/${id}`);
      });

      it('should have 204 status', function () {
        this.response.should.have.status(204);
      });

      it('should not return a body', function () {
        this.response.body.should.eql({});
      });
    });

    describe(`does not return the ${resource} after deletion`, () => {
      before(async function () {
        const create = await chai.request(api()).post(route).send(generateBody());
        await chai.request(api()).delete(`${route}/${create.body.id}`);
        this.response = await chai.request(api()).get(`${route}/${create.body.id}`);
      });

      unknownResource(resource);
    });

    describe('invalid request', () => {
      describe('bad id', () => {
        before(async function () {
          await chai.request(api()).post(route).send(generateBody());
          this.response = await chai.request(api()).delete(`${route}/99999999`);
        });

        unknownResource(resource);
      });
    });
  });
};
