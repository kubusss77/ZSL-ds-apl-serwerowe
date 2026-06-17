import { promises as fs } from 'fs';
import path from 'path';
import { APP_CONFIG } from '../constants.js';
import { sendMessage } from '../utils/http.utils.js';

import { photosRouter } from './photos.routes.js';
import { tagsRouter } from './tags.router.js';
import { userRouter } from './user.routes.js';
import { profileRouter } from './profile.router.js';
import { notificationsRouter } from './notifications.routes.js';
import { filtersRouter } from './filters.routes.js';
import { getImageRouter } from './getimage.routes.js';

export async function rootRouter(req, res) {
  console.log('url: ', req.url);

  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.url === '/') {
      const html = await fs.readFile(path.join(APP_CONFIG.ROOT_DIR, './html/photos.html'));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }

    if (req.url === '/notifications') {
      const html = await fs.readFile(path.join(APP_CONFIG.ROOT_DIR, './html/notifications.html'));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }

    if (req.url === '/likes') {
      const html = await fs.readFile(path.join(APP_CONFIG.ROOT_DIR, './html/likes.html'));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }

    // PHOTOS
    if (req.url.startsWith('/api/photos')) {
      await photosRouter(req, res);
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

    //PROFILE
    if (req.url.startsWith('/api/profile')) {
      profileRouter(req, res);
      return;
    }

    //NOTIFICATIONS
    if (req.url.startsWith('/api/notifications')) {
      await notificationsRouter(req, res);
      return;
    }

    // FILTERS
    if (req.url.startsWith('/api/filters')) {
      filtersRouter(req, res);
      return;
    }

    // GET IMAGE
    if (req.url.startsWith('/api/getimage')) {
      getImageRouter(req, res);
      return;
    }

    sendMessage(res, 404, 'Endpoint not found');
  } catch (error) {
    console.error(error);
    sendMessage(res, 500, 'Internal server error');
  }
}
