import { createServer } from 'http';
const PORT = 3000;
const server = createServer((req, res) => {
  let body = '';

  // zbieranie danych w całość
  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  //tu dane już są w całości
  // zamiana tekstu na obiekt JS
  // i odpowiedź do klienta
  req.on('end', () => {
    const data = JSON.parse(body);
    res.end(JSON.stringify({ message: 'Sukces', received: data }));
  });
});

server.listen(3000, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
