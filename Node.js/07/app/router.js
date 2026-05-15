import { promises as fs } from 'fs';
import path from 'path';
import { APP_CONFIG } from './constants.js';
import { sendError } from './utils.js';

import { getAllPhotos, getPhotoById } from './controllers/get-photos.controller.js';
import { uploadPhotos } from './controllers/upload-photos.controller.js';
import { deletePhotoById } from './controllers/delete-photo.js';

export async function route(req, res) {
  const { method, url } = req;

  try {
    if (url === '/') {
      const html = await fs.readFile(path.join(APP_CONFIG.ROOT_DIR, 'form.html'));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    }

    if (url === '/api/photos') {
      switch (method) {
        case 'GET': {
          getAllPhotos(req, res);
          return;
        }
        case 'POST': {
          uploadPhotos(req, res);
          return;
        }
      }
    }

    if (url.startsWith('/api/photos/')) {
      switch (method) {
        case 'GET': {
          getPhotoById(req, res);
          return;
        }
        case 'DELETE': {
          deletePhotoById(req, res);
          return;
        }
      }
    }

    sendError(res, 404, 'Endpoint not found');
  } catch (error) {
    sendError(res, 500, 'Internal server error');
    console.error(error);
  }
}
