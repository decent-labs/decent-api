import notes from './notes';

let _database;

export const setDatabase = database => {
  _database = database;
};

export const database = () => {
  return _database;
};

export const scrub = resource => {
  if (!resource) return null;
  delete resource.deleted_at;
  return resource;
};

export const databaseInterface = {
  notes
};
