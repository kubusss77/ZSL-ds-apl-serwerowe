import { decodeJwt } from '../../utils/crypto.utils.js';
import { tokensBlacklist } from '../../model.js';
import { sendMessage } from '../../utils/http.utils.js';

export async function logoutUser(req, res) {
  const token = req.headers['authorization'].split(' ')[1];
  const payload = await decodeJwt(token);

  if (!payload) {
    sendMessage(res, 401, 'Invalid token');
    return;
  }

  tokensBlacklist.push({ token: token, exp: payload.exp });

  sendMessage(res, 200, 'Logout successfull');
}
