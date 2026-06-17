import { sendMessage, sendJson } from '../../utils/http.utils.js';
import { tags, rawTags } from '../../model.js';

export function getAllTags(req, res) {
  sendJson(res, 200, tags);
}

export function getAllTagsRaw(req, res) {
  sendJson(res, 200, rawTags());
}

export function getTagById(req, res) {
  const tagId = parseInt(req.url.split('/').pop(), 10);
  const tag = tags.find((t) => t.id === tagId);

  if (!tag) {
    sendMessage(res, 404, 'Tag not found');
    return;
  }

  sendJson(res, 200, tag);
}