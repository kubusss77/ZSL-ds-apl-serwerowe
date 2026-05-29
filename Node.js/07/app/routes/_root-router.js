import { promises as fs } from 'fs';
import path from 'path';
import { APP_CONFIG } from '../constants.js';
import { sendMessage } from '../utils/http.utils.js';

import { photosRouter } from './photos.routes.js';
import { tagsRouter } from './tags.router.js';
import { userRouter } from './user.routes.js';

export async function rootRouter(req, res) {
  console.log('url: ', req.url);

  try {
    if (req.url === '/') {
      const html = await fs.readFile(path.join(APP_CONFIG.ROOT_DIR, 'form.html'));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }

    // PHOTOS
    if (req.url.startsWith('/api/photos')) {
      photosRouter(req, res);
      return;
    }

    // TAGS
    if (req.url.startsWith('/api/tags')) {
      tagsRouter(req, res);
      return;
    }

    // USER
    if (req.url.startsWith('/api/user')) {
      userRouter(req, res);
      return;
    }

    sendMessage(res, 404, 'Endpoint not found');
  } catch (error) {
    console.error(error);
    sendMessage(res, 500, 'Internal server error');
  }
}
