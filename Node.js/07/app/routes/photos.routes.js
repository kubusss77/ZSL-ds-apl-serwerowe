import { getAllPhotos, getPhotoById } from '../controllers/photos/get-photos.controller.js';
import { uploadPhotos } from '../controllers/photos/upload-photos.controller.js';

import { deletePhotoById } from '../controllers/photos/delete-photo.controller.js';
import { updatePhotoById } from '../controllers/photos/update-photo.controller.js';

export function photosRouter(req, res) {
  if (req.url === '/api/photos') {
    switch (req.method) {
      case 'GET': {
        getAllPhotos(req, res);
        return;
      }
      case 'POST': {
        uploadPhotos(req, res);
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
}
