import { database, scrub } from '.';

const create = note => {
  return new Promise((resolve, reject) => {
    return database()('notes').insert(note).returning('*')
      .then(([note]) => resolve(scrub(note)))
      .catch(reject);
  });
};

const list = () => {
  return new Promise((resolve, reject) => {
    return database()('notes').whereNull('deleted_at').select('id', 'note')
      .then(resolve)
      .catch(reject);
  });
};

const get = id => {
  return new Promise((resolve, reject) => {
    return database()('notes').whereNull('deleted_at').where({ id }).select('*').first()
      .then(note => resolve(scrub(note)))
      .catch(reject);
  });
};

const update = note => {
  return new Promise((resolve, reject) => {
    return database()('notes').whereNull('deleted_at').where({ id: note.id }).update({ ...note, updated_at: database().fn.now() }).returning('*')
      .then(([note]) => resolve(scrub(note)))
      .catch(reject);
  });
};

const remove = id => {
  return new Promise((resolve, reject) => {
    return database()('notes').whereNull('deleted_at').where({ id }).update({ deleted_at: database().fn.now() }).returning('id')
      .then(([id]) => resolve(id))
      .catch(reject);
  });
};

export default { create, list, get, update, remove };
