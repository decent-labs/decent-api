export const create = (db, note) => {
  return db.createNote(note);
};

export const list = db => {
  return db.listNotes();
};

export const get = (db, id) => {
  return db.getNote(id);
};

export const update = (db, note) => {
  return db.updateNote(note);
};

export const remove = (db, id) => {
  return db.deleteNote(id);
};
