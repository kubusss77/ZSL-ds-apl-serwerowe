import { createServer } from 'http';

const logger = (req, isError = false) => {
  const time = new Date().toLocaleTimeString();
  const msg = `[${time}] ${req.method} na ${req.url}`;

  if (isError) {
    console.error(msg, '- ALARM: NIEAUTORYZOWANY DOSTĘP');
  } else {
    // console.log drukuje standardowy tekst
    console.log(msg, 'Zapytanie OK');
  }
};

const server = createServer((req, res) => {
  try {
    if (req.url === '/error') {
      // Throw przerywa działanie i wpada do catch
      throw new Error('Błąd 1 symulowany przez throw new Error');
    }
    if (req.url === '/error2') {
      // Throw przerywa działanie i wpada do catch
      throw new Error('Błąd 2 symulowany przez throw new Error');
    }
    if (req.url === '/error3') {
      // Throw przerywa działanie i wpada do catch
      throw new Error('Błąd 3 symulowany przez throw new Error');
    }
    logger(req);

    if (req.url.startsWith('/admin')) {
      if (!req.url.includes('?password=1234')) {
        throw new Error('Brak dostępu!');
      }
      res.end('admin');
    }

    res.end('nie admin');
  } catch (err) {
    // wspólne miejsce do logowania błwdów - logujemy każdy błąd jako error (true)
    logger(req, true);

    // Opcjonalnie: logujemy sam komunikat błędu z throw
    console.error('Szczegóły błędu:', err.message);

    res.statusCode = 403;
    res.end('Brak dostępu');
  }
});

server.listen(3000, () => {
  console.log('Serwer działa na http://localhost:3000');
});
