import { authorize } from '../middleware/auth.middleware.js';
import { getProfile } from '../controllers/profile/get-profile.controller.js';
import { updateProfile } from '../controllers/profile/update-profile.controller.js';

import { sendMessage } from '../utils/http.utils.js';

export function profileRouter(req, res) {
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
    }
  }

  sendMessage(res, 404, 'Endpoint not found');
}
