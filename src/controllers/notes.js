import { create, list, get, update, remove } from '../models/note';

export const createNote = (req, res, next) => {
  const newNote = {
    note: req.body.note
  };

  create(res.locals.db, newNote)
    .then(note => res.status(201).json(note))
    .catch(next);
};

export const getNotes = (_, res, next) => {
  list(res.locals.db)
    .then(notes => res.status(200).json(notes))
    .catch(next);
};

export const getNote = (req, res, next) => {
  get(res.locals.db, req.params.id)
    .then(note => res.status(200).json(note))
    .catch(next);
};

export const updateNote = (req, res, next) => {
  const updatedNote = {
    id: req.params.id,
    note: req.body.note,
    updated_at: res.locals.db.fn.now()
  };

  update(res.locals.db, updatedNote)
    .then(note => res.status(200).json(note))
    .catch(next);
};

export const deleteNote = (req, res, next) => {
  remove(res.locals.db, req.params.id)
    .then(() => res.status(204).end())
    .catch(next);
};
