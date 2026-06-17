import { sendMessage, sendJson } from '../../utils/http.utils.js';
import { tags, rawTags } from '../../model.js';

export function getTagsStats(req, res) {
  const sortedTags = [...tags].sort((a, b) => b.popularity - a.popularity);
  const stats = {
    totalStats: tags.length,
    averagePopularity: Math.floor(tags.reduce((i, j) => i + j.popularity, 0) / tags.length) || 0,
    mostPopular: sortedTags[0] || null,
    leastPopular: sortedTags[sortedTags.length - 1] || null,
  };

  sendJson(res, 200, stats);
}
