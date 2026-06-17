import { addTag } from '../controllers/tags/add-tag.controller.js';
import { getAllTags, getAllTagsRaw, getTagById } from '../controllers/tags/get-tags.controller.js';
import { getTagsStats } from '../controllers/tags/get-tags-stats.controller.js';

import { sendMessage } from '../utils/http.utils.js';

export function tagsRouter(req, res) {
  if (req.url === '/api/tags') {
    switch (req.method) {
      case 'GET': {
        getAllTags(req, res);
        return;
      }
      case 'POST': {
        addTag(req, res);
        return;
      }
    }
  }

  if (req.url === '/api/tags/raw') {
    switch (req.method) {
      case 'GET': {
        getAllTagsRaw(req, res);
        return;
      }
    }
  }

  if (req.url === '/api/tags/stats') {
    switch (req.method) {
      case 'GET': {
        getTagsStats(req, res);
        return;
      }
    }
  }

  if (req.url.startsWith('/api/tags/')) {
    switch (req.method) {
      case 'GET': {
        getTagById(req, res);
        return;
      }
    }
  }

  sendMessage(res, 404, 'Endpoint not found');
}
