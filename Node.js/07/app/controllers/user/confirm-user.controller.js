import { verifyJwt } from '../../utils/crypto.utils.js';
import { sendMessage, sendJson } from '../../utils/http.utils.js';
import { users } from '../../model.js';

export async function confirmUser(req, res) {
  const token = req.url.split('/')[4];

  let payload;
  try {
    payload = await verifyJwt(token);
  } catch (error) {
    sendMessage(res, 400, 'Invalid or expired token');
    return;
  }

  if (payload.type !== 'confirm-user' || typeof payload.sub !== 'number') {
    sendMessage(res, 400, 'Invalid payload');
    return;
  }

  const user = users.find((u) => u.id === payload.sub);

  if (!user) {
    sendMessage(res, 400, 'User not found');
    return;
  }

  user.isConfirmed = true;

  sendMessage(res, 200, 'User account confirmed successfully');
}
