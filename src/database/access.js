let _db;

export const setDb = db => {
  _db = db;

  return {
    createNote, listNotes, getNote, updateNote, deleteNote
  };
};

const scrub = resource => {
  if (!resource) return null;
  delete resource.deleted_at;
  return resource;
}

const createNote = note => {
  return new Promise((resolve, reject) => {
    return _db('notes').insert(note).returning('*')
      .then(([note]) => resolve(scrub(note)))
      .catch(reject);
  });
};

const listNotes = () => {
  return new Promise((resolve, reject) => {
    return _db('notes').whereNull('deleted_at').select('id', 'note')
      .then(resolve)
      .catch(reject);
  });
};

const getNote = id => {
  return new Promise((resolve, reject) => {
    return _db('notes').whereNull('deleted_at').where({ id }).select('*').first()
      .then(note => resolve(scrub(note)))
      .catch(reject);
  });
};

const updateNote = note => {
  return new Promise((resolve, reject) => {
    return _db('notes').whereNull('deleted_at').where({ id: note.id }).update({ ...note, updated_at: _db.fn.now() }).returning('*')
      .then(([note]) => resolve(scrub(note)))
      .catch(reject);
  });
};

const deleteNote = id => {
  return new Promise((resolve, reject) => {
    return _db('notes').whereNull('deleted_at').where({ id }).update({ deleted_at: _db.fn.now() }).returning('id')
      .then(([id]) => resolve(id))
      .catch(reject);
  });
};
