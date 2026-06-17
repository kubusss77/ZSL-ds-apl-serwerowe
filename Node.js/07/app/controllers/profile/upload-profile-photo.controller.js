import formidable from 'formidable';
import path from 'path';
import { promises as fs } from 'fs';
import { APP_CONFIG } from '../../constants.js';
import { users } from '../../model.js';
import { sendJson, sendMessage } from '../../utils/http.utils.js';
import {
  cropSquareImage,
  overlayCircle,
  overlayText,
  overlayGradient,
  overlayPattern,
  overlayCircleBorder,
} from '../../utils/images/profile-photo.util.js';

function createProfileHttp(email, filePath) {
  const photo = path.basename(filePath);

  return `${APP_CONFIG.API_HOST}/api/getimage/profile/${encodeURIComponent(email)}/${encodeURIComponent(photo)}`;
}

export async function uploadProfilePhoto(req, res) {
  const form = formidable();

  const [fields, uploadedFiles] = await form.parse(req);
  const files = uploadedFiles.files || uploadedFiles.file;

  if (!files || files.length !== 1) {
    sendMessage(res, 400, 'One photo is required');
    return;
  }

  const photo = files[0];
  const user = users.find((item) => item.id === req.user.id);

  if (!user) {
    sendMessage(res, 404, 'User not found');
    return;
  }

  const profileDir = path.join(APP_CONFIG.UPLOADS_DIR, user.email, 'profile');
  await fs.mkdir(profileDir, { recursive: true });

  const ext = path.extname(photo.originalFilename || '').toLowerCase() || '.jpg';
  const inputPath = path.join(profileDir, `original${ext}`);
  const squarePath = path.join(profileDir, 'square.png');
  const circlePath = path.join(profileDir, 'circle.png');
  const textPath = path.join(profileDir, 'text.png');
  const gradientPath = path.join(profileDir, 'gradient.png');
  const patternPath = path.join(profileDir, 'pattern.png');
  const borderPath = path.join(profileDir, 'border.png');

  await fs.rename(photo.filepath, inputPath);

  await cropSquareImage(inputPath, squarePath);
  await overlayCircle(inputPath, circlePath);
  await overlayText(inputPath, textPath, 'OK');
  await overlayGradient(inputPath, gradientPath);
  await overlayPattern(inputPath, patternPath);
  await overlayCircleBorder(inputPath, borderPath);

  user.profileArray = [
    {
      status: 'original',
      http: createProfileHttp(user.email, inputPath),
    },
    {
      status: 'square',
      http: createProfileHttp(user.email, squarePath),
    },
    {
      status: 'circle',
      http: createProfileHttp(user.email, circlePath),
    },
    {
      status: 'text',
      http: createProfileHttp(user.email, textPath),
    },
    {
      status: 'gradient',
      http: createProfileHttp(user.email, gradientPath),
    },
    {
      status: 'pattern',
      http: createProfileHttp(user.email, patternPath),
    },
    {
      status: 'border',
      http: createProfileHttp(user.email, borderPath),
    },
  ];

  sendJson(res, 201, {
    message: 'Profile photo uploaded successfully',
    profileArray: user.profileArray,
  });
}
