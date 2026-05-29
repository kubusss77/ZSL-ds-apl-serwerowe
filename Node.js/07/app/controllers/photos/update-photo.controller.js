import { sendMessage, sendJson, getJsonBody } from '../../utils/http.utils.js';
import { photos } from '../../model.js';

export async function updatePhotoById(req, res) {
  const id = parseInt(req.url.split('/').pop(), 10);

  if (isNaN(id)) {
    sendMessage(res, 400, 'Invalid photo ID');
    return;
  }

  const body = await getJsonBody(req);
  if (!body) {
    sendMessage(res, 400, 'Invalid JSON body');
    return;
  }

  if (typeof body.status !== 'string') {
    sendMessage(res, 400, 'Invalid status');
    return;
  }

  const photoIndex = photos.findIndex((p) => p.id === id);

  if (photoIndex === -1) {
    sendMessage(res, 404, 'Photo not found');
    return;
  }

  const photo = photos[photoIndex];

  photo.history.push({
    status: body.status,
    timestampt: Date.now(),
  });

  photo.lastChange = body.status;

  sendJson(res, 200, photo);
}
