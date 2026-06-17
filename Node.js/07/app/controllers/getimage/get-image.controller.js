import { promises as fs } from 'fs';
import path from 'path';
import { APP_CONFIG } from '../../constants.js';
import { sendMessage } from '../../utils/http.utils.js';
import {
  findPhotoById,
  findPhotoByIdOrHistoryTimestamp,
  getImageContentType,
  getPhotoIdFromUrl,
  getUploadPathFromUrl,
} from '../../utils/photos.utils.js';

function sendImage(res, filePath, data) {
  res.writeHead(200, {
    'Content-Type': getImageContentType(filePath),
    'Content-Disposition': `inline; filename="${path.basename(filePath)}"`,
  });
  res.end(data);
}

function decodeUrlPart(value) {
  try {
    return decodeURIComponent(value || '');
  } catch (error) {
    return undefined;
  }
}

export async function getOriginalImage(req, res) {
  const id = getPhotoIdFromUrl(req);

  if (isNaN(id)) {
    sendMessage(res, 400, 'Invalid photo ID');
    return;
  }

  const photo = findPhotoById(id);

  if (!photo) {
    sendMessage(res, 404, 'Photo not found');
    return;
  }

  const filePath = getUploadPathFromUrl(photo.url);

  try {
    const data = await fs.readFile(filePath);
    sendImage(res, filePath, data);
  } catch (error) {
    console.error(error);
    sendMessage(res, 404, 'Image file not found');
  }
}

export async function getFilteredImage(req, res) {
  const urlParts = req.url.split('/').filter(Boolean);
  const id = parseInt(urlParts[2], 10);
  const filterName = urlParts[4];

  if (isNaN(id)) {
    sendMessage(res, 400, 'Invalid photo ID');
    return;
  }

  if (!filterName) {
    sendMessage(res, 400, 'Invalid filter');
    return;
  }

  const photo = findPhotoByIdOrHistoryTimestamp(id, filterName);

  if (!photo) {
    sendMessage(res, 404, 'Photo not found');
    return;
  }

  const historyEntry = [...photo.history]
    .reverse()
    .find((entry) => entry.status === filterName && (photo.id === id || entry.timestamp === id));

  if (!historyEntry?.url) {
    sendMessage(res, 404, 'Filtered image not found');
    return;
  }

  const filePath = getUploadPathFromUrl(historyEntry.url);

  try {
    const data = await fs.readFile(filePath);
    sendImage(res, filePath, data);
  } catch (error) {
    console.error(error);
    sendMessage(res, 404, 'Image file not found');
  }
}

export async function getProfileImage(req, res) {
  const urlParts = req.url.split('/').filter(Boolean);
  const email = decodeUrlPart(urlParts[3]);
  const photoName = decodeUrlPart(urlParts[4]);

  if (!email || email.includes('/') || email.includes('\\')) {
    sendMessage(res, 400, 'Invalid email');
    return;
  }

  if (!photoName || photoName.includes('/') || photoName.includes('\\') || photoName !== path.basename(photoName)) {
    sendMessage(res, 400, 'Invalid photo name');
    return;
  }

  const filePath = path.join(APP_CONFIG.UPLOADS_DIR, email, 'profile', photoName);

  try {
    const data = await fs.readFile(filePath);
    sendImage(res, filePath, data);
  } catch (error) {
    console.error(error);
    sendMessage(res, 404, 'Image file not found');
  }
}
