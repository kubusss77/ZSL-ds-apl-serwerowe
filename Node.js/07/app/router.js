import { promises as fs } from 'fs';
import path from 'path';
import { APP_CONFIG } from './constants.js';
import { sendError } from './utils.js';

import { getAllPhotos, getPhotoById } from './controllers/photos/get-photos.controller.js';
import { uploadPhotos } from './controllers/photos/upload-photos.controller.js';
import { deletePhotoById } from './controllers/photos/delete-photo.controller.js';
import { updatePhotoById } from './controllers/photos/update-photo.controller.js';

import { addTag } from './controllers/tags/add-tag.controller.js';
import { getAllTags, getAllTagsRaw } from './controllers/tags/get-tags.controller.js';
import { getTagsStats } from './controllers/tags/get-tags-stats.controller.js';

export async function route(req, res) {
  const { method, url } = req;

  console.log('url: ', url);

  try {
    if (url === '/') {
      const html = await fs.readFile(path.join(APP_CONFIG.ROOT_DIR, 'form.html'));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }

    // PHOTOS

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
        case 'PATCH': {
          updatePhotoById(req, res);
          return;
        }
      }
    }

    // TAGS

    if (url === '/api/tags') {
      switch (method) {
        case 'GET': {
          getAllTags(req, res);
          return;
        }
        case 'POST': {
          addTag(req, res);
          return;
        }
      }
    }

    if (url === '/api/tags/raw') {
      switch (method) {
        case 'GET': {
          getAllTagsRaw(req, res);
          return;
        }
      }
    }

    if (url === '/api/tags/stats') {
      switch (method) {
        case 'GET': {
          getTagsStats(req, res);
        }
      }
    }
    sendError(res, 404, 'Endpoint not found');
  } catch (error) {
    console.error(error);
    sendError(res, 500, 'Internal server error');
  }
}
