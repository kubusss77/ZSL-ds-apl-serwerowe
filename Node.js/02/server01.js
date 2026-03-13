import { createServer } from 'http';
const PORT = 3000;

const server = createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });

  switch (req.method) {
    case 'GET':
      res.end('Metoda GET służy do pobierania');
      break;
    case 'POST':
      res.end('Odebrano POST, dane zostały wysłane');
      break;
  }
});

server.listen(3000, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
