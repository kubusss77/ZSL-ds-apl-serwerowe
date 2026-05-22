import formidable from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import { APP_CONFIG } from '../../constants.js';
import { sendError, sendJson } from '../../utils.js';
import { photos } from '../../model.js';

export async function uploadPhotos(req, res) {
  const form = formidable();
  const [fields, { files }] = await form.parse(req);

  const albumName = fields.album[0];

  if (!albumName) {
    sendError(res, 400, 'Album name is required');
    return;
  }

  if (!files || files.length < 1) {
    sendError(res, 400, 'At least one file is required');
    return;
  }

  await fs.mkdir(path.join(APP_CONFIG.UPLOADS_DIR, albumName), { recursive: true });

  files.forEach(async (file, index) => {
    const id = Date.now() + index;
    const fileName = `${id}${path.extname(file.originalFilename)}`;

    await fs.rename(file.filepath, path.join(APP_CONFIG.UPLOADS_DIR, albumName, fileName));

    photos.push({
      id,
      album: albumName,
      originalName: file.originalFilename,
      url: `/uploads/${albumName}/${fileName}`,
      lastChange: 'original',
      history: [
        {
          status: 'original',
          timestamp: Date.now(),
        },
      ],
    });
  });

  console.log(`Uploaded ${files.length} files to album "${albumName}"`);

  sendJson(res, 201, {});
  return;
}
