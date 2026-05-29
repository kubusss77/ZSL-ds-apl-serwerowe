import { promises as fs } from 'fs';
import path from 'path';
import { APP_CONFIG } from '../../constants.js';
import { sendMessage, sendJson } from '../../utils/http.utils.js';
import { photos } from '../../model.js';

export async function deletePhotoById(req, res) {
  const id = parseInt(req.url.split('/').pop(), 10);

  if (isNaN(id)) {
    sendMessage(res, 400, 'Invalid photo ID');
    return;
  }

  const photoIndex = photos.findIndex((p) => p.id === id);

  if (photoIndex === -1) {
    sendMessage(res, 404, 'Photo not found');
    return;
  }

  const [deletedPhoto] = photos.splice(photoIndex, 1);

  await fs.unlink(path.join(APP_CONFIG.UPLOADS_DIR, deletedPhoto.album, path.basename(deletedPhoto.url)));

  console.log(`Deleted photo with ID ${id}`);

  sendJson(res, 200, {
    message: 'Photo deleted successfully',
  });
}
