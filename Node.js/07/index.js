import fs from 'fs';
import { APP_CONFIG } from './app/constants.js';
import { createServer } from 'http';
import { rootRouter } from './app/routes/_root-router.js';

function startServer() {
  fs.mkdirSync(APP_CONFIG.UPLOADS_DIR, { recursive: true });

  const server = createServer(async (req, res) => await rootRouter(req, res));
  server.listen(APP_CONFIG.PORT, () => console.log('Server running on port ' + APP_CONFIG.PORT));
}

startServer();
