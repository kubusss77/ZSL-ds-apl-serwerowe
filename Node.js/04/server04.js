import { createServer } from 'http';
import { emitWarning } from 'process';

const jsonParser = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';

    // Obsługa błędu (np. zerwane połączenie)
    req.on('error', (err) => reject(err));

    req.on('data', (chunk) => (body += chunk));

    req.on('end', () => {
      try {
        // jeśli parsowanie się nie uda, ustawiamy pusty obiekt
        req.body = body ? JSON.parse(body) : {};
        resolve();
      } catch (err) {
        // Jeśli JSON jest nieprawidłowy, możemy albo ustawić {},
        // albo odrzucić Promise, żeby poinformować o błędzie 400
        req.body = { error: 'Invalid JSON' };
        resolve();
      }
    });
  });
};

const logger = (req, isError) => {
  const id = req.body?.id ? req.body.id : 'brak';
  console.log('ID: ', id);

  if (isError) {
    console.error('Błąd | ID: ', id);
  }
};

const server = createServer(async (req, res) => {
  try {
    if (req.method === 'POST') {
      // Czekamy na dane, ale dodajemy try-catch serwera
      await jsonParser(req);

      logger(req, false);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Odebrano', dane: req.body }));
    } else {
      res.end('Wyslij POST z JSON');
    }
  } catch (err) {
    console.error('Błąd krytyczny serwera:', err.message);
    logger(req, true);
    res.statusCode = 500;
    res.end('Wystapil blad serwera');
  }
});

server.listen(3000, () => {
  console.log('Serwer działa na http://localhost:3000');
});
