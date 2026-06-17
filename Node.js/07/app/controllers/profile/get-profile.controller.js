import { users } from '../../model.js';
import { sendJson, sendMessage } from '../../utils/http.utils.js';

export function getProfile(req, res) {
  const user = users.find((p) => p.id === req.user.id);

  if (!user) {
    sendMessage(res, 404, 'User not found');
    return;
  }

  sendJson(res, 200, {
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    profileArray: user.profileArray,
  });
}
