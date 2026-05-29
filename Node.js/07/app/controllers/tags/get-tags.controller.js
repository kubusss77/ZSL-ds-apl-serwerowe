import { sendMessage, sendJson } from '../../utils/http.utils.js';
import { tags, rawTags } from '../../model.js';

export function getAllTags(req, res) {
  sendJson(res, 200, tags);
}

export function getAllTagsRaw(req, res) {
  sendJson(res, 200, rawTags());
}
