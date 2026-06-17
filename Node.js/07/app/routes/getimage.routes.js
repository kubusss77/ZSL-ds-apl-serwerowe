import { getFilteredImage, getOriginalImage, getProfileImage } from '../controllers/getimage/get-image.controller.js';
import { sendMessage } from '../utils/http.utils.js';
import { authorize } from '../middleware/auth.middleware.js';

export function getImageRouter(req, res) {
  const urlParts = req.url.split('/').filter(Boolean);

  if (urlParts.length === 3 && req.method === 'GET') {
    getOriginalImage(req, res);
    return;
  }

  if (urlParts.length === 5 && urlParts[2] === 'profile' && req.method === 'GET') {
    authorize(req, res, getProfileImage);
    return;
  }

  if (urlParts.length === 5 && urlParts[3] === 'filter' && req.method === 'GET') {
    getFilteredImage(req, res);
    return;
  }

  sendMessage(res, 404, 'Endpoint not found');
}
