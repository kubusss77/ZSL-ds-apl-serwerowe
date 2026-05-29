import { sendJson } from '../../utils/http.utils.js';
import { tokensBlacklist } from '../../model.js';

export function getBlacklist(req, res) {
  sendJson(res, 200, tokensBlacklist);
}
