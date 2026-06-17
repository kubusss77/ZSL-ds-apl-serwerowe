import sharp from 'sharp';
import { getJsonBody, sendMessage, sendJson } from '../../utils/http.utils.js';
import {
  createFilteredPhotoPath,
  createUploadUrl,
  findPhotoById,
  getUploadPathFromUrl,
} from '../../utils/photos.utils.js';

const availableFilters = ['rotate', 'crop', 'flip', 'flop', 'grayscale', 'resize', 'tint', 'negate'];

function readNumber(body, keys, defaultValue) {
  const value = keys.map((key) => body[key]).find((item) => typeof item === 'number');
  return value ?? defaultValue;
}

function getTint(body) {
  if (body.tint && typeof body.tint === 'object') {
    return {
      r: readNumber(body.tint, ['r', 'red'], 255),
      g: readNumber(body.tint, ['g', 'green'], 0),
      b: readNumber(body.tint, ['b', 'blue'], 0),
    };
  }

  return {
    r: readNumber(body, ['r', 'red'], 255),
    g: readNumber(body, ['g', 'green'], 0),
    b: readNumber(body, ['b', 'blue'], 0),
  };
}

function validatePositiveNumber(value) {
  return typeof value === 'number' && value > 0;
}

function applyFilter(image, filterName, body) {
  switch (filterName) {
    case 'rotate':
      return image.rotate(readNumber(body, ['angle', 'degrees'], 90));
    case 'resize': {
      const width = readNumber(body, ['width']);
      const height = readNumber(body, ['height']);

      if (!validatePositiveNumber(width) || !validatePositiveNumber(height)) {
        return undefined;
      }

      return image.resize({ width, height });
    }
    case 'crop': {
      const width = readNumber(body, ['width']);
      const height = readNumber(body, ['height']);

      if (!validatePositiveNumber(width) || !validatePositiveNumber(height)) {
        return undefined;
      }

      return image.extract({
        width,
        height,
        left: readNumber(body, ['left'], 0),
        top: readNumber(body, ['top'], 0),
      });
    }
    case 'flip':
      return image.flip();
    case 'flop':
      return image.flop();
    case 'grayscale':
      return image.grayscale();
    case 'tint':
      return image.tint(getTint(body));
    case 'negate':
      return image.negate();
  }
}

export async function updateFilter(req, res) {
  const body = await getJsonBody(req);

  if (!body) {
    sendMessage(res, 400, 'Invalid JSON body');
    return;
  }

  if (typeof body.id !== 'number') {
    sendMessage(res, 400, 'Invalid photo ID');
    return;
  }

  if (!availableFilters.includes(body.lastChange)) {
    sendMessage(res, 400, 'Invalid filter');
    return;
  }

  const photo = findPhotoById(body.id);

  if (!photo) {
    sendMessage(res, 404, 'Photo not found');
    return;
  }

  const inputPath = getUploadPathFromUrl(photo.url);
  const outputPath = createFilteredPhotoPath(photo, body.lastChange);
  const image = applyFilter(sharp(inputPath), body.lastChange, body);

  if (!image) {
    sendMessage(res, 400, 'Invalid filter params');
    return;
  }

  try {
    await image.toFile(outputPath);

    photo.lastChange = body.lastChange;
    photo.history.push({
      status: body.lastChange,
      timestamp: Date.now(),
      url: createUploadUrl(outputPath),
    });

    sendJson(res, 200, photo);
  } catch (error) {
    console.error(error);
    sendMessage(res, 500, 'Cannot apply filter');
  }
}
