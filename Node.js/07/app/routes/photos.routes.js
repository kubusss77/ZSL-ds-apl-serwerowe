import { getAllPhotos, getPhotoById } from '../controllers/photos/get-photos.controller.js';
import { uploadPhotos } from '../controllers/photos/upload-photos.controller.js';

import { addTagToPhoto } from '../controllers/photos/tag-photo.controller.js';
import { deletePhotoById } from '../controllers/photos/delete-photo.controller.js';
import { updatePhotoById } from '../controllers/photos/update-photo.controller.js';
import { likePhoto } from '../controllers/photos/like-photo.controller.js';
import { authorize } from '../middleware/auth.middleware.js';
import { getAuthorizedUserFromToken } from '../utils/auth.utils.js';

import { sendMessage } from '../utils/http.utils.js';

export async function photosRouter(req, res) {
  if (req.url.match(/^\/api\/photos\/[0-9]+\/like$/) && req.method === 'POST') {
    await authorize(req, res, likePhoto);
    return;
  }

  if (req.url.match(/^\/api\/photos\/[0-9]+\/tags$/) && req.method === 'PATCH') {
    addTagToPhoto(req, res);
    return;
  }

  if (req.url === '/api/photos') {
    switch (req.method) {
      case 'GET': {
        getAllPhotos(req, res);
        return;
      }
      case 'POST': {
        await authorize(req, res, uploadPhotos, false);
        return;
      }
    }
  } else {
    switch (req.method) {
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

  sendMessage(res, 404, 'Endpoint not found');
}
