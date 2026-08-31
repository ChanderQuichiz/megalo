import { teardownTestEnviroment } from './setup-e2e';

export default async () => {
  await teardownTestEnviroment();
};
