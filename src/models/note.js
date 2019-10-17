import { NotFound, InvalidInput } from '../errors';

const table = 'notes';

export const create = (db, note) => {
  return new Promise((resolve, reject) => {
    if (!note.note) throw new InvalidInput('note')
    return db(table).insert(note).returning('*')
      .then(([note]) => resolve(note))
      .catch(reject);
  });
};

export const list = db => {
  return new Promise((resolve, reject) => {
    return db.from(table).whereNull('deleted_at').select('id', 'note')
      .then(resolve)
      .catch(reject);
  });
};

export const get = (db, id) => {
  return new Promise((resolve, reject) => {
    return db.from(table).select('*').whereNull('deleted_at').where({ id }).first()
      .then(note => {
        if (!note) throw new NotFound('note');
        resolve(note);
      })
      .catch(reject);
  });
};

export const update = (db, note) => {
  if (!note.note) throw new InvalidInput('note')
  return new Promise((resolve, reject) => {
    return db(table).whereNull('deleted_at').where({ id: note.id }).update(note).returning('*')
      .then(([note]) => {
        if (!note) throw new NotFound('note');
        return resolve(note);
      })
      .catch(reject);
  });
};

export const remove = (db, id) => {
  return new Promise((resolve, reject) => {
    return db(table).whereNull('deleted_at').where({ id }).update({ deleted_at: db.fn.now() }).returning('*')
      .then(([note]) => {
        if (!note) throw new NotFound('note');
        return resolve(note);
      })
      .catch(reject);
  });
};
