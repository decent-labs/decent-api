export class NotFound extends Error {
  constructor(resource) {
    const message = `${resource} does not exist`;
    super(message);
    this.name = this.constructor.name;
    this.statusMessage = message;
    this.statusCode = 404;
  }
}

export class InvalidInput extends Error {
  constructor(resource) {
    const message = `invalid ${resource} input`;
    super(message);
    this.name = this.constructor.name;
    this.statusMessage = message;
    this.statusCode = 422;
  }
}
