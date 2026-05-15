import formidable, { errors as formidableErrors } from 'formidable';
import path from 'path';
import { promises as fs } from 'fs';

const ROOT_DIR = path.resolve();
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');

fs.mkdir(UPLOADS_DIR, { recursive: true });

export async function route(req, res) {
  const { method, url } = req;

  if (url === '/') {
    const html = await fs.readFile(path.join(ROOT_DIR, 'form.html'));
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  }

  if (url === '/api/photos') {
    try {
      switch (method) {
        case 'GET': {
          // get
          break;
        }
        case 'POST': {
          const form = formidable({});
          const [fields, files] = await form.parse(req);

          const albumName = fields.album[0];

          fs.mkdir(path.join(UPLOADS_DIR, albumName), { recursive: true });

          console.log(files);

          Object.keys(files).forEach(async (file) => {
            const oldFilename = files[file][0].filepath;
            const extension = path.extname(files[file][0].originalFilename);

            await fs.rename(oldFilename, path.join(UPLOADS_DIR, albumName, Date.now() + extension));
          });

          sendJson(res, 200, {});
          return;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}
