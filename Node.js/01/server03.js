import { createServer } from 'http';
const PORT = 3000;
const server = createServer((req, res) => {
  console.log(req.url);
  switch (req.url) {
    case '/headers': {
      res.writeHead(200, { 'content-type': 'application/json;charset=utf-8' });
      res.end(JSON.stringify(req.headers, null, 5));
      break;
    }
    case '/rawheaders': {
      res.writeHead(200, { 'content-type': 'application/json;charset=utf-8' });
      res.end(JSON.stringify(req.rawHeaders, null, 5));
      break;
    }
    default: {
      res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });

      res.end(
        '<h1>Cwiczenie 02</h1> <ul><li><a href=/headers>headers</a></li><li><a href=/rawheaders>rawHeaders</a></li></ul>'
      );
    }
  }
});

server.listen(PORT, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
