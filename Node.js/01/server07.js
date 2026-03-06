import { createServer } from 'http';
import tracer from 'tracer';
const logger = tracer.colorConsole();

const PORT = 3000;
const server = createServer((req, res) => {
  const url = decodeURI(req.url.toLowerCase());
  switch (url) {
    case '/zieleń':
      logger.info('Użytkownik wszedł w zieleń');
      res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
      res.end('<h1>Status: <span style="color: green">INFO</span></h1>');
      break;
    case '/czerwień':
      logger.error('Użytkownik wszedł w czerwień');
      res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
      res.end('<h1>Status: <span style="color: red">ERROR</span></h1>');
      break;
    case '/dane': {
      res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
      res.end(JSON.stringify(req.headers['user-agent'], null, 5));
    }
    default:
      logger.log('Nieznana ścieżka: ' + url);
    // zwróć instrukcję dla użytkownika
  }
});

server.listen(3000, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
