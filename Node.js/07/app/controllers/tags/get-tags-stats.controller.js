import { sendError, sendJson } from '../../utils.js';
import { tags, rawTags } from '../../model.js';

export function getTagsStats(req, res) {
  const stats = {
    totalStats: tags.length,
    averagePopularity: tags.reduce((i, j) => i + j),
  };

  sendJson(res, 200, stats);
}
