const table = 'notes';

export const create = (db, note) => {
  return new Promise((resolve, reject) => {
    return db(table).insert(note).returning('*')
      .then(([note]) => resolve(note))
      .catch(reject);
  });
};

export const list = db => {
  return new Promise((resolve, reject) => {
    return db(table).whereNull('deleted_at').select('id', 'note')
      .then(resolve)
      .catch(reject);
  });
};

export const get = (db, id) => {
  return new Promise((resolve, reject) => {
    return db(table).whereNull('deleted_at').where({ id }).select('*').first()
      .then(resolve)
      .catch(reject);
  });
};

export const update = (db, note) => {
  return new Promise((resolve, reject) => {
    return db(table).whereNull('deleted_at').where({ id: note.id }).update({ ...note, updated_at: db.fn.now() }).returning('*')
      .then(([note]) => resolve(note))
      .catch(reject);
  });
};

export const remove = (db, id) => {
  return new Promise((resolve, reject) => {
    return db(table).whereNull('deleted_at').where({ id }).update({ deleted_at: db.fn.now() }).returning('id')
      .then(([id]) => resolve(id))
      .catch(reject);
  });
};
