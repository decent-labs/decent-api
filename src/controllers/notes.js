import { NotFound, InvalidInput } from '../errors';
import { create, list, get, update, remove } from '../models/note';

export const createNote = (req, res, next) => {
  const newNote = {
    note: req.body.note
  };

  if (!newNote.note) throw new InvalidInput('note');

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
    .then(note => {
      if (!note) throw new NotFound('note');
      res.status(200).json(note);
    })
    .catch(next);
};

export const updateNote = (req, res, next) => {
  const updatedNote = {
    id: req.params.id,
    note: req.body.note
  };

  if (!updatedNote.note) throw new InvalidInput('note');

  update(res.locals.db, updatedNote)
    .then(note => {
      if (!note) throw new NotFound('note');
      res.status(200).json(note);
    })
    .catch(next);
};

export const deleteNote = (req, res, next) => {
  remove(res.locals.db, req.params.id)
    .then(id => {
      if (!id) throw new NotFound('note');
      res.status(204).end();
    })
    .catch(next);
};
