import { authorize } from '../middleware/auth.middleware.js';
import { subscribeToNotifications } from '../controllers/notifications/subscribe.controller.js';
import {
  getSubscribers,
  sendNotification,
  sendNotificationToEveryone,
} from '../controllers/notifications/send-notification.controller.js';

import { sendMessage } from '../utils/http.utils.js';

export async function notificationsRouter(req, res) {
  if ((req.url.startsWith('/api/notifications?') || req.url === '/api/notifications') && req.method === 'GET') {
    subscribeToNotifications(req, res);
    return;
  }

  if (req.url.startsWith('/api/notifications/subscribe') && req.method === 'GET') {
    subscribeToNotifications(req, res);
    return;
  }

  if (req.url === '/api/notifications/send' && req.method === 'POST') {
    await authorize(req, res, sendNotification);
    return;
  }

  if (req.url === '/api/notifications/send-to-all' && req.method === 'POST') {
    await authorize(req, res, sendNotificationToEveryone);
    return;
  }

  if (req.url === '/api/notifications/subscribers' && req.method === 'GET') {
    await authorize(req, res, getSubscribers);
    return;
  }

  sendMessage(res, 404, 'Endpoint not found');
}
