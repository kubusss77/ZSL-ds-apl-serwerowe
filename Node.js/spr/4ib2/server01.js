import { createServer } from 'http';
import fs from 'fs';
const PORT = 3000;

const server = createServer((req, res) => {
  if (req.url === '/index01') {
    const file = fs.readFileSync('static/index01.html');
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
    res.end(file);
  } else if (req.url.startsWith('/wybor')) {
    const url = new URL('http://localhost' + req.url);
    const postac = url.searchParams.get('postac');
    const lvl = url.searchParams.get('lvl');
    console.log(postac, lvl);
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
    res.end(`<h1>Postać: ${postac}</h1><h2>Poziom: ${lvl}</h2><img src="${postac}.jpg">`);
  } else if (req.url.endsWith('.jpg')) {
    const imageName = decodeURI(req.url.slice(1));
    console.log(imageName);
    const image = fs.readFileSync('static/' + imageName);
    res.writeHead(200, { 'Content-Type': 'image/jpg' });
    res.end(image);
  }
});

server.listen(3000, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
