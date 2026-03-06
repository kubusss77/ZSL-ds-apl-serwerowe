import { createServer } from 'http';
const PORT = 3000;
const server = createServer((req, res) => {
  // parametr res oznacza obiekt odpowiedzi serwera (response)
  // parametr req oznacza obiekt żądania klienta (request)

  let contentType = 'text/html; charset=utf-8';
  let content = '';

  if (req.url === '/tekst') {
    contentType = 'text/plain; charset=utf-8';
    content = '<h1>To nie będzie nagłówkiem h1</h1>';
  } else if (req.url === '/strona') {
    contentType = 'text/html; charset=utf-8';
    content = '<h1>Witaj!</h1><p>To jest renderowane jako HTML</p>';
  } else if (req.url === '/dane') {
    contentType = 'application/json; charset=utf-8';
    content = JSON.stringify({ status: 'ok', message: 'To jest format JSON', info: req.headers['user-agent'] });
  }

  res.writeHead(200, { 'Content-Type': contentType });

  res.end(content);
});

server.listen(3000, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
