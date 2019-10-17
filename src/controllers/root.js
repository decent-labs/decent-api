import childProcess from 'child_process';
import listEndpoints from 'express-list-endpoints';

import packageJson from '../../package.json';

const environment = process.env.NODE_ENV;
const gitHash = 'git rev-parse --short HEAD';
const revision = childProcess.execSync(gitHash).toString().trim();
const version = packageJson.version + '+' + revision;

export const getRoot = api => {
  return (_, res) => {
    res.status(200).send({
      '👋': '🌎',
      name: packageJson.name,
      environment,
      version,
      endpoints: listEndpoints(api)
    });
  }
};
