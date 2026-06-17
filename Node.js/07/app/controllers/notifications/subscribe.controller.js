import { notificationClients } from '../../model.js';
import { APP_CONFIG } from '../../constants.js';
import { sendMessage } from '../../utils/http.utils.js';
import { getAuthorizedUserFromToken } from '../../utils/auth.utils.js';

function writeEvent(res, payload) {
  if (res.writable) {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  }
}

export function sendNotificationToUser(userId, payload) {
  const clients = notificationClients.filter((client) => client.userId === userId);

  clients.forEach((client) => writeEvent(client.res, payload));

  return clients.length;
}

export function sendNotificationToAll(payload) {
  notificationClients.forEach((client) => writeEvent(client.res, payload));

  return notificationClients.length;
}

export function getNotificationClients() {
  return notificationClients.map((client) => ({
    clientId: client.clientId,
    userId: client.userId,
    userEmail: client.userEmail,
  }));
}

async function getUserFromRequest(req) {
  const url = new URL(req.url, APP_CONFIG.API_HOST);
  const token = url.searchParams.get('token');

  if (token) {
    return getAuthorizedUserFromToken(token);
  }

  const authorization = req.headers['authorization'];

  if (!authorization) {
    return undefined;
  }

  const [type, headerToken] = authorization.split(' ');

  if (type !== 'Bearer') {
    return undefined;
  }

  return getAuthorizedUserFromToken(headerToken);
}

export async function subscribeToNotifications(req, res) {
  const user = await getUserFromRequest(req);

  if (!user) {
    sendMessage(res, 401, 'Invalid token');
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  res.write(':' + ' '.repeat(1024) + '\n\n');

  const client = {
    clientId: `ID-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    userId: user.id,
    userEmail: user.email,
    res,
  };

  notificationClients.push(client);
  writeEvent(res, {
    type: 'connected',
    clientId: client.clientId,
    userId: client.userId,
    userEmail: client.userEmail,
  });

  req.on('close', () => {
    const clientIndex = notificationClients.indexOf(client);
    if (clientIndex !== -1) {
      notificationClients.splice(clientIndex, 1);
    }
  });
}
