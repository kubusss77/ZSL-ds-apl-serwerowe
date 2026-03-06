import { createServer } from 'http';
const PORT = 3000;
const server = createServer((req, res) => {
  // parametr res oznacza obiekt odpowiedzi serwera (response)
  // parametr req oznacza obiekt żądania klienta (request)
  console.log('request');
  res.end('response');
});

server.listen(3000, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
