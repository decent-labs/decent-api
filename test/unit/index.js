import { api } from '../../src/api';
import { notes } from './notes';

export const unit = () => {
  describe("unit", function () {
    let _testApi;

    before(() => {
      const db = {
        notes: {
          create: note => {
            return { id: 1, note: note.note }
          },
          list: () => {
            return [{ id: 1, note: 'foo' }]
          },
          get: id => {
            return { id: id, note: 'bar' }
          },
          update: note => {
            return { id: 1, note: note.note }
          },
          delete: id => {
            return null;
          }
        }
      };

      _testApi = api(db);
    });

    notes(() => _testApi);
  });
};
