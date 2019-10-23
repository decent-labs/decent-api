import { create, list, get, update, remove } from './crud';

const table = 'notes';

export const notes = (db, crud) => {
  return crud(db, table, { create, list, get, update, remove });
};
