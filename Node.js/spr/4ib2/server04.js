import { createServer } from 'http';
import fs from 'fs';
const PORT = 3000;

function authGuard(req) {
  const key = req.headers['x-api-key'];
  console.log(key);

  if (key === 'ADMIN123') {
    req.role = 'admin';
  } else if (key === 'USER456') {
    req.role = 'user';
  } else {
    req.role = 'guest';
  }
}

function dataPrep(req) {
  if (req.role === 'admin') {
    req.access = {
      level: 10,
      zone: 'Hangar A',
      desc: 'Pełny dotęp',
    };
  } else if (req.role === 'user') {
    req.access = {
      level: 1,
      zone: 'Korytarz',
      desc: 'Ograniczony dostępu',
    };
  } else if (req.role === 'guest') {
    req.access = {
      level: 0,
      zone: 'Poczekalnia',
      desc: 'Brak dostępu',
    };
  }
}

const server = createServer((req, res) => {
  if (req.url === '/index04') {
    authGuard(req);
    dataPrep(req);
    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
    res.end(
      JSON.stringify({ rola: req.role, strefa: req.access?.zone, poziom: req.access?.level, opis: req.access?.desc })
    );
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json;charset=utf-8' });
    res.end(
      JSON.stringify({ error: 'Not Found', message: 'Serwer reaguje tyko na ścieżkę /index04', requestedPath: req.url })
    );
  }
});

server.listen(3000, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
