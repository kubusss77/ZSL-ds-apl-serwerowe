import { sendError, sendJson } from '../../utils.js';
import { getJsonBody } from '../../utils.js';
import { newTagId, tags } from '../../model.js';

export async function addTag(req, res) {
  const body = await getJsonBody(req);
  if (!body) {
    sendError(res, 400, 'Invalid JSON body');
    return;
  }

  if (typeof body.name !== 'string') {
    sendError(res, 400, 'Invalid name');
    return;
  }

  if (typeof body.popularity !== 'number') {
    sendError(res, 400, 'Invalid popularity');
    return;
  }

  if (!body.name.startsWith('#')) body.name = '#' + body.name;

  if (tags.findIndex((t) => t.name === body.name) !== -1) {
    sendError(res, 400, 'Tag already exists');
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
