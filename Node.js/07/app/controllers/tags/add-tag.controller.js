import { getJsonBody, sendMessage, sendJson } from '../../utils/http.utils.js';
import { newTagId, tags } from '../../model.js';

export async function addTag(req, res) {
  const body = await getJsonBody(req);
  if (!body) {
    sendMessage(res, 400, 'Invalid JSON body');
    return;
  }

  if (typeof body.name !== 'string') {
    sendMessage(res, 400, 'Invalid name');
    return;
  }

  if (typeof body.popularity !== 'number') {
    sendMessage(res, 400, 'Invalid popularity');
    return;
  }

  if (!body.name.startsWith('#')) body.name = '#' + body.name;

  if (tags.findIndex((t) => t.name === body.name) !== -1) {
    sendMessage(res, 400, 'Tag already exists');
    return;
  }

  const newTag = {
    id: newTagId(),
    name: body.name,
    popularity: body.popularity,
  };

  tags.push(newTag);

  sendJson(res, 201, { message: 'New tag created succesfully', newTag });
}
