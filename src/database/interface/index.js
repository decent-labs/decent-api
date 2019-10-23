import { crud } from './crud';
import { notes } from './notes';

export const setDatabase = database => {
  return {
    notes: notes(database, crud)
  };
};
