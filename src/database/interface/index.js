import { notes } from './notes';

export const setDatabase = database => {
  return {
    notes: notes(database, crud)
  }
};

export const scrub = resource => {
  if (!resource) return null;
  delete resource.deleted_at;
  return resource;
};

const crud = (db, implementation) => {
  return {
    create: resource => implementation.create(db, resource),
    list: () => implementation.list(db),
    get: id => implementation.get(db, id),
    update: resource => implementation.update(db, resource),
    remove: id => implementation.remove(db, id)
  };
};
