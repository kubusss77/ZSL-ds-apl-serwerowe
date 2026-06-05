import { notificationClients } from '../../model.js';

export async function subscribeToNotifications(req, res) {
  const client = {
    userId: req.user.id,
    res,
  };

  notificationClients.push(client);

  req.on('close', () => {
    const clientIndex = notificationClients.indexOf(client);
    notificationClients.splice(clientIndex, 1);
  });
}
