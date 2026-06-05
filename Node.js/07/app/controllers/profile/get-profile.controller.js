import { users } from '../../model.js';
import { sendJson } from '../../utils/http.utils.js';

export function getProfile(req, res) {
  const user = users.find((p) => p.id === req.user.id);
  sendJson(res, 200, {
    name: user.name,
    lastName: user.lastName,
  });
}
