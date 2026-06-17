import { authorize } from '../middleware/auth.middleware.js';
import { getProfile } from '../controllers/profile/get-profile.controller.js';
import { updateProfile } from '../controllers/profile/update-profile.controller.js';
import { uploadProfilePhoto } from '../controllers/profile/upload-profile-photo.controller.js';
import { logoutUser } from '../controllers/user/logout-user.controller.js';

import { sendMessage } from '../utils/http.utils.js';

export function profileRouter(req, res) {
  if (req.url === '/api/profile/logout' && req.method === 'POST') {
    authorize(req, res, logoutUser);
    return;
  }

  if (req.url === '/api/profile') {
    switch (req.method) {
      case 'GET': {
        authorize(req, res, getProfile);
        return;
      }
      case 'PATCH': {
        authorize(req, res, updateProfile);
        return;
      }
      case 'POST': {
        authorize(req, res, uploadProfilePhoto);
        return;
      }
    }
  }

  sendMessage(res, 404, 'Endpoint not found');
}
