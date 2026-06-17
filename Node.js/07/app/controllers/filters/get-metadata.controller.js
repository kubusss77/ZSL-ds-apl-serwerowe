import sharp from 'sharp';
import { sendMessage, sendJson } from '../../utils/http.utils.js';
import { findPhotoById, getUploadPathFromUrl } from '../../utils/photos.utils.js';

export async function getMetadata(req, res) {
  const id = parseInt(req.url.split('/').pop(), 10);

  if (isNaN(id)) {
    sendMessage(res, 400, 'Invalid photo ID');
    return;
  }

  const photo = findPhotoById(id);

  if (!photo) {
    sendMessage(res, 404, 'Photo not found');
    return;
  }

  try {
    const metadata = await sharp(getUploadPathFromUrl(photo.url)).metadata();
    sendJson(res, 200, metadata);
  } catch (error) {
    console.error(error);
    sendMessage(res, 500, 'Cannot read photo metadata');
  }
}
