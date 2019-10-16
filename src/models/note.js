import { makeError } from '../middleware';

const table = 'notes';

export const create = (db, note) => {
  return new Promise((resolve, reject) => {
    if (!note.note) makeError(422, 'invalid input');

    return db(table).insert(note).returning('*')
      .then(([note]) => resolve(note))
      .catch(reject);
  });
};

export const list = db => {
  return new Promise((resolve, reject) => {
    return db.from(table).select('id', 'note').whereNull('deleted_at')
      .then(resolve)
      .catch(reject);
  });
};

export const get = (db, id) => {
  return new Promise((resolve, reject) => {
    return db.from(table).select('*').whereNull('deleted_at').where({ id }).first()
      .then(note => {
        if (!note) makeError(404, 'note does not exist');
        resolve(note);
      })
      .catch(reject);
  });
};

export const update = (db, note) => {
  if (!note.note) makeError(422, 'invalid input');

  return new Promise((resolve, reject) => {
    return db(table).whereNull('deleted_at').where({ id: note.id }).update(note).returning('*')
      .then(([note]) => {
        if (!note) makeError(404, 'note does not exist');
        return resolve(note);
      })
      .catch(reject);
  });
};

export const remove = (db, id) => {
  return new Promise((resolve, reject) => {
    return db(table).whereNull('deleted_at').where({ id }).update({ deleted_at: db.fn.now() }).returning('*')
      .then(([note]) => {
        if (!note) makeError(404, 'note does not exist');
        return resolve(note);
      })
      .catch(reject);
  });
};
