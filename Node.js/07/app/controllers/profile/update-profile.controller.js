import { users } from '../../model.js';
import { sendJson } from '../../utils/http.utils.js';

export function updateProfile(req, res) {
  const { name, lastName } = req.body;
  const user = users.find((p) => p.id === req.user.id);

  if (name) user.name = name;
  if (lastName) user.lastName = lastName;

  sendJson(res, 200, user);
}
