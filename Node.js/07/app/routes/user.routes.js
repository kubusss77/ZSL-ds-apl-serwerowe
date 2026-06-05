import { registerUser } from '../controllers/user/register-user.controller.js';
import { confirmUser } from '../controllers/user/confirm-user.controller.js';
import { loginUser } from '../controllers/user/login-user.controller.js';
import { logoutUser } from '../controllers/user/logout-user.controller.js';
import { getBlacklist } from '../controllers/user/get-blacklist.controller.js';

import { sendMessage } from '../utils/http.utils.js';

export function userRouter(req, res) {
  console.log('user');
  if (req.url === '/api/user/register' && req.method === 'POST') {
    registerUser(req, res);
    return;
  }

  if (req.url.startsWith('/api/user/confirm') && req.method === 'GET') {
    console.log('confirm');
    confirmUser(req, res);
    return;
  }

  if (req.url === '/api/user/login' && req.method === 'POST') {
    loginUser(req, res);
    return;
  }

  if (req.url === '/api/user/logout' && req.method === 'POST') {
    logoutUser(req, res);
    return;
  }

  if (req.url === '/api/user/blacklist' && req.method === 'GET') {
    getBlacklist(req, res);
    return;
  }

  sendMessage(res, 404, 'Endpoint not found');
}
