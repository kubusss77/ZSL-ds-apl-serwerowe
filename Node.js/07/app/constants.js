import dotenv from 'dotenv';
const { parsed } = dotenv.config();

if (!parsed.JWT_SECRET || !parsed.PORT || !parsed.API_HOST) {
  throw new Error('Required environment variables not set');
}

import path from 'path';

export const APP_CONFIG = {
  ROOT_DIR: path.resolve(),
  UPLOADS_DIR: path.join(path.resolve(), 'uploads'),
  JWT_SECRET: parsed.JWT_SECRET,
  PORT: parsed.PORT,
  API_HOST: parsed.API_HOST,
};
