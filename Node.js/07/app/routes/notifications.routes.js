import { authorize } from '../middleware/auth.middleware.js';
import { subscribeToNotifications } from '../controllers/notifications/subscribe.controller.js';

import { sendMessage } from '../utils/http.utils.js';

export function notificationsRouter(req, res) {
  if (req.url === '/api/notifications') {
    authorize(req, res, subscribeToNotifications);
    return;
  }

  sendMessage(res, 404, 'Endpoint not found');
}
