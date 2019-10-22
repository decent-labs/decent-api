export const create = (db, note) => {
  return db.notes.create(note);
};

export const list = db => {
  return db.notes.list();
};

export const get = (db, id) => {
  return db.notes.get(id);
};

export const update = (db, note) => {
  return db.notes.update(note);
};

export const remove = (db, id) => {
  return db.notes.remove(id);
};
