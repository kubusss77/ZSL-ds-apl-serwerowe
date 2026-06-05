import formidable from 'formidable';
import { sendMessage } from '../../utils/http.utils.js';
import {
  cropSquareImage,
  overlayCircle,
  overlayText,
  overlayGradient,
  overlayPattern,
  overlayCircleBorder,
} from '../../utils/images/profile-photo.util.js';
import { promises as fs } from 'fs';

export async function uploadProfilePhoto(req, res) {
  const form = formidable();

  const [fields, { files }] = await form.parse(req);

  if (!files || files.length !== 1) {
    sendMessage(res, 400, 'One photo is required');
    return;
  }

  const photo = files[0];
}
