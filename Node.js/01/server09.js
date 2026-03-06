import { createServer } from 'http';
import 'colors';
import path from 'path';
import { readFile } from 'fs';

const PORT = 3000;

const files = {
  '/wąż': 'wąż.jpg',
  '/mąż': 'mąż.jpg',
  '/książ': 'książ.jfif',
};

const __dirname = path.resolve();

const server = createServer((req, res) => {
  const url = decodeURI(req.url.toLowerCase());
  const targetFile = files[url];

  if (url === '/favicon.ico') {
    res.writeHead(204);
    return res.end();
  }

  if (url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  }

  if (targetFile) {
    const fullPath = path.join(__dirname, 'static', targetFile);
    readFile(fullPath, (error, data) => {
      if (error) {
        console.log(`Błąd: ${targetFile}`.red);
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Błąd 404 - brak zdjęcia!</h1>');
      } else {
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.end(data); // Wysyłamy surowe dane binarne obrazu
      }
    });
  }

  console.log('request');
});

server.listen(3000, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
