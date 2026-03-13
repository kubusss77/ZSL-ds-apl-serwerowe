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
  // parametr res oznacza obiekt odpowiedzi serwera (response)
  // parametr req oznacza obiekt żądania klienta (request)

  switch (req.method) {
    case 'GET': {
      res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
      res.end(readHtml('index04.html'));
    }
    case 'POST': {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        // Wszystko co odesłane w res.end() trafia z powrotem do funkcji fetch
        res.end(`Serwer otrzymał: ${body}`);
      });
      break;
    }
  }
});

server.listen(3000, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
