import { Router } from 'express';

import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote
} from '../controllers/notes';

const notesRouter = Router();

notesRouter.post('/', createNote);
notesRouter.get('/', getNotes);
notesRouter.get('/:id', getNote);
notesRouter.patch('/:id', updateNote);
notesRouter.delete('/:id', deleteNote);

export const notes = notesRouter;
