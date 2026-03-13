import { createServer } from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3000;
const rootPath = path.resolve();

function readHtml(fileName) {
  const absPath = path.join(rootPath, 'static', fileName);
  const htmlFile = fs.readFileSync(absPath);
  return htmlFile;
}

const server = createServer((req, res) => {
  switch (req.method) {
    case 'GET': {
      console.log('get');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      const file = readHtml('index05.html');
      res.end(file);
      break;
    }
    case 'POST': {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      console.log('post');
      req.on('end', () => {
        // Uwaga: dane z formularza nie przychodzą jako JSON, tylko w formacie: username=Jan&innepole=wartosc
        console.log(`Odebrano dane: ${body}`);

        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`Serwer odebrał dane z formularza: ${body}`);
      });
    }
  }
});

server.listen(3000, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
