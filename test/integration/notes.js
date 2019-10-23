import crypto from 'crypto';

import { create, list, get, update, remove } from './crud';

export const notes = (api, route) => {
  describe(`${route} route tests`, () => {

    const resourceName = 'note'
    const aKey = 'note';

    const generateBody = () => {
      return { [aKey]: crypto.randomBytes(6).toString('hex') }
    };

    create(api, route, resourceName, generateBody, aKey);
    list(api, route, resourceName, generateBody, aKey);
    get(api, route, resourceName, generateBody, aKey);
    update(api, route, resourceName, generateBody, aKey);
    remove(api, route, resourceName, generateBody);
  });
};
