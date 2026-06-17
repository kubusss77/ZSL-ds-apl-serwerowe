import path from 'path';
import { APP_CONFIG } from '../constants.js';
import { photos } from '../model.js';

export function getPhotoIdFromUrl(req) {
  return parseInt(req.url.split('/').filter(Boolean).at(2), 10);
}

export function findPhotoById(id) {
  return photos.find((photo) => photo.id === id);
}

export function findPhotoByIdOrHistoryTimestamp(id, filterName) {
  return photos.find((photo) => {
    if (photo.id === id) return true;

    return photo.history.some((entry) => entry.timestamp === id && (!filterName || entry.status === filterName));
  });
}

export function getUploadPathFromUrl(url) {
  return path.join(APP_CONFIG.ROOT_DIR, url.replace(/^\/+/, ''));
}

export function createFilteredPhotoPath(photo, filterName) {
  const sourcePath = getUploadPathFromUrl(photo.url);
  const parsedPath = path.parse(sourcePath);

  return path.join(parsedPath.dir, `${parsedPath.name}-${filterName}${parsedPath.ext}`);
}

export function createUploadUrl(filePath) {
  return '/' + path.relative(APP_CONFIG.ROOT_DIR, filePath).split(path.sep).join('/');
}

export function getImageContentType(filePath) {
  switch (path.extname(filePath).toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    case '.avif':
      return 'image/avif';
    default:
      return 'application/octet-stream';
  }
}
