import { getJsonBody, sendMessage, sendJson } from '../../utils/http.utils.js';
import { users } from '../../model.js';
import { comparePassword, signJwt } from '../../utils/crypto.utils.js';
import { APP_CONFIG } from '../../constants.js';

const AUTH_TOKEN_EXPIRY = 60 * 60 * 24;

export async function loginUser(req, res) {
  const required = {
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

  const user = users.find((u) => u.email === body.email);

  if (!user) {
    await comparePassword('1', '$2b$12$pTHzYhsiVhiUfmsAxZpdAu68AlSgMS4Mo2VX1L.e25jtF6a3Co9P2');
    sendMessage(res, 400, 'Invalid email or password');
    return;
  }

  const isPasswordValid = await comparePassword(body.password, user.passwordHash);
  if (!isPasswordValid) {
    sendMessage(res, 400, 'Invalid email or password');
    return;
  }

  if (!user.isConfirmed) {
    sendMessage(res, 400, 'User account not confirmed. Try to register again');
    return;
  }

  const token = await signJwt(AUTH_TOKEN_EXPIRY, {
    sub: user.id,
  });

  res.setHeader('Authorization', 'Bearer ' + token);
  sendJson(res, 200, {
    message: 'Login successfull',
    token,
    notificationsLink: `${APP_CONFIG.API_HOST}/api/notifications?token=${token}`,
  });
}
