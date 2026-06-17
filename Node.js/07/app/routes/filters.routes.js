import { getMetadata } from '../controllers/filters/get-metadata.controller.js';
import { updateFilter } from '../controllers/filters/update-filter.controller.js';
import { sendMessage } from '../utils/http.utils.js';

export function filtersRouter(req, res) {
  if (req.url.startsWith('/api/filters/metadata')) {
    if (req.method === 'GET') {
      getMetadata(req, res);
      return;
    }
  }

  if (req.url === '/api/filters') {
    if (req.method === 'PATCH') {
      updateFilter(req, res);
      return;
    }
  }

  sendMessage(res, 404, 'Endpoint not found');
}
