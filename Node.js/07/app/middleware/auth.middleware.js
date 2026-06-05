import { verifyJwt } from '../utils/crypto.utils.js';
import { sendMessage } from '../utils/http.utils.js';

export async function authorize(req, res, handler) {
  if (!req.headers['authorization']) {
    sendMessage(res, 401, 'Authorization required');
    return;
  }

  const token = req.headers['authorization'].split(' ')[1];
  console.log('token', req.headers['authorization'], token);

  const payload = await verifyJwt(token);
  console.log('payload', payload);
  if (!payload || typeof payload.sub !== 'number') {
    sendMessage(res, 401, 'Invalid token');
    return;
  }

  req.user = {
    id: payload.sub,
  };

  handler(req, res);
}
