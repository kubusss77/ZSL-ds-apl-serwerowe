import { users } from '../../model.js';
import { getJsonBody, sendJson, sendMessage } from '../../utils/http.utils.js';
import {
  getNotificationClients,
  sendNotificationToAll,
  sendNotificationToUser,
} from './subscribe.controller.js';

function findRecipient(body) {
  if (typeof body.toUserId === 'number') {
    return users.find((user) => user.id === body.toUserId);
  }

  if (typeof body.to === 'number') {
    return users.find((user) => user.id === body.to);
  }

  if (typeof body.to === 'string') {
    return users.find((user) => user.email === body.to);
  }

  if (typeof body.toEmail === 'string') {
    return users.find((user) => user.email === body.toEmail);
  }

  return undefined;
}

export async function sendNotification(req, res) {
  const body = await getJsonBody(req);

  if (!body) {
    sendMessage(res, 400, 'Invalid JSON body');
    return;
  }

  const recipient = findRecipient(body);

  if (!recipient) {
    sendMessage(res, 404, 'Recipient not found');
    return;
  }

  const message = body.msg || body.message;

  if (typeof message !== 'string') {
    sendMessage(res, 400, 'Invalid message');
    return;
  }

  const delivered = sendNotificationToUser(recipient.id, {
    type: 'message',
    from: req.user.email,
    to: recipient.email,
    message,
    timestamp: Date.now(),
  });

  sendJson(res, 200, {
    message: 'Notification sent',
    delivered,
  });
}

export async function sendNotificationToEveryone(req, res) {
  const body = await getJsonBody(req);

  if (!body) {
    sendMessage(res, 400, 'Invalid JSON body');
    return;
  }

  const message = body.msg || body.message;

  if (typeof message !== 'string') {
    sendMessage(res, 400, 'Invalid message');
    return;
  }

  const delivered = sendNotificationToAll({
    type: 'broadcast',
    from: req.user.email,
    message,
    timestamp: Date.now(),
  });

  sendJson(res, 200, {
    message: 'Notification sent to all',
    delivered,
  });
}

export function getSubscribers(req, res) {
  sendJson(res, 200, getNotificationClients());
}
