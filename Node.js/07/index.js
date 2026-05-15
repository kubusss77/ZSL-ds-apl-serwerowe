import fs from 'fs';
import { APP_CONFIG } from './app/constants.js';
import { createServer } from 'http';
import { route } from './app/router.js';

function startServer() {
  fs.mkdirSync(APP_CONFIG.UPLOADS_DIR, { recursive: true });

  const server = createServer(async (req, res) => await route(req, res));
  server.listen(3000, () => console.log('Server running on port 3000'));
}

startServer();
