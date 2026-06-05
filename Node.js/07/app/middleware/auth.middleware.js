import { verifyJwt } from '../utils/crypto.utils.js';
import { sendMessage } from '../utils/http.utils.js';

export async function authorize(req, res, handler) {
  if (!req.headers['authorization']) {
    sendMessage(res, 401, 'Authorization required');
    return;
  }

  const token = req.headers['authorization'].split(' ')[1];

  const payload = await verifyJwt(token);
  if (!payload || typeof payload.sub !== 'string') {
    sendMessage(res, 401, 'Invalid token');
    return;
  }

  req.user = {
    id: payload.sub,
  };

  handler(req, res);
}
