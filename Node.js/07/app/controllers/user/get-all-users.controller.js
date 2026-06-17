import { sendJson } from '../../utils/http.utils.js';
import { users } from '../../model.js';

export async function getAllUsers(req, res) {
  sendJson(res, 200, users);
}
