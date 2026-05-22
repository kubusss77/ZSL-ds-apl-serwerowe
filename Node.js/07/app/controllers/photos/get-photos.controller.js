import { sendError, sendJson } from '../../utils.js';
import { photos } from '../../model.js';

export async function getAllPhotos(req, res) {
  sendJson(res, 200, photos);
}

export async function getPhotoById(req, res) {
  const id = parseInt(req.url.split('/').pop(), 10);

  if (isNaN(id)) {
    sendError(res, 400, 'Invalid photo ID');
    return;
  }

  const photo = photos.find((p) => p.id === id);

  if (!photo) {
    sendError(res, 404, 'Photo not found');
    return;
  }

  sendJson(res, 200, photo);
}
