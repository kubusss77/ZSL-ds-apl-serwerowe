import { createServer } from 'http';
import path from 'path';
import { readFile } from 'fs';

const PORT = 3000;
const __dirname = path.resolve();

const server = createServer((req, res) => {
  if (req.url === '/') {
    const mypath = path.join(__dirname, 'static', 'third.html');
    readFile(mypath, (error, data) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
  } else if (req.url === '/style.css') {
    const mypath = path.join(__dirname, 'static', 'style.css');
    readFile(mypath, (error, data) => {
      res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' });
      res.end(data);
    });
  } else if (req.url === '/script.js') {
    const mypath = path.join(__dirname, 'static', 'style.css');
    readFile(mypath, (error, data) => {
      res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' });
      res.end(data);
    });
  }
  console.log(req.url);
});

server.listen(3000, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
