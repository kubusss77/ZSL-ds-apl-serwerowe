import { sendMessage } from '../utils/http.utils.js';
import { getAuthorizedUserFromToken } from '../utils/auth.utils.js';

export async function authorize(req, res, handler, requireAuth = true) {
  const authorization = req.headers['authorization'];

  if (!authorization) {
    if (requireAuth) {
      sendMessage(res, 401, 'Authorization required');
      return;
    } else {
      await handler(req, res);
      return;
    }
  }

  const [type, token] = authorization.split(' ');

  if (type !== 'Bearer' || !token) {
    sendMessage(res, 401, 'Invalid token');
    return;
  }

  const user = await getAuthorizedUserFromToken(token);

  if (!user) {
    sendMessage(res, 401, 'Invalid token');
    return;
  }

  req.user = {
    id: user.id,
    email: user.email,
  };

  await handler(req, res);
}
