import { scrub } from '.';

const table = 'notes';

const create = (db, note) => {
  return new Promise((resolve, reject) => {
    return db(table).insert(note).returning('*')
      .then(([note]) => resolve(scrub(note)))
      .catch(reject);
  });
};

const list = db => {
  return new Promise((resolve, reject) => {
    return db(table).whereNull('deleted_at').select('id', 'note')
      .then(resolve)
      .catch(reject);
  });
};

const get = (db, id) => {
  return new Promise((resolve, reject) => {
    return db(table).whereNull('deleted_at').where({ id }).select('*').first()
      .then(note => resolve(scrub(note)))
      .catch(reject);
  });
};

const update = (db, note) => {
  return new Promise((resolve, reject) => {
    return db(table).whereNull('deleted_at').where({ id: note.id }).update({ ...note, updated_at: db.fn.now() }).returning('*')
      .then(([note]) => resolve(scrub(note)))
      .catch(reject);
  });
};

const remove = (db, id) => {
  return new Promise((resolve, reject) => {
    return db(table).whereNull('deleted_at').where({ id }).update({ deleted_at: db.fn.now() }).returning('id')
      .then(([id]) => resolve(id))
      .catch(reject);
  });
};

export const notes = (db, crud) => {
  return crud(db, { create, list, get, update, remove })
};
