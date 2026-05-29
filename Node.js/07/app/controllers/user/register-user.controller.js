import { getJsonBody, sendMessage, sendJson } from '../../utils/http.utils.js';
import { hashPassword, signJwt } from '../../utils/crypto.utils.js';
import { users, newUserId } from '../../model.js';
import { APP_CONFIG } from '../../constants.js';

const CONFIRM_USER_TOKEN_EXPIRATION = 60 * 60;

export async function registerUser(req, res) {
  const required = {
    name: 'string',
    lastName: 'string',
    email: 'string',
    password: 'string',
  };

  const { body, errors } = await getJsonBody(req, required);
  if (!body) {
    sendMessage(res, 400, 'Invalid JSON body');
    return;
  }

  if (errors.length > 0) {
    sendMessage(res, 400, 'Invalid values of: ' + errors.join(', '));
    return;
  }

  const existingUser = users.find((u) => u.email === body.email);

  if (existingUser) {
    if (existingUser.isConfirmed) {
      sendMessage(res, 400, 'User exists');
      return;
    } else {
      //pop user
    }
  }

  const passwordHash = await hashPassword(body.password);

  const userId = newUserId();

  users.push({
    id: userId,
    ...body,
    isConfirmed: false,
    passwordHash,
  });

  const token = await signJwt(CONFIRM_USER_TOKEN_EXPIRATION, { sub: userId, type: 'confirm-user' });

  sendJson(res, 201, {
    message: 'Use the link provided to confirm your account. Link is valid for 1 hour',
    link: APP_CONFIG.API_HOST + '/api/user/confirm/' + token,
  });
}
