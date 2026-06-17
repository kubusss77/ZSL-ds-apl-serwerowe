import { getJsonBody } from '../../utils/http.utils.js';
import { sendMessage, sendJson } from '../../utils/http.utils.js';
import { photos } from '../../model.js';

export async function addTagToPhoto(req, res) {
  const body = await getJsonBody(req);
  console.log(req.url.split('/')[3]);
  const photoId = parseInt(req.url.split('/')[3]);
  const { tag } = body;

  if (isNaN(photoId)) {
    sendMessage(res, 400, 'Invalid photo ID');
    return;
  }

  if (!tag) {
    sendMessage(res, 400, 'Tag is required');
    return;
  }

  const photo = photos.find((p) => p.id === photoId);

  if (!photo) {
    sendMessage(res, 404, 'Photo not found');
    return;
  }

  if (photo.tags.includes(tag)) {
    sendMessage(res, 400, 'Tag already exists for this photo');
    return;
  }

  photo.tags.push(tag);
  sendJson(res, 200, photo);
}
