import { users } from '../../model.js';
import { getJsonBody, sendJson, sendMessage } from '../../utils/http.utils.js';

export async function updateProfile(req, res) {
  const body = await getJsonBody(req);

  if (!body) {
    sendMessage(res, 400, 'Invalid JSON body');
    return;
  }

  const { name, lastName } = body;
  const user = users.find((p) => p.id === req.user.id);

  if (!user) {
    sendMessage(res, 404, 'User not found');
    return;
  }

  if (name !== undefined && typeof name !== 'string') {
    sendMessage(res, 400, 'Invalid name');
    return;
  }

  if (lastName !== undefined && typeof lastName !== 'string') {
    sendMessage(res, 400, 'Invalid lastName');
    return;
  }

  if (name) user.name = name;
  if (lastName) user.lastName = lastName;

  sendJson(res, 200, {
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    profileArray: user.profileArray,
  });
}
