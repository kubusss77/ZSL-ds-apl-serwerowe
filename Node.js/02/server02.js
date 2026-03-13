import { createServer } from 'http';
const PORT = 3000;
const server = createServer((req, res) => {
  const baseUrl = `http://${req.headers.host}`;
  const myUrl = new URL(req.url, baseUrl);
  console.log('Witaj ' + myUrl.searchParams.get('name') + '!');

  res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
  res.end();
});

server.listen(3000, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
