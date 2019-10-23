const scrub = resource => {
  if (!resource) return null;
  delete resource.deleted_at;
  return resource;
};

export const crud = (db, table, implementation) => {
  return {
    create: resource => implementation.create(db, table, resource),
    list: () => implementation.list(db, table),
    get: id => implementation.get(db, table, id),
    update: resource => implementation.update(db, table, resource),
    remove: id => implementation.remove(db, table, id)
  };
};

export const create = (db, table, resource) => {
  return new Promise((resolve, reject) => {
    return db(table).insert(resource).returning('*')
      .then(([resource]) => resolve(scrub(resource)))
      .catch(reject);
  });
};

export const list = (db, table) => {
  return new Promise((resolve, reject) => {
    return db(table).whereNull('deleted_at').select('*')
      .then(resolve)
      .catch(reject);
  });
};

export const get = (db, table, id) => {
  return new Promise((resolve, reject) => {
    return db(table).whereNull('deleted_at').where({ id }).select('*').first()
      .then(resource => resolve(scrub(resource)))
      .catch(reject);
  });
};

export const update = (db, table, resource) => {
  return new Promise((resolve, reject) => {
    return db(table).whereNull('deleted_at').where({ id: resource.id }).update({ ...resource, updated_at: db.fn.now() }).returning('*')
      .then(([resource]) => resolve(scrub(resource)))
      .catch(reject);
  });
};

export const remove = (db, table, id) => {
  return new Promise((resolve, reject) => {
    return db(table).whereNull('deleted_at').where({ id }).update({ deleted_at: db.fn.now() }).returning('id')
      .then(([id]) => resolve(id))
      .catch(reject);
  });
};
