import { authorize } from '../middleware/auth.middleware.js';

import { registerUser } from '../controllers/user/register-user.controller.js';
import { confirmUser } from '../controllers/user/confirm-user.controller.js';
import { loginUser } from '../controllers/user/login-user.controller.js';
import { getAllUsers } from '../controllers/user/get-all-users.controller.js';
import { logoutUser } from '../controllers/user/logout-user.controller.js';
import { getBlacklist } from '../controllers/user/get-blacklist.controller.js';

import { sendMessage } from '../utils/http.utils.js';

export function userRouter(req, res) {
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

  if (req.url === '/api/user/auth' && req.method === 'POST') {
    console.log('auth');
    authorize(req, res, () => {
      sendMessage(res, 200, 'Authenticated');
    });
    return;
  }

  if (req.url === '/api/user' && req.method === 'GET') {
    getAllUsers(req, res);
    return;
  }

  if (req.url === '/api/user/logout' && req.method === 'POST') {
    authorize(req, res, logoutUser);
    return;
  }

  if (req.url === '/api/user/blacklist' && req.method === 'GET') {
    getBlacklist(req, res);
    return;
  }

  sendMessage(res, 404, 'Endpoint not found');
}
